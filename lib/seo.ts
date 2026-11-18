import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const hreflang: Record<string, string> = { ru: "ru-KZ", kz: "kk-KZ" };

/** canonical + hreflang для страницы (путь без локали, например "/catalog"). */
export function alternates(locale: string, path: string): Metadata["alternates"] {
  const p = path === "/" ? "" : path;
  const languages: Record<string, string> = { "x-default": `/${routing.defaultLocale}${p}` };
  for (const l of routing.locales) languages[hreflang[l]] = `/${l}${p}`;
  return { canonical: `/${locale}${p}`, languages };
}
