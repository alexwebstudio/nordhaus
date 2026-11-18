"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/data/catalog";
import { estimate, steps, type Answers } from "@/data/quiz";
import { prefersReducedMotion } from "@/lib/gsap";
import { gsap } from "@/lib/gsap-core";

/** Число, которое плавно «доезжает» до нового значения. */
function Num({ value, format = (n: number) => n.toLocaleString("ru-RU") }: { value: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const cur = useRef(value);
  useEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) {
      el.textContent = format(value);
      cur.current = value;
      return;
    }
    const o = { v: cur.current };
    const tw = gsap.to(o, {
      v: value,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => {
        cur.current = o.v;
        el.textContent = format(Math.round(o.v));
      },
    });
    return () => {
      tw.kill();
    };
  }, [value, format]);
  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  );
}

const fmtPrice = (n: number) => formatPrice(Math.round(n / 100_000) * 100_000);

/** короткие подписи выбранных ответов */
export function useChips(a: Answers) {
  const t = useTranslations("quiz.steps");
  const out: string[] = [];
  for (const s of steps) {
    if (s.kind !== "choice") continue;
    const v = a[s.id as keyof Answers];
    if (v === undefined) continue;
    const o = s.options.find((x) => x.value === v);
    if (!o) continue;
    if (s.id === "bedrooms") out.push(`${Number(v) === 5 ? "5+" : v} ${t("bedrooms.unit", { count: Number(v) })}`);
    else if (s.id === "pack") out.push(t(`pack.options.${o.key}.title`));
    else out.push(t(`${s.id}.options.${o.key}.short`));
  }
  return out;
}

/** Большое превью справа (desktop): живые цифры дома — площадь, срок, цена «от». */
export function QuizPreview({ answers }: { answers: Answers }) {
  const t = useTranslations("quiz.preview");
  const tc = useTranslations("common");
  const { price, days } = estimate(answers);
  const list = useChips(answers);
  const fill = Math.min(1, (answers.area - 60) / 190);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] bg-graphite p-6 text-white">
      <p className="text-[12px] font-semibold tracking-[0.16em] text-white/60 uppercase">{t("title")}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("chipsAria")}>
        {list.length === 0 && <li className="text-[14px] text-white/55">{t("empty")}</li>}
        {list.map((c) => (
          <li key={c} className="animate-[quizChip_.5s_var(--ease-ui)] rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] backdrop-blur-md">
            {c}
          </li>
        ))}
      </ul>

      {/* площадь — главная цифра, растёт вместе с ползунком */}
      <div className="mt-auto pt-10">
        <p className="text-[13px] text-white/55">{t("area")}</p>
        <p className="font-brand mt-1 text-[clamp(64px,8vw,120px)] leading-[0.9] font-semibold tracking-[-0.05em]">
          <Num value={answers.area} />
          <span className="ml-2 align-top text-[0.28em] font-normal tracking-normal text-white/55">{tc("m2")}</span>
        </p>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
          <div className="h-full rounded-full bg-wood-light transition-[width] duration-700" style={{ width: `${8 + fill * 92}%` }} />
        </div>
      </div>

      <div className="mt-6 grid gap-3" aria-live="polite">
        <div className="rounded-[18px] border border-white/15 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.2)] backdrop-blur-xl">
          <p className="text-[12px] text-white/60">{t("term")}</p>
          <p className="font-brand mt-1 text-[28px] font-semibold tracking-[-0.03em]">
            ~<Num value={days} /> <span className="font-sans text-[14px] font-normal text-white/60">{t("daysUnit")}</span>
          </p>
        </div>
        <div className="rounded-[18px] bg-white p-5 text-ink">
          <p className="text-[12px] text-muted">{t("cost")}</p>
          <p className="font-brand mt-1 text-[clamp(24px,2.6vw,36px)] leading-none font-semibold tracking-[-0.04em]">
            <Num value={price} format={fmtPrice} />
          </p>
          <p className="mt-2 text-[12px] text-muted">{t("note")}</p>
        </div>
      </div>
    </div>
  );
}

/** Компактное превью сверху (мобилка). */
export function QuizPreviewCompact({ answers }: { answers: Answers }) {
  const t = useTranslations("quiz.preview");
  const tc = useTranslations("common");
  const { price, days } = estimate(answers);
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] bg-graphite px-4 py-3 text-white" aria-live="polite">
      <p className="font-brand text-[26px] leading-none font-semibold tracking-[-0.04em]">
        <Num value={answers.area} /> <span className="text-[12px] font-normal text-white/55">{tc("m2")}</span>
      </p>
      <div className="min-w-0 text-right">
        <p className="font-brand text-[16px] leading-tight font-semibold tracking-[-0.03em]">
          <Num value={price} format={fmtPrice} />
        </p>
        <p className="mt-0.5 text-[12px] text-white/60">
          ~{days} {t("daysUnit")}
        </p>
      </div>
    </div>
  );
}
