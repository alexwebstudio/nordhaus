import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SectionHead } from "@/components/ui/Section";
import { CountUp } from "@/components/ui/CountUp";
import { BlurIn } from "@/components/effects/BlurIn";
import { Reveal } from "@/components/effects/Reveal";
import { ImageReveal } from "@/components/effects/ImageReveal";
import { FinalCta } from "@/components/home/FinalCta";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return { title: t("title"), description: t("description"), alternates: alternates(locale, "/about") };
}

const initials = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("");

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const stats = t.raw("stats") as { value: number; suffix: string; label: string }[];
  const values = t.raw("values") as { title: string; text: string }[];
  const team = t.raw("team") as { name: string; role: string; note: string }[];
  const timeline = t.raw("timeline") as { year: string; text: string }[];

  return (
    <PageShell crumbs={[{ label: t("crumb") }]} label={t("label")} title={t("title")} lead={t("lead")}>
      <Panel className="grid gap-4 p-3 md:p-4 lg:grid-cols-[1fr_1.1fr]">
        <ImageReveal className="relative min-h-[380px] overflow-hidden rounded-[calc(var(--radius-section)-10px)] lg:min-h-[560px]">
          <Image src="/images/raw/blueprints-hands.jpg" alt={t("photoAlt")} fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
        </ImageReveal>
        <div className="flex min-w-0 flex-col justify-between gap-10 px-4 py-8 md:px-8 lg:py-12">
          <div>
            <SectionHead label={t("historyLabel")} title={t("historyTitle")} />
            <BlurIn as="p" className="mt-6 max-w-[34em] text-[17px] leading-relaxed text-muted">
              {t("historyText")}
            </BlurIn>
          </div>
          <Reveal className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <li key={s.label} className="glass rounded-[var(--radius-card)] p-5">
                <CountUp value={s.value} suffix={s.suffix} className="font-brand text-[clamp(34px,3.4vw,48px)] leading-none font-semibold tracking-[-0.04em]" />
                <p className="mt-2 text-[14px] leading-snug text-muted">{s.label}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Panel>

      <Panel tone="plain" className="px-2 py-10 md:px-8 md:py-14" aria-label={t("valuesTitle")}>
        <SectionHead label={t("valuesLabel")} title={t("valuesTitle")} />
        <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={v.title} className="flex min-h-[220px] flex-col rounded-[var(--radius-card)] bg-[linear-gradient(160deg,#2A2D32_0%,#1E2024_70%)] p-6 text-white">
              <span className="font-brand text-[12px] tracking-[0.14em] text-white/45">0{i + 1}</span>
              <h3 className="mt-auto text-[21px] font-medium">{v.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">{v.text}</p>
            </li>
          ))}
        </Reveal>
      </Panel>

      <Panel className="px-5 py-12 md:px-12 md:py-16" aria-label={t("teamTitle")}>
        <SectionHead label={t("teamLabel")} title={t("teamTitle")} lead={t("teamLead")} />
        <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <li key={m.name} className="flex items-center gap-4 rounded-[var(--radius-card)] border border-white bg-white p-5 shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)]">
              <span className="font-display grid size-16 shrink-0 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#D2A47C,#8C603E)] text-[18px] font-semibold text-white">
                {initials(m.name)}
              </span>
              <span className="min-w-0">
                <span className="block text-[17px] font-medium">{m.name}</span>
                <span className="block text-[14px] text-ink/70">{m.role}</span>
                <span className="mt-1 block text-[13px] text-muted">{m.note}</span>
              </span>
            </li>
          ))}
        </Reveal>
      </Panel>

      <Panel tone="dark" className="relative isolate grid gap-10 overflow-hidden px-5 py-12 md:px-12 md:py-16 lg:grid-cols-[1fr_1fr]" aria-label={t("productionTitle")}>
        <Image src="/images/raw/tower-bw.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(22,24,27,.95),rgba(22,24,27,.7))]" />
        <SectionHead dark label={t("productionLabel")} title={t("productionTitle")} lead={t("productionLead")} />
        <Reveal as="ol" className="space-y-5 border-l border-white/15 pl-6">
          {timeline.map((s) => (
            <li key={s.year}>
              <p className="font-brand text-[14px] text-wood-light">{s.year}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-white/70">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </Panel>

      <FinalCta />
    </PageShell>
  );
}
