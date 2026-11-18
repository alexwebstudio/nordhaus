import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, htmlLang } from "@/i18n/routing";
import { BRAND, site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { QuizRoot } from "@/components/quiz/QuizRoot";
import { alternates } from "@/lib/seo";
import "../globals.css";

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("siteTitle"), template: `%s — ${BRAND}` },
    description: t("siteDescription"),
    applicationName: BRAND,
    alternates: alternates(locale, "/"),
    openGraph: { type: "website", locale: locale === "kz" ? "kk_KZ" : "ru_RU", siteName: BRAND },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = { themeColor: "#16181B" };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("meta");

  /** Schema.org: строительная компания (данные демо) */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BRAND,
    description: t("siteDescription"),
    url: `${site.url}/${locale}`,
    logo: `${site.url}/icon.svg`,
    telephone: site.phone,
    email: site.email,
    priceRange: "7 900 000 ₸ – 35 000 000 ₸",
    address: { "@type": "PostalAddress", addressLocality: "Karaganda", addressCountry: "KZ" },
    foundingDate: "2013",
  };

  return (
    <html lang={htmlLang(locale)} className={fontVariables} data-loading="">
      <body>
        <noscript>
          {/* без JS: показываем сайт сразу и с веб-шрифтами */}
          <style>{`html[data-loading]{overflow:auto}[data-preloader]{display:none!important}html:not([data-fonts]){--font-brand:var(--font-unb-lat),var(--font-unb-cyr),var(--font-unb-ext),"Arial Black",sans-serif;--font-sans:var(--font-onest-lat),var(--font-onest-cyr),var(--font-onest-kk),var(--font-onest-ext),system-ui,sans-serif}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <QuizRoot>
              <Preloader />
              <Header />
              {children}
              <Footer />
            </QuizRoot>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
