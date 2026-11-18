/**
 * Единый motion-стандарт сайта. CSS-двойники — переменные в app/globals.css
 * (--ease-ui, --dur-hover, --dur-expand, --dur-reveal, --dur-photo).
 */
export const EASE = {
  /** ease-out-quint — все UI-переходы (hover, раскрытия, состояния) */
  ui: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** GSAP: появления блоков */
  in: "expo.out",
  soft: "power3.out",
  /** GSAP: спокойные сцены (прелоадер, уход экрана) */
  inOut: "power2.inOut",
  expoInOut: "expo.inOut",
} as const;

/** секунды — для GSAP */
export const DUR = {
  hover: 0.45,
  expand: 0.55,
  reveal: 1.0,
  photo: 0.8,
} as const;

/** Появление карточек: fade + подъём + лёгкий blur → 0, один раз при входе в экран */
export const REVEAL = {
  y: 36,
  blur: 8,
  stagger: 0.1,
  start: "top 88%",
} as const;
