"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { stepVisuals } from "@/data/home";
import { Panel, SectionHead } from "@/components/ui/Section";
import { Visual } from "@/components/ui/Visual";
import { PillButton } from "@/components/ui/PillButton";
import { useGsap, prefersReducedMotion, loadGsap } from "@/lib/gsap";

/**
 * «3 шага»: на десктопе секция закрепляется (pin), шаги [1] [2] [3]
 * переключаются по скроллу, прогресс-линия заполняется. На мобилке — обычный список.
 */
export function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const t = useTranslations("home.steps");
  const items = (t.raw("items") as { title: string; text: string; term: string }[]).map((s, i) => ({ ...s, n: i + 1, visual: stepVisuals[i] }));
  const n = items.length;

  useGsap(
    ({ gsap, ScrollTrigger }) => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top top+=12",
          end: () => `+=${window.innerHeight * 1.6}`,
          pin: true,
          // родитель — flex, там GSAP по умолчанию выключает pinSpacing
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            gsap.set("[data-steps-bar]", { scaleY: self.progress });
            setActive(Math.min(n - 1, Math.floor(self.progress * n * 0.999)));
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    [],
    ref,
  );

  const go = async (i: number) => {
    // клик по шагу — прокрутить к его доле пина
    const { ScrollTrigger } = await loadGsap();
    const st = ScrollTrigger.getAll().find((s) => s.trigger === ref.current && s.pin);
    if (!st) return setActive(i);
    const y = st.start + ((i + 0.5) / n) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div ref={ref}>
      <Panel className="px-5 py-12 md:px-12 md:py-16 lg:h-[calc(100svh-24px)] lg:max-h-[860px] lg:min-h-[640px]" aria-label={t("title")}>
        <div className="grid h-full gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="flex flex-col">
            <SectionHead title={t("title")} />

            {/* Десктоп: большая цифра в скобках, переключается флипом */}
            <div className="mt-8 hidden items-start gap-8 lg:flex" aria-hidden>
              <div className="relative font-display text-[clamp(96px,10vw,168px)] leading-[0.8] font-light tracking-[-0.06em] text-ink/90 [perspective:600px]">
                <span className="text-ink/20">[</span>
                <span key={active} className="inline-block animate-[stepflip_.9s_var(--ease-flip)] text-wood">
                  {active + 1}
                </span>
                <span className="text-ink/20">]</span>
              </div>
            </div>

            <ol className="relative mt-auto flex flex-col gap-1 pt-8">
              <span aria-hidden className="absolute top-8 bottom-0 left-[15px] hidden w-px bg-ink/10 lg:block">
                <span data-steps-bar className="block h-full w-px origin-top scale-y-0 bg-wood" />
              </span>
              {items.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={on ? "step" : undefined}
                      className="group flex w-full items-start gap-5 rounded-[20px] py-3 pr-3 text-left"
                    >
                      <span
                        className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full font-display text-[12px] transition-colors duration-500 ${
                          on ? "bg-dark text-white" : "bg-white text-muted ring-1 ring-ink/10"
                        }`}
                      >
                        {s.n}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-4">
                          <span className={`text-[20px] font-medium tracking-[-0.01em] transition-colors duration-500 ${on ? "text-ink" : "text-ink/45 lg:text-ink/40"}`}>
                            {s.title}
                          </span>
                          <span className="font-display text-[12px] text-wood">{s.term}</span>
                        </span>
                        <span
                          className={`grid transition-[grid-template-rows,opacity] duration-[var(--dur-expand)]  max-lg:grid-rows-[1fr] max-lg:opacity-100 ${
                            on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-2 text-[15px] leading-relaxed text-muted">{s.text}</span>
                          </span>
                        </span>
                      </span>
                    </button>
                    {/* мобильная картинка шага */}
                    <div className="relative mt-3 mb-6 aspect-[4/3] overflow-hidden rounded-[var(--radius-photo)] lg:hidden">
                      <Visual visual={s.visual} sizes="100vw" />
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-8">
              <PillButton data-quiz-trigger>{t("cta")}</PillButton>
            </div>
          </div>

          {/* Десктоп: картинки шагов сменяются clip-path */}
          <div className="relative hidden overflow-hidden rounded-[calc(var(--radius-section)-8px)] bg-dark lg:block">
            {items.map((s, i) => (
              <div
                key={s.n}
                className="absolute inset-0 transition-[clip-path,transform] duration-[1.1s] "
                style={{
                  clipPath: i <= active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                  transform: i < active ? "scale(1.06)" : "scale(1)",
                  zIndex: i,
                }}
              >
                <Visual visual={s.visual} sizes="50vw" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,24,27,0)_55%,rgba(22,24,27,.7)_100%)]" />
                <div className="glass absolute bottom-5 left-5 flex items-center gap-3 rounded-full py-2 pr-5 pl-2">
                  <span className="grid size-9 place-items-center rounded-full bg-dark font-display text-[12px] text-white">{s.n}</span>
                  <span className="text-[14px] font-medium">{s.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
