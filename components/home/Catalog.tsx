"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { catalog } from "@/data/catalog";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Panel, SectionHead } from "@/components/ui/Section";
import { PillButton } from "@/components/ui/PillButton";
import { Icon } from "@/components/ui/Icon";

/** Горизонтальный слайдер: нативный scroll-snap + drag мышью + стрелки-кружки + прогресс. */
export function Catalog() {
  const t = useTranslations("home.catalog");
  const tc = useTranslations("common");
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current!;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });

    // drag мышью (touch — нативный)
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) {
        moved = true;
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.cursor = "";
      if (moved) {
        // мягко «доснапить» к ближайшей карточке
        const card = el.firstElementChild as HTMLElement;
        const step = card.offsetWidth + 12;
        const target = Math.round(el.scrollLeft / step) * step;
        el.scrollTo({ left: target, behavior: "smooth" });
        setTimeout(() => (el.style.scrollSnapType = ""), 450);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current!;
    const card = el.firstElementChild as HTMLElement;
    el.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: "smooth" });
  };

  return (
    <Panel className="overflow-hidden py-14 md:py-20" aria-label={t("title")}>
      <SectionHead
        className="px-5 md:px-12"
        label={t("label")}
        title={t("title")}
        aside={
          <p className="max-w-[300px] text-[15px] leading-snug text-muted md:text-right">
            <span className="text-ink">{t("asideStrong")}</span> {t("asideText")}
          </p>
        }
      />

      <ul
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] md:scroll-px-12 md:px-12 [&::-webkit-scrollbar]:hidden cursor-grab select-none"
        aria-label={t("listAria")}
      >
        {catalog.map((p) => (
          <li key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[calc((100%-36px)/4)] lg:min-w-[300px]">
            <ProjectCard p={p} sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 25vw" />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-6 px-5 md:px-12">
        <PillButton href="/catalog">{tc("toCatalog")}</PillButton>
        <div className="hidden h-px flex-1 bg-ink/10 sm:block" aria-hidden>
          <div className="h-px origin-left bg-ink transition-transform duration-500" style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              disabled={d === -1 ? edges.start : edges.end}
              aria-label={d === -1 ? t("prev") : t("next")}
              className="grid size-12 place-items-center rounded-full bg-white text-ink shadow-[0_8px_24px_-12px_rgba(0,0,0,.3)] transition-[background-color,color,opacity] hover:bg-dark hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-ink"
            >
              <Icon name={d === -1 ? "chevronLeft" : "chevronRight"} className="size-5" />
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
