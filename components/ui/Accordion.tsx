"use client";

import { useId, useState } from "react";
import { Icon } from "./Icon";

/**
 * Плавный аккордеон: высота раскрывается через grid-template-rows 0fr → 1fr (550ms),
 * содержимое проявляется с fade и лёгким подъёмом, плюс плавно поворачивается в крестик.
 */
export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const uid = useId();

  return (
    <ul className="flex flex-col gap-2">
      {items.map((it, i) => {
        const on = open === i;
        const pid = `${uid}-p${i}`;
        const bid = `${uid}-b${i}`;
        return (
          <li
            key={it.q}
            className={`rounded-[20px] border transition-[background-color,border-color,box-shadow] duration-[var(--dur-expand)] ${
              on ? "border-white bg-white shadow-[0_20px_50px_-30px_rgba(20,21,24,.25)]" : "border-ink/8 bg-transparent hover:bg-white/60"
            }`}
          >
            <h3>
              <button
                id={bid}
                type="button"
                aria-expanded={on}
                aria-controls={pid}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left text-[17px] font-medium tracking-[-0.01em] md:px-6"
              >
                {it.q}
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-[var(--dur-expand)] ${
                    on ? "rotate-45 bg-dark text-white" : "bg-white text-ink ring-1 ring-ink/10"
                  }`}
                >
                  <Icon name="plus" className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={pid}
              role="region"
              aria-labelledby={bid}
              className={`grid transition-[grid-template-rows] duration-[var(--dur-expand)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-[60ch] px-5 pb-6 text-[15px] leading-relaxed text-muted transition-[opacity,transform] duration-500 md:px-6 ${
                    on ? "translate-y-0 opacity-100 delay-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  {it.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
