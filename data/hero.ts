/**
 * Hero: одно широкое фото, видимое сквозь 4 окна.
 * В public/images/raw нет готового дома (только бетон/стройка) — стоит плейсхолдер.
 * Когда появится фото ≥ 2400px (IMAGES_NEEDED.md, #1): { kind: "photo", src, altKey: "hero.aria" }.
 */
import type { Visual } from "./types";

export const heroVisual: Visual = { kind: "placeholder", labelKey: "hero.placeholder", ratio: "16:10", size: "2400×1500" };
