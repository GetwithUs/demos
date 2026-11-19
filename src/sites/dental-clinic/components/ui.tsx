import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>
  );
}

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.16em] text-dental-brass-deep uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-7 bg-dental-brass" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  id,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "max-w-[44rem]",
        align === "center" && "mx-auto text-center [&>p:first-child]:justify-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        id={id}
        className="mt-4 font-dental-display text-[clamp(2rem,4.4vw,3.15rem)] leading-[1.06] font-normal tracking-[-0.02em] text-balance text-dental-ink"
      >
        {title}
      </Tag>
      {intro ? (
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-pretty text-dental-muted sm:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "outline-light";
type ButtonSize = "md" | "lg" | "sm";

/** Shared button look for links and buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-300 ease-dental focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-dental-spruce active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    size === "lg" && "h-13 px-7 text-[1rem]",
    size === "md" && "h-11 px-5 text-[0.9375rem]",
    size === "sm" && "h-9 px-4 text-[0.875rem]",
    variant === "primary" &&
      "bg-dental-spruce text-white shadow-[0_8px_20px_-10px_rgb(18_52_48/0.7)] hover:bg-dental-spruce-deep hover:shadow-[0_12px_26px_-10px_rgb(18_52_48/0.75)]",
    variant === "secondary" &&
      "border border-dental-ink/15 bg-dental-paper/70 text-dental-ink hover:border-dental-ink/30 hover:bg-dental-paper",
    variant === "ghost" && "px-0 text-dental-spruce underline-offset-4 hover:underline",
    variant === "light" &&
      "bg-dental-ivory text-dental-ink hover:bg-white focus-visible:outline-dental-ivory",
    variant === "outline-light" &&
      "border border-white/30 text-white hover:border-white/60 hover:bg-white/5 focus-visible:outline-dental-ivory",
  );
}

export function Stars({
  rating,
  className,
  size = 16,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-dental-brass", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          width={size}
          height={size}
          strokeWidth={1.5}
          className={i <= Math.round(rating) ? "fill-current" : "fill-transparent opacity-50"}
        />
      ))}
      <span className="sr-only">{rating} out of 5 stars</span>
    </span>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-dental-muted">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 ? <ChevronRight aria-hidden="true" className="size-3.5 opacity-60" /> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded-sm underline-offset-4 hover:text-dental-ink hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-dental-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The opening block of every inner page. */
export function PageIntro({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: { href?: string; label: string }[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-dental-line/70 bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--color-dental-mint),transparent_60%)]",
        className,
      )}
    >
      <Container className="pt-8 pb-14 sm:pt-10 sm:pb-20">
        <Breadcrumbs items={[{ href: "/dental-clinic", label: "Home" }, ...crumbs]} />
        <div className="mt-10 animate-dental-rise sm:mt-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-[18ch] font-dental-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] font-normal tracking-[-0.025em] text-balance text-dental-ink">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-pretty text-dental-muted">
              {intro}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  );
}

export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dental-line bg-dental-paper/80 px-3 py-1 text-[0.8125rem] font-medium text-dental-body",
        className,
      )}
    >
      {children}
    </span>
  );
}
