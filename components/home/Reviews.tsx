import Image from "next/image";
import { useTranslations } from "next-intl";
import { reviewsBackground, statsRating } from "@/data/home";
import { Panel, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/effects/Reveal";

type Review = { name: string; city: string; house: string; days: number; text: string };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => w && w !== "и" && w !== "мен" && w !== "және")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

export function Reviews() {
  const t = useTranslations("home.reviews");
  const tc = useTranslations("common");
  const items = t.raw("items") as Review[];
  return (
    <Panel tone="dark" className="relative isolate overflow-hidden px-5 py-14 md:px-12 md:py-20">
      {/* фон под стекло — фото из public/images/raw */}
      <Image src={reviewsBackground} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-45" style={{ objectPosition: "50% 35%" }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(22,24,27,.35),rgba(22,24,27,.92)_70%)]" />

      <SectionHead
        dark
        label={t("label")}
        title={t("title")}
        aside={
          <div className="flex items-center gap-4 text-white">
            <span className="font-brand text-[44px] leading-none font-semibold tracking-[-0.04em]">{statsRating}</span>
            <span className="text-[13px] leading-snug text-white/60">
              <span className="flex gap-0.5 text-wood-light" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="size-3.5 fill-current" strokeWidth={0} />
                ))}
              </span>
              {t("rating")}
              <br />
              {t("source")}
            </span>
          </div>
        }
      />

      <Reveal className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((r) => (
          <li
            key={r.name}
            className="flex flex-col rounded-[var(--radius-card)] border border-white/15 bg-white/[.07] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_30px_60px_-30px_rgba(0,0,0,.6)] backdrop-blur-[20px] backdrop-saturate-150"
          >
            <Icon name="quote" className="size-6 text-wood-light" />
            <p className="mt-4 text-[15px] leading-relaxed text-white/80">{r.text}</p>
            <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-5">
              <span className="font-display grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#D2A47C,#8C603E)] text-[13px] font-semibold">
                {initials(r.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium">{r.name}</span>
                <span className="block text-[13px] text-white/55">
                  {r.city} · {r.house} · {tc("days", { count: r.days })}
                </span>
              </span>
            </div>
          </li>
        ))}
      </Reveal>
    </Panel>
  );
}
