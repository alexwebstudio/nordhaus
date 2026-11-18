import type { ReactNode } from "react";
import { TextFlip } from "@/components/effects/TextFlip";
import { BlurIn } from "@/components/effects/BlurIn";

/** Секция-панель «плавает» на фоне со скруглением 32px (референс «каркасный дом»). */
export function Panel({
  children,
  className = "",
  tone = "light",
  id,
  as: Tag = "section",
  eager = true,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "plain" | "dark";
  id?: string;
  as?: "section" | "div";
  /** false — включить content-visibility (только для блоков без анимаций по IO и пинов рядом) */
  eager?: boolean;
} & React.AriaAttributes) {
  const toneCls =
    tone === "light"
      ? "bg-[linear-gradient(180deg,#F8F8F9_0%,#F1F2F4_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.9)] ring-1 ring-white/70"
      : tone === "dark"
        ? "bg-graphite text-white"
        : "";
  return (
    <div className="px-[var(--gutter)]">
      <Tag
        id={id}
        className={`mx-auto w-full max-w-[1600px] rounded-[var(--radius-section)] ${eager ? "" : "cv-auto"} ${toneCls} ${className}`}
        {...rest}
      >
        {children}
      </Tag>
    </div>
  );
}

export function Label({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-[0.12em] uppercase ${
        dark ? "border-white/20 text-white/60" : "border-ink/12 text-muted"
      }`}
    >
      {children}
    </span>
  );
}

/** Заголовок секции: пилюля-лейбл + H2 с Text Flip по словам + абзац Blur In. */
export function SectionHead({
  label,
  title,
  lead,
  dark = false,
  className = "",
  aside,
  titleClassName = "",
}: {
  label?: string;
  title: string;
  lead?: string;
  dark?: boolean;
  className?: string;
  aside?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-[760px]">
        {label && <Label dark={dark}>{label}</Label>}
        <TextFlip
          as="h2"
          text={title}
          split="words"
          stagger={45}
          className={`mt-5 block text-[clamp(32px,4.2vw,64px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance ${titleClassName}`}
        />
        {lead && (
          <BlurIn as="p" delay={200} className={`mt-5 max-w-[560px] text-[17px] leading-relaxed ${dark ? "text-white/55" : "text-muted"}`}>
            {lead}
          </BlurIn>
        )}
      </div>
      {aside}
    </div>
  );
}
