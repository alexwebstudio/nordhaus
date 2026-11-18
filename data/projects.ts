/** DEMO: реализованные объекты для /projects. Тексты — в messages/*.json → projects.items. */
export type Realized = { id: string; year: number; area: number; days: number };

export const realizedAll: Realized[] = [
  { id: "burabay", year: 2025, area: 148, days: 58 },
  { id: "kapchagay", year: 2025, area: 196, days: 67 },
  { id: "karagayly", year: 2024, area: 112, days: 52 },
  { id: "borovoe", year: 2024, area: 86, days: 46 },
  { id: "kosshy", year: 2025, area: 124, days: 61 },
  { id: "tokarevka", year: 2023, area: 64, days: 40 },
];

/** «до/после» — фото пока нет, плейсхолдеры 4:3 (IMAGES_NEEDED.md, «Проекты») */
export const beforeAfterShot = { ratio: "4:3", size: "1600×1200" };
