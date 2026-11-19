/**
 * A QR-style code drawn in SVG for the demo UPI payment. It looks like a real QR (finder
 * squares, a quiet zone, random modules) but encodes nothing, so it cannot be paid.
 */
const N = 29;

/** Pseudo-random modules from a seed (FNV hash into xorshift), skipping finders and the logo. */
function qrCells(seed: string): [number, number][] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  const cells: [number, number][] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue;
      if (x > 11 && x < 17 && y > 11 && y < 17) continue;
      if (rand() > 0.52) cells.push([x, y]);
    }
  }
  return cells;
}

export default function UpiQr({ seed, size = 168 }: { seed: string; size?: number }) {
  const n = N;
  const cells = qrCells(seed);
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} fill="#111" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#111" />
    </g>
  );
  return (
    <svg
      viewBox={`-2 -2 ${n + 4} ${n + 4}`}
      width={size}
      height={size}
      role="img"
      aria-label="Demo UPI QR code (cannot be paid)"
      shapeRendering="crispEdges"
    >
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#111" />
      ))}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
      <rect x={12.2} y={12.2} width={4.6} height={4.6} rx={1} fill="#2f5d50" />
      <path
        d="M14.5 13.1c.9 1.1 1.5 1.9 1.5 2.7a1.5 1.5 0 0 1-3 0c0-.8.6-1.6 1.5-2.7Z"
        fill="#fbf8f3"
      />
    </svg>
  );
}
