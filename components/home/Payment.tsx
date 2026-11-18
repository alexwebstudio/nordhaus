import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { paymentSlugs, paymentTone } from "@/data/payment";
import { Panel, SectionHead } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/PillButton";
import { Reveal } from "@/components/effects/Reveal";

export function Payment() {
  const t = useTranslations("home.payment");
  const tm = useTranslations("payment.methods");
  return (
    <Panel tone="plain" className="px-2 py-12 md:px-8 md:py-16" aria-label={t("title")}>
      <SectionHead title={t("title")} lead={t("lead")} className="md:items-end" />
      <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {paymentSlugs.map((slug, i) => {
          const dark = paymentTone[slug] === "dark";
          return (
            <li key={slug}>
              <Link
                href={`/payment/${slug}`}
                className={`group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[var(--radius-card)] p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-[5px] ${
                  dark
                    ? "bg-[linear-gradient(160deg,#2A2D32_0%,#1E2024_70%)] text-white hover:shadow-[0_34px_70px_-34px_rgba(0,0,0,.5)]"
                    : "border border-white bg-[linear-gradient(160deg,#FFFFFF_0%,#F3F4F5_100%)] shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)] hover:shadow-[0_34px_70px_-34px_rgba(20,21,24,.3)]"
                }`}
              >
                <span className={`font-brand text-[11px] tracking-[0.14em] ${dark ? "text-white/45" : "text-muted"}`}>0{i + 1}</span>
                <h3 className="mt-3 text-[21px] leading-tight font-medium tracking-[-0.01em] [overflow-wrap:anywhere]">{tm(`${slug}.card`)}</h3>
                <p className={`mt-3 text-[15px] leading-relaxed ${dark ? "text-white/60" : "text-muted"}`}>{tm(`${slug}.cardText`)}</p>
                <span
                  className={`mt-auto ml-auto grid size-11 place-items-center rounded-full transition-[transform,background-color] duration-500 group-hover:-rotate-45 ${
                    dark ? "bg-white text-ink group-hover:bg-wood-light" : "bg-dark text-white group-hover:bg-wood"
                  }`}
                >
                  <Arrow className="size-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </Reveal>
    </Panel>
  );
}
