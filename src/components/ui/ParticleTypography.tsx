import { useEffect, useRef } from 'react';

// ============================================================
// ParticleTypography — tipografia em partículas no canvas 2D
// (Cursor Driven Particles Typography, 21st.dev). As partículas
// formam a palavra e se dispersam sob o cursor, voltando por
// mola. Canvas leve (sem WebGL). Adaptado: pausa o rAF quando
// fora da viewport (perf) e usa a cor da marca.
// ============================================================

interface Props {
  text: string;
  className?: string;
  fontSize?: number;
  fontFamily?: string;
  particleSize?: number;
  particleDensity?: number;
  dispersionStrength?: number;
  returnSpeed?: number;
  color?: string;
}

class Particle {
  x: number; y: number; originX: number; originY: number;
  vx: number; vy: number; size: number; color: string;
  dispersion: number; returnSpd: number;

  constructor(x: number, y: number, size: number, color: string, dispersion: number, returnSpd: number) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.originX = x;
    this.originY = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const interactionRadius = 120;

    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000) {
      const fdx = dx / distance;
      const fdy = dy / distance;
      const force = (interactionRadius - distance) / interactionRadius;
      this.vx -= fdx * force * this.dispersion;
      this.vy -= fdy * force * this.dispersion;
    }

    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;
    this.vx *= 0.85;
    this.vy *= 0.85;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function ParticleTypography({
  text,
  className = '',
  fontSize = 160,
  fontFamily = "'Raleway', sans-serif",
  particleSize = 1.6,
  particleDensity = 5,
  dispersionStrength = 14,
  returnSpeed = 0.08,
  color = '#f3ead9',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let running = false;
    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let w = 0;
    let h = 0;

    const init = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const effectiveFontSize = Math.min(fontSize, w * 0.16);
      ctx.fillStyle = color;
      ctx.font = `800 ${effectiveFontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];
      const step = Math.max(1, Math.floor(particleDensity * dpr));
      for (let y = 0; y < data.height; y += step) {
        for (let x = 0; x < data.width; x += step) {
          const alpha = data.data[(y * data.width + x) * 4 + 3] || 0;
          if (alpha > 128) {
            particles.push(new Particle(x / dpr, y / dpr, particleSize, color, dispersionStrength, returnSpeed));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.update(mouseX, mouseY);
        p.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running) return;
      running = true;
      animationFrameId = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => { mouseX = -1000; mouseY = -1000; };

    const timeoutId = setTimeout(init, 100);

    // Só anima quando a dobra está visível (economia de CPU)
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05 }
    );
    io.observe(container);

    const resizeObserver = new ResizeObserver(() => init());
    resizeObserver.observe(container);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      clearTimeout(timeoutId);
      io.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, fontSize, fontFamily, particleSize, particleDensity, dispersionStrength, returnSpeed, color]);

  return (
    <div ref={containerRef} className={`w-full h-full min-h-[280px] relative touch-none ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" role="img" aria-label={text} />
    </div>
  );
}
