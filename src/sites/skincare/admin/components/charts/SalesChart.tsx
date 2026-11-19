"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { formatCompactINR, formatNumber } from "@/sites/skincare/admin/lib/format";
import { niceMax, type Bucket, type SeriesPoint } from "@/sites/skincare/admin/lib/metrics";
import { formatINR } from "@/sites/skincare/lib/pricing";

const W = 1000;
const H = 260;
const LINE = "#2f5d50";
const PREV = "#a8a29e";

/**
 * Revenue over time as an area line, with last period as a quiet grey line. Hover or focus
 * the chart and use the arrow keys to read each point; the same numbers are in a table below.
 */
export default function SalesChart({
  buckets,
  current,
  previous,
  lastIndex,
  compareLabel,
}: {
  buckets: Bucket[];
  current: SeriesPoint[];
  previous?: SeriesPoint[];
  /** Points after this index are in the future (today's later hours) and are not drawn. */
  lastIndex: number;
  compareLabel: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const descId = useId();
  const n = buckets.length;
  const showPrev = Boolean(previous && previous.some((p) => p.revenue > 0));
  const peak = Math.max(
    1,
    ...current.slice(0, lastIndex + 1).map((p) => p.revenue),
    ...(showPrev && previous ? previous.map((p) => p.revenue) : []),
  );
  const step = niceMax(peak / 4);
  const max = step * 4;
  const ticks = [0, 1, 2, 3, 4].map((k) => k * step);
  const x = (i: number) => (n <= 1 ? W / 2 : (i / (n - 1)) * W);
  const y = (v: number) => H - (v / max) * H;
  const xPct = (i: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100);

  const drawn = current.slice(0, lastIndex + 1);
  const line = drawn
    .map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.revenue).toFixed(1)}`)
    .join(" ");
  const area = drawn.length
    ? `${line} L${x(drawn.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`
    : "";
  const prevLine =
    showPrev && previous
      ? previous
          .map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.revenue).toFixed(1)}`)
          .join(" ")
      : "";

  const labelEvery = n > 24 ? 5 : n > 12 ? 3 : 1;
  const labelIndexes = buckets
    .map((_, i) => i)
    .filter(
      (i) => i === n - 1 || (i % labelEvery === 0 && n - 1 - i >= Math.ceil(labelEvery * 0.6)),
    );
  const totals = drawn.reduce((s, p) => s + p.revenue, 0);

  const pointAt = (clientX: number) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.min(lastIndex, Math.round(ratio * (n - 1)));
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => setActive(pointAt(e.clientX));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowUp: 1,
      ArrowDown: -1,
    };
    if (e.key in keys) {
      e.preventDefault();
      setActive((a) => Math.min(lastIndex, Math.max(0, (a ?? lastIndex) + keys[e.key])));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(lastIndex);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };

  const a =
    active !== null
      ? { i: active, bucket: buckets[active], point: current[active], prev: previous?.[active] }
      : null;

  return (
    <div>
      <div className="flex gap-3">
        {/* y axis */}
        <div
          aria-hidden
          className="relative w-12 shrink-0 text-right text-[0.6875rem] text-stone-500 tabular-nums"
          style={{ height: 240 }}
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${100 - (t / max) * 100}%` }}
            >
              {t === 0 ? "₹0" : formatCompactINR(t)}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div
            ref={plotRef}
            role="group"
            tabIndex={0}
            aria-roledescription="chart"
            aria-label={`Revenue by ${n === 24 ? "hour" : "day"}. Use the left and right arrow keys to read each point.`}
            aria-describedby={descId}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive((v) => v ?? lastIndex)}
            onBlur={() => setActive(null)}
            onKeyDown={onKeyDown}
            className="relative cursor-crosshair rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-skin-accent"
            style={{ height: 240 }}
          >
            {/* gridlines */}
            {ticks.map((t) => (
              <div
                key={t}
                aria-hidden
                className={cn(
                  "absolute inset-x-0 h-px",
                  t === 0 ? "bg-stone-300" : "bg-stone-200/70",
                )}
                style={{ top: `${100 - (t / max) * 100}%` }}
              />
            ))}
            <svg
              aria-hidden
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {prevLine ? (
                <path
                  d={prevLine}
                  fill="none"
                  stroke={PREV}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : null}
              {area ? <path d={area} fill={LINE} fillOpacity={0.1} /> : null}
              {line ? (
                <path
                  d={line}
                  fill="none"
                  stroke={LINE}
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : null}
            </svg>
            {/* end marker */}
            {drawn.length ? (
              <span
                aria-hidden
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
                style={{
                  left: `${xPct(lastIndex)}%`,
                  top: `${(y(current[lastIndex]?.revenue ?? 0) / H) * 100}%`,
                  background: LINE,
                }}
              />
            ) : null}
            {a ? (
              <>
                <div
                  aria-hidden
                  className="absolute inset-y-0 w-px bg-stone-400/70"
                  style={{ left: `${xPct(a.i)}%` }}
                />
                <span
                  aria-hidden
                  className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
                  style={{
                    left: `${xPct(a.i)}%`,
                    top: `${(y(a.point.revenue) / H) * 100}%`,
                    background: LINE,
                  }}
                />
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-2 z-10 w-max min-w-40 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs shadow-lg",
                    xPct(a.i) > 60 ? "-translate-x-[calc(100%+12px)]" : "translate-x-3",
                  )}
                  style={{ left: `${xPct(a.i)}%` }}
                >
                  <p className="font-medium text-stone-900">{a.bucket.long}</p>
                  <p className="mt-1 flex items-center justify-between gap-4 text-stone-700">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-0.5 w-3 rounded" style={{ background: LINE }} />
                      Revenue
                    </span>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      {formatINR(a.point.revenue)}
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center justify-between gap-4 text-stone-600">
                    <span className="pl-[18px]">Orders</span>
                    <span className="tabular-nums">{formatNumber(a.point.orders)}</span>
                  </p>
                  {showPrev && a.prev ? (
                    <p className="mt-1 flex items-center justify-between gap-4 border-t border-stone-100 pt-1 text-stone-600">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-0.5 w-3 rounded" style={{ background: PREV }} />
                        Previous
                      </span>
                      <span className="tabular-nums">{formatINR(a.prev.revenue)}</span>
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
          {/* x axis */}
          <div aria-hidden className="relative mt-2 h-4 text-[0.6875rem] text-stone-500">
            {labelIndexes.map((i, k) => (
              <span
                key={buckets[i].start}
                className={cn(
                  "absolute whitespace-nowrap",
                  i === 0
                    ? "translate-x-0"
                    : i === n - 1
                      ? "-translate-x-full"
                      : "-translate-x-1/2",
                  k % 2 === 1 && i !== n - 1 && "max-sm:hidden",
                )}
                style={{ left: `${xPct(i)}%` }}
              >
                {buckets[i].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-0.5 w-4 rounded" style={{ background: LINE }} />
            This period
          </span>
          {showPrev ? (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-0.5 w-4 rounded" style={{ background: PREV }} />
              Previous period ({compareLabel.replace(/^vs /, "")})
            </span>
          ) : null}
        </div>
        <p id={descId} className="sr-only" aria-live="polite">
          {a
            ? `${a.bucket.long}: ${formatINR(a.point.revenue)} from ${a.point.orders} ${a.point.orders === 1 ? "order" : "orders"}.`
            : `Total ${formatINR(totals)}.`}
        </p>
      </div>

      <details className="group mt-3 text-sm">
        <summary className="inline-flex cursor-pointer items-center rounded text-[0.8125rem] font-medium text-skin-accent hover:underline">
          Show chart data as a table
        </summary>
        <div className="mt-2 max-h-72 overflow-auto rounded-lg border border-stone-200">
          <table className="w-full text-left text-[0.8125rem] tabular-nums">
            <thead className="sticky top-0 bg-stone-50 text-stone-600">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  {n === 24 ? "Hour" : "Day"}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  Orders
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  Revenue
                </th>
                {showPrev ? (
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    Previous period
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {buckets.slice(0, lastIndex + 1).map((b, i) => (
                <tr key={b.start}>
                  <th scope="row" className="px-3 py-1.5 font-normal text-stone-700">
                    {b.long}
                  </th>
                  <td className="px-3 py-1.5 text-right">{current[i].orders}</td>
                  <td className="px-3 py-1.5 text-right">{formatINR(current[i].revenue)}</td>
                  {showPrev ? (
                    <td className="px-3 py-1.5 text-right text-stone-600">
                      {formatINR(previous?.[i]?.revenue ?? 0)}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
