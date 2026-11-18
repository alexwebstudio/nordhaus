import { useTranslations } from "next-intl";

/**
 * Нейтральный плейсхолдер фото: графитовый фон + подпись секции, пропорции и минимальный размер.
 * Никаких нарисованных домов — только место под настоящее фото (см. IMAGES_NEEDED.md).
 */
export function Placeholder({
  label,
  ratio,
  size,
  className = "",
  compact = false,
}: {
  label: string;
  ratio: string;
  size: string;
  className?: string;
  /** маленькие миниатюры — только подпись пропорций */
  compact?: boolean;
}) {
  const t = useTranslations();
  return (
    <div
      role="img"
      aria-label={t("placeholder.aria", { label })}
      className={`absolute inset-0 flex items-center justify-center bg-[linear-gradient(160deg,#25282D_0%,#1A1C20_55%,#16181B_100%)] p-4 text-center ${className}`}
    >
      <div className="max-w-[80%]">
        {!compact && <p className="text-[13px] leading-snug font-medium text-white/60">{label}</p>}
        <p className={`font-[family-name:var(--font-brand)] text-[11px] tracking-[0.12em] text-white/35 ${compact ? "" : "mt-1.5"}`}>
          {t("common.placeholderSize", { ratio, size })}
        </p>
      </div>
    </div>
  );
}
