"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useApp, wasIntroPlayed } from "@/components/providers/AppProviders";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";
import { FRAME } from "@/components/ui/houseFrame";

const SEEN_KEY = "nh-intro-seen";
/** power2.inOut / expo.inOut / ease-out-quint как cubic-bezier для Web Animations API */
const POWER2_IN_OUT = "cubic-bezier(0.45, 0, 0.55, 1)";
const EXPO_IN_OUT = "cubic-bezier(0.87, 0, 0.13, 1)";
const QUINT_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Прелоадер (~3s): на графите тонкими линиями прорисовывается каркас дома,
 * над ним мягко поднимается NORDHAUS, пауза — и экран уходит clip-path прямо в анимацию hero.
 * Повторный визит в сессии — ~0.8s. При переходах между страницами и смене языка не показывается.
 * Работает на Web Animations API — стартует сразу, без ожидания библиотек.
 */
export function Preloader() {
  const t = useTranslations("preloader");
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(wasIntroPlayed);
  const { finishIntro } = useApp();

  useEffect(() => {
    if (gone) return;
    const el = root.current!;
    const lines = Array.from(el.querySelectorAll<SVGPathElement>("[data-line]"));
    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-letter]"));
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;

    const anims: Animation[] = [];
    const timers: number[] = [];
    let cancelled = false;
    const A = (node: Element, kf: Keyframe[], opt: KeyframeAnimationOptions) => {
      const an = node.animate(kf, { fill: "both", ...opt });
      anims.push(an);
      return an;
    };
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));
    const done = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setGone(true);
    };

    if (prefersReducedMotion()) {
      lines.forEach((l) => (l.style.strokeDashoffset = "0"));
      letters.forEach((l) => (l.style.opacity = "1"));
      timers.push(window.setTimeout(finishIntro, 300));
      A(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 300 }).onfinish = done;
      return () => timers.forEach(clearTimeout);
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}

    // к уходу экрана должны быть готовы hero-фото (если есть) и GSAP для анимации окон; максимум 2.5s
    const heroImg = document.querySelector<HTMLImageElement>("[data-win] img");
    const imgReady = heroImg && !heroImg.complete ? new Promise((r) => heroImg.addEventListener("load", r, { once: true })) : Promise.resolve();
    const heroReady = Promise.race([Promise.all([imgReady, loadGsap()]), wait(2500)]);

    const exit = (dur: number) => {
      if (cancelled) return;
      finishIntro();
      A(stage, [{ transform: "none" }, { transform: "translateY(-56px)" }], { duration: dur, easing: EXPO_IN_OUT });
      A(el, [{ clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)" }], { duration: dur, easing: EXPO_IN_OUT }).onfinish = done;
    };

    const letterIn = (i: number, delay: number, dur: number) =>
      A(
        letters[i],
        [
          { opacity: 0, transform: "translateY(0.45em)", filter: "blur(10px)" },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
        { duration: dur, delay, easing: QUINT_OUT },
      );

    if (seen) {
      // повторный визит — ~0.8s
      lines.forEach((l, i) => A(l, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 380, delay: i * 6, easing: POWER2_IN_OUT }));
      letters.forEach((_, i) => letterIn(i, 60 + i * 20, 380));
      wait(300)
        .then(() => heroReady)
        .then(() => exit(520));
    } else {
      // первый визит — ≈3s: каркас группами, как на стройке
      for (let g = 0; g <= 5; g++) {
        lines
          .filter((l) => l.dataset.group === String(g))
          .forEach((l, i) => A(l, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 700, delay: 120 + g * 240 + i * 30, easing: POWER2_IN_OUT }));
      }
      letters.forEach((_, i) => letterIn(i, 1100 + i * 60, 900));
      wait(2200)
        .then(() => heroReady)
        .then(() => exit(900));
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      anims.forEach((an) => an.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  const word = "NORDHAUS";
  return (
    <div
      ref={root}
      data-preloader
      role="status"
      aria-live="polite"
      aria-label={t("aria")}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite text-white [clip-path:inset(0%_0%_0%_0%)]"
    >
      <div data-stage className="flex flex-col items-center">
        {/* NORDHAUS — буквы поднимаются из размытия (логотип A, по буквам) */}
        <p className="font-brand mb-8 text-[clamp(28px,4.4vw,56px)] leading-none tracking-[0.06em] uppercase" aria-hidden>
          {Array.from(word).map((ch, i) => (
            <span key={i} data-letter className={`inline-block opacity-0 ${i < 4 ? "font-bold" : "font-light"}`}>
              {ch}
            </span>
          ))}
        </p>
        <svg viewBox="0 30 480 260" className="w-[min(72vw,460px)]" fill="none" aria-hidden>
          {FRAME.map((p, i) => (
            <path
              key={i}
              data-line
              data-group={p.group}
              d={p.d}
              pathLength={1}
              stroke="rgba(255,255,255,0.82)"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              strokeDashoffset={1}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
