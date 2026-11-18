import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FRAME } from "@/components/ui/houseFrame";

/** 404: участок размечен, но фундамент ещё не залит — только разметка будущего каркаса. */
export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-graphite px-[var(--gutter)] pt-28 pb-16 text-white">
      <div className="relative flex max-w-[760px] flex-col items-center text-center">
        <svg viewBox="0 30 480 270" className="w-[min(86vw,460px)]" fill="none" aria-hidden>
          {/* призрак будущего каркаса */}
          {FRAME.map((p, i) => (
            <path key={i} d={p.d} stroke="#fff" strokeOpacity=".1" strokeWidth="1.2" strokeDasharray="4 6" />
          ))}
          {/* разметка участка — всё, что есть */}
          <path d="M40 280H440" stroke="#B07A4F" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <p className="font-brand mt-6 text-[clamp(72px,14vw,168px)] leading-none font-semibold tracking-[-0.06em]">
          4<span className="text-wood">0</span>4
        </p>
        <h1 className="mt-4 text-[clamp(26px,3.4vw,44px)] leading-tight font-medium tracking-[-0.03em]">{t("title")}</h1>
        <p className="mt-4 max-w-[30em] text-[17px] text-white/60">{t("text")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-12 items-center rounded-full bg-white px-6 text-[15px] font-medium text-ink transition-colors hover:bg-surface">
            {t("home")}
          </Link>
          <Link href="/catalog" className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-[15px] font-medium transition-colors hover:border-white/60">
            {t("catalog")}
          </Link>
        </div>
      </div>
    </main>
  );
}
