import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SectionHead } from "@/components/ui/Section";
import { Calculator } from "@/components/payment/Calculator";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/effects/Reveal";
import { FinalCta } from "@/components/home/FinalCta";
import { isPaymentSlug, paymentSlugs } from "@/data/payment";
import { alternates } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => routing.locales.flatMap((locale) => paymentSlugs.map((method) => ({ locale, method })));

type Props = { params: Promise<{ locale: string; method: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, method } = await params;
  if (!isPaymentSlug(method)) return {};
  const t = await getTranslations({ locale, namespace: `payment.methods.${method}` });
  return { title: t("title"), description: t("lead"), alternates: alternates(locale, `/payment/${method}`) };
}

export default async function PaymentPage({ params }: Props) {
  const { locale, method } = await params;
  setRequestLocale(locale);
  if (!isPaymentSlug(method)) notFound();
  const t = await getTranslations("payment");
  const m = (k: string) => t(`methods.${method}.${k}`);
  const facts = t.raw(`methods.${method}.facts`) as [string, string][];
  const conditions = t.raw(`methods.${method}.conditions`) as string[];
  const steps = t.raw(`methods.${method}.steps`) as { title: string; text: string }[];
  const faq = t.raw(`methods.${method}.faq`) as { q: string; a: string }[];

  return (
    <PageShell
      crumbs={[{ href: "/payment/mortgage", label: t("crumb") }, { label: m("nav") }]}
      label={t("label")}
      title={m("title")}
      lead={m("lead")}
      aside={
        <dl className="grid grid-cols-3 gap-3 text-white">
          {facts.map(([v, l]) => (
            <div key={l} className="rounded-[20px] border border-white/12 bg-white/5 p-4 backdrop-blur-md">
              <dt className="sr-only">{l}</dt>
              <dd className="font-display text-[clamp(18px,2vw,28px)] font-semibold tracking-[-0.04em] text-wood-light">{v}</dd>
              <dd className="mt-1 text-[13px] leading-snug text-white/60">{l}</dd>
            </div>
          ))}
        </dl>
      }
    >
      {/* переключатель способов оплаты */}
      <div className="px-[var(--gutter)]">
        <nav aria-label={t("switchAria")} className="mx-auto max-w-[1600px] overflow-x-auto [scrollbar-width:none]">
          <ul className="flex w-max gap-1.5 rounded-full bg-white p-1.5 shadow-[0_14px_40px_-28px_rgba(20,21,24,.3)]">
            {paymentSlugs.map((x) => (
              <li key={x}>
                <Link
                  href={`/payment/${x}`}
                  aria-current={x === method ? "page" : undefined}
                  className={`block rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${x === method ? "bg-ink text-white" : "text-ink/70 hover:bg-bg hover:text-ink"}`}
                >
                  {t(`methods.${x}.nav`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Panel className="px-5 py-12 md:px-12 md:py-16" aria-label={t("calcLabel")}>
        <SectionHead label={t("calcLabel")} title={t("calcTitle")} className="mb-10" />
        <Calculator key={method} mode={method} />
      </Panel>

      <Panel tone="plain" className="grid gap-10 px-2 py-10 md:px-8 md:py-14 lg:grid-cols-2" aria-label={t("conditionsTitle")}>
        <div className="min-w-0">
          <SectionHead label={t("conditionsLabel")} title={t("conditionsTitle")} />
          <Reveal className="mt-8 space-y-2">
            {conditions.map((c) => (
              <li key={c} className="flex gap-3 rounded-[18px] bg-white p-4 text-[15px] leading-snug shadow-[0_14px_40px_-30px_rgba(20,21,24,.3)]">
                <Icon name="check" className="mt-0.5 size-5 shrink-0 text-wood" />
                {c}
              </li>
            ))}
          </Reveal>
        </div>
        <div className="min-w-0">
          <SectionHead label={t("stepsLabel")} title={t("stepsTitle")} />
          <Reveal as="ol" className="mt-8 grid gap-2 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-[var(--radius-card)] bg-[linear-gradient(160deg,#2A2D32_0%,#1E2024_70%)] p-5 text-white">
                <span className="font-brand text-[clamp(28px,3vw,40px)] leading-none font-light text-wood-light">[{i + 1}]</span>
                <h3 className="mt-4 text-[18px] font-medium">{s.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-white/60">{s.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Panel>

      <Panel className="grid gap-10 px-5 py-12 md:px-12 md:py-16 lg:grid-cols-[1fr_1.35fr]" aria-label={t("faqTitle")}>
        <SectionHead label={t("faqLabel")} title={t("faqTitle")} />
        <Accordion items={faq} />
      </Panel>

      <FinalCta />
    </PageShell>
  );
}
