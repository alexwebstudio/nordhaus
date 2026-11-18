/**
 * Визуалы главной. Тексты — в messages/*.json → home.
 * Фото — только из public/images/raw; чего нет — плейсхолдер (см. IMAGES_NEEDED.md).
 */
import type { Visual } from "./types";

export const offerVisual: Visual = { kind: "placeholder", labelKey: "home.offer.placeholder", ratio: "4:5", size: "1400×1750" };

export const stepVisuals: Visual[] = [
  { kind: "photo", src: "/images/raw/blueprints-hands.jpg", altKey: "home.steps.items.0.alt", position: "50% 40%" },
  { kind: "photo", src: "/images/raw/helmet.jpg", altKey: "home.steps.items.1.alt", position: "50% 50%" },
  { kind: "photo", src: "/images/raw/concrete-chair.jpg", altKey: "home.steps.items.2.alt", position: "50% 60%" },
];

export const realizedVisual: Visual = { kind: "placeholder", labelKey: "home.realized.placeholder", ratio: "4:3", size: "1600×1200" };

/** реализованные объекты на главной: срок (дней) для бейджа — остальное в messages */
export const realizedDays = [58, 67, 52];

export const finalCtaVisual: Visual = { kind: "placeholder", labelKey: "home.finalCta.placeholder", ratio: "21:9", size: "2400×1030" };

/** фон под стеклянными отзывами */
export const reviewsBackground = "/images/raw/concrete-zigzag.jpg";

export const statsRating = "4,9";
