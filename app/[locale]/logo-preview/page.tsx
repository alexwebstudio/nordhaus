import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Section";
import { Wordmark, DEFAULT_WORDMARK, type WordmarkVariant } from "@/components/layout/Wordmark";

/** Временная страница выбора логотипа (не индексируется). */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.logoPreview" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

const VARIANTS: WordmarkVariant[] = ["a", "b", "c"];

export default async function LogoPreview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("logoPreview");
  const th = await getTranslations("header");
  return (
    <PageShell title={t("title")} lead={t("lead")}>
      {VARIANTS.map((v) => (
        <Panel key={v} className="px-5 py-10 md:px-10 md:py-12" aria-label={t(`variants.${v}.name`)}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-medium">{t(`variants.${v}.name`)}</h2>
            {v === DEFAULT_WORDMARK && <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-medium text-white">{t("current")}</span>}
          </div>
          <p className="mt-2 max-w-[48em] text-[15px] text-muted">{t(`variants.${v}.note`)}</p>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            <figure className="grid min-h-[200px] place-items-center rounded-[var(--radius-card)] bg-graphite p-8 text-white">
              <Wordmark variant={v} className="text-[clamp(26px,3.2vw,40px)]" />
              <figcaption className="sr-only">{t("onDark")}</figcaption>
            </figure>
            <figure className="grid min-h-[200px] place-items-center rounded-[var(--radius-card)] bg-white p-8 text-ink">
              <Wordmark variant={v} className="text-[clamp(26px,3.2vw,40px)]" />
              <figcaption className="sr-only">{t("onLight")}</figcaption>
            </figure>
            <figure className="flex min-h-[200px] flex-col justify-center gap-3 rounded-[var(--radius-card)] bg-[linear-gradient(160deg,#2A2D32,#16181B)] p-6">
              <div className="flex h-14 items-center justify-between rounded-full border border-white/10 bg-white/5 pr-2 pl-5 text-white">
                <Wordmark variant={v} className="text-[15px]" />
                <span className="h-10 rounded-full bg-white px-4 text-[11px] leading-10 font-semibold text-graphite uppercase">{th("discuss")}</span>
              </div>
              <figcaption className="text-center text-[12px] text-white/50">{t("inHeader")}</figcaption>
            </figure>
          </div>
        </Panel>
      ))}
    </PageShell>
  );
}
