import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { routing, htmlLang } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { paymentSlugs } from "@/data/payment";

/** Все страницы в обеих локалях с hreflang-альтернативами. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "/catalog", ...catalog.map((p) => `/catalog/${p.slug}`), "/technology", "/projects", ...paymentSlugs.map((m) => `/payment/${m}`), "/about", "/contacts"];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.7,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [`${htmlLang(l)}-KZ`, `${site.url}/${l}${path}`])) },
    })),
  );
}
