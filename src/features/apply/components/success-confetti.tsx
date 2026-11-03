import { useEffect, useRef } from 'react';

/** Brand palette for the celebration burst, straight from the @theme tokens. */
const CONFETTI_COLORS = [
  '#3d7cf6',
  '#2f63d4',
  '#8db2ff',
  '#d7e4ff',
  '#22c55e',
  '#0f9d58',
  '#ffb020',
  '#feebb4',
  '#e1493c',
] as const;

const PIECE_COUNT = 160;
const DURATION_MS = 4200;
const FADE_OUT_MS = 900;
const GRAVITY = 340; // px/s²

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  color: string;
  circle: boolean;
  sway: number;
  phase: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Full-viewport confetti rain for the registration success state. Canvas
 * based and dependency free; skips entirely for reduced motion users.
 * Renders inside the open dialog (top layer) with pointer-events off, so
 * clicks keep reaching the panel underneath.
 */
export function SuccessConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = Array.from({ length: PIECE_COUNT }, () => ({
      x: rand(0, Math.max(canvas.clientWidth, 1)),
      y: rand(-canvas.clientHeight * 0.6, -24),
      w: rand(6, 12),
      h: rand(8, 18),
      vx: rand(-48, 48),
      vy: rand(60, 160),
      rotation: rand(0, Math.PI * 2),
      spin: rand(-2.6, 2.6),
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? '#3d7cf6',
      circle: Math.random() < 0.28,
      sway: rand(0.7, 1.7),
      phase: rand(0, Math.PI * 2),
    }));

    let raf = 0;
    let last = performance.now();
    const start = last;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = now - start;
      const fade =
        elapsed > DURATION_MS - FADE_OUT_MS
          ? Math.max(0, (DURATION_MS - elapsed) / FADE_OUT_MS)
          : 1;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.vy += GRAVITY * dt;
        p.x += p.vx * dt + Math.sin((now / 1000) * p.sway * 2 + p.phase) * 28 * dt;
        p.y += p.vy * dt;
        p.rotation += p.spin * dt;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.circle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (elapsed < DURATION_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
}
