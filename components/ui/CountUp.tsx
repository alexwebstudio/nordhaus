"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/** Count-up при появлении в экране. SSR рендерит финальное значение (SEO, no-JS). */
export function CountUp({
  value,
  suffix = "",
  duration = 1.8,
  className = "",
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const render = (v: number) => (el.textContent = Math.round(v).toLocaleString("ru-RU") + suffix);
    render(0);
    let raf = 0;
    // свой rAF вместо GSAP: count-up не должен тянуть библиотеку в первый экран
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / (duration * 1000));
        render(value * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}
