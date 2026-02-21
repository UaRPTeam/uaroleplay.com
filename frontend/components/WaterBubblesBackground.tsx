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

type Fish = {
  x: number;
  y: number;
  size: number;
  depth: number;
  vx: number;
  phase: number;
  sway: number;
  alpha: number;
  dir: 1 | -1;
  base: string;
  shade: string;
  highlight: string;
};

export default function WaterBubblesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const fishRef = useRef<Fish[]>([]);

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

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeBubbles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
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

    const makeFish = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const count = Math.max(6, Math.min(12, Math.round((w * h) / 190000)));

      const palettes = [
        { base: "#EEA85D", shade: "#C9873E", highlight: "#FFE4B8" },
        { base: "#F5C66C", shade: "#CF9A42", highlight: "#FFEDC8" },
        { base: "#EFA17D", shade: "#C67653", highlight: "#FFDCCF" },
        { base: "#E7BF72", shade: "#BC9345", highlight: "#FFF2CA" },
      ];
      const next: Fish[] = [];

      for (let i = 0; i < count; i += 1) {
        const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
        const depth = Math.random();
        const size = 16 + Math.random() * 40 * (0.6 + depth);
        const p = palettes[Math.floor(Math.random() * palettes.length)];

        next.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          depth,
          vx: (0.18 + Math.random() * 0.45) * dir,
          phase: Math.random() * Math.PI * 2,
          sway: 12 + Math.random() * 22,
          alpha: 0.45 + depth * 0.4,
          dir,
          base: p.base,
          shade: p.shade,
          highlight: p.highlight,
        });
      }

      fishRef.current = next;
    };

    const drawWaterLayer = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

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

    const drawFish = (f: Fish, t: number) => {
      const bob = Math.sin(t / 1300 + f.phase) * (f.sway * 0.07);
      const sway = Math.sin(t / 900 + f.phase) * 0.12;

      const x = f.x;
      const y = f.y + bob;

      const bodyW = f.size * 1.9;
      const bodyH = f.size * 1.05;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(f.dir, 1);
      ctx.rotate(sway * 0.15);

      // 1) водяний ореол
      ctx.globalAlpha = 0.10;
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyW * 0.65, bodyH * 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // 2) тіло
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyW * 0.5, bodyH * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = f.base;
      ctx.fill();

      // м’який “водяний” контур
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(20, 45, 70, 0.35)";
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyW * 0.5, bodyH * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 3) хвіст (тримаємо альфу високою)
      ctx.globalAlpha = 0.88;
      const wiggle = Math.sin(t / 140 + f.phase) * 0.35;

      ctx.beginPath();
      ctx.moveTo(-bodyW * 0.55, 0);
      ctx.lineTo(-bodyW * 0.95, -bodyH * (0.45 + wiggle));
      ctx.lineTo(-bodyW * 0.95, bodyH * (0.45 - wiggle));
      ctx.closePath();
      ctx.fillStyle = f.shade;
      ctx.fill();

      // 4) плавник
      ctx.globalAlpha = 0.72;
      ctx.beginPath();
      ctx.moveTo(-bodyW * 0.05, -bodyH * 0.18);
      ctx.quadraticCurveTo(bodyW * 0.1, -bodyH * 0.55, bodyW * 0.25, -bodyH * 0.15);
      ctx.closePath();
      ctx.fillStyle = f.base;
      ctx.fill();

      // 5) блік
      ctx.globalAlpha = 0.32;
      ctx.beginPath();
      ctx.ellipse(bodyW * 0.18, -bodyH * 0.18, bodyW * 0.22, bodyH * 0.14, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // 6) око
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(bodyW * 0.25, -bodyH * 0.05, Math.max(2, f.size * 0.06), 0, Math.PI * 2);
      ctx.fillStyle = "#1b1b1b";
      ctx.fill();

      ctx.restore();
    };

    const tick = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      drawWaterLayer(t);

      for (const f of fishRef.current) {
        // швидше і "живіше"
        f.x += f.vx * 1.35;
        f.y += Math.sin(t / 1400 + f.phase) * 0.18;

        if (f.dir === 1 && f.x - 110 > w) f.x = -110;
        if (f.dir === -1 && f.x + 110 < 0) f.x = w + 110;

        if (f.y < -90) f.y = h + 90;
        if (f.y > h + 90) f.y = -90;

        drawFish(f, t);
      }

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

    const onResize = () => {
      resize();
      makeBubbles();
      makeFish();
      if (prefersReducedMotion) tick(0);
    };

    resize();
    makeBubbles();
    makeFish();

    tick(0);
    if (!prefersReducedMotion) rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
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
