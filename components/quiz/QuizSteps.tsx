"use client";

import { useTranslations } from "next-intl";
import type { Answers, Step } from "@/data/quiz";
import { Icon } from "@/components/ui/Icon";

type Props = {
  step: Step;
  answers: Answers;
  onPick: (id: keyof Answers, value: Answers[keyof Answers]) => void;
  onArea: (v: number) => void;
};

const card =
  "group relative flex w-full rounded-[20px] border text-left transition-[transform,box-shadow,border-color,background-color] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const cardIdle = "border-white/80 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_14px_40px_-24px_rgba(20,21,24,.25)] backdrop-blur-xl hover:bg-white/90";
const cardOn = "border-ink bg-white shadow-[0_18px_50px_-24px_rgba(20,21,24,.4)]";

function Tick({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute top-3 right-3 grid size-7 place-items-center rounded-full transition-[transform,opacity,background-color] duration-500 ${
        on ? "scale-100 bg-ink text-white opacity-100" : "scale-50 opacity-0"
      }`}
    >
      <Icon name="check" className="size-4" strokeWidth={2.2} />
    </span>
  );
}

export function StepBody({ step, answers, onPick, onArea }: Props) {
  const t = useTranslations("quiz.steps");
  const tc = useTranslations("common");

  if (step.kind === "range") {
    const pct = ((answers.area - step.min) / (step.max - step.min)) * 100;
    return (
      <div className="pt-2">
        <p className="font-brand text-[clamp(56px,7vw,96px)] leading-none font-semibold tracking-[-0.05em]">
          {answers.area}
          <span className="ml-2 align-top text-[0.32em] font-normal tracking-normal text-muted">{tc("m2")}</span>
        </p>
        <label htmlFor="quiz-area" className="sr-only">
          {t("area.aria")}
        </label>
        <input
          id="quiz-area"
          type="range"
          min={step.min}
          max={step.max}
          step={step.step}
          value={answers.area}
          onChange={(e) => onArea(Number(e.target.value))}
          aria-valuetext={t("area.valueText", { area: answers.area })}
          className="quiz-range mt-8 w-full"
          style={{ "--pct": `${pct}%` } as React.CSSProperties}
        />
        <div className="mt-2 flex justify-between text-[12px] text-muted" aria-hidden>
          <span>{step.min} {tc("m2")}</span>
          <span>{step.max} {tc("m2")}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {step.presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onArea(p)}
              aria-pressed={answers.area === p}
              className={`h-10 rounded-full px-4 text-[14px] font-medium transition-colors ${
                answers.area === p ? "bg-ink text-white" : "bg-white/70 text-ink ring-1 ring-ink/10 hover:bg-white"
              }`}
            >
              {p} {tc("m2")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const current = answers[step.id as keyof Answers];

  if (step.layout === "number") {
    return (
      <div className="grid grid-cols-5 gap-2" role="group" aria-label={t("bedrooms.title")}>
        {step.options.map((o) => {
          const on = current === o.value;
          const n = Number(o.value);
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(step.id, o.value as Answers["bedrooms"])}
              className={`${card} ${on ? cardOn : cardIdle} aspect-[3/4] flex-col items-center justify-center sm:aspect-square`}
            >
              <span className="font-brand text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.04em]">{n === 5 ? "5+" : n}</span>
              <span className="mt-1 text-[12px] text-muted">{t("bedrooms.unit", { count: n })}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (step.layout === "list") {
    return (
      <div className="grid gap-2.5 md:grid-cols-3" role="group" aria-label={t("pack.title")}>
        {step.options.map((o) => {
          const on = current === o.value;
          const includes = t.raw(`pack.options.${o.key}.includes`) as string[];
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(step.id, o.value as Answers["pack"])}
              className={`${card} ${on ? cardOn : cardIdle} flex-col p-5`}
            >
              {o.key === "turnkey" && <span className="mb-3 self-start rounded-full bg-wood px-2.5 py-1 text-[11px] font-medium text-white">{t("pack.hit")}</span>}
              <span className="block pr-8 text-[18px] font-medium">{t(`pack.options.${o.key}.title`)}</span>
              <ul className="mt-3 space-y-1.5">
                {includes.map((inc) => (
                  <li key={inc} className="flex gap-2 text-[13px] leading-snug text-muted">
                    <Icon name="check" className="mt-px size-4 shrink-0 text-wood" />
                    {inc}
                  </li>
                ))}
              </ul>
              <Tick on={on} />
            </button>
          );
        })}
      </div>
    );
  }

  // icon — крупные стеклянные карточки, выбор в 1 клик
  const many = step.options.length === 4;
  return (
    <div className={`grid gap-2.5 ${many ? "sm:grid-cols-2" : ""}`} role="group" aria-label={t(`${step.id}.title`)}>
      {step.options.map((o) => {
        const on = current === o.value;
        const hasText = t.has(`${step.id}.options.${o.key}.text`);
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(step.id, o.value as Answers[keyof Answers])}
            className={`${card} ${on ? cardOn : cardIdle} items-center gap-4 p-4 pr-12`}
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-500 group-hover:scale-105 ${on ? "bg-ink text-wood-light" : "bg-bg text-ink"}`}>
              <Icon name={o.icon!} className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[16px] leading-tight font-medium">{t(`${step.id}.options.${o.key}.title`)}</span>
              {hasText && <span className="mt-1 block text-[13px] text-muted">{t(`${step.id}.options.${o.key}.text`)}</span>}
            </span>
            <Tick on={on} />
          </button>
        );
      })}
    </div>
  );
}
