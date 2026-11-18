/**
 * Архитектурный чертёж каркасного дома во фронтальной диметрии:
 * фасад без искажений, глубина уходит вверх-вправо под 30° с коэффициентом 0.5.
 * Генерируется из 3D-координат (метры). Каждый элемент — отдельный path с data-stage,
 * чтобы прорисовывать по скроллу в порядке стройки:
 *   0 обвязка (сваи, нижняя обвязка, лаги) → 1 стойки → 2 верхняя обвязка →
 *   3 перекрытие → 4 стропила → 5 раскосы и проёмы.
 */
type P3 = [number, number, number]; // x — вдоль фасада, y — вверх, z — вглубь

const L = 10; // длина, м
const W = 7; // ширина
const H = 3; // высота стены
const R = 2.3; // подъём конька
const O = 0.45; // свес кровли
const S = 40; // px на метр
const K = 0.5; // сокращение глубины
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

const proj = ([x, y, z]: P3): [number, number] => [x * S + z * S * K * COS, -y * S - z * S * K * SIN];

/** проёмы на фасаде (z = 0): [x0, x1, низ, верх] */
const DOOR = [4.4, 5.4, 0, 2.1] as const;
const WIN1 = [1.2, 2.8, 0.9, 2.1] as const;
const WIN2 = [6.6, 8.8, 0.9, 2.1] as const;
/** окно на правом торце (x = L): [z0, z1, низ, верх] */
const WIN3 = [2.6, 4.4, 0.9, 2.1] as const;

export type Seg = { a: P3; b: P3; stage: number; minor?: boolean };

const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let v = from; v <= to + 1e-6; v += step) out.push(Math.round(v * 1000) / 1000);
  return out;
};
const inOpening = (v: number, [a, b]: readonly [number, number, ...number[]]) => v > a + 1e-3 && v < b - 1e-3;

export function buildFrame(detail: "full" | "simple"): Seg[] {
  const s = detail === "full" ? 0.6 : 1.2;
  const out: Seg[] = [];
  const add = (a: P3, b: P3, stage: number, minor = false) => out.push({ a, b, stage, minor });

  /* 0 — сваи, нижняя обвязка, лаги пола */
  for (const x of [0, L / 2, L]) for (const z of [0, W / 2, W]) add([x, -0.55, z], [x, 0, z], 0);
  add([0, 0, 0], [L, 0, 0], 0);
  add([L, 0, 0], [L, 0, W], 0);
  add([L, 0, W], [0, 0, W], 0);
  add([0, 0, W], [0, 0, 0], 0);
  if (detail === "full") for (const x of range(s, L - s, s)) add([x, 0, 0], [x, 0, W], 0, true);

  /* 1 — стойки (в проёмах — только крайние, сами проёмы обрамляем на этапе 5) */
  const frontX = [...new Set([...range(0, L, s), DOOR[0], DOOR[1], WIN1[0], WIN1[1], WIN2[0], WIN2[1]])].sort((a, b) => a - b);
  for (const x of frontX) if (![DOOR, WIN1, WIN2].some((o) => inOpening(x, o))) add([x, 0, 0], [x, H, 0], 1);
  for (const x of range(0, L, s)) add([x, 0, W], [x, H, W], 1);
  for (const z of range(s, W - s, s)) add([0, 0, z], [0, H, z], 1);
  const sideZ = [...new Set([...range(s, W - s, s), WIN3[0], WIN3[1]])].sort((a, b) => a - b);
  for (const z of sideZ) if (!inOpening(z, WIN3)) add([L, 0, z], [L, H, z], 1);

  /* 2 — верхняя обвязка (двойная доска) */
  for (const y of [H, H - 0.1]) {
    add([0, y, 0], [L, y, 0], 2);
    add([L, y, 0], [L, y, W], 2);
    add([L, y, W], [0, y, W], 2);
    add([0, y, W], [0, y, 0], 2);
  }

  /* 3 — перекрытие: балки поперёк дома */
  for (const x of range(s, L - s, s)) add([x, H, 0], [x, H, W], 3, true);

  /* 4 — стропильные пары, конёк, затяжки */
  const zc = W / 2;
  const rafterX = range(0, L, detail === "full" ? s : s);
  rafterX.forEach((x, i) => {
    add([x, H - (O * R) / zc, -O], [x, H + R, zc], 4);
    add([x, H + R, zc], [x, H - (O * R) / zc, W + O], 4);
    if (i % 2 === 0 && detail === "full") add([x, H + R * 0.45, zc * 0.45], [x, H + R * 0.45, W - zc * 0.45], 4, true);
  });
  add([-0.3, H + R, zc], [L + 0.3, H + R, zc], 4);

  /* 5 — раскосы и обрамление проёмов */
  add([0, 0.05, 0], [1.1, H - 0.1, 0], 5);
  add([L, 0.05, 0], [L - 1.1, H - 0.1, 0], 5);
  add([0, 0.05, W], [0, H - 0.1, W - 1.4], 5);
  add([L, 0.05, W], [L, H - 0.1, W - 1.4], 5);
  for (const [x0, x1, lo, hi] of [WIN1, WIN2, DOOR]) {
    add([x0, hi, 0], [x1, hi, 0], 5);
    add([x0, hi + 0.12, 0], [x1, hi + 0.12, 0], 5);
    if (lo > 0) add([x0, lo, 0], [x1, lo, 0], 5);
    if (detail === "full") {
      for (const x of range(x0 + s / 2, x1 - s / 4, s / 1.5)) {
        add([x, hi + 0.12, 0], [x, H - 0.1, 0], 5, true);
        if (lo > 0) add([x, 0, 0], [x, lo, 0], 5, true);
      }
    }
  }
  add([L, WIN3[3], WIN3[0]], [L, WIN3[3], WIN3[1]], 5);
  add([L, WIN3[2], WIN3[0]], [L, WIN3[2], WIN3[1]], 5);
  return out;
}

/** опорные точки выносок (по этапам) и смещение подписи, px */
const CALLOUTS: { at: P3; dx: number; dy: number; anchor: "start" | "end" }[] = [
  { at: [2.2, 0, 0], dx: -40, dy: 48, anchor: "end" },
  { at: [0, 1.6, 0], dx: -36, dy: -10, anchor: "end" },
  { at: [L, H, W * 0.55], dx: 54, dy: -6, anchor: "start" },
  { at: [L * 0.82, H, W * 0.5], dx: 70, dy: -40, anchor: "start" },
  { at: [1.2, H + R * 0.62, W * 0.27], dx: -60, dy: -44, anchor: "end" },
  { at: [L - 0.5, H * 0.55, 0], dx: 70, dy: 34, anchor: "start" },
];

export function FrameDrawing({
  detail,
  callouts = [],
  dimLength,
  dimHeight,
  label,
  className = "",
}: {
  detail: "full" | "simple";
  callouts?: string[];
  dimLength: string;
  dimHeight: string;
  label: string;
  className?: string;
}) {
  const segs = buildFrame(detail);
  const pts = segs.flatMap((s) => [proj(s.a), proj(s.b)]);
  const pad = detail === "full" ? 150 : 40;
  const minX = Math.min(...pts.map((p) => p[0])) - pad;
  const maxX = Math.max(...pts.map((p) => p[0])) + pad;
  const minY = Math.min(...pts.map((p) => p[1])) - (detail === "full" ? 60 : 20);
  const maxY = Math.max(...pts.map((p) => p[1])) + 70;
  const f = (n: number) => n.toFixed(1);

  // размерные линии: длина под фасадом, высота слева
  const [lx0, ly] = proj([0, -0.55, 0]);
  const [lx1] = proj([L, -0.55, 0]);
  const dimY = ly + 34;
  const [hx, hy0] = proj([0, 0, 0]);
  const [, hy1] = proj([0, H, 0]);
  const dimX = hx - 34;

  return (
    <svg viewBox={`${f(minX)} ${f(minY)} ${f(maxX - minX)} ${f(maxY - minY)}`} className={className} fill="none" role="img" aria-label={label}>
      {segs.map((s, i) => {
        const [x1, y1] = proj(s.a);
        const [x2, y2] = proj(s.b);
        return (
          <path
            key={i}
            data-seg
            data-stage={s.stage}
            d={`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`}
            pathLength={1}
            strokeDasharray="1 1"
            stroke="#3A3E45"
            strokeOpacity={s.minor ? 0.55 : 1}
            strokeWidth={s.minor ? 0.9 : 1.25}
            strokeLinecap="round"
          />
        );
      })}

      {/* размерные линии в стиле чертежа */}
      <g data-dim="0" stroke="#7A7E86" strokeWidth={0.9} fontFamily="var(--font-brand)" fontSize={11} fill="#686C74">
        <path d={`M${f(lx0)} ${f(dimY)}H${f(lx1)}M${f(lx0)} ${f(dimY - 6)}v12M${f(lx1)} ${f(dimY - 6)}v12M${f(lx0)} ${f(ly + 6)}V${f(dimY + 6)}M${f(lx1)} ${f(ly + 6)}V${f(dimY + 6)}`} />
        <text x={f((lx0 + lx1) / 2)} y={f(dimY - 8)} textAnchor="middle" stroke="none">
          {dimLength}
        </text>
      </g>
      <g data-dim="1" stroke="#7A7E86" strokeWidth={0.9} fontFamily="var(--font-brand)" fontSize={11} fill="#686C74">
        <path d={`M${f(dimX)} ${f(hy0)}V${f(hy1)}M${f(dimX - 6)} ${f(hy0)}h12M${f(dimX - 6)} ${f(hy1)}h12`} />
        <text x={f(dimX - 8)} y={f((hy0 + hy1) / 2)} textAnchor="middle" stroke="none" transform={`rotate(-90 ${f(dimX - 8)} ${f((hy0 + hy1) / 2)})`}>
          {dimHeight}
        </text>
      </g>

      {/* выносные подписи: появляются Blur In на своём этапе */}
      {callouts.map((text, i) => {
        const c = CALLOUTS[i];
        const [ax, ay] = proj(c.at);
        const ex = ax + c.dx;
        const ey = ay + c.dy;
        const tx = ex + (c.anchor === "start" ? 6 : -6);
        return (
          <g key={i} data-callout={i}>
            <path d={`M${f(ax)} ${f(ay)}L${f(ex)} ${f(ey)}`} stroke="#B07A4F" strokeWidth={0.9} />
            <text x={f(tx)} y={f(ey + 4)} textAnchor={c.anchor} fontSize={12.5} fill="#2A2D32" fontFamily="var(--font-sans)" fontWeight={500}>
              {text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
