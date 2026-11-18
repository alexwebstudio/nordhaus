"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { BRAND } from "@/config/site";
import { heroVisual } from "@/data/hero";
import { Link } from "@/i18n/navigation";
import { TextFlip } from "@/components/effects/TextFlip";
import { BlurIn } from "@/components/effects/BlurIn";
import { Magnetic } from "@/components/effects/Magnetic";
import { Arrow } from "@/components/ui/PillButton";
import { useApp } from "@/components/providers/AppProviders";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";
import styles from "./Hero.module.css";

/** 4 окна: индекс колонки + верх/низ в % высоты сцены (ритм «ступенек» ARCHISTUDIO). */
const WINDOWS = [
  { c: 0, t: 0, b: 68 },
  { c: 1, t: 0, b: 68 },
  { c: 2, t: 0, b: 96 },
  { c: 3, t: 4.5, b: 64 },
] as const;

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const root = useRef<HTMLElement>(null);
  const { introDone } = useApp();
  const words = t.raw("words") as string[];

  // Вход — после прелоадера: окна «вырастают» снизу вверх, фото внутри мягко уменьшается
  useGsap(
    ({ gsap }) => {
      if (!introDone) return;
      const wins = gsap.utils.toArray<HTMLElement>("[data-win]");
      const photos = gsap.utils.toArray<HTMLElement>("[data-photo]");
      if (prefersReducedMotion()) {
        gsap.to(wins, { opacity: 1, duration: 0.6 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "expo.out", duration: 1.4 } })
        .fromTo(wins, { clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", stagger: 0.12, immediateRender: true }, 0)
        .fromTo(photos, { scale: 1.15 }, { scale: 1, duration: 2, stagger: 0.12 }, 0)
        .fromTo("[data-hero-cta]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1.0);
    },
    [introDone],
    root,
  );

  // Логотип точно подгоняется под ширину колонок 1–2 (на мобилке — под всю ширину),
  // чтобы никогда не заезжать на 3-е окно: меряем реальную ширину текста.
  useEffect(() => {
    const copy = root.current!.querySelector<HTMLElement>("[data-logo]")!;
    const h1 = copy.querySelector<HTMLElement>("h1")!;
    const fit = () => {
      h1.style.fontSize = "100px";
      const natural = h1.scrollWidth;
      const target = copy.clientWidth;
      if (natural > 0 && target > 0) h1.style.fontSize = `${(100 * target) / natural}px`;
    };
    fit();
    // веб-шрифт подключается после первого кадра — перемеряем, когда он догрузится
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener("loadingdone", fit);
    const ro = new ResizeObserver(fit);
    ro.observe(copy);
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, []);

  const photo = heroVisual.kind === "photo" ? heroVisual : null;

  return (
    <section ref={root} className={styles.hero} aria-label={t("aria")}>
      <div data-stage className={styles.stage}>
        {WINDOWS.map((w, i) => (
          <div
            key={i}
            data-win={i}
            className={`${styles.win} ${i > 1 ? styles.desktopOnly : ""}`}
            style={{ "--c": w.c, "--t": w.t, "--b": w.b } as React.CSSProperties}
          >
            <div className={styles.photoWrap}>
              <div data-photo className={styles.photo}>
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={i === 0 ? t("aria") : ""}
                    aria-hidden={i !== 0}
                    fill
                    priority
                    fetchPriority="high"
                    loading="eager"
                    sizes="100vw"
                    quality={78}
                    style={{ objectFit: "cover", objectPosition: photo.position }}
                  />
                ) : (
                  <div className={styles.placeholder} aria-hidden={i !== 2} />
                )}
              </div>
            </div>
            {/* подпись плейсхолдера: в самом высоком окне (на мобилке — в первом) */}
            {!photo && heroVisual.kind === "placeholder" && (i === 2 || i === 0) && (
              <p className={`${styles.phCaption} ${i === 0 ? styles.mobileOnly : ""}`}>
                <span>{t("placeholder")}</span>
                <span className={styles.phSize}>{tc("placeholderSize", { ratio: heroVisual.ratio, size: heroVisual.size })}</span>
              </p>
            )}
            <span className={styles.shade} aria-hidden />
          </div>
        ))}

        <div data-logo className={styles.copy}>
          <h1 className={styles.logo}>
            <TextFlip text={BRAND} play={introDone} delay={450} duration={1100} stagger={55} perspective={900} />
          </h1>
          <BlurIn as="p" play={introDone} delay={900} className={styles.subtitle}>
            {t("subtitle1")}
            <br />
            {t("subtitle2")}
          </BlurIn>

          {/* Продающие кнопки: основная (заливка, кружок-стрелка, magnetic) и второстепенная (обводка) */}
          <div className={styles.actions}>
            <span data-hero-cta className={styles.ctaWrap}>
              <Magnetic className="max-md:w-full">
                <button type="button" data-quiz-trigger className={`group ${styles.ctaPrimary}`}>
                  <span>{t("ctaPrimary")}</span>
                  <span className={styles.ctaDot}>
                    <Arrow className="size-4 transition-transform duration-[var(--dur-expand)] group-hover:-rotate-45" />
                  </span>
                </button>
              </Magnetic>
            </span>
            <span data-hero-cta className={styles.ctaWrap}>
              <Link href="/catalog" className={`group ${styles.ctaSecondary}`}>
                <span>{t("ctaSecondary")}</span>
                <Arrow className="size-4 transition-transform duration-[var(--dur-expand)] group-hover:translate-x-1.5" />
              </Link>
            </span>
          </div>
        </div>

        <ul data-words className={styles.words} aria-label={t("wordsAria")}>
          {words.map((w, i) => (
            <BlurIn as="li" key={w} play={introDone} delay={700 + i * 110} className={i % 2 ? styles.wordDim : styles.word}>
              {w}
            </BlurIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
