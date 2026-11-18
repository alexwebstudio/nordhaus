"use client";

/**
 * <BlurIn> — React-порт эффекта AW-Flow «Blur In» (fx/14, aw-flow.alexwebstudio.ru).
 * Объект выплывает из размытия и чуть уменьшается до своего размера — мягкий фокус.
 * Как и TextFlip: без JS содержимое видимо, скрытое состояние взводит скрипт (data-armed).
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** px */
  blur?: number;
  scale?: number;
  /** мс */
  duration?: number;
  delay?: number;
  ease?: string;
  play?: "view" | boolean;
  threshold?: number;
  style?: CSSProperties;
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function BlurIn({
  children,
  as: Tag = "div",
  className = "",
  blur = 16,
  scale = 1.05,
  duration = 900,
  delay = 0,
  ease = "cubic-bezier(0.5, 1, 0.89, 1)",
  play = "view",
  threshold = 0.2,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const { introDone } = useApp();

  useIsoLayoutEffect(() => {
    if (!prefersReducedMotion()) ref.current?.setAttribute("data-armed", "");
  }, []);

  useEffect(() => {
    if (play !== "view" || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [play, threshold]);

  const active = play === "view" ? inView && introDone : play;

  return (
    <Tag
      ref={ref}
      className={`awf-blur ${active ? "awf-in" : ""} ${className}`}
      style={
        {
          "--awf-blur": `${blur}px`,
          "--awf-scale": scale,
          "--awf-duration": `${duration}ms`,
          "--awf-delay": `${delay}ms`,
          "--awf-ease": ease,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
