import { useTranslations } from "next-intl";
import { offerVisual } from "@/data/home";
import { Panel, Label } from "@/components/ui/Section";
import { Visual } from "@/components/ui/Visual";
import { PillButton } from "@/components/ui/PillButton";
import { CountUp } from "@/components/ui/CountUp";
import { TextFlip } from "@/components/effects/TextFlip";
import { BlurIn } from "@/components/effects/BlurIn";
import { Reveal } from "@/components/effects/Reveal";
import { ImageReveal } from "@/components/effects/ImageReveal";

type Stat = { value: number; suffix: string; unit: string; label: string };

export function Offer() {
  const t = useTranslations("home.offer");
  const stats = t.raw("stats") as Stat[];
  return (
    <Panel className="grid gap-4 p-3 md:p-4 lg:grid-cols-[1.08fr_1fr]">
      <div className="flex min-w-0 flex-col justify-between gap-10 px-4 pt-8 pb-4 md:px-8 md:pt-12 lg:pb-8">
        <div>
          <Label>{t("label")}</Label>
          <TextFlip
            as="h2"
            text={t("title")}
            split="words"
            stagger={45}
            className="mt-6 block max-w-[13em] text-[clamp(32px,4.4vw,68px)] leading-[1.02] font-medium tracking-[-0.03em] text-balance [overflow-wrap:anywhere]"
          />
          <BlurIn as="p" delay={250} className="mt-6 max-w-[34em] text-[17px] leading-relaxed text-muted">
            {t("lead")}
          </BlurIn>
          <BlurIn delay={400} className="mt-8">
            <PillButton data-quiz-trigger>{t("cta")}</PillButton>
          </BlurIn>
        </div>

        <Reveal className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <li key={s.unit} className="glass rounded-[var(--radius-card)] p-5">
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <CountUp value={s.value} suffix={s.suffix} className="font-brand text-[44px] leading-none font-semibold tracking-[-0.04em]" />
                <span className="text-[13px] font-medium text-wood">{s.unit}</span>
              </div>
              <p className="mt-3 text-[14px] leading-snug text-muted">{s.label}</p>
            </li>
          ))}
        </Reveal>
      </div>

      <ImageReveal
        className="relative min-h-[420px] overflow-hidden rounded-[calc(var(--radius-section)-10px)] lg:min-h-[640px]"
        overlay={
          <>
            <div className="glass absolute top-4 right-4 left-4 rounded-full px-5 py-2.5 text-center sm:left-auto">
              <span className="text-[13px] font-medium">{t("camera")}</span>
            </div>
            <div className="glass absolute bottom-4 left-4 max-w-[260px] rounded-[20px] p-4">
              <p className="text-[14px] font-semibold tracking-[-0.01em]">{t("badgeTitle")}</p>
              <p className="mt-1 text-[13px] text-muted">{t("badgeText")}</p>
            </div>
          </>
        }
      >
        <Visual visual={offerVisual} sizes="(max-width: 1024px) 100vw, 48vw" />
      </ImageReveal>
    </Panel>
  );
}
