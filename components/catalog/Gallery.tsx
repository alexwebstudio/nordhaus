"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Visual as V } from "@/data/types";
import { Visual } from "@/components/ui/Visual";

/** Галерея проекта: большой кадр + миниатюры. Смена кадра — clip-path снизу вверх (плавно, ~1s). */
export function Gallery({ items }: { items: { visual: V; caption: string }[] }) {
  const t = useTranslations("project.gallery");
  const [i, setI] = useState(0);
  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-dark md:aspect-[16/10]">
        {items.map((it, k) => (
          <div
            key={k}
            aria-hidden={k !== i}
            className="absolute inset-0 transition-[clip-path,transform] duration-1000"
            style={{
              clipPath: k === i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
              transform: k === i ? "scale(1)" : "scale(1.05)",
              zIndex: k === i ? 2 : 1,
            }}
          >
            <Visual visual={it.visual} sizes="(max-width: 1024px) 100vw, 60vw" priority={k === 0} />
          </div>
        ))}
        <p className="glass absolute bottom-4 left-4 z-10 rounded-full px-4 py-1.5 text-[13px] font-medium">{items[i].caption}</p>
        <p className="font-brand absolute top-4 right-4 z-10 rounded-full bg-graphite/60 px-3 py-1 text-[11px] text-white backdrop-blur-md">
          {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
      </div>
      <ul className="mt-3 grid grid-cols-4 gap-2" aria-label={t("aria")}>
        {items.map((it, k) => (
          <li key={k}>
            <button
              type="button"
              onClick={() => setI(k)}
              aria-label={it.caption}
              aria-pressed={k === i}
              className={`relative block aspect-[4/3] w-full overflow-hidden rounded-[14px] transition-[opacity,box-shadow] ${
                k === i ? "ring-2 ring-ink ring-offset-2 ring-offset-bg" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Visual visual={it.visual} sizes="160px" compact />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
