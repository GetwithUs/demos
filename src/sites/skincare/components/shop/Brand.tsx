import Link from "next/link";
import { cn } from "@/lib/cn";

/** The Oruvi wordmark with its droplet mark. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/skincare"
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 text-skin-ink", className)}
      aria-label="Oruvi Skin, home"
    >
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
        <circle cx="16" cy="16" r="15" fill="#2f5d50" />
        <path d="M16 7.5c3.6 4.3 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.4-6.3 6-10.6Z" fill="#fbf8f3" />
        <path
          d="M13.4 18.6a2.8 2.8 0 0 0 2.6 2.6"
          stroke="#2f5d50"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="font-skin-display text-[1.6rem] font-medium tracking-tight">Oruvi</span>
        <span className="text-[0.6rem] font-semibold tracking-[0.32em] text-skin-subtle">SKIN</span>
      </span>
    </Link>
  );
}

/** Generic social icons (no brand logos, no links: the brand is made up). */
export function SocialIcon({ name }: { name: "instagram" | "youtube" | "facebook" | "x" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-[1.05rem]",
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  } as const;
  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10 9.2v5.6l4.8-2.8Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.6-1.5h1.5V4.5a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.2H9v3h2.5V21" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4 4 20" />
        </svg>
      );
  }
}

/** Payment method marks drawn in CSS, not real logos. */
export function PaymentMarks({ className }: { className?: string }) {
  const chip =
    "inline-flex h-7 items-center justify-center rounded-md bg-white px-2 text-[0.68rem] font-bold ring-1 ring-skin-line";
  return (
    <ul
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      aria-label="Payment methods we accept"
    >
      <li className={cn(chip, "text-[#1f6f43]")}>
        UPI<span className="ml-0.5 text-[#e07b1f]">▸</span>
      </li>
      <li className={cn(chip, "tracking-wider text-[#1a3a8f] italic")}>VISA</li>
      <li className={chip} aria-label="Mastercard">
        <span className="relative flex w-7 items-center" aria-hidden>
          <span className="size-3.5 rounded-full bg-[#e8343a]" />
          <span className="-ml-1.5 size-3.5 rounded-full bg-[#f5a623] mix-blend-multiply" />
        </span>
      </li>
      <li className={cn(chip, "text-[#1d3c78]")}>
        Ru<span className="text-[#e6772e]">Pay</span>
      </li>
      <li className={cn(chip, "text-skin-ink")}>Net banking</li>
      <li className={cn(chip, "text-skin-ink")}>COD</li>
    </ul>
  );
}
