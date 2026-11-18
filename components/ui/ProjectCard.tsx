import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { floorsKey, formatPrice, type Project } from "@/data/catalog";
import { Visual } from "./Visual";
import { Icon } from "./Icon";

/** Карточка проекта каталога: фото, название (Unbounded), параметры, стеклянная плашка цены. */
export function ProjectCard({
  p,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 46vw, 25vw",
  className = "",
}: {
  p: Project;
  sizes?: string;
  className?: string;
}) {
  const t = useTranslations();
  return (
    <Link
      href={`/catalog/${p.slug}`}
      draggable={false}
      className={`group relative block aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-dark text-white outline-offset-4 ${className}`}
    >
      {/* медленный zoom фото 1 → 1.05 за 800ms */}
      <div className="absolute inset-0 transition-transform duration-[var(--dur-photo)] group-hover:scale-[1.05]">
        <Visual visual={p.visual} sizes={sizes} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,24,27,0)_45%,rgba(22,24,27,.82)_100%)]" />

      <div className="absolute top-3 right-3 left-3 flex items-start justify-between">
        {p.tag ? (
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.06em] text-ink uppercase">{t(`catalog.tags.${p.tag}`)}</span>
        ) : (
          <span />
        )}
        <span className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-[transform,background-color,color] duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
          <Icon name="arrowUpRight" className="size-4" />
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3">
        <h3 className="font-brand px-2 text-[22px] leading-none font-semibold tracking-[-0.02em]">{p.name}</h3>
        <p className="mt-2 flex flex-wrap gap-x-3 px-2 text-[13px] text-white/75">
          <span>
            {p.area} {t("common.m2")}
          </span>
          <span>{t("common.bedrooms", { count: p.bedrooms })}</span>
          <span>{t(`common.floors.${floorsKey(p.floors)}`)}</span>
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-[16px] border border-white/20 bg-white/12 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.25)] backdrop-blur-xl">
          <span className="text-[12px] text-white/70">{t("common.priceFrom")}</span>
          <span className="font-brand text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap">{formatPrice(p.price)}</span>
        </div>
      </div>
      <span className="sr-only">, {t("common.days", { count: p.days })}</span>
    </Link>
  );
}
