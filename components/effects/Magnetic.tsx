"use client";

import { useRef, type ReactNode } from "react";

/**
 * Magnetic: элемент мягко тянется за курсором (только мышь, без reduced-motion).
 * Сдвиг плавный — transition по --ease-ui, возврат на место при уходе курсора.
 */
export function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`inline-flex transition-transform duration-[var(--dur-expand)] ease-[var(--ease-ui)] ${className}`}
    >
      {children}
    </span>
  );
}
