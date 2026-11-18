"use client";

import { useEffect, useState, type RefObject } from "react";

/** true, когда элемент подошёл к экрану на `margin` — для ленивого монтирования тяжёлого SVG. */
export function useNearViewport(ref: RefObject<Element | null>, margin = "600px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, near]);
  return near;
}
