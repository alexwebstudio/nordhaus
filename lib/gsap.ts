"use client";

import { useEffect, type DependencyList, type RefObject } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Core = typeof import("./gsap-core");

let pending: Promise<Core> | null = null;
/** Ленивая загрузка GSAP + ScrollTrigger (один раз на сайт). */
export const loadGsap = () => (pending ??= import("./gsap-core"));

/**
 * Аналог useGSAP, но GSAP подгружается лениво: эффект запускается, как только чанк готов.
 * Всё созданное внутри собирается в gsap.context и откатывается при размонтировании.
 */
export function useGsap(
  effect: (core: Core) => void | (() => void),
  deps: DependencyList,
  scope?: RefObject<Element | null>,
) {
  useEffect(() => {
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    let cleanup: void | (() => void);
    loadGsap().then((core) => {
      if (cancelled) return;
      ctx = core.gsap.context(() => {
        cleanup = effect(core);
      }, scope?.current ?? undefined);
    });
    return () => {
      cancelled = true;
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
