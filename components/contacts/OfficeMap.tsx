"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { offices } from "@/data/contacts";
import { useNearViewport } from "@/components/ui/useNearViewport";

const widget = (lat: number, lon: number) => `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=12&pt=${lon}%2C${lat}%2Cpm2dgl&l=map`;

/**
 * Карта офисов: виджет Яндекс Карт (без ключа), тонированный под графит сайта.
 * Iframe монтируется на подходе к экрану, переключатель городов — сверху.
 * Плашки и копирайт Яндекса не перекрываем: адрес и маршрут — в карточках офисов ниже.
 */
export function OfficeMap() {
  const t = useTranslations("contacts");
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref, "300px");
  const o = offices[i];
  const city = t(`offices.${o.id}.city`);

  return (
    <div ref={ref} className="relative min-h-[380px] overflow-hidden rounded-[calc(var(--radius-section)-10px)] bg-graphite lg:min-h-[560px]">
      {near && (
        <iframe
          key={o.id}
          src={widget(o.lat, o.lon)}
          title={t("mapTitle", { city })}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full animate-[quizChip_.8s_var(--ease-ui)] border-0 [filter:grayscale(1)_contrast(1.05)_brightness(.92)]"
        />
      )}
      <div className="glass absolute top-3 left-3 flex gap-1 rounded-full p-1" role="tablist" aria-label={t("mapAria")}>
        {offices.map((x, k) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`h-9 rounded-full px-4 text-[14px] font-medium transition-colors ${k === i ? "bg-ink text-white" : "text-ink hover:bg-white/70"}`}
          >
            {t(`offices.${x.id}.city`)}
          </button>
        ))}
      </div>
    </div>
  );
}
