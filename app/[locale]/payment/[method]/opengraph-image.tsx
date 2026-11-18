import { getTranslations } from "next-intl/server";
import { renderOg, ogSize } from "@/lib/og";
import { routing } from "@/i18n/routing";
import { paymentSlugs } from "@/data/payment";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "NORDHAUS";
export const generateStaticParams = () => routing.locales.flatMap((locale) => paymentSlugs.map((method) => ({ locale, method })));

export default async function Image({ params }: { params: Promise<{ locale: string; method: string }> }) {
  const { locale, method } = await params;
  const t = await getTranslations({ locale });
  return renderOg({
    kicker: t(`payment.methods.${method}.nav`),
    title: t(`payment.methods.${method}.title`),
    tagline: t("meta.ogTagline"),
    words: t.raw("hero.words") as string[],
  });
}
