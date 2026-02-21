"use client";

import { useEffect, useRef } from "react";

type Bubble = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  hue: number;
  alpha: number;
};

export default function WaterBubblesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const viewportRef = useRef({ w: 0, h: 0 });
  const lastSizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ✅ База з твого основного #D7EAF8
    const WATER_H = 205; // ~205° для D7EAF8
    const hsla = (h: number, s: number, l: number, a: number) =>
      `hsla(${h}, ${s}%, ${l}%, ${a})`;

    const getViewport = () => {
      const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      return { w, h };
    };

    const resize = () => {
      const { w, h } = getViewport();
      viewportRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeBubbles = () => {
      const { w, h } = viewportRef.current;
      const count = Math.round((w * h) / 85000);

      const next: Bubble[] = [];
      for (let i = 0; i < count; i += 1) {
        const r = 6 + Math.random() * 24;
        next.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vy: 0.1 + Math.random() * 0.32,
          vx: (Math.random() - 0.5) * 0.14,
          phase: Math.random() * Math.PI * 2,
          hue: 198 + Math.random() * 40, // ~198–238
          alpha: 0.2 + Math.random() * 0.22,
        });
      }
      bubblesRef.current = next;
    };

    const drawWaterLayer = (t: number) => {
      const { w, h } = viewportRef.current;

      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, hsla(WATER_H, 70, 97, 1));
      g.addColorStop(0.45, hsla(WATER_H, 70, 91, 1));
      g.addColorStop(1, hsla(WATER_H, 68, 84, 1));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = 0.28;
      for (let i = 0; i < 4; i += 1) {
        const cx = w * (0.15 + i * 0.25) + Math.sin(t / 2600 + i) * 40;
        const cy = h * (0.3 + 0.12 * Math.sin(t / 2100 + i));
        const r = Math.max(w, h) * (0.55 + i * 0.05);

        const caustic = ctx.createRadialGradient(cx, cy, 40, cx, cy, r);
        const hue = WATER_H + 8 * Math.sin(t / 2200 + i);

        caustic.addColorStop(0, hsla(hue, 58, 92, 0.28));
        caustic.addColorStop(0.45, hsla(hue, 55, 90, 0.12));
        caustic.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = caustic;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;

      ctx.globalAlpha = 0.1;
      ctx.fillStyle = hsla(WATER_H + 2 * Math.sin(t / 2400), 60, 94, 0.22);
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    };

    const drawBubble = (b: Bubble, t: number) => {
      const shimmer = Math.sin(t / 900 + b.phase) * 14;
      const hue = b.hue + shimmer;

      const ring = ctx.createRadialGradient(b.x, b.y, b.r * 0.2, b.x, b.y, b.r);
      ring.addColorStop(0, hsla(hue, 92, 83, b.alpha));
      ring.addColorStop(0.6, hsla(hue + 20, 95, 76, b.alpha * 0.78));
      ring.addColorStop(1, "rgba(255,255,255,0)");

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = ring;
      ctx.fill();

      ctx.globalAlpha = 0.62;
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.24, b.y - b.r * 0.24, b.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.52)";
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 0.98, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.38)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const tick = (t: number) => {
      if (!prefersReducedMotion) {
        if (t - lastT < 33) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        lastT = t;
      }

      const { w, h } = viewportRef.current;

      drawWaterLayer(t);

      for (const b of bubblesRef.current) {
        b.y -= b.vy;
        b.x += b.vx + Math.sin(t / 1200 + b.phase) * 0.12;

        if (b.y + b.r < -20) {
          b.y = h + 20 + Math.random() * 120;
          b.x = Math.random() * w;
        }
        if (b.x < -50) b.x = w + 50;
        if (b.x > w + 50) b.x = -50;

        drawBubble(b, t);
      }

      if (!prefersReducedMotion) rafRef.current = requestAnimationFrame(tick);
    };

    let lastT = 0;

    const onResize = () => {
      const prev = lastSizeRef.current;
      const next = getViewport();

      const dw = Math.abs(next.w - prev.w);
      const dh = Math.abs(next.h - prev.h);
      const isSmallMobileHeightJitter = dw < 40 && dh < 120;

      resize();

      if (!isSmallMobileHeightJitter) {
        makeBubbles();
        lastSizeRef.current = next;
      }

      if (prefersReducedMotion) tick(0);
    };

    resize();
    lastSizeRef.current = getViewport();
    makeBubbles();

    tick(0);
    if (!prefersReducedMotion) rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
      }}
    />
  );
}
