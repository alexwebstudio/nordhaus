import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SectionHead } from "@/components/ui/Section";
import { Gallery } from "@/components/catalog/Gallery";
import { FloorPlan } from "@/components/catalog/FloorPlan";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/effects/Reveal";
import { FinalCta } from "@/components/home/FinalCta";
import { catalog, floorPlan, floorsKey, formatPrice, galleryShots, packPrice, packs, similar, type Project } from "@/data/catalog";
import { alternates } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => routing.locales.flatMap((locale) => catalog.map((p) => ({ locale, slug: p.slug })));

type Props = { params: Promise<{ locale: string; slug: string }> };

async function describe(p: Project, locale: string) {
  const t = await getTranslations({ locale });
  return t("project.description", {
    name: p.name,
    type: t(`project.types.${floorsKey(p.floors)}`),
    area: p.area,
    bedrooms: t("project.bedroomsFor", { count: p.bedrooms }),
    days: p.days,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = catalog.find((x) => x.slug === slug);
  if (!p) return {};
  const t = await getTranslations({ locale, namespace: "meta.project" });
  return {
    title: t("title", { name: p.name, area: p.area, price: formatPrice(p.price) }),
    description: await describe(p, locale),
    alternates: alternates(locale, `/catalog/${p.slug}`),
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = catalog.find((x) => x.slug === slug);
  if (!p) notFound();
  const t = await getTranslations();
  const floorsLabel = t(`common.floors.${floorsKey(p.floors)}`);

  const gallery = galleryShots.map((g) => ({
    visual: { kind: "placeholder", labelKey: `project.gallery.${g.key}`, ratio: g.ratio, size: g.size } as const,
    caption: t(`project.gallery.${g.key}`),
  }));

  const specRows: [string, string][] = [
    [t("project.specs.area"), `${p.area} ${t("common.m2")}`],
    [t("project.specs.floors"), floorsLabel],
    [t("project.specs.bedrooms"), String(p.bedrooms)],
    [t("project.specs.bathrooms"), String(p.bathrooms)],
    [t("project.specs.term"), t("project.daysShort", { days: p.days })],
    [t("project.specs.walls"), t("project.specValues.walls")],
    [t("project.specs.roof"), t(p.roof === "flat" ? "project.specValues.roofFlat" : "project.specValues.roofPitched")],
    [t("project.specs.facade"), t("project.specValues.facade")],
    [t("project.specs.windows"), t("project.specValues.windows")],
    [t("project.specs.foundation"), t("project.specValues.foundation")],
  ];

  return (
    <PageShell
      crumbs={[{ href: "/catalog", label: t("catalog.crumb") }, { label: p.name }]}
      label={p.tag ? t("project.labelTag", { tag: t(`catalog.tags.${p.tag}`) }) : t("project.label")}
      title={p.name}
      lead={t("project.lead", { floors: floorsLabel, area: p.area, bedrooms: t("common.bedrooms", { count: p.bedrooms }), days: p.days })}
      aside={
        <div className="rounded-[var(--radius-card)] border border-white/12 bg-white/5 p-6 text-white backdrop-blur-md">
          <p className="text-[13px] text-white/55">{t("project.priceLabel")}</p>
          <p className="font-display mt-1 text-[clamp(26px,3vw,40px)] leading-none font-semibold tracking-[-0.04em]">{t("common.from", { price: formatPrice(p.price) })}</p>
          <p className="mt-3 text-[14px] text-white/55">{t("project.priceNote")}</p>
          <button type="button" data-quiz-trigger className="group mt-5 flex h-12 w-full items-center justify-between rounded-full bg-white pr-1.5 pl-6 text-[15px] font-medium text-ink transition-colors hover:bg-surface">
            {t("project.calc")}
            <span className="grid size-9 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:-rotate-45">
              <Icon name="arrowUpRight" className="size-4 rotate-45" />
            </span>
          </button>
        </div>
      }
    >
      <Panel className="grid gap-8 p-3 md:p-4 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        <Gallery items={gallery} />
        <div className="flex min-w-0 flex-col px-3 py-4 md:px-4 lg:py-8 lg:pr-8">
          <h2 className="text-[clamp(24px,2.4vw,32px)] leading-tight font-medium tracking-[-0.02em]">{t("project.about")}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{await describe(p, locale)}</p>
          <Reveal as="dl" className="mt-8 grid grid-cols-2 gap-2">
            {[
              [t("project.facts.area"), `${p.area} ${t("common.m2")}`],
              [t("project.facts.floors"), floorsLabel],
              [t("project.facts.bedrooms"), String(p.bedrooms)],
              [t("project.facts.term"), t("project.daysShort", { days: p.days })],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[18px] bg-white p-4 shadow-[0_14px_40px_-28px_rgba(20,21,24,.3)]">
                <dt className="text-[12px] text-muted">{k}</dt>
                <dd className="mt-1 text-[19px] font-semibold tracking-[-0.02em]">{v}</dd>
              </div>
            ))}
          </Reveal>
          <p className="mt-auto flex items-center gap-2 pt-8 text-[14px] text-muted">
            <Icon name="check" className="size-4 shrink-0 text-wood" />
            {t("project.adaptFree")}
          </p>
        </div>
      </Panel>

      <Panel className="px-5 py-12 md:px-12 md:py-16" aria-label={t("project.planLabel")}>
        <SectionHead label={t("project.planLabel")} title={t("project.planTitle")} className="mb-10" />
        <FloorPlan floors={floorPlan(p)} />
      </Panel>

      <Panel tone="plain" className="px-2 py-10 md:px-8 md:py-14" aria-label={t("project.packsLabel")}>
        <SectionHead label={t("project.packsLabel")} title={t("project.packsTitle")} lead={t("project.packsLead")} />
        <Reveal className="mt-10 grid gap-3 md:grid-cols-3">
          {packs.map((pk) => {
            const items = t.raw(`project.packs.${pk.id}.items`) as string[];
            return (
              <li
                key={pk.id}
                className={`relative flex flex-col rounded-[var(--radius-card)] p-6 md:p-7 ${
                  pk.hit ? "bg-[linear-gradient(160deg,#2A2D32_0%,#1E2024_70%)] text-white" : "border border-white bg-white shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)]"
                }`}
              >
                {pk.hit && <span className="mb-4 self-start rounded-full bg-wood px-3 py-1 text-[11px] font-medium text-white">{t("project.packHit")}</span>}
                <h3 className="text-[21px] font-medium">{t(`project.packs.${pk.id}.title`)}</h3>
                <p className="font-display mt-4 text-[clamp(22px,2.4vw,32px)] leading-none font-semibold tracking-[-0.04em]">{t("common.from", { price: formatPrice(packPrice(p, pk.k)) })}</p>
                <p className={`mt-2 text-[13px] ${pk.hit ? "text-white/55" : "text-muted"}`}>{t("project.termApprox", { days: p.days + pk.days })}</p>
                <ul className={`mt-6 space-y-2.5 border-t pt-6 ${pk.hit ? "border-white/10" : "border-ink/8"}`}>
                  {items.map((it) => (
                    <li key={it} className={`flex gap-2.5 text-[14px] leading-snug ${pk.hit ? "text-white/75" : "text-ink/80"}`}>
                      <Icon name="check" className={`mt-px size-4 shrink-0 ${pk.hit ? "text-wood-light" : "text-wood"}`} />
                      {it}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-quiz-trigger
                  className={`mt-8 h-12 rounded-full text-[15px] font-medium transition-colors ${pk.hit ? "bg-white text-ink hover:bg-surface" : "bg-ink text-white hover:bg-dark"}`}
                >
                  {t("project.getEstimate")}
                </button>
              </li>
            );
          })}
        </Reveal>
      </Panel>

      <Panel className="grid gap-10 px-5 py-12 md:px-12 md:py-16 lg:grid-cols-[1fr_1.4fr]" aria-label={t("project.specsLabel")}>
        <SectionHead label={t("project.specsLabel")} title={t("project.specsTitle")} />
        <dl className="divide-y divide-ink/8 border-y border-ink/8">
          {specRows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[1fr_1.3fr] gap-4 py-4 text-[15px]">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel tone="plain" className="px-2 py-10 md:px-8 md:py-14" aria-label={t("project.similar")}>
        <SectionHead title={t("project.similar")} />
        <Reveal className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {similar(p).map((s) => (
            <li key={s.slug}>
              <ProjectCard p={s} />
            </li>
          ))}
        </Reveal>
      </Panel>

      <FinalCta />
    </PageShell>
  );
}
