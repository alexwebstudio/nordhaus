import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BRAND } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

const font = (f: string) => readFile(join(process.cwd(), "assets/og-fonts", f));

/**
 * OG-картинка в стиле hero: фото сквозь 4 «ступенчатых» окна, огромный логотип,
 * справа заголовок страницы. Шрифты — Unbounded / Onest (woff: satori не читает woff2).
 */
export async function renderOg({ title, kicker, accent, tagline, words }: { title: string; kicker?: string; accent?: string; tagline: string; words: string[] }) {
  const [unbLat, unbCyr, onLat, onCyr, unbExt, onExt, onKk, photo] = await Promise.all([
    font("unbounded-latin-700-normal.woff"),
    font("unbounded-cyrillic-700-normal.woff"),
    font("onest-latin-400-normal.woff"),
    font("onest-cyrillic-400-normal.woff"),
    font("unbounded-latin-ext-700-normal.woff"),
    font("onest-latin-ext-400-normal.woff"),
    font("onest-cyrillic-ext-400-normal.woff"),
    readFile(join(process.cwd(), "public/images/raw/concrete-frame-sky.jpg")),
  ]);
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const W = 1200;
  const H = 630;
  const pad = 28;
  const gap = 12;
  const stageW = 620;
  const cw = (stageW - gap * 3) / 4;
  const wins = [
    { t: 0, b: 0.58 },
    { t: 0, b: 0.58 },
    { t: 0, b: 0.66 },
    { t: 0.05, b: 0.54 },
  ];
  const stageH = H - pad * 2;

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", background: "#16181B", position: "relative", fontFamily: "Onest, OnestCyr, OnestExt, OnestKk" }}>
        {wins.map((w, i) => {
          const left = pad + i * (cw + gap);
          const top = pad + w.t * stageH;
          const h = (w.b - w.t) * stageH;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left,
                top,
                width: cw,
                height: h,
                borderRadius: 26,
                overflow: "hidden",
                display: "flex",
                border: "1px solid rgba(255,255,255,.12)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                width={stageW}
                height={stageW * 1.5}
                style={{ position: "absolute", left: -(i * (cw + gap)), top: -(w.t * stageH) - 120, objectFit: "cover" }}
              />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: pad,
            bottom: pad + 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: "Unbounded, UnboundedCyr, UnboundedExt, OnestKk", fontSize: 92, color: "#fff", letterSpacing: -3, lineHeight: 1 }}>{BRAND}</div>
          <div style={{ marginTop: 10, fontSize: 22, color: "rgba(255,255,255,.5)" }}>{tagline}</div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 48,
            top: 64,
            width: 470,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            textAlign: "right",
          }}
        >
          {kicker && (
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#D2A47C",
                border: "1px solid rgba(210,164,124,.5)",
                borderRadius: 999,
                padding: "6px 16px",
                marginBottom: 22,
              }}
            >
              {kicker}
            </div>
          )}
          <div style={{ fontSize: 46, lineHeight: 1.08, color: "#fff", letterSpacing: -1 }}>{title}</div>
          {accent && (
            <div style={{ marginTop: 14, fontFamily: "Unbounded, UnboundedCyr, UnboundedExt, OnestKk", fontSize: 40, color: "#D2A47C", letterSpacing: -1 }}>{accent.replace(/ /g, " ")}</div>
          )}
        </div>

        <div style={{ position: "absolute", right: 48, bottom: pad + 14, display: "flex", flexDirection: "column", alignItems: "flex-end", fontFamily: "Unbounded, UnboundedCyr, UnboundedExt, OnestKk", fontSize: 26, lineHeight: 1.25 }}>
          {words.map((w, i) => (
            <span key={w} style={{ color: i % 2 ? "rgba(255,255,255,.42)" : "#fff" }}>
              {w.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Unbounded", data: unbLat, weight: 700, style: "normal" },
        { name: "UnboundedCyr", data: unbCyr, weight: 700, style: "normal" },
        { name: "Onest", data: onLat, weight: 400, style: "normal" },
        { name: "OnestCyr", data: onCyr, weight: 400, style: "normal" },
        { name: "UnboundedExt", data: unbExt, weight: 700, style: "normal" },
        { name: "OnestExt", data: onExt, weight: 400, style: "normal" },
        { name: "OnestKk", data: onKk, weight: 400, style: "normal" },
      ],
    },
  );
}
