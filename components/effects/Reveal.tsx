"use client";

/**
 * Каскадное появление карточек: fade + подъём + blur → 0, stagger 0.1s, один раз при входе в экран.
 * Скрытое состояние ставится из JS до отрисовки; анимирует GSAP (expo.out).
 * Страховка: если GSAP не загрузился за 3s, элементы просто становятся видимыми.
 */
import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";
import { DUR, EASE, REVEAL } from "@/lib/motion";
import { useApp } from "@/components/providers/AppProviders";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Reveal({
  children,
  as: Tag = "ul",
  className = "",
  stagger = REVEAL.stagger,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
} & React.AriaAttributes) {
  const ref = useRef<HTMLElement>(null);
  const { introDone } = useApp();

  const items = () => Array.from(ref.current?.children ?? []) as HTMLElement[];

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    for (const el of items()) {
      el.style.opacity = "0";
      el.style.transform = `translateY(${REVEAL.y}px)`;
      el.style.filter = `blur(${REVEAL.blur}px)`;
    }
    // страховка только на случай, если GSAP так и не загрузился
    const safety = window.setTimeout(() => items().forEach(clear), 6000);
    loadGsap().then(() => window.clearTimeout(safety));
    return () => window.clearTimeout(safety);
     
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !introDone) return;
    let cancelled = false;
    let kill = () => {};
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !ref.current) return;
      const els = items();
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: REVEAL.start,
        once: true,
        onEnter: () =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: DUR.reveal,
            ease: EASE.in,
            stagger,
            onComplete: () => els.forEach(clear),
          }),
      });
      kill = () => st.kill();
    });
    return () => {
      cancelled = true;
      kill();
    };
     
  }, [introDone, stagger]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

function clear(el: HTMLElement) {
  el.style.opacity = "";
  el.style.transform = "";
  el.style.filter = "";
}
