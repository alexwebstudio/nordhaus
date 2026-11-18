"use client";

import { useRef, type ReactNode } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Image reveal: контейнер раскрывается clip-path снизу вверх, содержимое
 * чуть уменьшается со 1.12 → 1, затем мягко параллаксит на скролле.
 */
export function ImageReveal({
  children,
  overlay,
  className = "",
  parallax = 6,
}: {
  children: ReactNode;
  /** слой поверх (бейджи) — не масштабируется */
  overlay?: ReactNode;
  className?: string;
  /** % вертикального сдвига содержимого на скролле */
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap }) => {
      if (prefersReducedMotion()) return;
      const el = ref.current!;
      const inner = el.querySelector("[data-reveal-inner]");
      gsap.fromTo(
        el,
        { clipPath: "inset(18% 6% 0% 6% round 28px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "expo.out",
          duration: 1.6,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          clearProps: "clipPath",
        },
      );
      gsap.fromTo(
        inner,
        { scale: 1.12, yPercent: -parallax / 2 },
        {
          scale: 1,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
      if (parallax) {
        gsap.to(inner, {
          yPercent: parallax / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    },
    [],
    ref,
  );

  return (
    <div ref={ref} className={className}>
      <div data-reveal-inner className="absolute -inset-y-[4%] inset-x-0">
        {children}
      </div>
      {overlay}
    </div>
  );
}
