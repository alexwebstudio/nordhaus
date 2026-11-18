import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { nav, site } from "@/config/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="cv-auto px-[var(--gutter)] pb-[var(--gutter)]">
      <div className="rounded-[var(--radius-section)] bg-graphite px-6 pt-14 pb-6 text-white md:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <Link href="/" className="text-[22px] transition-opacity hover:opacity-80">
            <Wordmark />
          </Link>
          <nav aria-label={t("footer.menuAria")}>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-[15px] text-white/70 sm:grid-cols-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition-colors hover:text-white">
                    {t(`nav.${n.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-1 text-[15px]">
            <a href={site.phoneHref} className="font-brand block text-lg transition-colors hover:text-wood-light">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block text-white/60 transition-colors hover:text-white">
              {site.email}
            </a>
            <p className="text-white/55">{t("footer.cities")}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <a
            href={site.developer.url}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em] text-white/70 uppercase transition-colors hover:text-white"
          >
            {t("footer.developed")}
            <svg viewBox="0 0 16 16" className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" aria-hidden>
              <path d="M4 12 12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
