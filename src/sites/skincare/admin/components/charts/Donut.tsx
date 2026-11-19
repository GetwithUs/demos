"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DonutSegment = {
  key: string;
  label: string;
  value: number;
  color: string;
  /** Extra text for the legend row, e.g. revenue. */
  detail?: ReactNode;
};

const R = 64;
const STROKE = 20;
const C = 2 * Math.PI * R;
const GAP = 2.5;

/**
 * A donut with its legend as a readable list (label, share, count), so the numbers never
 * depend on colour alone. Hovering a legend row highlights its segment.
 */
export default function Donut({
  segments,
  centerLabel,
  centerValue,
  formatValue = (v) => String(v),
  label,
}: {
  segments: DonutSegment[];
  centerLabel: string;
  centerValue: ReactNode;
  formatValue?: (v: number) => string;
  label: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const visible = segments.filter((s) => s.value > 0);
  const active = segments.find((s) => s.key === hover);

  const arcs: (DonutSegment & { len: number; offset: number })[] = [];
  let offset = 0;
  for (const s of visible) {
    const full = (s.value / (total || 1)) * C;
    arcs.push({ ...s, len: visible.length > 1 ? Math.max(0.5, full - GAP) : full, offset });
    offset += full;
  }

  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-5 @sm:flex-row @sm:items-center">
        <div className="relative size-40 shrink-0">
          <svg viewBox="0 0 168 168" className="size-full -rotate-90" role="img" aria-label={label}>
            <circle cx="84" cy="84" r={R} fill="none" stroke="#f0eeea" strokeWidth={STROKE} />
            {arcs.map((a) => (
              <circle
                key={a.key}
                cx="84"
                cy="84"
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={hover === a.key ? STROKE + 4 : STROKE}
                strokeDasharray={`${a.len} ${C - a.len}`}
                strokeDashoffset={-a.offset}
                opacity={hover && hover !== a.key ? 0.35 : 1}
                className="transition-[opacity,stroke-width] duration-150"
                onPointerEnter={() => setHover(a.key)}
                onPointerLeave={() => setHover(null)}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p className="text-[0.6875rem] text-stone-500">{active ? active.label : centerLabel}</p>
            <p className="text-lg font-semibold text-stone-900 tabular-nums">
              {active ? `${total ? Math.round((active.value / total) * 100) : 0}%` : centerValue}
            </p>
          </div>
        </div>
        <ul className="w-full min-w-0 flex-1 space-y-1">
          {segments.map((s) => {
            const pct = total ? (s.value / total) * 100 : 0;
            return (
              <li
                key={s.key}
                onPointerEnter={() => setHover(s.key)}
                onPointerLeave={() => setHover(null)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8125rem] transition-colors",
                  hover === s.key && "bg-stone-50",
                )}
              >
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ background: s.color }}
                />
                <span className="min-w-0 flex-1 truncate text-stone-800">{s.label}</span>
                <span className="text-stone-600 tabular-nums">{formatValue(s.value)}</span>
                <span className="w-11 text-right font-medium text-stone-900 tabular-nums">
                  {Math.round(pct)}%
                </span>
                {s.detail ? (
                  <span className="hidden w-20 text-right text-stone-500 tabular-nums @md:inline">
                    {s.detail}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
