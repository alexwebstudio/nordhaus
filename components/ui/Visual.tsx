import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Visual as V } from "@/data/types";
import { Placeholder } from "./Placeholder";

/** Фото (next/image, cover) или плейсхолдер. Родитель задаёт размер и position: relative. */
export function Visual({
  visual,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  priority,
  compact,
}: {
  visual: V;
  sizes?: string;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const t = useTranslations();
  if (visual.kind === "photo") {
    return (
      <Image
        src={visual.src}
        alt={t(visual.altKey)}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
        style={{ objectPosition: visual.position ?? "50% 50%" }}
      />
    );
  }
  return <Placeholder label={t(visual.labelKey)} ratio={visual.ratio} size={visual.size} compact={compact} className={className} />;
}
