import localFont from "next/font/local";

/*
 * Шрифты self-hosted (variable woff2), урезаны до используемых символов.
 * Каждый файл покрывает свой unicode-range; браузер берёт глиф из подходящего по цепочке.
 * preload: false — веб-шрифты включаются после первого кадра (html[data-fonts]).
 * Значения — литералы: next/font не принимает константы.
 */

export const unbLat = localFont({ src: "../app/fonts/unbounded-latin-wght-normal.woff2", weight: "100 900", variable: "--font-unb-lat", preload: false, display: "swap", fallback: [], adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }] });
export const unbCyr = localFont({ src: "../app/fonts/unbounded-cyrillic-wght-normal.woff2", weight: "100 900", variable: "--font-unb-cyr", preload: false, display: "swap", fallback: [], adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116" }] });
export const unbExt = localFont({ src: "../app/fonts/unbounded-tenge.woff2", weight: "100 900", variable: "--font-unb-ext", preload: false, display: "swap", fallback: [], adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+20B8" }] });
export const onestLat = localFont({ src: "../app/fonts/onest-latin-wght-normal.woff2", weight: "100 900", variable: "--font-onest-lat", preload: false, display: "swap", fallback: [], adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }] });
export const onestCyr = localFont({ src: "../app/fonts/onest-cyrillic-wght-normal.woff2", weight: "100 900", variable: "--font-onest-cyr", preload: false, display: "swap", fallback: [], adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116" }] });
export const onestKk = localFont({ src: "../app/fonts/onest-kk.woff2", weight: "100 900", variable: "--font-onest-kk", preload: false, display: "swap", fallback: [], adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+0492-0493,U+049A-049B,U+04A2-04A3,U+04AE-04AF,U+04BA-04BB,U+04D8-04D9,U+04E8-04E9" }] });
export const onestExt = localFont({ src: "../app/fonts/onest-tenge.woff2", weight: "100 900", variable: "--font-onest-ext", preload: false, display: "swap", fallback: [], adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+20B8" }] });

export const fontVariables = [unbLat, unbCyr, unbExt, onestLat, onestCyr, onestKk, onestExt].map((f) => f.variable).join(" ");
