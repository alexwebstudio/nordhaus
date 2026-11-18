"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PaymentSlug } from "@/data/payment";
import { formatPrice } from "@/data/catalog";

const fmt = (n: number) => formatPrice(Math.round(n / 1000) * 1000);

function Range({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[14px] text-muted">
        {label}
        <span className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">{display}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={display}
        className="quiz-range mt-2 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

function Seg<T extends string | number>({ label, options, value, onChange }: { label: string; options: { v: T; l: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[14px] text-muted">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o.v)}
            type="button"
            aria-pressed={o.v === value}
            onClick={() => onChange(o.v)}
            className={`h-10 rounded-full px-4 text-[14px] font-medium transition-colors ${o.v === value ? "bg-ink text-white" : "bg-bg text-ink ring-1 ring-ink/10 hover:ring-ink/30"}`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const annuity = (sum: number, ratePct: number, months: number) => {
  const r = ratePct / 100 / 12;
  return r === 0 ? sum / months : (sum * r) / (1 - Math.pow(1 + r, -months));
};

/** Калькулятор платежа: отдельная модель для каждого способа оплаты (демо-ставки). */
export function Calculator({ mode }: { mode: PaymentSlug }) {
  const t = useTranslations("payment.calc");
  const [price, setPrice] = useState(18_000_000);
  const [down, setDown] = useState(mode === "installment" ? 30 : 20);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(15);
  const [months, setMonths] = useState(12);
  const [savings, setSavings] = useState(4_000_000);
  const [houses, setHouses] = useState(3);

  let result: { main: string; mainLabel: string; rows: [string, string][] };

  if (mode === "mortgage") {
    const loan = price * (1 - down / 100);
    const pay = annuity(loan, rate, years * 12);
    result = {
      mainLabel: t("monthly"),
      main: fmt(pay),
      rows: [
        [t("loan"), fmt(loan)],
        [t("firstPay"), fmt(price - loan)],
        [t("overpay"), fmt(pay * years * 12 - loan)],
      ],
    };
  } else if (mode === "installment") {
    const first = price * (down / 100);
    result = {
      mainLabel: t("monthly"),
      main: fmt((price - first) / months),
      rows: [
        [t("firstPay"), fmt(first)],
        [t("rest"), fmt(price - first)],
        [t("overpayShort"), "0 ₸"],
      ],
    };
  } else if (mode === "subsidy") {
    const premium = Math.min(savings * 0.2, 1_500_000);
    const own = savings + premium;
    const loan = Math.max(0, price - own);
    const pay = annuity(loan, 5, 10 * 12);
    result = {
      mainLabel: t("subsidyMonthly"),
      main: fmt(pay),
      rows: [
        [t("premium"), fmt(premium)],
        [t("own"), fmt(own)],
        [t("loanSum"), fmt(loan)],
      ],
    };
  } else {
    const discount = houses >= 10 ? 0.12 : houses >= 5 ? 0.08 : houses >= 3 ? 0.05 : 0;
    const total = price * houses * (1 - discount);
    result = {
      mainLabel: t("totalVat", { count: houses }),
      main: fmt(total),
      rows: [
        [t("discount"), `${Math.round(discount * 100)}%`],
        [t("advance"), fmt(total * 0.3)],
        [t("stages"), `${fmt(total * 0.4)} + ${fmt(total * 0.3)}`],
      ],
    };
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)] md:p-8">
        <Range id="calc-price" label={mode === "cashless" ? t("priceOne") : t("price")} value={price} min={6_000_000} max={45_000_000} step={500_000} onChange={setPrice} display={fmt(price)} />
        {mode === "mortgage" && (
          <>
            <Range id="calc-down" label={t("down")} value={down} min={20} max={90} step={5} onChange={setDown} display={`${down}% · ${fmt((price * down) / 100)}`} />
            <Seg label={t("program")} value={rate} onChange={setRate} options={[{ v: 7, l: t("rateGov") }, { v: 12, l: t("ratePartner") }, { v: 17.5, l: t("rateMarket") }]} />
            <Range id="calc-years" label={t("term")} value={years} min={5} max={25} step={1} onChange={setYears} display={t("years", { count: years })} />
          </>
        )}
        {mode === "installment" && (
          <>
            <Range id="calc-down" label={t("down")} value={down} min={30} max={90} step={5} onChange={setDown} display={`${down}% · ${fmt((price * down) / 100)}`} />
            <Seg label={t("termInstallment")} value={months} onChange={setMonths} options={[3, 6, 9, 12].map((m) => ({ v: m, l: t("months", { count: m }) }))} />
          </>
        )}
        {mode === "subsidy" && (
          <Range id="calc-sav" label={t("savings")} value={savings} min={500_000} max={15_000_000} step={250_000} onChange={setSavings} display={fmt(savings)} />
        )}
        {mode === "cashless" && (
          <Range id="calc-houses" label={t("houses")} value={houses} min={1} max={20} step={1} onChange={setHouses} display={String(houses)} />
        )}
      </div>

      <div className="flex flex-col rounded-[var(--radius-card)] bg-[linear-gradient(160deg,#2A2D32_0%,#1E2024_70%)] p-6 text-white md:p-8" aria-live="polite">
        <p className="text-[14px] text-white/55">{result.mainLabel}</p>
        <p className="mt-2 font-display text-[clamp(32px,3.6vw,52px)] leading-none font-semibold tracking-[-0.04em] text-wood-light">{result.main}</p>
        <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {result.rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-3 text-[14px]">
              <dt className="text-white/55">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          data-quiz-trigger
          className="mt-auto h-12 rounded-full bg-white text-[15px] font-medium text-ink transition-colors hover:bg-surface max-lg:mt-8"
        >
          {t("getExact")}
        </button>
        <p className="mt-3 text-[12px] text-white/55">{t("note")}</p>
      </div>
    </div>
  );
}
