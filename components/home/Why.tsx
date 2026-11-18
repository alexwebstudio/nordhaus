import { useTranslations } from "next-intl";
import { Panel, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/effects/Reveal";

type Item = { title: string; text: string; value: string; caption: string };
const ICONS = ["shield", "compass", "calendar", "support"];

/**
 * «Почему нас выбирают». Hover мягкий: подъём на 5px, плавная тень,
 * лёгкий scale фона иконки, 500ms — без смены цвета карточки.
 */
export function Why() {
  const t = useTranslations("home.why");
  const items = t.raw("items") as Item[];
  return (
    <Panel className="px-5 py-14 md:px-12 md:py-20">
      <SectionHead label={t("label")} title={t("title")} lead={t("lead")} />
      <Reveal className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <li
            key={it.title}
            className="group flex min-h-[340px] flex-col rounded-[var(--radius-card)] border border-white bg-white/80 p-6 shadow-[0_1px_0_rgba(20,21,24,.04),0_20px_50px_-30px_rgba(20,21,24,.18)] transition-[transform,box-shadow] duration-500 hover:-translate-y-[5px] hover:shadow-[0_34px_70px_-34px_rgba(20,21,24,.3)]"
          >
            <span className="relative grid size-12 place-items-center text-ink">
              <span aria-hidden className="absolute inset-0 rounded-full bg-bg transition-transform duration-500 group-hover:scale-110" />
              <Icon name={ICONS[i]} className="relative size-[22px]" />
            </span>
            <h3 className="mt-6 text-[19px] font-medium tracking-[-0.01em]">{it.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{it.text}</p>
            <div className="mt-auto pt-8">
              <p className="font-brand text-[clamp(44px,4vw,60px)] leading-none font-semibold tracking-[-0.05em]">{it.value}</p>
              <p className="mt-2 text-[14px] text-muted">{it.caption}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </Panel>
  );
}
