import { getTranslations } from "next-intl/server";
import { renderOg, ogSize } from "@/lib/og";
import { routing } from "@/i18n/routing";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "NORDHAUS";
export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return renderOg({ title: t("catalog.title"), kicker: t("catalog.label"), tagline: t("meta.ogTagline"), words: t.raw("hero.words") as string[] });
}
