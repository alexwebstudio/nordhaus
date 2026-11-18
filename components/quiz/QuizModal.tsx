"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { initialAnswers, SOCIAL_COUNT, steps, TOTAL, type Answers } from "@/data/quiz";
import { Icon } from "@/components/ui/Icon";
import { prefersReducedMotion } from "@/lib/gsap";
import { gsap } from "@/lib/gsap-core";
import type { Origin } from "./QuizRoot";
import { StepBody } from "./QuizSteps";
import { QuizPreview, QuizPreviewCompact } from "./QuizPreview";
import { QuizForm, QuizSuccess } from "./QuizForm";

const STORE = "nh-quiz-v1";
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

type Saved = { answers: Answers; step: number };
const load = (): Saved => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) ?? "null") as Saved | null;
    if (s && typeof s.step === "number" && s.answers?.area) return { answers: s.answers, step: Math.min(s.step, TOTAL) };
  } catch {}
  return { answers: initialAnswers, step: 0 };
};

export function QuizModal({ origin, onClosed }: { origin: Origin; onClosed: () => void }) {
  const t = useTranslations("quiz");
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closing = useRef(false);
  const pickTimer = useRef<number | undefined>(undefined);

  const [{ answers, step }, setState] = useState<Saved>(load);
  const [dir, setDir] = useState<1 | -1>(1);
  const [done, setDone] = useState<null | { contact: "whatsapp" | "telegram" | "call"; name: string }>(null);

  const isForm = step >= TOTAL;
  const current = steps[Math.min(step, TOTAL - 1)];
  const left = TOTAL - step;

  // сохраняем прогресс
  useEffect(() => {
    if (done) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ answers, step }));
    } catch {}
  }, [answers, step, done]);

  /* ---------- FLIP-морф: кнопка → панель ---------- */
  const insetFrom = useCallback(
    (r: DOMRect) => {
      const p = panel.current!.getBoundingClientRect();
      const c = (n: number) => Math.max(0, n);
      return `inset(${c(r.top - p.top)}px ${c(p.right - r.right)}px ${c(p.bottom - r.bottom)}px ${c(r.left - p.left)}px round ${origin.radius}px)`;
    },
    [origin.radius],
  );

  useLayoutEffect(() => {
    const el = panel.current!;
    const content = el.querySelector("[data-quiz-content]");
    const backdrop = root.current!.querySelector("[data-quiz-backdrop]");
    const finalR = window.innerWidth < 1024 ? 24 : 28;
    if (prefersReducedMotion()) {
      gsap.fromTo([backdrop, el], { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.set(content, { opacity: 1 });
    } else {
      const tl = gsap.timeline();
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
        .fromTo(
          el,
          { clipPath: insetFrom(origin.rect), backgroundColor: origin.bg },
          { clipPath: `inset(0px 0px 0px 0px round ${finalR}px)`, duration: 0.95, ease: "expo.inOut" },
          0,
        )
        .to(el, { backgroundColor: "#EEEFF1", duration: 0.5, ease: "power1.inOut" }, 0.2)
        .fromTo(content, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }, 0.55);
    }
    const t = setTimeout(() => titleRef.current?.focus({ preventScroll: true }), 650);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    window.clearTimeout(pickTimer.current);
    const el = panel.current!;
    const content = el.querySelector("[data-quiz-content]");
    const backdrop = root.current!.querySelector("[data-quiz-backdrop]");
    if (prefersReducedMotion()) {
      gsap.to([el, backdrop], { opacity: 0, duration: 0.2, onComplete: onClosed });
      return;
    }
    // если кнопка всё ещё на экране — схлопываемся обратно в неё
    let r = origin.el?.getBoundingClientRect();
    if (!r || r.bottom < 0 || r.top > window.innerHeight || r.width === 0) {
      r = new DOMRect(window.innerWidth / 2 - 110, window.innerHeight - 90, 220, 52);
    }
    const tl = gsap.timeline({ onComplete: onClosed });
    tl.to(content, { opacity: 0, y: 12, duration: 0.25, ease: "power2.in" }, 0)
      .to(el, { clipPath: insetFrom(r), backgroundColor: origin.bg, duration: 0.75, ease: "expo.inOut" }, 0.1)
      .to(backdrop, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.35)
      .to(el, { opacity: 0, duration: 0.15 }, 0.75);
  }, [insetFrom, onClosed, origin]);

  /* ---------- клавиатура: Esc + фокус-трап ---------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const items = Array.from(panel.current!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !panel.current!.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /* ---------- навигация ---------- */
  const go = useCallback((to: number) => {
    setState((s) => {
      setDir(to > s.step ? 1 : -1);
      return { ...s, step: Math.max(0, Math.min(TOTAL, to)) };
    });
  }, []);

  useEffect(() => {
    // фокус на заголовок шага — скринридер прочитает вопрос
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("#quiz-title")?.focus({ preventScroll: true }), 60);
    panel.current?.querySelector("[data-quiz-scroll]")?.scrollTo({ top: 0 });
    return () => clearTimeout(t);
  }, [step, done]);

  const onPick = (id: keyof Answers, value: Answers[keyof Answers]) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } }));
    window.clearTimeout(pickTimer.current);
    // выбор в один клик → автопереход
    pickTimer.current = window.setTimeout(() => go(step + 1), 380);
  };
  const onArea = (v: number) => setState((s) => ({ ...s, answers: { ...s.answers, area: v } }));

  const answered = !isForm && (current.kind === "range" || answers[current.id as keyof Answers] !== undefined);

  const onSuccess = (contact: "whatsapp" | "telegram" | "call", name: string) => {
    setDone({ contact, name });
    try {
      localStorage.removeItem(STORE);
    } catch {}
  };

  return (
    <div ref={root} className="fixed inset-0 z-[90]" onKeyDown={onKeyDown}>
      <div
        data-quiz-backdrop
        className="absolute inset-0 bg-graphite/45 backdrop-blur-[14px] backdrop-saturate-[120%]"
        onClick={close}
        aria-hidden
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
        className="absolute inset-x-0 top-2 bottom-0 overflow-hidden bg-bg lg:inset-3"
        style={{ clipPath: "inset(0px 0px 0px 0px round 28px)" }}
      >
        <div data-quiz-content className="relative flex h-full min-w-0 flex-col gap-3 p-2 opacity-0 sm:p-3 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <section className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            {/* шапка */}
            <div className="flex items-center justify-between gap-3 px-3 pt-3 lg:px-6 lg:pt-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-medium ring-1 ring-ink/8">
                <Icon name="clock" className="size-3.5 text-wood" />
                {done ? t("sent") : t("badge")}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="grid size-11 place-items-center rounded-full bg-white text-ink ring-1 ring-ink/10 transition-[transform,background-color,color] duration-500 ease-[var(--ease-expo)] hover:rotate-90 hover:bg-ink hover:text-white"
              >
                <Icon name="close" className="size-5" />
              </button>
            </div>

            {done ? (
              <QuizSuccess answers={answers} contact={done.contact} name={done.name} onClose={close} />
            ) : (
              <>
                <div className="px-3 pt-3 lg:hidden">
                  <QuizPreviewCompact answers={answers} />
                </div>

                {/* прогресс */}
                <div className="px-3 pt-5 lg:px-6 lg:pt-8">
                  <div className="flex items-baseline justify-between text-[13px]">
                    <span className="font-display text-[12px] tracking-[0.08em] uppercase">
                      {isForm ? t("finish") : t("question", { n: step + 1, total: TOTAL })}
                    </span>
                    <span className="text-muted">
                      {isForm
                        ? t("leftContact")
                        : left === 1
                          ? t("lastQuestion")
                          : t("left", { count: left })}
                    </span>
                  </div>
                  <div
                    className="mt-3 h-1 overflow-hidden rounded-full bg-ink/8"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={TOTAL}
                    aria-valuenow={step}
                    aria-label={t("progressAria")}
                  >
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#141518,#B07A4F)] transition-[width] duration-700 ease-[var(--ease-expo)]"
                      style={{ width: `${(step / TOTAL) * 100}%` }}
                    />
                  </div>
                </div>

                {/* шаг */}
                <div data-quiz-scroll data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-6 pb-4 lg:px-6 lg:pt-10">
                  <div key={step} className={dir === 1 ? "animate-[quizNext_.7s_var(--ease-expo)]" : "animate-[quizPrev_.7s_var(--ease-expo)]"}>
                    <h2
                      id="quiz-title"
                      ref={titleRef}
                      tabIndex={-1}
                      className="text-[clamp(28px,3.2vw,44px)] leading-[1.05] font-medium tracking-[-0.03em] outline-none"
                    >
                      {isForm ? t("formTitle") : t(`steps.${current.id}.title`)}
                    </h2>
                    {!isForm && t.has(`steps.${current.id}.hint`) && <p className="mt-3 text-[15px] text-muted">{t(`steps.${current.id}.hint`)}</p>}
                    <div className="mt-7">
                      {isForm ? (
                        <QuizForm answers={answers} onSuccess={onSuccess} />
                      ) : (
                        <StepBody step={current} answers={answers} onPick={onPick} onArea={onArea} />
                      )}
                    </div>
                  </div>
                </div>

                {/* низ: назад / далее + социальное доказательство */}
                <div className="flex items-center justify-between gap-3 border-t border-ink/8 px-3 py-3 lg:px-6 lg:py-4">
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    disabled={step === 0}
                    className="inline-flex h-11 items-center gap-2 rounded-full pr-4 pl-3 text-[14px] font-medium transition-[opacity,background-color] hover:bg-white disabled:pointer-events-none disabled:opacity-0"
                  >
                    <Icon name="arrowLeft" className="size-4" />
                    {t("back")}
                  </button>

                  <p className="hidden text-[13px] text-muted sm:block">
                    <span>
                      {t("social", { count: SOCIAL_COUNT })}
                    </span>
                  </p>

                  {!isForm && (
                    <button
                      type="button"
                      onClick={() => go(step + 1)}
                      disabled={!answered}
                      className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink pr-1.5 pl-5 text-[14px] font-medium text-white transition-opacity disabled:opacity-30"
                    >
                      {t("next")}
                      <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0.5">
                        <Icon name="chevronRight" className="size-4" />
                      </span>
                    </button>
                  )}
                  {isForm && <span className="w-11" />}
                </div>
              </>
            )}
          </section>

          <aside className="relative hidden min-h-0 lg:block" aria-label={t("preview.aria")}>
            <QuizPreview answers={answers} />
          </aside>
        </div>
      </div>
    </div>
  );
}
