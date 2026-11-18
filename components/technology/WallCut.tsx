"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { wallLayers, wallTotal } from "@/data/technology";

/** Минимальная видимая ширина слоя: мембраны в 1 мм иначе не разглядеть. */
const visual = (mm: number) => Math.max(mm, 16);

const textureCss: Record<string, string> = {
  wood: "repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0 2px, transparent 2px 22px)",
  gap: "repeating-linear-gradient(90deg, rgba(20,21,24,.06) 0 1px, transparent 1px 10px)",
  membrane: "repeating-linear-gradient(135deg, rgba(255,255,255,.35) 0 3px, transparent 3px 8px)",
  wool: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.5) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(0,0,0,.08) 0 2px, transparent 3px)",
  frame: "linear-gradient(0deg, transparent 0 46%, #a8784f 46% 54%, transparent 54% 100%), radial-gradient(circle at 40% 40%, rgba(255,255,255,.35) 0 2px, transparent 3px)",
  board: "linear-gradient(90deg, rgba(0,0,0,.04), transparent)",
};

/**
 * Интерактивный «разрез» стены: слои снаружи → внутрь.
 * Наведение/фокус/клик подсвечивает слой и показывает описание.
 */
export function WallCut() {
  const [active, setActive] = useState<number>(4);
  const t = useTranslations("technology");
  const name = (id: string) => t(`layers.${id}.name`);
  const l = wallLayers[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-stretch [&>*]:min-w-0">
      <div className="relative">
        <div className="mb-3 flex justify-between font-display text-[11px] tracking-[0.12em] text-muted">
          <span>{t("street")}</span>
          <span>{t("inside")}</span>
        </div>
        <div
          className="flex h-[300px] overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[0_30px_60px_-30px_rgba(20,21,24,.3)] md:h-[420px]"
          role="tablist"
          aria-label={t("layersAria")}
        >
          {wallLayers.map((layer, i) => {
            const on = i === active;
            return (
              <button
                key={layer.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="wall-layer-panel"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group relative h-full outline-none transition-[flex-grow,filter] duration-700  focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ink"
                style={{
                  flexGrow: visual(layer.mm) * (on ? 1.6 : 1),
                  flexBasis: 0,
                  background: `${textureCss[layer.texture]}, ${layer.color}`,
                  filter: on ? "none" : "saturate(.75) brightness(.97)",
                }}
              >
                <span className="sr-only">
                  {name(layer.id)}, {layer.mm} {t("mm")}
                </span>
                <span
                  aria-hidden
                  className={`absolute inset-0 transition-opacity duration-500 ${on ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                  style={{ background: "linear-gradient(90deg, rgba(20,21,24,.05), rgba(20,21,24,.12))" }}
                />
                {/* номер слоя */}
                <span
                  aria-hidden
                  className={`absolute top-3 left-1/2 size-7 -translate-x-1/2 place-items-center rounded-full font-display text-[11px] transition-colors duration-500 ${
                    on ? "grid bg-ink text-white" : "hidden bg-white/85 text-ink md:grid"
                  }`}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>
        {/* на телефоне тонкие слои не подписать — даём список слоёв чипами */}
        <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:hidden" aria-hidden>
          {wallLayers.map((x, i) => (
            <button
              key={x.id}
              type="button"
              tabIndex={-1}
              onClick={() => setActive(i)}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors ${
                i === active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10"
              }`}
            >
              <span className="font-display text-[11px] opacity-60">{i + 1}</span>
              {name(x.id)}
            </button>
          ))}
        </div>
        {/* шкала толщины */}
        <div className="mt-4 flex items-center gap-3 text-[13px] text-muted">
          <span className="h-px flex-1 bg-ink/15" />
          <span className="font-display text-ink">{wallTotal} {t("mm")}</span>
          <span>— {t("total")}</span>
          <span className="h-px flex-1 bg-ink/15" />
        </div>
      </div>

      <div
        id="wall-layer-panel"
        role="tabpanel"
        aria-live="polite"
        className="flex flex-col rounded-[var(--radius-card)] bg-[linear-gradient(160deg,#2A2D32_0%,#1E2024_70%)] p-6 text-white md:p-8"
      >
        <div key={l.id} className="animate-[quizNext_.6s_var(--ease-expo)]">
          <p className="font-display text-[12px] tracking-[0.14em] text-white/55">
            {t("layer", { n: active + 1, total: wallLayers.length })}
          </p>
          <h3 className="mt-3 text-[clamp(26px,2.6vw,36px)] leading-tight font-medium tracking-[-0.02em]">{name(l.id)}</h3>
          <p className="mt-2 font-display text-[clamp(32px,3.4vw,48px)] leading-none font-semibold tracking-[-0.04em] text-wood-light">
            {l.mm} <span className="text-[16px] font-normal text-white/55">{t("mm")}</span>
          </p>
          <p className="mt-6 text-[16px] leading-relaxed text-white/65">{t(`layers.${l.id}.text`)}</p>
        </div>
        <ol className="mt-auto flex flex-wrap gap-1.5 pt-8" aria-label={t("goTo")}>
          {wallLayers.map((x, i) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={name(x.id)}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${i === active ? "w-8 bg-wood-light" : "w-4 bg-white/20 hover:bg-white/40"}`}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
