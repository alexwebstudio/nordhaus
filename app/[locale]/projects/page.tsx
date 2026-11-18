import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SectionHead } from "@/components/ui/Section";
import { BeforeAfter } from "@/components/projects/BeforeAfter";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/effects/Reveal";
import { Reviews } from "@/components/home/Reviews";
import { FinalCta } from "@/components/home/FinalCta";
import { beforeAfterShot, realizedAll } from "@/data/projects";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };
type Item = { name: string; city: string; project: string; story: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.projects" });
  return { title: t("title"), description: t("description"), alternates: alternates(locale, "/projects") };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const tc = await getTranslations("common");
  const stats = t.raw("stats") as { value: string; label: string }[];
  const item = (id: string) => t.raw(`items.${id}`) as Item;
  const [first, ...rest] = realizedAll;
  const f = item(first.id);

  const pair = (name: string) => ({
    before: <Placeholder label={`${name} · ${t("beforeNeed")}`} ratio={beforeAfterShot.ratio} size={beforeAfterShot.size} className="!bg-[linear-gradient(160deg,#2F3237_0%,#24272B_100%)]" />,
    after: <Placeholder label={`${name} · ${t("afterNeed")}`} ratio={beforeAfterShot.ratio} size={beforeAfterShot.size} />,
  });

  return (
    <PageShell
      crumbs={[{ label: t("crumb") }]}
      label={t("label")}
      title={t("title")}
      lead={t("lead")}
      aside={
        <dl className="grid grid-cols-3 gap-3 text-white">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[20px] border border-white/12 bg-white/5 p-4 backdrop-blur-md">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-brand text-[clamp(20px,2.4vw,32px)] font-semibold tracking-[-0.04em]">{s.value}</dd>
              <dd className="mt-1 text-[13px] text-white/55">{s.label}</dd>
            </div>
          ))}
        </dl>
      }
    >
      {/* главный объект — крупно */}
      <Panel className="grid gap-6 p-3 md:p-4 lg:grid-cols-[1.7fr_1fr]">
        <BeforeAfter label={f.name} className="aspect-[4/3] rounded-[calc(var(--radius-section)-10px)] md:aspect-[16/10]" {...pair(f.name)} />
        <div className="flex min-w-0 flex-col px-3 py-4 md:px-4 lg:py-8 lg:pr-8">
          <p className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">
            {first.year} · {f.city}
          </p>
          <h2 className="mt-3 text-[clamp(28px,3vw,40px)] leading-tight font-medium tracking-[-0.03em]">{f.name}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{f.story}</p>
          <dl className="mt-auto grid grid-cols-3 gap-2 pt-8">
            {[
              [t("area"), `${first.area} ${tc("m2")}`],
              [t("term"), t("daysShort", { days: first.days })],
              [t("project"), f.project],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[16px] bg-white p-3">
                <dt className="text-[12px] text-muted">{k}</dt>
                <dd className="mt-1 text-[16px] font-semibold tracking-[-0.02em]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Panel>

      <Panel className="px-4 py-12 md:px-10 md:py-16" aria-label={t("allLabel")}>
        <SectionHead label={t("allLabel")} title={t("allTitle")} className="mb-10 px-1" />
        <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((r) => {
            const it = item(r.id);
            return (
              <li key={r.id} className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[0_20px_50px_-30px_rgba(20,21,24,.22)]">
                <BeforeAfter label={it.name} className="aspect-[4/3]" {...pair(it.name)} />
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[19px] font-medium tracking-[-0.01em]">{it.name}</h3>
                    <span className="shrink-0 text-[13px] text-muted">{r.year}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-muted">{t("delivered", { city: it.city, area: r.area, days: r.days })}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{it.story}</p>
                </div>
              </li>
            );
          })}
        </Reveal>
      </Panel>

      <Reviews />
      <FinalCta />
    </PageShell>
  );
}
