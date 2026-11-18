"use client";

/**
 * <TextFlip> — React-порт эффекта AW-Flow «3D Flip» (fx/04, aw-flow.alexwebstudio.ru).
 * Буквы/слова разворачиваются вокруг горизонтальной оси, как табло.
 *
 * Надёжность: сервер отдаёт текст ВИДИМЫМ. Скрытое стартовое состояние включает JS
 * (data-armed в useLayoutEffect, до отрисовки), поэтому при сбое скриптов текст не пропадёт.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { prefersReducedMotion } from "@/lib/gsap";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  split?: "chars" | "words";
  angle?: number;
  perspective?: number;
  /** мс */
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  /** "view" — при появлении в экране; boolean — ручной запуск */
  play?: "view" | boolean;
  style?: CSSProperties;
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function TextFlip({
  text,
  as: Tag = "span",
  className = "",
  split = "chars",
  angle = -90,
  perspective = 600,
  duration = 850,
  stagger = 28,
  delay = 0,
  ease = "cubic-bezier(0.34, 1.56, 0.64, 1)",
  play = "view",
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const { introDone } = useApp();

  // взводим до первой отрисовки компонента
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
      { threshold: 0.2 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [play]);

  // в режиме «при появлении» ждём ухода прелоадера, иначе анимация отыграет под ним
  const active = play === "view" ? inView && introDone : play;

  let i = 0;
  const words = text.split(/(\s+)/);

  return (
    <Tag
      ref={ref}
      className={`awf-flip ${active ? "awf-in" : ""} ${className}`}
      style={
        {
          "--awf-angle": `${angle}deg`,
          "--awf-perspective": `${perspective}px`,
          "--awf-duration": `${duration}ms`,
          "--awf-stagger": `${stagger}ms`,
          "--awf-delay": `${delay}ms`,
          "--awf-ease": ease,
          ...style,
        } as CSSProperties
      }
    >
      {/* текст для скринридеров и поисковиков; анимированные части скрыты от них */}
      <span className="sr-only">{text}</span>
      {words.map((w, wi) => {
        if (!w) return null;
        if (/^\s+$/.test(w)) return " ";
        if (split === "words") {
          return (
            <span key={wi} aria-hidden className="awf-w awf-p" style={{ "--i": i++ } as CSSProperties}>
              {w}
            </span>
          );
        }
        return (
          <span key={wi} aria-hidden className="awf-w">
            {Array.from(w).map((ch, ci) => (
              <span key={ci} className="awf-p" style={{ "--i": i++ } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
