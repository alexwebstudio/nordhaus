import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type Variant = "dark" | "light" | "ghost-light";

const styles: Record<Variant, { root: string; dot: string }> = {
  dark: {
    root: "bg-dark text-white hover:bg-ink",
    dot: "bg-white text-dark",
  },
  light: {
    root: "bg-white text-ink hover:bg-surface",
    dot: "bg-dark text-white",
  },
  "ghost-light": {
    root: "border border-white/25 text-white hover:border-white/60",
    dot: "bg-white text-dark",
  },
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M3 8h10m0 0L8.5 3.5M13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Common = { children: ReactNode; variant?: Variant; className?: string; arrow?: boolean };

/** Кнопка-пилюля с кружком-стрелкой (ЭСТ). Стрелка проворачивается на hover. */
export function PillButton({
  children,
  variant = "dark",
  className = "",
  arrow = true,
  href,
  ...rest
}: Common & ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) | (Common & { href?: undefined } & Omit<ComponentProps<"button">, "className">)) {
  const s = styles[variant];
  const cls = `group inline-flex h-12 items-center gap-3 rounded-full pl-6 ${arrow ? "pr-1.5" : "pr-6"} text-[14px] font-medium transition-colors ${s.root} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          className={`grid size-9 place-items-center rounded-full transition-transform duration-[var(--dur-expand)] group-hover:translate-x-0.5 group-hover:-rotate-45 ${s.dot}`}
        >
          <Arrow className="size-4" />
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} {...(rest as Omit<ComponentProps<typeof Link>, "href">)}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ComponentProps<"button">)}>
      {inner}
    </button>
  );
}
