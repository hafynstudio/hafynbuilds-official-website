"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Subtle animated circuit/network texture drawn on Canvas2D.
 * Renders a sparse graph of nodes connected by orthogonal lines —
 * the "live network" motif specified in PRD §2.2.5.
 * GPU-friendly: only transform/opacity on the canvas element itself;
 * all drawing is internal to the canvas (no DOM mutations per frame).
 * Fades out automatically when prefers-reduced-motion is set.
 */
export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];

    const NODE_COUNT = 28;
    const MAX_DIST = 180;
    const SPEED = 0.18;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initNodes() {
      if (!canvas) return;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move nodes — bounce off edges
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      // Draw edges between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (!a || !b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.09;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            // Orthogonal "circuit" path: horizontal then vertical
            ctx.lineTo(b.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgb(62 123 250 / ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(62 123 250 / 0.22)";
        ctx.fill();
      }

      animFrameId = requestAnimationFrame(draw);
    }

    resize();
    initNodes();

    // Static render for reduced motion — draw once, no rAF loop
    if (reducedMotion) {
      draw();
      cancelAnimationFrame(animFrameId!);
      return;
    }

    draw();

    const ro = new ResizeObserver(() => {
      resize();
      initNodes();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrameId);
      ro.disconnect();
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    />
  );
}
