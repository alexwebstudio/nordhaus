import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Section";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { catalog } from "@/data/catalog";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.catalog" });
  return { title: t("title"), description: t("description", { count: catalog.length }), alternates: alternates(locale, "/catalog") };
}

export default async function CatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");
  return (
    <PageShell
      crumbs={[{ label: t("crumb") }]}
      label={t("label")}
      title={t("title")}
      lead={t("lead")}
      aside={
        <dl className="grid grid-cols-3 gap-3 text-white">
          {[
            [String(catalog.length), t("statProjects")],
            ["64–180", t("statArea")],
            ["42–72", t("statDays")],
          ].map(([v, l]) => (
            <div key={l} className="rounded-[20px] border border-white/12 bg-white/5 p-4 backdrop-blur-md">
              <dt className="sr-only">{l}</dt>
              <dd className="font-brand text-[clamp(20px,2.4vw,32px)] font-semibold tracking-[-0.04em]">{v}</dd>
              <dd className="mt-1 text-[13px] text-white/55">{l}</dd>
            </div>
          ))}
        </dl>
      }
    >
      <Panel className="px-4 py-8 md:px-10 md:py-12">
        <CatalogGrid />
      </Panel>
      <FinalCta />
    </PageShell>
  );
}
