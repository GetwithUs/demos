import { Star } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Badge } from "@/sites/skincare/data/types";
import { discountPercent, formatINR } from "@/sites/skincare/lib/pricing";

/** Shared class strings so buttons look the same everywhere. */
export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-skin-accent disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]",
  primary: "bg-skin-accent text-skin-accent-ink hover:bg-skin-accent-hover",
  dark: "bg-skin-ink text-white hover:bg-black",
  outline: "border border-skin-ink/80 text-skin-ink hover:bg-skin-ink hover:text-white",
  soft: "bg-skin-accent-soft text-skin-accent hover:bg-[#d5e3da]",
  ghost: "text-skin-ink hover:bg-skin-sand",
  lg: "h-12 px-6 text-[0.95rem]",
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
} as const;

export function buttonClass(
  variant: "primary" | "dark" | "outline" | "soft" | "ghost" = "primary",
  size: "lg" | "md" | "sm" = "md",
  extra?: string,
) {
  return cn(btn.base, btn[variant], btn[size], extra);
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: "primary" | "dark" | "outline" | "soft" | "ghost";
  size?: "lg" | "md" | "sm";
}) {
  return <Link {...props} className={buttonClass(variant, size, className)} />;
}

/** Five stars filled to the rating, with the number for screen readers. */
export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
            aria-hidden
          >
            <Star
              className="absolute inset-0 text-skin-sand-2"
              fill="currentColor"
              strokeWidth={0}
              style={{ width: size, height: size }}
            />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                className="text-skin-star"
                fill="currentColor"
                strokeWidth={0}
                style={{ width: size, height: size }}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Price with MRP struck through and the percentage off, as Indian stores show it. */
export function Price({
  price,
  mrp,
  size = "md",
  className,
}: {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const off = discountPercent(price, mrp);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-semibold text-skin-ink tabular-nums",
          size === "lg" ? "text-[1.75rem] leading-none" : size === "md" ? "text-base" : "text-sm",
        )}
      >
        {formatINR(price)}
      </span>
      {off > 0 ? (
        <>
          <span
            className={cn("text-skin-subtle tabular-nums", size === "lg" ? "text-base" : "text-sm")}
          >
            <span className="sr-only">MRP </span>
            <s>{formatINR(mrp)}</s>
          </span>
          <span
            className={cn(
              "font-semibold text-skin-success",
              size === "lg" ? "text-base" : "text-sm",
            )}
          >
            {off}% off
          </span>
        </>
      ) : null}
    </span>
  );
}

const BADGE_STYLE: Record<Badge | "Sold out" | "Low stock", string> = {
  Bestseller: "bg-skin-ink text-white",
  New: "bg-skin-accent text-white",
  "Award winner": "bg-white text-skin-saffron-ink",
  Limited: "bg-skin-rose-soft text-skin-rose-ink",
  "Sold out": "bg-white text-skin-ink ring-1 ring-skin-line",
  "Low stock": "bg-white/90 text-skin-rose-ink",
};

export function BadgePill({
  badge,
  children,
  className,
}: {
  badge: keyof typeof BADGE_STYLE;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide uppercase",
        BADGE_STYLE[badge],
        className,
      )}
    >
      {children ?? badge}
    </span>
  );
}

/** Small uppercase label above section titles. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-xs font-semibold tracking-[0.18em] text-skin-subtle uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow className="mb-2">{eyebrow}</Eyebrow> : null}
        <h2
          id={id}
          className="font-skin-display text-[1.85rem] leading-[1.1] font-normal tracking-tight text-skin-ink sm:text-[2.35rem]"
        >
          {title}
        </h2>
        {text ? <p className="mt-3 text-[0.98rem] leading-relaxed text-skin-body">{text}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** Page container with the shop's side padding and max width. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.8rem] text-skin-subtle">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-skin-ink hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-skin-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Title block for content and account pages. */
export function PageHeader({
  crumb,
  eyebrow,
  title,
  intro,
  className,
}: {
  crumb: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("pt-6 sm:pt-8", className)}>
      <Breadcrumbs items={[{ label: "Home", href: "/skincare" }, { label: crumb }]} />
      {eyebrow ? <Eyebrow className="mt-8">{eyebrow}</Eyebrow> : null}
      <h1
        className={cn(
          "font-skin-display text-4xl leading-tight tracking-tight text-skin-ink sm:text-5xl",
          eyebrow ? "mt-2" : "mt-5",
        )}
      >
        {title}
      </h1>
      {intro ? (
        <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-skin-body">{intro}</p>
      ) : null}
    </div>
  );
}
