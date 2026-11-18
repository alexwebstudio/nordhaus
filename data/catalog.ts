/**
 * DEMO-каталог проектов 2026. Цены условные, «от» — комплектация «Тёплый контур».
 * Тексты (теги, описания, комнаты, комплектации) — в messages/*.json → catalog / project.
 */
import type { Visual } from "./types";

export type Floors = 1 | 1.5 | 2;
export type Project = {
  slug: string;
  name: string;
  area: number;
  floors: Floors;
  bedrooms: number;
  bathrooms: number;
  days: number;
  price: number;
  tag?: "hit" | "new" | "premium";
  roof: "flat" | "pitched";
  visual: Visual;
};

/** Фото проектов пока нет — плейсхолдер 3:4 (см. IMAGES_NEEDED.md, «Каталог») */
const ph: Visual = { kind: "placeholder", labelKey: "catalog.placeholder", ratio: "3:4", size: "1200×1600" };

export const catalog: Project[] = [
  { slug: "nord-64", name: "NORD 64", area: 64, floors: 1, bedrooms: 2, bathrooms: 1, days: 42, price: 7_900_000, tag: "hit", roof: "pitched", visual: ph },
  { slug: "skog-86", name: "SKOG 86", area: 86, floors: 1.5, bedrooms: 2, bathrooms: 1, days: 48, price: 10_400_000, roof: "pitched", visual: ph },
  { slug: "steppe-92", name: "STEPPE 92", area: 92, floors: 1, bedrooms: 3, bathrooms: 1, days: 50, price: 11_200_000, roof: "flat", visual: ph },
  { slug: "taiga-104", name: "TAIGA 104", area: 104, floors: 1.5, bedrooms: 3, bathrooms: 2, days: 55, price: 12_900_000, tag: "new", roof: "pitched", visual: ph },
  { slug: "altai-120", name: "ALTAI 120", area: 120, floors: 2, bedrooms: 3, bathrooms: 2, days: 60, price: 14_800_000, roof: "flat", visual: ph },
  { slug: "fjord-138", name: "FJORD 138", area: 138, floors: 2, bedrooms: 4, bathrooms: 2, days: 64, price: 16_900_000, roof: "pitched", visual: ph },
  { slug: "boreal-156", name: "BOREAL 156", area: 156, floors: 1, bedrooms: 4, bathrooms: 2, days: 66, price: 18_700_000, roof: "flat", visual: ph },
  { slug: "loft-180", name: "LOFT 180", area: 180, floors: 2, bedrooms: 5, bathrooms: 3, days: 72, price: 21_500_000, tag: "premium", roof: "flat", visual: ph },
];

export const formatPrice = (n: number) => new Intl.NumberFormat("ru-RU").format(n).replace(/ /g, " ") + " ₸";

/** ключ подписи этажности: common.floors.f1 / f15 / f2 */
export const floorsKey = (f: Floors) => (f === 1 ? "f1" : f === 1.5 ? "f15" : "f2");

/* ---------- Детали проекта (DEMO, генерируются из параметров) ---------- */
export type Room = { key: string; n?: number; area: number };
export type Floor = { key: "floor1" | "floor2" | "attic"; rooms: Room[] };

const round1 = (n: number) => Math.round(n * 10) / 10;

export function floorPlan(p: Project): Floor[] {
  const living = round1(p.area * (p.floors === 1 ? 0.3 : 0.24));
  const bath = round1(Math.max(4.5, p.area * 0.05));
  const hall = round1(Math.max(5, p.area * 0.07));
  const tech = round1(Math.max(3.5, p.area * 0.035));
  const bedArea = (n: number, share: number) => round1((p.area * share) / n);

  if (p.floors === 1) {
    return [
      {
        key: "floor1",
        rooms: [
          { key: "living", area: living },
          ...Array.from({ length: p.bedrooms }, (_, i) => (i === 0 ? { key: "master", area: bedArea(p.bedrooms, 0.42) } : { key: "bedroom", n: i + 1, area: bedArea(p.bedrooms, 0.42) })),
          { key: "bath", area: bath },
          ...(p.bathrooms > 1 ? [{ key: "bath2", area: round1(bath * 0.8) }] : []),
          { key: "hallway", area: hall },
          { key: "boiler", area: tech },
        ],
      },
    ];
  }
  const up = Math.max(1, p.bedrooms - 1);
  return [
    {
      key: "floor1",
      rooms: [
        { key: "living", area: living },
        { key: "guest", area: bedArea(1, 0.1) },
        { key: "bath", area: bath },
        { key: "hallway", area: hall },
        { key: "boiler", area: tech },
      ],
    },
    {
      key: p.floors === 1.5 ? "attic" : "floor2",
      rooms: [
        ...Array.from({ length: up }, (_, i) => (i === 0 ? { key: "master", area: bedArea(up, 0.3) } : { key: "bedroom", n: i + 2, area: bedArea(up, 0.3) })),
        ...(p.bathrooms > 1 ? [{ key: "bath2", area: round1(bath * 0.9) }] : []),
        { key: "hall", area: round1(p.area * 0.06) },
      ],
    },
  ];
}

/** Комплектации: коэффициент к цене «Тёплый контур» и сдвиг срока */
export const packs = [
  { id: "contour", k: 1, days: -15, hit: false },
  { id: "rough", k: 1.31, days: -6, hit: false },
  { id: "turnkey", k: 1.62, days: 0, hit: true },
] as const;

export const packPrice = (p: Project, k: number) => Math.round((p.price * k) / 100_000) * 100_000;

export const similar = (p: Project, n = 3) =>
  [...catalog].filter((x) => x.slug !== p.slug).sort((a, b) => Math.abs(a.area - p.area) - Math.abs(b.area - p.area)).slice(0, n);

/** Галерея проекта: 4 кадра, пока плейсхолдеры (ключи подписей — project.gallery.*) */
export const galleryShots = [
  { key: "facade", ratio: "16:10", size: "2000×1250" },
  { key: "evening", ratio: "16:10", size: "2000×1250" },
  { key: "site", ratio: "16:10", size: "2000×1250" },
  { key: "interior", ratio: "16:10", size: "2000×1250" },
] as const;
