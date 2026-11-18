const paths: Record<string, string> = {
  shield: "M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3zm-3 9l2 2 4-4",
  compass: "M4 20L14 4M14 4l6 6M14 4l-2 6 6 2M8 14l3 3M4 20h6",
  calendar: "M4 7h16v13H4zM4 11h16M8 3v4M16 3v4M8 15h3",
  support: "M4 13v-1a8 8 0 0116 0v1M4 13h3v5H5a1 1 0 01-1-1v-4zM20 13h-3v5h2a1 1 0 001-1v-4zM17 18c0 2-2 3-5 3",
  plus: "M12 5v14M5 12h14",
  arrowUpRight: "M7 17L17 7M17 7H8.5M17 7v8.5",
  chevronLeft: "M15 6l-6 6 6 6",
  chevronRight: "M9 6l6 6-6 6",
  area: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  bed: "M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 14h18M7 9V7a1 1 0 011-1h3a1 1 0 011 1v2",
  floors: "M4 20h16M6 20V10l6-5 6 5v10M10 20v-5h4v5M6 13h12",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  quote: "M9 7H5v6h4l-2 4M19 7h-4v6h4l-2 4",
  check: "M5 12.5l4.5 4.5L19 7.5",
  doc: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
  pin: "M12 21s-6-5.5-6-11a6 6 0 0112 0c0 5.5-6 11-6 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  wallet: "M4 7h15a1 1 0 011 1v11H5a1 1 0 01-1-1zM4 7l11-3v3M16 13h1.5",
  bank: "M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18",
  split: "M4 12h6M14 12h6M12 4v16M7 8l-3 4 3 4M17 8l3 4-3 4",
  close: "M6 6l12 12M18 6L6 18",
  arrowLeft: "M19 12H5m0 0l6-6m-6 6l6 6",
  gift: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1s5 1 5 1zM12 7c1.5-3 5-3.5 5-1s-5 1-5 1z",
  whatsapp: "M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z",
  telegram: "M21 4L3 11l6 2 2 6 3-4 5 4zM9 13l8-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z",
  home: "M4 11 12 4l8 7M6.5 9.5V20h11V9.5M10 20v-5h4v5",
  sun: "M12 16a4 4 0 100-8 4 4 0 000 8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
  steam: "M4 20h16M6 20v-7h12v7M9 9c-1-1.5 1-2.5 0-4M12 9c-1-1.5 1-2.5 0-4M15 9c-1-1.5 1-2.5 0-4",
  key: "M14.5 9.5a4 4 0 11-1.2-2.8M13.3 6.7 20 13.4M17 10.4l2-2M18.6 12l1.4-1.4",
  level1: "M3 20h18M5 20v-8h14v8M3 12l9-6 9 6",
  attic: "M3 20h18M5 20v-7h14v7M3 13l9-8 9 8M10 10h4",
  level2: "M3 20h18M5 20V7h14v13M5 13.5h14M3 7h18",
  star: "M12 4l2.4 5 5.4.7-4 3.8 1 5.4L12 16.3 7.2 18.9l1-5.4-4-3.8 5.4-.7z",
};

export function Icon({ name, className = "size-5", strokeWidth = 1.6 }: { name: keyof typeof paths | string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}
