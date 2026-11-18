/** DEMO: структура слоёв стены и сравнения. Тексты — в messages/*.json → technology. */

export const wallLayers = [
  { id: "facade", mm: 20, color: "#B07A4F", texture: "wood" },
  { id: "vent", mm: 40, color: "#E7E1D9", texture: "gap" },
  { id: "wind", mm: 1, color: "#3F6E8C", texture: "membrane" },
  { id: "outer", mm: 50, color: "#E9D27A", texture: "wool" },
  { id: "frame", mm: 200, color: "#D8B98F", texture: "frame" },
  { id: "vapor", mm: 1, color: "#8E9AA6", texture: "membrane" },
  { id: "install", mm: 50, color: "#F1ECE6", texture: "gap" },
  { id: "inner", mm: 13, color: "#FAFAFA", texture: "board" },
] as const;

export const wallTotal = wallLayers.reduce((s, l) => s + l.mm, 0);

/** какая колонка сравнения — наша (подсвечивается) */
export const comparisonWin = [true, false, false];
