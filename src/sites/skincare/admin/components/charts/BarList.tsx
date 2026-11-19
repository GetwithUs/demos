import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BarRow = {
  key: string;
  label: ReactNode;
  value: number;
  /** Shown at the end of the row; defaults to the value. */
  display?: ReactNode;
  /** Secondary figure, e.g. order count. */
  sub?: ReactNode;
  href?: string;
  color?: string;
};

/**
 * Horizontal bars with the label above and the value at the end. Every value is printed, so
 * the list doubles as the chart's text version.
 */
export default function BarList({
  rows,
  color = "#2f5d50",
  className,
  empty = "Nothing to show for this period.",
  dense = false,
}: {
  rows: BarRow[];
  color?: string;
  className?: string;
  empty?: string;
  /** Tighter rows for long lists in short cards. */
  dense?: boolean;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length || rows.every((r) => r.value === 0)) {
    return <p className="py-6 text-center text-sm text-stone-500">{empty}</p>;
  }
  return (
    <ul className={cn(dense ? "space-y-1.5" : "space-y-3", className)}>
      {rows.map((r) => {
        const content = (
          <>
            <div className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
              <span className="min-w-0 truncate text-stone-800">{r.label}</span>
              <span className="shrink-0 text-stone-900 tabular-nums">
                {r.sub ? <span className="mr-2 text-stone-500">{r.sub}</span> : null}
                <span className="font-medium">{r.display ?? r.value}</span>
              </span>
            </div>
            <div
              aria-hidden
              className={cn("rounded-full bg-stone-100", dense ? "mt-1 h-1.5" : "mt-1.5 h-2")}
            >
              <div
                className={cn("rounded-full", dense ? "h-1.5" : "h-2")}
                style={{
                  width: `${Math.max(r.value > 0 ? 2 : 0, (r.value / max) * 100)}%`,
                  background: r.color ?? color,
                }}
              />
            </div>
          </>
        );
        return (
          <li key={r.key}>
            {r.href ? (
              <Link href={r.href} className="-mx-2 block rounded-lg px-2 py-1 hover:bg-stone-50">
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
