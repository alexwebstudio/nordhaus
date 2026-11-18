import { getTranslations } from "next-intl/server";
import { renderOg, ogSize } from "@/lib/og";
import { routing } from "@/i18n/routing";
import { catalog, formatPrice } from "@/data/catalog";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "NORDHAUS";
export const generateStaticParams = () => routing.locales.flatMap((locale) => catalog.map((p) => ({ locale, slug: p.slug })));

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const p = catalog.find((x) => x.slug === slug)!;
  return renderOg({
    kicker: p.name,
    title: `${p.area} ${t("common.m2")} · ${t("common.days", { count: p.days })}`,
    accent: t("common.from", { price: formatPrice(p.price) }),
    tagline: t("meta.ogTagline"),
    words: t.raw("hero.words") as string[],
  });
}
