"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { catalog, formatPrice, type Floors } from "@/data/catalog";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/effects/Reveal";

type Opt<T> = { label: string; value: T };

const MAX_PRICE = Math.ceil(Math.max(...catalog.map((p) => p.price)) / 1_000_000) * 1_000_000;
const MIN_PRICE = Math.floor(Math.min(...catalog.map((p) => p.price)) / 1_000_000) * 1_000_000;

function Chips<T>({ legend, options, value, onChange }: { legend: string; options: Opt<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[13px] text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = JSON.stringify(o.value) === JSON.stringify(value);
          return (
            <button
              key={o.label}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`h-10 rounded-full px-4 text-[14px] font-medium transition-[background-color,color,box-shadow] ${
                on ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink/30"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CatalogGrid() {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const [area, setArea] = useState<[number, number] | null>(null);
  const [floors, setFloors] = useState<Floors | null>(null);
  const [beds, setBeds] = useState<[number, number] | null>(null);
  const [budget, setBudget] = useState(MAX_PRICE);
  const [sort, setSort] = useState<"price" | "area" | "days">("price");

  const AREA: Opt<[number, number] | null>[] = [
    { label: t("anyF"), value: null },
    { label: t("areaTo90"), value: [0, 90] },
    { label: t("area90130"), value: [90, 130] },
    { label: t("areaFrom130"), value: [130, 999] },
  ];
  const FLOORS: Opt<Floors | null>[] = [
    { label: t("anyF"), value: null },
    { label: tc("floors.f1"), value: 1 },
    { label: tc("floors.f15"), value: 1.5 },
    { label: tc("floors.f2"), value: 2 },
  ];
  const BEDS: Opt<[number, number] | null>[] = [
    { label: t("anyN"), value: null },
    { label: "1–2", value: [1, 2] },
    { label: "3", value: [3, 3] },
    { label: "4+", value: [4, 99] },
  ];

  const list = useMemo(
    () =>
      catalog
        .filter((p) => !area || (p.area >= area[0] && p.area < area[1]))
        .filter((p) => floors === null || p.floors === floors)
        .filter((p) => !beds || (p.bedrooms >= beds[0] && p.bedrooms <= beds[1]))
        .filter((p) => p.price <= budget)
        .sort((a, b) => a[sort] - b[sort]),
    [area, floors, beds, budget, sort],
  );

  const reset = () => {
    setArea(null);
    setFloors(null);
    setBeds(null);
    setBudget(MAX_PRICE);
  };
  const dirty = area || floors !== null || beds || budget < MAX_PRICE;
  const pct = ((budget - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10">
      <aside aria-label={t("filtersAria")} className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-white bg-white/70 p-5 shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)] backdrop-blur-xl md:p-6">
          <Chips legend={t("area")} options={AREA} value={area} onChange={setArea} />
          <Chips legend={t("floors")} options={FLOORS} value={floors} onChange={setFloors} />
          <Chips legend={t("bedrooms")} options={BEDS} value={beds} onChange={setBeds} />
          <div>
            <label htmlFor="budget" className="flex items-baseline justify-between gap-3 text-[13px] text-muted">
              {t("budget")}
              <span className="font-display text-[14px] font-semibold text-ink">{t("budgetUpTo", { price: formatPrice(budget) })}</span>
            </label>
            <input
              id="budget"
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={500_000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="quiz-range mt-3 w-full"
              style={{ "--pct": `${pct}%` } as React.CSSProperties}
            />
          </div>
          <button
            type="button"
            onClick={reset}
            className={`self-start text-[14px] font-medium text-wood underline-offset-4 transition-opacity hover:underline ${dirty ? "opacity-100" : "pointer-events-none opacity-0"}`}
            tabIndex={dirty ? 0 : -1}
          >
            {t("reset")}
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] text-muted" aria-live="polite">
            {t("found", { count: list.length, total: catalog.length })}
          </p>
          <label className="flex items-center gap-2 text-[14px] text-muted">
            {t("sort")}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-full bg-white px-4 text-[14px] font-medium text-ink ring-1 ring-ink/10 transition-shadow outline-none focus-visible:ring-ink"
            >
              <option value="price">{t("sortPrice")}</option>
              <option value="area">{t("sortArea")}</option>
              <option value="days">{t("sortDays")}</option>
            </select>
          </label>
        </div>

        {list.length ? (
          <Reveal className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <li key={p.slug} className="animate-[quizChip_.6s_var(--ease-ui)]">
                <ProjectCard p={p} sizes="(max-width: 640px) 90vw, (max-width: 1280px) 40vw, 28vw" />
              </li>
            ))}
          </Reveal>
        ) : (
          <div className="grid place-items-center rounded-[var(--radius-card)] border border-dashed border-ink/15 px-6 py-20 text-center">
            <Icon name="eye" className="size-8 text-wood" />
            <p className="mt-4 text-[20px] font-medium">{t("emptyTitle")}</p>
            <p className="mt-2 max-w-[28em] text-muted">{t("emptyText")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" data-quiz-trigger className="h-12 rounded-full bg-ink px-6 text-[15px] font-medium text-white transition-colors hover:bg-dark">
                {t("emptyCta")}
              </button>
              <button type="button" onClick={reset} className="h-12 rounded-full px-6 text-[15px] font-medium ring-1 ring-ink/15 transition-colors hover:bg-white">
                {t("reset")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
