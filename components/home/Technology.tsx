import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Panel, SectionHead } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/PillButton";
import { Reveal } from "@/components/effects/Reveal";
import { FrameStory } from "@/components/technology/FrameStory";

type Item = { title: string; text: string; metric: string };

export function Technology() {
  const t = useTranslations("home.tech");
  const items = t.raw("items") as Item[];
  return (
    <Panel eager tone="plain" as="div" className="py-10 md:py-16">
      <section className="px-2 md:px-8" aria-label={t("title")}>
        <FrameStory head={<SectionHead label={t("label")} title={t("title")} lead={t("lead")} className="mb-6 lg:mb-4" />} />

        <Reveal className="mt-12 grid gap-3 md:grid-cols-3">
          {items.map((it, i) => (
            <li
              key={it.title}
              className="relative overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(135deg,#2A2D32_0%,#1E2024_60%)] p-6 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)] md:p-7"
            >
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="font-brand text-[11px] tracking-[0.14em] text-white/45">0{i + 1}</span>
                  <h3 className="mt-2 text-[21px] font-medium tracking-[-0.01em]">{it.title}</h3>
                </div>
                <span className="font-brand shrink-0 text-[clamp(22px,2.2vw,30px)] font-semibold tracking-[-0.04em] text-wood-light">{it.metric}</span>
              </div>
              <p className="mt-3 max-w-[30em] text-[15px] leading-relaxed text-white/60">{it.text}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-3 flex flex-col gap-4 rounded-[var(--radius-card)] border border-ink/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] leading-snug text-ink">{t("objection")}</p>
          <Link href="/technology" className="group inline-flex shrink-0 items-center gap-2 text-[14px] font-medium text-ink">
            {t("link")}
            <span className="grid size-8 place-items-center rounded-full bg-dark text-white transition-transform duration-500 group-hover:-rotate-45">
              <Arrow className="size-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </Panel>
  );
}
