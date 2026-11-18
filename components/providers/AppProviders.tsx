"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

type Ctx = {
  /** true, когда прелоадер начал уходить — hero стартует свою анимацию */
  introDone: boolean;
  finishIntro: () => void;
  lenis: React.RefObject<Lenis | null>;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <AppProviders>");
  return ctx;
}

/**
 * Интро (прелоадер) проигрывается один раз за загрузку вкладки. При смене локали
 * дерево [locale] перемонтируется — флаг на уровне модуля не даёт показать прелоадер снова.
 */
let introPlayed = false;
export const wasIntroPlayed = () => introPlayed;

export function AppProviders({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(introPlayed);
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    const html = document.documentElement;
    if (!introPlayed) {
      // прелоадер всегда открывает hero сверху
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    } else {
      html.removeAttribute("data-loading");
    }
    // веб-шрифты включаем после первого кадра (см. html:not([data-fonts]) в globals.css)
    requestAnimationFrame(() => requestAnimationFrame(() => html.setAttribute("data-fonts", "")));

    if (prefersReducedMotion()) return;
    // Lenis и GSAP грузим после первой отрисовки — они не нужны для первого кадра
    let cancelled = false;
    let teardown = () => {};
    Promise.all([import("lenis"), loadGsap()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      const l = new LenisCtor({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      lenis.current = l;
      l.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (html.hasAttribute("data-loading")) l.stop();
      // секции с content-visibility меняют высоту страницы по мере прокрутки —
      // пересчитываем позиции ScrollTrigger (пины, scrub), когда высота реально изменилась
      let lastH = document.body.scrollHeight;
      let t = 0;
      const ro = new ResizeObserver(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - lastH) < 2) return;
        lastH = h;
        clearTimeout(t);
        t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      ro.observe(document.body);
      teardown = () => {
        ro.disconnect();
        clearTimeout(t);
        gsap.ticker.remove(tick);
        l.destroy();
        lenis.current = null;
      };
    });
    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  // Смена маршрута: наверх без анимации и пересчёт ScrollTrigger под новую страницу
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    let raf = 0;
    loadGsap().then(({ ScrollTrigger }) => {
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const finishIntro = useCallback(() => {
    introPlayed = true;
    document.documentElement.removeAttribute("data-loading");
    lenis.current?.start();
    setIntroDone(true);
  }, []);

  return <AppCtx.Provider value={{ introDone, finishIntro, lenis }}>{children}</AppCtx.Provider>;
}
