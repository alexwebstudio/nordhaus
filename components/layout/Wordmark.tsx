/**
 * Текстовый логотип NORDHAUS (Unbounded, капс). Без пиктограмм.
 *  A — контраст насыщенности: NORD 700 / HAUS 300 (по умолчанию)
 *  B — ровный трекинг + тонкий «скат крыши» над буквой A
 *  C — NORD/HAUS через тонкую косую черту цвета дерева
 * Варианты сравниваются на /logo-preview.
 */
export type WordmarkVariant = "a" | "b" | "c";
export const DEFAULT_WORDMARK: WordmarkVariant = "a";

export function Wordmark({ variant = DEFAULT_WORDMARK, className = "" }: { variant?: WordmarkVariant; className?: string }) {
  if (variant === "b") {
    return (
      <span className={`font-brand inline-flex items-baseline font-semibold tracking-[0.16em] uppercase ${className}`} aria-label="NORDHAUS">
        <span aria-hidden>NORDH</span>
        <span aria-hidden className="relative">
          A
          {/* скат крыши: две тонкие линии над A */}
          <svg viewBox="0 0 20 8" className="absolute -top-[0.42em] left-1/2 w-[1.05em] -translate-x-[58%]" fill="none" aria-hidden>
            <path d="M1 7.2 10 1l9 6.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </span>
        <span aria-hidden>US</span>
      </span>
    );
  }
  if (variant === "c") {
    return (
      <span className={`font-brand inline-flex items-baseline font-semibold tracking-[0.08em] uppercase ${className}`} aria-label="NORDHAUS">
        <span aria-hidden>NORD</span>
        <span aria-hidden className="mx-[0.12em] font-extralight text-wood">/</span>
        <span aria-hidden>HAUS</span>
      </span>
    );
  }
  return (
    <span className={`font-brand inline-flex items-baseline tracking-[0.06em] uppercase ${className}`} aria-label="NORDHAUS">
      <span aria-hidden className="font-bold">NORD</span>
      <span aria-hidden className="font-light">HAUS</span>
    </span>
  );
}
