import { useRef, useEffect, useState } from 'react';

// ============================================================
// GeometricBlurMesh — wireframes 3D em WebGL raw (Geometric Blur
// Mesh, 21st.dev / Leva C do blueprint de imersão). Fragment
// shader projeta sólidos geométricos em perspectiva e desenha as
// arestas por distância-a-segmento; perto do cursor as linhas
// ficam DESFOCADAS (blur no smoothstep) — metáfora de precisão.
// Adaptações: faixa contida (não fullscreen), cores da marca
// (traço creme sobre verde-escuro), listener global de teclado
// REMOVIDO (digitar em inputs da página trocava a forma no
// original), rAF pausado fora da viewport, clique alterna forma.
// ============================================================

const fragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_time;
uniform int u_shape;

#define PI 3.1415926535897932384626433832795
#define TWO_PI 6.2831853071795864769252867665590

mat3 rotateX(float angle) {
    float s = sin(angle); float c = cos(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}
mat3 rotateY(float angle) {
    float s = sin(angle); float c = cos(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}
mat3 rotateZ(float angle) {
    float s = sin(angle); float c = cos(angle);
    return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    return p;
}

vec2 project(vec3 p) {
    float perspective = 2.0 / (2.0 - p.z);
    return p.xy * perspective;
}

float distToSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float drawLine(vec2 p, vec2 a, vec2 b, float thickness, float blur) {
    float d = distToSegment(p, a, b);
    return smoothstep(thickness + blur, thickness - blur, d);
}

void getCubeVertices(out vec3 v[8]) {
    float s = 0.7;
    v[0] = vec3(-s, -s, -s); v[1] = vec3( s, -s, -s);
    v[2] = vec3( s,  s, -s); v[3] = vec3(-s,  s, -s);
    v[4] = vec3(-s, -s,  s); v[5] = vec3( s, -s,  s);
    v[6] = vec3( s,  s,  s); v[7] = vec3(-s,  s,  s);
}

void getTetrahedronVertices(out vec3 v[4]) {
    float a = 1.0 / sqrt(3.0);
    v[0] = vec3( a,  a,  a); v[1] = vec3( a, -a, -a);
    v[2] = vec3(-a,  a, -a); v[3] = vec3(-a, -a,  a);
}

void getOctahedronVertices(out vec3 v[6]) {
    v[0] = vec3( 1.0,  0.0,  0.0); v[1] = vec3(-1.0,  0.0,  0.0);
    v[2] = vec3( 0.0,  1.0,  0.0); v[3] = vec3( 0.0, -1.0,  0.0);
    v[4] = vec3( 0.0,  0.0,  1.0); v[5] = vec3( 0.0,  0.0, -1.0);
}

void getIcosahedronVertices(out vec3 v[12]) {
    float t = (1.0 + sqrt(5.0)) / 2.0;
    float s = 1.0 / sqrt(1.0 + t * t);
    v[0] = vec3(-s, t * s, 0.0);  v[1] = vec3( s, t * s, 0.0);
    v[2] = vec3(-s, -t * s, 0.0); v[3] = vec3( s, -t * s, 0.0);
    v[4] = vec3(0.0, -s, t * s);  v[5] = vec3(0.0,  s, t * s);
    v[6] = vec3(0.0, -s, -t * s); v[7] = vec3(0.0,  s, -t * s);
    v[8] = vec3( t * s, 0.0, -s); v[9] = vec3( t * s, 0.0,  s);
    v[10] = vec3(-t * s, 0.0, -s); v[11] = vec3(-t * s, 0.0,  s);
}

float drawWireframe(vec2 p, int shape, mat3 rotation, float scale, float thickness, float blur) {
    float result = 0.0;

    if (shape == 0) {
        vec3 v[8];
        getCubeVertices(v);
        for (int i = 0; i < 8; i++) { v[i] = rotation * (v[i] * scale); }
        result += drawLine(p, project(v[0]), project(v[1]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[2]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[3]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[0]), thickness, blur);
        result += drawLine(p, project(v[4]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[5]), project(v[6]), thickness, blur);
        result += drawLine(p, project(v[6]), project(v[7]), thickness, blur);
        result += drawLine(p, project(v[7]), project(v[4]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[4]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[6]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[7]), thickness, blur);
    } else if (shape == 1) {
        vec3 v[4];
        getTetrahedronVertices(v);
        for (int i = 0; i < 4; i++) { v[i] = rotation * (v[i] * scale); }
        result += drawLine(p, project(v[0]), project(v[1]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[2]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[3]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[2]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[3]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[3]), thickness, blur);
    } else if (shape == 2) {
        vec3 v[6];
        getOctahedronVertices(v);
        for (int i = 0; i < 6; i++) { v[i] = rotation * (v[i] * scale); }
        result += drawLine(p, project(v[2]), project(v[0]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[1]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[4]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[0]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[1]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[4]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[4]), thickness, blur);
        result += drawLine(p, project(v[4]), project(v[1]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[5]), project(v[0]), thickness, blur);
    } else if (shape == 3) {
        vec3 v[12];
        getIcosahedronVertices(v);
        for (int i = 0; i < 12; i++) { v[i] = rotation * (v[i] * scale); }
        result += drawLine(p, project(v[0]), project(v[1]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[7]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[10]), thickness, blur);
        result += drawLine(p, project(v[0]), project(v[11]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[7]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[8]), thickness, blur);
        result += drawLine(p, project(v[1]), project(v[9]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[3]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[4]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[6]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[10]), thickness, blur);
        result += drawLine(p, project(v[2]), project(v[11]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[4]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[6]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[8]), thickness, blur);
        result += drawLine(p, project(v[3]), project(v[9]), thickness, blur);
        result += drawLine(p, project(v[4]), project(v[5]), thickness, blur);
        result += drawLine(p, project(v[4]), project(v[9]), thickness, blur);
        result += drawLine(p, project(v[4]), project(v[11]), thickness, blur);
        result += drawLine(p, project(v[5]), project(v[9]), thickness, blur);
        result += drawLine(p, project(v[5]), project(v[11]), thickness, blur);
        result += drawLine(p, project(v[6]), project(v[7]), thickness, blur);
        result += drawLine(p, project(v[6]), project(v[8]), thickness, blur);
        result += drawLine(p, project(v[6]), project(v[10]), thickness, blur);
        result += drawLine(p, project(v[7]), project(v[10]), thickness, blur);
        result += drawLine(p, project(v[8]), project(v[9]), thickness, blur);
        result += drawLine(p, project(v[9]), project(v[11]), thickness, blur);
        result += drawLine(p, project(v[10]), project(v[11]), thickness, blur);
    } else {
        // Forma que respira: morphing cubo <-> octaedro
        float t = u_time * 0.5;
        float morph = sin(t) * 0.5 + 0.5;
        vec3 cube[8];
        getCubeVertices(cube);
        vec3 octa[6];
        getOctahedronVertices(octa);
        vec3 v[8];
        for (int i = 0; i < 8; i++) {
            if (i < 6) { v[i] = mix(cube[i], octa[i] * 1.5, morph); }
            else { v[i] = cube[i] * (1.0 - morph * 0.3); }
            v[i] = rotation * (v[i] * scale);
        }
        float alpha = 1.0 - morph * 0.5;
        result += drawLine(p, project(v[0]), project(v[1]), thickness, blur) * alpha;
        result += drawLine(p, project(v[1]), project(v[2]), thickness, blur) * alpha;
        result += drawLine(p, project(v[2]), project(v[3]), thickness, blur) * alpha;
        result += drawLine(p, project(v[3]), project(v[0]), thickness, blur) * alpha;
        result += drawLine(p, project(v[4]), project(v[5]), thickness, blur) * alpha;
        result += drawLine(p, project(v[5]), project(v[6]), thickness, blur) * alpha;
        result += drawLine(p, project(v[6]), project(v[7]), thickness, blur) * alpha;
        result += drawLine(p, project(v[7]), project(v[4]), thickness, blur) * alpha;
        result += drawLine(p, project(v[0]), project(v[6]), thickness, blur) * morph;
        result += drawLine(p, project(v[1]), project(v[7]), thickness, blur) * morph;
        result += drawLine(p, project(v[2]), project(v[4]), thickness, blur) * morph;
        result += drawLine(p, project(v[3]), project(v[5]), thickness, blur) * morph;
    }

    return clamp(result, 0.0, 1.0);
}

vec4 render(vec2 st, vec2 mouse) {
    float mouseDistance = length(st - mouse);
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.5, mouseDistance);

    float time = u_time * 0.2;
    mat3 rotation = rotateY(time + (mouse.x - 0.5) * mouseInfluence * 1.0) *
                    rotateX(time * 0.7 + (mouse.y - 0.5) * mouseInfluence * 1.0) *
                    rotateZ(time * 0.1);

    float scale = 0.35;
    // Perto do cursor: desfocado; longe: nítido (metáfora invertida de foco)
    float blur = mix(0.0001, 0.05, mouseInfluence);
    float thickness = mix(0.002, 0.003, mouseInfluence);

    float shape = drawWireframe(st, u_shape, rotation, scale, thickness, blur);

    // Traço verde-profundo elegante (pode ser ajustado)
    vec3 color = vec3(0.12, 0.23, 0.16);
    float dimming = 1.0 - mouseInfluence * 0.3;
    float alpha = shape * dimming;
    color *= alpha; // Premultiplied color

    float vignette = 1.0 - length(st) * 0.2;
    color *= vignette;
    alpha *= vignette;

    return vec4(color, alpha);
}

void main() {
    vec2 st = coord(gl_FragCoord.xy);
    vec2 mouse = coord(u_mouse * u_pixelRatio) * vec2(1., -1.);
    vec4 colorAlpha = render(st, mouse);
    gl_FragColor = colorAlpha;
}
`;

const vertexShader = `
attribute vec3 a_position;
attribute vec2 a_uv;
varying vec2 v_texcoord;
void main() {
    gl_Position = vec4(a_position, 1.0);
    v_texcoord = a_uv;
}
`;

const SHAPES = ['Cubo', 'Tetraedro', 'Octaedro', 'Icosaedro', 'Em transformação'];

export function GeometricBlurMesh({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseDampRef = useRef({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState(3); // Icosaedro = precisão
  const animationFrameRef = useRef<number | undefined>(undefined);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const startTimeRef = useRef(Date.now());
  const visibleRef = useRef(false);

  // Inicialização WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;
    glRef.current = gl;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vShader = createShader(gl.VERTEX_SHADER, vertexShader);
    const fShader = createShader(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vShader || !fShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    programRef.current = program;
    gl.useProgram(program);

    uniformsRef.current = {
      u_mouse: gl.getUniformLocation(program, 'u_mouse'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_pixelRatio: gl.getUniformLocation(program, 'u_pixelRatio'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_shape: gl.getUniformLocation(program, 'u_shape'),
    };

    const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLocation = gl.getAttribLocation(program, 'a_uv');
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
    };
  }, []);

  // Resize pelo container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const gl = glRef.current;
      if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse relativo ao canvas
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, []);

  // Clique alterna a forma (o listener GLOBAL de teclado do original foi
  // removido: digitar '1'-'8' em qualquer input da página trocava a forma)
  useEffect(() => {
    const handleClick = () => setCurrentShape((prev) => (prev + 1) % SHAPES.length);
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);

  // Loop de render (pausado fora da viewport)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      const canvas = canvasRef.current;
      const gl = glRef.current;
      const program = programRef.current;
      if (!canvas || !gl || !program) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const dampingFactor = 8;
      mouseDampRef.current.x += (mouseRef.current.x - mouseDampRef.current.x) * dampingFactor * deltaTime;
      mouseDampRef.current.y += (mouseRef.current.y - mouseDampRef.current.y) * dampingFactor * deltaTime;

      gl.clear(gl.COLOR_BUFFER_BIT);

      const dpr = Math.min(window.devicePixelRatio, 2);
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
      const u = uniformsRef.current;
      if (u.u_mouse) gl.uniform2f(u.u_mouse, mouseDampRef.current.x, mouseDampRef.current.y);
      if (u.u_resolution) gl.uniform2f(u.u_resolution, canvas.width, canvas.height);
      if (u.u_pixelRatio) gl.uniform1f(u.u_pixelRatio, dpr);
      if (u.u_time) gl.uniform1f(u.u_time, elapsedTime);
      if (u.u_shape) gl.uniform1i(u.u_shape, currentShape);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        lastTime = performance.now();
        // Primeiro frame síncrono: sem flash preto enquanto o rAF não dispara
        animate(performance.now());
      }
    };
    const stop = () => {
      visibleRef.current = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    // Frame inicial garantido no mount (IO pode demorar/não disparar), depois
    // o loop contínuo fica sob controle da visibilidade
    animate(performance.now());
    visibleRef.current = true;

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(container);

    return () => {
      io.disconnect();
      stop();
    };
  }, [currentShape]);

  return (
    <div ref={containerRef} className={`relative w-full h-full cursor-pointer overflow-hidden ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <div className="text-background/30 text-[0.62rem] font-extrabold tracking-[0.26em] uppercase">
          {SHAPES[currentShape]}
        </div>
        <div className="text-background/15 text-[0.55rem] font-semibold mt-1 tracking-[0.2em] uppercase">
          Clique para alternar
        </div>
      </div>
    </div>
  );
}
