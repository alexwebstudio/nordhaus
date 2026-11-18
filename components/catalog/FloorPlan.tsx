"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Floor, Room } from "@/data/catalog";

type Box = { x: number; y: number; w: number; h: number; room: Room };

/** Раскладка комнат «срезами»: самая большая — слева, остальные — колонками справа. */
function layout(rooms: Room[], W: number, H: number): Box[] {
  const total = rooms.reduce((s, r) => s + r.area, 0);
  const [first, ...rest] = [...rooms].sort((a, b) => b.area - a.area);
  const w0 = Math.max(W * 0.34, (first.area / total) * W);
  const boxes: Box[] = [{ x: 0, y: 0, w: w0, h: H, room: first }];
  // остальные — в две колонки
  const colA: Room[] = [];
  const colB: Room[] = [];
  let a = 0;
  let b = 0;
  for (const r of rest) {
    if (a <= b) {
      colA.push(r);
      a += r.area;
    } else {
      colB.push(r);
      b += r.area;
    }
  }
  const restW = W - w0;
  const cols = colB.length ? [colA, colB] : [colA];
  const sums = cols.map((c) => c.reduce((s, r) => s + r.area, 0));
  const sumAll = sums.reduce((s, v) => s + v, 0);
  let x = w0;
  cols.forEach((col, ci) => {
    const cw = (sums[ci] / sumAll) * restW;
    let y = 0;
    col.forEach((r) => {
      const h = (r.area / sums[ci]) * H;
      boxes.push({ x, y, w: cw, h, room: r });
      y += h;
    });
    x += cw;
  });
  return boxes;
}

export function FloorPlan({ floors }: { floors: Floor[] }) {
  const [f, setF] = useState(0);
  const W = 600;
  const H = 380;
  const t = useTranslations("project.plan");
  const tc = useTranslations("common");
  const roomName = (r: Room) => t(r.key, { n: r.n ?? 0 });
  const floorName = (k: Floor["key"]) => t(k);
  const boxes = layout(floors[f].rooms, W, H);
  const area = floors[f].rooms.reduce((s, r) => s + r.area, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)] md:p-6">
        {floors.length > 1 && (
          <div className="mb-4 inline-flex rounded-full bg-bg p-1" role="tablist" aria-label={t("floorsAria")}>
            {floors.map((fl, k) => (
              <button
                key={fl.key}
                type="button"
                role="tab"
                aria-selected={k === f}
                onClick={() => setF(k)}
                className={`h-9 rounded-full px-4 text-[14px] font-medium transition-colors ${k === f ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}
              >
                {floorName(fl.key)}
              </button>
            ))}
          </div>
        )}
        <svg key={f} viewBox={`-12 -12 ${W + 24} ${H + 24}`} className="w-full animate-[quizChip_.7s_var(--ease-ui)]" role="img" aria-label={t("aria", { floor: floorName(floors[f].key) })}>
          <defs>
            <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="#F7F7F8" />
              <rect width="1" height="8" fill="#E2E3E6" />
            </pattern>
          </defs>
          <rect x={-6} y={-6} width={W + 12} height={H + 12} fill="#141518" rx="2" />
          {boxes.map((b, k) => {
            const big = k === 0;
            return (
              <g key={b.room.key + (b.room.n ?? "")}>
                <rect x={b.x + 3} y={b.y + 3} width={b.w - 6} height={b.h - 6} fill={big ? "#F3EDE7" : "url(#hatch)"} />
                {/* дверной проём */}
                <path d={`M${b.x + b.w / 2 - 14} ${b.y + b.h - 3}h28`} stroke={big ? "#F3EDE7" : "#F7F7F8"} strokeWidth="7" />
                <path d={`M${b.x + b.w / 2 - 14} ${b.y + b.h - 3}a28 28 0 0 1 28 -28`} fill="none" stroke="#B07A4F" strokeWidth="1" opacity=".6" />
                <text x={b.x + 14} y={b.y + 28} fontSize={b.h > 90 ? 15 : 12} fill="#141518" fontFamily="var(--font-sans)" fontWeight={500}>
                  {roomName(b.room)}
                </text>
                <text x={b.x + 14} y={b.y + (b.h > 90 ? 48 : 44)} fontSize="12" fill="#B07A4F" fontFamily="var(--font-display)">
                  {b.room.area.toLocaleString("ru-RU")} {tc("m2")}
                </text>
              </g>
            );
          })}
          {/* панорамное окно гостиной */}
          <path d={`M${boxes[0].w * 0.15} ${H + 3}h${boxes[0].w * 0.7}`} stroke="#8fb1c6" strokeWidth="5" />
        </svg>
        <p className="mt-3 text-[12px] text-muted">{t("note")}</p>
      </div>

      <div>
        <p className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">{floorName(floors[f].key)}</p>
        <p className="mt-2 font-display text-[40px] leading-none font-semibold tracking-[-0.04em]">
          {Math.round(area)} <span className="text-[18px] font-normal text-muted">{tc("m2")}</span>
        </p>
        <ul className="mt-6 divide-y divide-ink/8 border-y border-ink/8">
          {floors[f].rooms.map((r) => (
            <li key={r.key + (r.n ?? "")} className="flex items-baseline justify-between py-3 text-[15px]">
              <span>{roomName(r)}</span>
              <span className="font-display text-[13px] text-muted">{r.area.toLocaleString("ru-RU")} {tc("m2")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
