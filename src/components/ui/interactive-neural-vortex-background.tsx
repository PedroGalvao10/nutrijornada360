import React, { useEffect, useRef, useState } from 'react';

const InteractiveNeuralVortexBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 }); 
  const animationRef = useRef<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl = (canvasEl.getContext('webgl') || canvasEl.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      uniform float u_dark_mode;
      
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.0;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 0.5 + 0.1 * sin(t * 0.2));
          sine_acc = rotate(sine_acc, 0.5);
          vec2 layer = uv * scale + float(j) + sine_acc - t * 0.5;
          sine_acc += sin(layer) + 3.0 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= 1.15;
        }
        return res.x + res.y;
      }
      
      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= u_ratio;
        
        vec2 p_pos = u_pointer_position - 0.5;
        p_pos.x *= u_ratio;
        float dist = length(uv - p_pos);
        float p = exp(-dist * 4.0);
        
        float t = u_time * 0.0005;
        float noise = neuro_shape(uv, t, p);
        
        noise = pow(noise, 2.5) * 1.5;
        noise = smoothstep(0.1, 0.9, noise);
        
        // Premium NutriJornada Palette
        vec3 color1 = vec3(0.05, 0.45, 0.3); // Deep Emerald
        vec3 color2 = vec3(0.15, 0.85, 0.55); // Vibrant Mint
        vec3 color3 = vec3(0.44, 0.36, 0.19); // Subtle Gold
        
        vec3 finalColor = mix(color1, color2, 0.5 + 0.5 * sin(t + uv.x));
        finalColor = mix(finalColor, color3, 0.2 * noise);
        
        // Theme adjustments
        float opacity = noise * (u_dark_mode > 0.5 ? 0.6 : 0.4);
        if (u_dark_mode < 0.5) {
          finalColor = mix(finalColor, vec3(0.1, 0.3, 0.2), 0.3); // Darker on light mode for contrast
        }
        
        gl_FragColor = vec4(finalColor * noise, opacity);
      }
    `;

    const compileShader = (gl: WebGLRenderingContext, source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRatio = gl.getUniformLocation(program, 'u_ratio');
    const uPointerPosition = gl.getUniformLocation(program, 'u_pointer_position');
    const uScrollProgress = gl.getUniformLocation(program, 'u_scroll_progress');
    const uDarkMode = gl.getUniformLocation(program, 'u_dark_mode');

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvasEl.width = window.innerWidth * dpr;
      canvasEl.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
      if (uRatio) gl.uniform1f(uRatio, canvasEl.width / canvasEl.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (time: number) => {
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.1;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.1;
      
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointerPosition, pointer.current.x / window.innerWidth, 1 - pointer.current.y / window.innerHeight);
      gl.uniform1f(uScrollProgress, window.scrollY / document.body.scrollHeight);
      gl.uniform1f(uDarkMode, isDarkMode ? 1.0 : 0.0);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      pointer.current.tX = e.clientX;
      pointer.current.tY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDarkMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-1000"
      style={{ 
        mixBlendMode: isDarkMode ? 'screen' : 'multiply',
        filter: isDarkMode ? 'contrast(1.1) brightness(1.2)' : 'contrast(1.1) brightness(1.0)',
        opacity: isDarkMode ? 0.6 : 0.4
      }}
    />
  );
};

export default InteractiveNeuralVortexBackground;

