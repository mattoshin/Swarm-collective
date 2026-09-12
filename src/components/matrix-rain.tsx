"use client";

import { useEffect, useRef } from "react";

// Half-width katakana are single-cell glyphs, so columns stay aligned.
const GLYPHS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789<>/=+*";

// Rain stays full strength at the edges and dims toward the center, where content sits.
const MASK =
  "radial-gradient(ellipse 80% 70% at 50% 40%, rgb(0 0 0 / 0.35) 0%, rgb(0 0 0 / 0.6) 50%, black 100%)";

type MatrixRainProps = {
  color?: string;
  fadeColor?: string;
  fontSize?: number;
  fps?: number;
  opacity?: number;
};

export function MatrixRain({
  color = "#00ff41",
  fadeColor = "#030703",
  fontSize = 16,
  fps = 22,
  opacity = 0.5,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glyph = hexToRgb(color);
    const fade = hexToRgb(fadeColor);
    const fontFamily = getComputedStyle(canvas).fontFamily || "monospace";
    let width = 0;
    let height = 0;
    let drops: number[] = [];
    let speeds: number[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -(height / fontSize));
      speeds = Array.from({ length: columns }, () => 0.35 + Math.random() * 0.65);
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, width, height);
    };

    const drawFrame = () => {
      // Translucent wash each frame turns old glyphs into fading trails.
      ctx.fillStyle = `rgba(${fade.r},${fade.g},${fade.b},0.14)`;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "top";

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        if (y > -fontSize) {
          const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          const alpha =
            Math.random() > 0.97 ? opacity * 1.6 : opacity * (0.4 + Math.random() * 0.6);
          ctx.fillStyle = `rgba(${glyph.r},${glyph.g},${glyph.b},${Math.min(alpha, 1)})`;
          ctx.fillText(char, i * fontSize, y);
        }
        drops[i] = y > height && Math.random() > 0.975 ? 0 : drops[i] + speeds[i];
      }
    };

    const renderStatic = () => {
      for (let n = 0; n < 90; n++) drawFrame();
    };

    resize();

    let rafId = 0;
    if (reducedMotion) {
      renderStatic();
    } else {
      const interval = 1000 / fps;
      let last = 0;
      const loop = (now: number) => {
        rafId = requestAnimationFrame(loop);
        if (now - last < interval) return;
        last = now;
        drawFrame();
      };
      rafId = requestAnimationFrame(loop);
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reducedMotion) renderStatic();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [color, fadeColor, fontSize, fps, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    />
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
