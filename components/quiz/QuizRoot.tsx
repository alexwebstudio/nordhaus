"use client";

/**
 * Глобальная точка входа квиза: перехватывает клики по любому [data-quiz-trigger]
 * (в т.ч. в серверных компонентах), запоминает прямоугольник и цвет кнопки
 * для FLIP-морфа и лениво подгружает сам попап.
 */
import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";

export type Origin = { rect: DOMRect; bg: string; radius: number; el: HTMLElement | null };

const QuizModal = dynamic(() => import("./QuizModal").then((m) => m.QuizModal), { ssr: false });

const Ctx = createContext<{ open: (el?: HTMLElement | null) => void } | null>(null);
export const useQuiz = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useQuiz must be used inside <QuizRoot>");
  return c;
};

const measure = (el?: HTMLElement | null): Origin => {
  if (!el) {
    const w = 220;
    const h = 52;
    const rect = new DOMRect(window.innerWidth / 2 - w / 2, window.innerHeight / 2 - h / 2, w, h);
    return { rect, bg: "#1E2024", radius: 26, el: null };
  }
  const rect = el.getBoundingClientRect();
  const bg = getComputedStyle(el).backgroundColor;
  return {
    rect,
    bg: bg === "rgba(0, 0, 0, 0)" || bg === "transparent" ? "#1E2024" : bg,
    radius: Math.min(rect.height / 2, 999),
    el,
  };
};

export function QuizRoot({ children }: { children: React.ReactNode }) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const { lenis } = useApp();
  const openRef = useRef(false);

  const open = useCallback(
    (el?: HTMLElement | null) => {
      if (openRef.current) return;
      openRef.current = true;
      lenis.current?.stop();
      setOrigin(measure(el));
    },
    [lenis],
  );

  const onClosed = useCallback(() => {
    openRef.current = false;
    lenis.current?.start();
    const el = origin?.el;
    setOrigin(null);
    // возвращаем фокус на кнопку, с которой открыли
    requestAnimationFrame(() => el?.focus({ preventScroll: true }));
  }, [lenis, origin]);

  // делегирование кликов + прогрев чанка попапа
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-quiz-trigger]");
      if (!t) return;
      e.preventDefault();
      open(t);
    };
    document.addEventListener("click", onClick);
    const idle = (window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500)))(() => {
      import("./QuizModal");
    });
    return () => {
      document.removeEventListener("click", onClick);
      if (typeof idle === "number" && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    };
  }, [open]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {origin && <QuizModal origin={origin} onClosed={onClosed} />}
    </Ctx.Provider>
  );
}
