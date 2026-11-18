import { useTranslations } from "next-intl";
import { site } from "@/config/site";
import { Panel, SectionHead } from "@/components/ui/Section";
import { PillButton } from "@/components/ui/PillButton";
import { Accordion } from "@/components/ui/Accordion";

export function Faq() {
  const t = useTranslations("home.faq");
  return (
    <Panel className="grid gap-12 px-5 py-14 md:px-12 md:py-20 lg:grid-cols-[1fr_1.35fr]">
      <div className="flex min-w-0 flex-col">
        <SectionHead label={t("label")} title={t("title")} />
        <div className="mt-10 rounded-[var(--radius-card)] bg-dark p-6 text-white lg:mt-auto">
          <p className="text-[19px] font-medium">{t("missTitle")}</p>
          <p className="mt-2 text-[15px] text-white/60">{t("missText")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <PillButton variant="light" data-quiz-trigger>
              {t("ask")}
            </PillButton>
            <a href={site.phoneHref} className="font-brand text-[14px] text-white/80 transition-colors hover:text-white">
              {site.phone}
            </a>
          </div>
        </div>
      </div>
      <Accordion items={t.raw("items") as { q: string; a: string }[]} />
    </Panel>
  );
}
