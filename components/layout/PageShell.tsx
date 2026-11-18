import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TextFlip } from "@/components/effects/TextFlip";
import { BlurIn } from "@/components/effects/BlurIn";
import { Label } from "@/components/ui/Section";
import { site } from "@/config/site";

type Crumb = { href?: string; label: string };

/**
 * Оболочка внутренней страницы: тёмная «сцена» сверху (под белый хедер),
 * затем светлая часть наезжает скруглённым краем — как на главной.
 */
export function PageShell({
  label,
  title,
  lead,
  crumbs = [],
  aside,
  children,
}: {
  label?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  aside?: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations("common");
  const locale = useLocale();
  const all: Crumb[] = [{ href: "/", label: t("home") }, ...crumbs];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${site.url}/${locale}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="relative overflow-hidden bg-graphite px-[var(--gutter)] pt-[calc(var(--gutter)+120px)] pb-20 text-white md:pb-28">
        <div aria-hidden className="absolute -top-40 right-[-10%] size-[620px] rounded-full bg-[radial-gradient(circle,rgba(176,122,79,.18),transparent_65%)]" />

        <div className="relative mx-auto grid max-w-[1600px] gap-10 px-2 md:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="min-w-0">
            <nav aria-label={t("breadcrumbs")} className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
                {all.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    {c.href && i < all.length - 1 ? (
                      <Link href={c.href} className="transition-colors hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-white/80">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            {label && <Label dark>{label}</Label>}
            <TextFlip
              as="h1"
              text={title}
              split="words"
              stagger={50}
              className="mt-6 block max-w-[14em] text-[clamp(36px,6vw,92px)] leading-[0.98] font-medium tracking-[-0.035em] text-balance [overflow-wrap:anywhere] hyphens-auto"
            />
            {lead && (
              <BlurIn as="p" delay={250} className="mt-6 max-w-[38em] text-[17px] leading-relaxed text-white/60 md:text-[18px]">
                {lead}
              </BlurIn>
            )}
          </div>
          {aside && <BlurIn delay={350}>{aside}</BlurIn>}
        </div>
      </section>

      <div className="bg-graphite">
        <div className="flex flex-col gap-[var(--gutter)] rounded-t-[var(--radius-section)] bg-bg py-[var(--gutter)]">{children}</div>
      </div>
    </main>
  );
}
