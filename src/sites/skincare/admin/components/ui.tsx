"use client";

import { ArrowDownRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Order, OrderStatus } from "@/sites/skincare/data/types";
import { paymentStatusLabel, STATUS_LABEL } from "@/sites/skincare/admin/lib/format";

/* Small building blocks shared by every dashboard page. */

export function Card({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border border-stone-200/90 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.05)]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
  id,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-5 pt-4 pb-3", className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-[0.9375rem] font-semibold text-stone-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-[0.8125rem] text-stone-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

type Variant = "primary" | "secondary" | "ghost" | "danger" | "danger-soft";
type Size = "sm" | "md";

export function buttonClass(
  variant: Variant = "secondary",
  size: Size = "md",
  className?: string,
): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-skin-accent",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    size === "sm" ? "h-8 px-3 text-[0.8125rem]" : "h-10 px-4 text-sm",
    variant === "primary" && "bg-skin-accent text-white shadow-sm hover:bg-skin-accent-hover",
    variant === "secondary" &&
      "border border-stone-300 bg-white text-stone-800 shadow-xs hover:bg-stone-50",
    variant === "ghost" && "text-stone-700 hover:bg-stone-100",
    variant === "danger" && "bg-red-700 text-white shadow-sm hover:bg-red-800",
    variant === "danger-soft" && "border border-red-200 bg-white text-red-700 hover:bg-red-50",
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export type Tone = "neutral" | "green" | "amber" | "blue" | "violet" | "red" | "teal" | "rose";

const TONES: Record<Tone, string> = {
  neutral: "bg-stone-100 text-stone-700 ring-stone-200",
  green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  amber: "bg-amber-50 text-amber-900 ring-amber-200",
  blue: "bg-sky-50 text-sky-900 ring-sky-200",
  violet: "bg-violet-50 text-violet-800 ring-violet-200",
  red: "bg-red-50 text-red-800 ring-red-200",
  teal: "bg-teal-50 text-teal-800 ring-teal-200",
  rose: "bg-rose-50 text-rose-800 ring-rose-200",
};

const DOTS: Record<Tone, string> = {
  neutral: "bg-stone-400",
  green: "bg-emerald-600",
  amber: "bg-amber-500",
  blue: "bg-sky-600",
  violet: "bg-violet-600",
  red: "bg-red-600",
  teal: "bg-teal-600",
  rose: "bg-rose-600",
};

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {dot ? <span aria-hidden className={cn("size-1.5 rounded-full", DOTS[tone])} /> : null}
      {children}
    </span>
  );
}

export const STATUS_TONE: Record<OrderStatus, Tone> = {
  placed: "blue",
  confirmed: "teal",
  packed: "amber",
  shipped: "violet",
  "out-for-delivery": "violet",
  delivered: "green",
  cancelled: "neutral",
  returned: "rose",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <Badge tone={STATUS_TONE[status]} dot className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function PaymentBadge({ order, className }: { order: Order; className?: string }) {
  const label = paymentStatusLabel(order);
  const tone: Tone =
    label === "Paid"
      ? "green"
      : label === "To collect"
        ? "amber"
        : label === "Refunded"
          ? "rose"
          : "neutral";
  return (
    <Badge tone={tone} className={className}>
      {label}
    </Badge>
  );
}

/** Marks orders placed in the shop in this browser. */
export function VisitorBadge({ order }: { order: Order }) {
  if (order.source !== "visitor") return null;
  return (
    <Badge tone="blue" className="bg-skin-accent text-white ring-skin-accent">
      {order.status === "placed" ? "New, from this browser" : "From this browser"}
    </Badge>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-stone-200/70", className)} />;
}

/** A page-sized loading placeholder; announces itself once to screen readers. */
export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="mt-4 h-56 rounded-xl" />
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      {icon ? (
        <div className="mb-3 grid size-11 place-items-center rounded-full bg-stone-100 text-stone-500 [&>svg]:size-5">
          {icon}
        </div>
      ) : null}
      <p className="font-medium text-stone-900">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
  meta,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
  meta?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {back ? (
        <Link
          href={back.href}
          className="mb-2 inline-flex items-center gap-1 rounded text-[0.8125rem] font-medium text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-[1.375rem]">
              {title}
            </h1>
            {meta}
          </div>
          {description ? <p className="mt-1 text-sm text-stone-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export const inputClass = cn(
  "block h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 shadow-xs",
  "placeholder:text-stone-400 focus:border-skin-accent focus:outline-2 focus:outline-offset-0 focus:outline-skin-accent/25",
  "disabled:bg-stone-50 disabled:text-stone-500 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus:outline-red-600/25",
);

export const selectClass = cn(
  inputClass,
  "appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9",
);

/** Down-chevron for native selects, as an inline SVG data URL (no network). */
export const SELECT_CHEVRON = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
} as const;

export function Select({ className, style, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(selectClass, className)}
      style={{ ...SELECT_CHEVRON, ...style }}
      {...props}
    />
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.8125rem] font-medium text-stone-800">
        {label}
        {required ? (
          <span aria-hidden className="text-red-700">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[0.8125rem] text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[0.8125rem] text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** aria props tying an input to its Field hint or error. */
export function describedBy(id: string, { error, hint }: { error?: string; hint?: boolean }) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  id: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-stone-900">
          {label}
        </label>
        {description ? (
          <p id={`${id}-desc`} className="mt-0.5 text-[0.8125rem] text-stone-500">
            {description}
          </p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-skin-accent disabled:opacity-50",
          checked ? "bg-skin-accent" : "bg-stone-300",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

/** A row of mutually exclusive buttons (date ranges, views). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex rounded-lg border border-stone-300 bg-white p-0.5 shadow-xs",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[0.8125rem] font-medium whitespace-nowrap transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-skin-accent",
            o.value === value
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** "+12.4%" in green or "-3.1%" in red, with an arrow; null shows a neutral note. */
export function Delta({
  value,
  unit = "%",
  goodWhenDown = false,
  emptyLabel = "No earlier data",
}: {
  value: number | null;
  unit?: "%" | "pts";
  goodWhenDown?: boolean;
  emptyLabel?: string;
}) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="text-xs text-stone-500">{emptyLabel}</span>;
  }
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) return <span className="text-xs font-medium text-stone-600">No change</span>;
  const up = rounded > 0;
  const good = goodWhenDown ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        good ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800",
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      <span className="sr-only">{up ? "Up" : "Down"} </span>
      {Math.abs(rounded).toFixed(1)}
      {unit === "%" ? "%" : " pts"}
    </span>
  );
}

/** Checkbox styled for tables. */
export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4 cursor-pointer rounded border-stone-400 accent-skin-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-skin-accent",
        className,
      )}
      {...props}
    />
  );
}
