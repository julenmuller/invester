'use client';

import { useEffect, useRef } from 'react';
import { assetTypeColors, colors } from '@/styles/tokens';

/**
 * Ambient, futuristic background — a slow-drifting constellation field rendered
 * to a single <canvas> (no DOM nodes, no library) behind all content.
 *
 * Why a hand-rolled canvas over a particle lib: we need only a few dozen dots
 * with faint links, and a canvas keeps it to one element with full control over
 * cost. tsparticles would add weight for effects we deliberately don't want.
 *
 * Discipline (all required):
 *  - Subtle: low opacity, soft contrast — it's ambience, never the protagonist.
 *  - GPU-friendly: we only paint to canvas (no layout/DOM animation). The canvas
 *    itself is a single composited layer; the parallax is a cheap transform.
 *  - Respects `prefers-reduced-motion`: paints one static frame and stops.
 *  - Pauses when the tab is hidden (`visibilitychange`) to spare battery/CPU.
 */
export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext('2d');
    if (!context) return;
    // Aliased to non-null-typed consts so the closures below keep the narrowing.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Parse the cyan accent once so links/dots stay token-driven.
    const accent = hexToRgb(colors.primary.DEFAULT) ?? { r: 34, g: 211, b: 238 };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let rafId = 0;
    let running = true;

    // Pointer parallax target/current (eased). Range roughly [-1, 1].
    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      /** Parallax depth: deeper dots move less, creating subtle layering. */
      depth: number;
      r: number;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area but is capped — never hundreds of dots.
      const target = Math.min(72, Math.round((width * height) / 22000));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        depth: 0.4 + Math.random() * 0.6,
        r: 0.8 + Math.random() * 1.4,
      }));
    }

    const LINK_DIST = 130;

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Ease pointer toward target for smooth parallax.
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      // Pre-compute on-screen positions (with parallax offset by depth).
      const px = pointer.x * 24;
      const py = pointer.y * 24;
      const pts = particles.map((p) => ({
        sx: p.x + px * p.depth,
        sy: p.y + py * p.depth,
        r: p.r,
        depth: p.depth,
      }));

      // Faint links between nearby dots.
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].sx - pts[j].sx;
          const dy = pts[i].sy - pts[j].sy;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.12;
            ctx.strokeStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].sx, pts[i].sy);
            ctx.lineTo(pts[j].sx, pts[j].sy);
            ctx.stroke();
          }
        }
      }

      // Dots themselves.
      for (const pt of pts) {
        ctx.fillStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${
          0.18 + pt.depth * 0.22
        })`;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      if (!running) return;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around the edges so the field never empties out.
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }
      draw();
      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (rafId) cancelAnimationFrame(rafId);
      running = true;
      rafId = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function onPointerMove(e: PointerEvent) {
      pointer.tx = (e.clientX / width) * 2 - 1;
      pointer.ty = (e.clientY / height) * 2 - 1;
    }

    function onVisibility() {
      if (document.visibilityState === 'hidden') stop();
      else if (!reduceMotion) start();
    }

    resize();

    if (reduceMotion) {
      // Static, single frame — honor the user's reduced-motion preference.
      draw();
    } else {
      start();
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface-background"
    >
      {/* Static aurora glow behind the dots — pure CSS, no animation cost. */}
      <div
        className="absolute -left-1/4 -top-1/3 h-[60vh] w-[60vw] rounded-full opacity-[0.06] blur-[120px]"
        style={{ background: colors.primary.DEFAULT }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[55vh] w-[55vw] rounded-full opacity-[0.05] blur-[120px]"
        style={{ background: assetTypeColors.FII }}
      />
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
    </div>
  );
}

/** Parse a #rrggbb string into rgb components. */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}
