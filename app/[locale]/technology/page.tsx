import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SectionHead } from "@/components/ui/Section";
import { WallCut } from "@/components/technology/WallCut";
import { FrameStory } from "@/components/technology/FrameStory";
import { Icon } from "@/components/ui/Icon";
import { BlurIn } from "@/components/effects/BlurIn";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { comparisonWin, wallTotal } from "@/data/technology";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.technology" });
  return { title: t("title"), description: t("description", { mm: wallTotal }), alternates: alternates(locale, "/technology") };
}

export default async function TechnologyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technology");
  const facts = t.raw("facts") as { value: string; text: string }[];
  const columns = t.raw("columns") as string[];
  const rows = t.raw("rows") as { label: string; values: string[] }[];

  return (
    <PageShell
      crumbs={[{ label: t("crumb") }]}
      label={t("label")}
      title={t("title")}
      lead={t("lead")}
      aside={
        <ul className="grid grid-cols-2 gap-3 text-white">
          {facts.map((f) => (
            <li key={f.value} className="rounded-[20px] border border-white/12 bg-white/5 p-4 backdrop-blur-md">
              <p className="font-display text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.04em] text-wood-light">{f.value}</p>
              <p className="mt-1 text-[13px] leading-snug text-white/60">{f.text}</p>
            </li>
          ))}
        </ul>
      }
    >
      <Panel className="px-5 py-12 md:px-12 md:py-16" aria-label={t("wallLabel")}>
        <SectionHead label={t("wallLabel")} title={t("wallTitle", { mm: wallTotal })} lead={t("wallLead")} className="mb-10" />
        <WallCut />
      </Panel>

      <Panel eager tone="plain" as="div" className="px-2 py-12 md:px-8 md:py-16">
        <section aria-label={t("buildTitle")}>
          <FrameStory head={<SectionHead label={t("buildLabel")} title={t("buildTitle")} lead={t("buildLead")} className="mb-6 lg:mb-4" />} />
        </section>
      </Panel>

      <Panel className="px-5 py-12 md:px-12 md:py-16" aria-label={t("compareTitle")}>
        <SectionHead label={t("compareLabel")} title={t("compareTitle")} lead={t("compareLead")} className="mb-10" />
        <BlurIn className="overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)]">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <caption className="sr-only">{t("compareCaption")}</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[34%] p-5 text-[13px] font-normal text-muted">
                  {t("param")}
                </th>
                {columns.map((c, i) => (
                  <th key={c} scope="col" className={`p-5 text-[15px] font-medium ${comparisonWin[i] ? "bg-dark text-white" : ""}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-ink/8">
                  <th scope="row" className="p-5 font-normal text-muted">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className={`p-5 ${comparisonWin[i] ? "bg-dark font-medium text-white" : ""}`}>
                      <span className="inline-flex items-center gap-2">
                        {comparisonWin[i] && <Icon name="check" className="size-4 text-wood-light" />}
                        {v}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </BlurIn>
      </Panel>

      <Faq />
      <FinalCta />
    </PageShell>
  );
}
