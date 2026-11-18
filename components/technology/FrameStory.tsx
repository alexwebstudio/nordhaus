"use client";

import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";
import { FrameDrawing } from "./FrameDrawing";

const GRAPHITE = "#3A3E45";
const WOOD = "#B07A4F";

/**
 * Сборка каркаса по скроллу. Десктоп: секция закрепляется (pin), чертёж прорисовывается scrub-ом
 * этап за этапом, текущий этап подсвечен деревом и синхронно активен в списке справа;
 * выносные подписи и размерные линии появляются через blur-in. Мобилка: упрощённый чертёж без пина.
 */
export function FrameStory({ head }: { head?: ReactNode }) {
  const t = useTranslations("frame");
  const stages = t.raw("stages") as { title: string; text: string }[];
  const callouts = t.raw("callouts") as string[];
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useGsap(
    ({ gsap }) => {
      const reduce = prefersReducedMotion();
      const mm = gsap.matchMedia();

      const build = (scope: Element, pin: boolean) => {
        const segs = gsap.utils.toArray<SVGPathElement>("[data-seg]", scope);
        const labels = gsap.utils.toArray<SVGGElement>("[data-callout]", scope);
        const dims = gsap.utils.toArray<SVGGElement>("[data-dim]", scope);
        if (reduce) {
          gsap.set(segs, { strokeDashoffset: 0 });
          setActive(5);
          return;
        }
        gsap.set(segs, { strokeDashoffset: 1, stroke: WOOD });
        gsap.set([...labels, ...dims], { opacity: 0, filter: "blur(6px)" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pin
            ? {
                trigger: ref.current,
                start: "top top+=12",
                end: () => `+=${window.innerHeight * 2.2}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.9,
                onUpdate: (self) => setActive(self.progress < 0.02 ? -1 : Math.min(5, Math.floor(self.progress * 6 * 0.999))),
              }
            : {
                trigger: scope,
                start: "top 85%",
                end: "bottom 45%",
                scrub: 0.9,
                onUpdate: (self) => setActive(self.progress < 0.02 ? -1 : Math.min(5, Math.floor(self.progress * 6 * 0.999))),
              },
        });
        for (let g = 0; g <= 5; g++) {
          const group = segs.filter((s) => s.dataset.stage === String(g));
          const at = g;
          tl.to(group, { strokeDashoffset: 0, duration: 0.8, stagger: { amount: 0.4 }, ease: "power2.inOut" }, at);
          // этап закончился — дерево спокойно переходит в графит
          tl.to(group, { stroke: GRAPHITE, duration: 0.4 }, at + 0.95);
          if (labels[g]) tl.to(labels[g], { opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }, at + 0.35);
          if (dims[g]) tl.to(dims[g], { opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }, at + 0.5);
        }
        tl.to({}, { duration: 0.4 }); // небольшая пауза в конце пина
      };

      mm.add("(min-width: 1024px)", () => build(ref.current!.querySelector("[data-full]")!, true));
      mm.add("(max-width: 1023px)", () => build(ref.current!.querySelector("[data-simple]")!, false));
      return () => mm.revert();
    },
    [],
    ref,
  );

  return (
    <div ref={ref} className="lg:flex lg:h-[calc(100svh-24px)] lg:max-h-[900px] lg:min-h-[620px] lg:flex-col">
      {head}
      <div className="grid min-h-0 flex-1 items-center gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <div data-full className="hidden lg:block">
            <FrameDrawing detail="full" callouts={callouts} dimLength={t("dimLength")} dimHeight={t("dimHeight")} label={t("aria")} className="mx-auto max-h-[62svh] w-full" />
          </div>
          <div data-simple className="lg:hidden">
            <FrameDrawing detail="simple" dimLength={t("dimLength")} dimHeight={t("dimHeight")} label={t("aria")} className="w-full" />
          </div>
        </div>

        <ol className="flex flex-col gap-1" aria-label={t("stagesAria")}>
          {stages.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <li
                key={s.title}
                aria-current={on ? "step" : undefined}
                className={`grid grid-cols-[34px_1fr] items-start gap-3 rounded-[18px] px-3 py-2.5 transition-[background-color,opacity] duration-[var(--dur-expand)] ${
                  on ? "bg-white shadow-[0_14px_40px_-28px_rgba(20,21,24,.4)]" : ""
                } ${on || done ? "opacity-100" : "opacity-45"}`}
              >
                <span
                  className={`font-brand grid size-8 place-items-center rounded-full text-[11px] transition-colors duration-[var(--dur-expand)] ${
                    on ? "bg-wood text-white" : done ? "bg-dark text-white" : "bg-white text-muted ring-1 ring-ink/10"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[16px] font-medium tracking-[-0.01em]">{s.title}</span>
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-[var(--dur-expand)] max-lg:grid-rows-[1fr] max-lg:opacity-100 ${
                      on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-1 text-[14px] leading-snug text-muted">{s.text}</span>
                    </span>
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
