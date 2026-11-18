"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, htmlLang } from "@/i18n/routing";
import { nav } from "@/config/site";
import { Wordmark } from "./Wordmark";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // переключатель языка показываем, только когда локалей больше одной
  const multiLang = routing.locales.length > 1;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/")));

  // смена языка: та же страница, другая локаль
  const switchTo = (l: string) => {
    if (l === locale) return;
    startTransition(() => router.replace(pathname, { locale: l, scroll: false }));
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-[var(--gutter)] pt-[calc(var(--gutter)+10px)]">
      <div
        className={`pointer-events-auto mx-auto flex h-14 items-center justify-between gap-4 rounded-full pr-2 pl-5 text-white transition-[max-width,background-color,border-color,box-shadow] duration-[var(--dur-expand)] ${
          scrolled ? "glass-dark max-w-[1180px]" : "max-w-full border border-transparent"
        }`}
      >
        <Link href="/" aria-label={t("header.homeAria")} className="text-[15px] transition-opacity hover:opacity-80">
          <Wordmark />
        </Link>

        <nav aria-label={t("header.mainMenu")} className="hidden xl:block">
          <ul className="flex items-center gap-0.5 text-[13px] font-medium">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-full border px-3.5 py-2 transition-colors ${
                    isActive(item.href) ? "border-white/45 text-white" : "border-transparent text-white/75 hover:text-white"
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className={`hidden items-center gap-1 text-[11px] font-semibold ${multiLang ? "sm:flex" : ""}`} role="group" aria-label={t("header.language")}>
            {routing.locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchTo(l)}
                aria-pressed={locale === l}
                lang={htmlLang(l)}
                className={`h-7 rounded-full border px-2.5 uppercase transition-colors ${
                  locale === l ? "border-white bg-white text-graphite" : "border-white/35 text-white/80 hover:border-white/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-quiz-trigger
            className="h-10 rounded-full bg-white px-4 text-[12px] font-semibold tracking-[0.04em] text-graphite uppercase transition-[transform,background-color] hover:scale-[1.03] hover:bg-surface sm:px-5"
          >
            {t("header.discuss")}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("header.menuClose") : t("header.menuOpen")}
            className="relative grid size-10 place-items-center rounded-full border border-white/30 transition-colors hover:border-white/60 xl:hidden"
          >
            <span className={`absolute h-px w-4 bg-white transition-transform ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
            <span className={`absolute h-px w-4 bg-white transition-transform ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`glass-dark mx-auto mt-2 overflow-hidden rounded-[var(--radius-card)] text-white transition-[clip-path,opacity] duration-[var(--dur-expand)] xl:hidden ${
          open ? "pointer-events-auto opacity-100 [clip-path:inset(0_0_0_0_round_24px)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0_round_24px)]"
        }`}
        inert={!open}
      >
        <ul className="p-3 text-[22px] font-medium">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-white/5 ${isActive(item.href) ? "bg-white/10" : ""}`}
              >
                {t(`nav.${item.key}`)}
                <span aria-hidden className="text-sm text-wood-light">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={`gap-2 border-t border-white/10 p-4 sm:hidden ${multiLang ? "flex" : "hidden"}`} role="group" aria-label={t("header.language")}>
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              aria-pressed={locale === l}
              className={`h-10 flex-1 rounded-full border text-[13px] font-semibold uppercase transition-colors ${
                locale === l ? "border-white bg-white text-graphite" : "border-white/35 text-white/80"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
