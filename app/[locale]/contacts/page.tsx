import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Section";
import { ContactForm } from "@/components/contacts/ContactForm";
import { OfficeMap } from "@/components/contacts/OfficeMap";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/effects/Reveal";
import { offices } from "@/data/contacts";
import { site } from "@/config/site";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contacts" });
  return { title: t("title"), description: t("description"), alternates: alternates(locale, "/contacts") };
}

const tel = (p: string) => "tel:+" + p.replace(/\D/g, "");

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");
  return (
    <PageShell
      crumbs={[{ label: t("crumb") }]}
      label={t("label")}
      title={t("title")}
      lead={t("lead")}
      aside={
        <div className="flex flex-wrap gap-2">
          <a href={site.phoneHref} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-medium text-ink transition-colors hover:bg-surface">
            <Icon name="phone" className="size-4" />
            {site.phone}
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 text-[15px] font-medium text-white transition-colors hover:border-white/60">
            <Icon name="whatsapp" className="size-4" />
            WhatsApp
          </a>
          <a href={site.telegram} target="_blank" rel="noopener" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 text-[15px] font-medium text-white transition-colors hover:border-white/60">
            <Icon name="telegram" className="size-4" />
            Telegram
          </a>
        </div>
      }
    >
      <Panel className="grid gap-3 p-3 md:p-4 lg:grid-cols-[1.25fr_1fr]">
        <OfficeMap />
        <ContactForm />
      </Panel>

      <Panel tone="plain" className="px-2 py-6 md:px-8 md:py-10" aria-label={t("officesAria")}>
        <Reveal className="grid gap-3 md:grid-cols-3">
          {offices.map((o) => (
            <li key={o.id} className="flex flex-col rounded-[var(--radius-card)] border border-white bg-white p-6 shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)]">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">{t(`offices.${o.id}.label`)}</p>
              <h2 className="mt-2 text-[26px] font-medium tracking-[-0.02em]">{t(`offices.${o.id}.city`)}</h2>
              <p className="mt-4 flex gap-2 text-[15px]">
                <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-wood" />
                {t(`offices.${o.id}.address`)}
              </p>
              <p className="mt-2 flex gap-2 text-[15px] text-muted">
                <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-wood" />
                {t(`offices.${o.id}.hours`)}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 pt-2">
                <a href={tel(o.phone)} className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-[14px] font-medium text-white transition-colors hover:bg-dark">
                  {o.phone}
                </a>
                <a
                  href={`https://2gis.kz/search/${encodeURIComponent(t(`offices.${o.id}.city`))}`}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-medium ring-1 ring-ink/15 transition-colors hover:bg-bg"
                >
                  {t("route")}
                  <Icon name="arrowUpRight" className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </li>
          ))}
        </Reveal>
      </Panel>
    </PageShell>
  );
}
