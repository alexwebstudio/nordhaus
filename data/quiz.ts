/**
 * DEMO: структура квиза «Собери свой дом» и упрощённая модель цены/срока.
 * Тексты шагов и вариантов — в messages/*.json → quiz.steps.
 */
export type Answers = {
  purpose?: "home" | "dacha" | "guest" | "rent";
  area: number;
  floors?: 1 | 1.5 | 2;
  bedrooms?: number;
  pack?: "contour" | "rough" | "turnkey";
  plot?: "yes" | "process" | "no";
  start?: "season" | "later" | "browse";
  pay?: "cash" | "mortgage" | "installment" | "subsidy";
};

export const initialAnswers: Answers = { area: 120 };

/** вариант: значение ответа, ключ текста в messages и иконка */
type Opt = { value: string | number; key: string; icon?: string };

export type Step =
  | { id: "area"; kind: "range"; min: number; max: number; step: number; presets: number[] }
  | { id: "bedrooms"; kind: "choice"; layout: "number"; options: Opt[] }
  | { id: "pack"; kind: "choice"; layout: "list"; options: Opt[] }
  | { id: "purpose" | "floors" | "plot" | "start" | "pay"; kind: "choice"; layout: "icon"; options: Opt[] };

export const steps: Step[] = [
  {
    id: "purpose",
    kind: "choice",
    layout: "icon",
    options: [
      { value: "home", key: "home", icon: "home" },
      { value: "dacha", key: "dacha", icon: "sun" },
      { value: "guest", key: "guest", icon: "steam" },
      { value: "rent", key: "rent", icon: "key" },
    ],
  },
  { id: "area", kind: "range", min: 60, max: 250, step: 2, presets: [80, 100, 120, 150, 200] },
  {
    id: "floors",
    kind: "choice",
    layout: "icon",
    options: [
      { value: 1, key: "f1", icon: "level1" },
      { value: 1.5, key: "f15", icon: "attic" },
      { value: 2, key: "f2", icon: "level2" },
    ],
  },
  { id: "bedrooms", kind: "choice", layout: "number", options: [1, 2, 3, 4, 5].map((n) => ({ value: n, key: String(n) })) },
  {
    id: "pack",
    kind: "choice",
    layout: "list",
    options: [
      { value: "contour", key: "contour" },
      { value: "rough", key: "rough" },
      { value: "turnkey", key: "turnkey" },
    ],
  },
  {
    id: "plot",
    kind: "choice",
    layout: "icon",
    options: [
      { value: "yes", key: "yes", icon: "check" },
      { value: "process", key: "process", icon: "doc" },
      { value: "no", key: "no", icon: "pin" },
    ],
  },
  {
    id: "start",
    kind: "choice",
    layout: "icon",
    options: [
      { value: "season", key: "season", icon: "bolt" },
      { value: "later", key: "later", icon: "calendar" },
      { value: "browse", key: "browse", icon: "eye" },
    ],
  },
  {
    id: "pay",
    kind: "choice",
    layout: "icon",
    options: [
      { value: "cash", key: "cash", icon: "wallet" },
      { value: "mortgage", key: "mortgage", icon: "bank" },
      { value: "installment", key: "installment", icon: "split" },
      { value: "subsidy", key: "subsidy", icon: "shield" },
    ],
  },
];

export const TOTAL = steps.length;
export const SOCIAL_COUNT = 34; // demo

/* ---------- Модель (demo) ---------- */
const PER_M2 = { contour: 95_000, rough: 125_000, turnkey: 154_000 } as const;
const FLOOR_K = { 1: 1.06, 1.5: 1, 2: 0.97 } as const;

export function estimate(a: Answers) {
  const pack = a.pack ?? "contour";
  const floors = a.floors ?? 1.5;
  const extraBeds = Math.max(0, (a.bedrooms ?? 2) - 2) * 250_000;
  const raw = a.area * PER_M2[pack] * FLOOR_K[floors] + extraBeds;
  const price = Math.round(raw / 100_000) * 100_000;
  const days = Math.round(35 + a.area * 0.22 + (floors === 2 ? 5 : floors === 1.5 ? 3 : 0) + (pack === "contour" ? -15 : pack === "rough" ? -6 : 0));
  return { price, days };
}
