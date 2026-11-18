import { useTranslations } from "next-intl";
import { finalCtaVisual } from "@/data/home";
import { site } from "@/config/site";
import { Panel } from "@/components/ui/Section";
import { Visual } from "@/components/ui/Visual";
import { PillButton } from "@/components/ui/PillButton";
import { TextFlip } from "@/components/effects/TextFlip";
import { BlurIn } from "@/components/effects/BlurIn";

export function FinalCta() {
  const t = useTranslations("home.finalCta");
  return (
    <Panel tone="dark" className="relative isolate min-h-[520px] overflow-hidden md:min-h-[560px]" aria-label={t("aria")}>
      {/* фото вечернего дома — пока плейсхолдер справа */}
      <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[58%]">
        <Visual visual={finalCtaVisual} sizes="60vw" className="md:items-end md:justify-end md:pr-10 md:pb-10" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(22,24,27,1)_0%,rgba(22,24,27,.9)_40%,rgba(22,24,27,0)_75%)] max-md:bg-[linear-gradient(180deg,rgba(22,24,27,.96)_0%,rgba(22,24,27,.7)_60%,rgba(22,24,27,.3)_100%)]"
      />
      <div className="flex h-full min-h-[inherit] flex-col justify-between gap-10 p-6 md:p-14">
        <div className="max-w-[640px]">
          <TextFlip
            as="h2"
            text={t("title")}
            split="words"
            stagger={45}
            className="block text-[clamp(30px,4.2vw,60px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance [overflow-wrap:anywhere]"
          />
          <BlurIn as="p" delay={250} className="mt-5 max-w-[30em] text-[17px] leading-relaxed text-white/65">
            {t("text")}
          </BlurIn>
        </div>
        <BlurIn delay={400} className="flex flex-wrap items-center gap-5">
          <PillButton variant="light" data-quiz-trigger>
            {t("cta")}
          </PillButton>
          <a href={site.whatsapp} target="_blank" rel="noopener" className="text-[15px] text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline">
            {t("whatsapp")}
          </a>
        </BlurIn>
      </div>
    </Panel>
  );
}
