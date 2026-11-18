"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

/**
 * Слайдер «до/после»: тянуть ручку мышью/пальцем, клавиши ← → Home End.
 * Слева «до» (каркас), справа «после» (готовый дом).
 */
export function BeforeAfter({
  before,
  after,
  label,
  className = "",
}: {
  before: ReactNode;
  after: ReactNode;
  label: string;
  className?: string;
}) {
  const t = useTranslations("projects");
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const fromX = useCallback((clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className={`relative touch-pan-y overflow-hidden select-none ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        fromX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-graphite/70 px-3 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-white backdrop-blur-md">{t("before")}</span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-ink backdrop-blur-md">{t("after")}</span>

      {/* линия + ручка */}
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,.08)]" style={{ left: `${pos}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={t("sliderAria", { name: label })}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={t("sliderValue", { value: Math.round(pos) })}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 4;
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
          else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
          else if (e.key === "Home") setPos(0);
          else if (e.key === "End") setPos(100);
          else return;
          e.preventDefault();
        }}
        className="absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,.45)] outline-none focus-visible:ring-2 focus-visible:ring-wood focus-visible:ring-offset-2"
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
        </svg>
      </div>
    </div>
  );
}
