import { defineRouting } from "next-intl/routing";

/**
 * Локали. Казахская версия подготовлена (роуты /kz, шрифт с казахскими буквами, hreflang),
 * но выключена до готовности messages/kz.json — чтобы добавить, верните "kz" в locales.
 */
export const routing = defineRouting({
  locales: ["ru"],
  defaultLocale: "ru",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

/** BCP-47 для html[lang] и hreflang: «kz» в URL — это казахский язык (kk). */
export const htmlLang = (l: string) => (l === "kz" ? "kk" : "ru");
