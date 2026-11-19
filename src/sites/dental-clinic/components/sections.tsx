import { ArrowRight, Plus, Siren } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CallButton, ChatButton } from "@/sites/dental-clinic/components/ActionButtons";
import { Container, Stars, buttonClasses } from "@/sites/dental-clinic/components/ui";
import { CLINIC, HOURS } from "@/sites/dental-clinic/content/clinic";
import { RATING_BREAKDOWN } from "@/sites/dental-clinic/content/reviews";
import type { Faq } from "@/sites/dental-clinic/content/treatments";
import { formatTime } from "@/sites/dental-clinic/lib/format";

/** Accessible accordion built on <details>, so it works without JavaScript. */
export function FaqList({
  items,
  className,
  name,
}: {
  items: Faq[];
  className?: string;
  name?: string;
}) {
  return (
    <div className={cn("divide-y divide-dental-line border-y border-dental-line", className)}>
      {items.map((item) => (
        <details key={item.q} name={name} className="dental-faq group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-md py-5 text-left font-dental-display text-[1.15rem] leading-snug text-dental-ink transition-colors hover:text-dental-spruce sm:text-[1.25rem]">
            {item.q}
            <span className="dental-faq-icon mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-dental-ink/12 text-dental-spruce transition-transform duration-300 ease-dental group-open:border-dental-spruce group-open:bg-dental-spruce group-open:text-white">
              <Plus aria-hidden="true" className="size-4" />
            </span>
          </summary>
          <div className="dental-faq-answer max-w-[46rem] pr-12 pb-6 leading-relaxed text-dental-body">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "Ready when you are.",
  text = "Book a visit online in about a minute, or ask the WhatsApp assistant anything first. Same-day slots for tooth pain.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="dental-cta-title" className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-dental-spruce text-dental-ivory">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(40rem_22rem_at_90%_10%,rgb(192_154_95/0.28),transparent_60%),radial-gradient(30rem_20rem_at_0%_100%,rgb(159_188_174/0.22),transparent_60%)]"
        />
        <Container className="relative flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2
              id="dental-cta-title"
              className="font-dental-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-white"
            >
              {title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-dental-ivory/80">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dental-clinic/book" className={buttonClasses("light", "lg")}>
              Book an appointment
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <ChatButton className={buttonClasses("outline-light", "lg")}>
              Chat on WhatsApp
            </ChatButton>
          </div>
        </Container>
      </div>
    </section>
  );
}

export function EmergencyBand({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="dental-emergency-title"
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-dental-coral/20 bg-dental-coral-soft",
        className,
      )}
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-dental-coral text-white">
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-dental-ping rounded-full bg-dental-coral/50"
            />
            <Siren aria-hidden="true" className="relative size-5" />
          </span>
          <div>
            <h2
              id="dental-emergency-title"
              className="font-dental-display text-[1.5rem] leading-tight text-dental-ink"
            >
              Toothache, swelling or a broken tooth?
            </h2>
            <p className="mt-1.5 max-w-xl leading-relaxed text-dental-body">
              We keep same-day emergency slots every day we are open, including Sunday mornings.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 md:shrink-0">
          <Link
            href="/dental-clinic/book?treatment=tooth-pain"
            className={cn(buttonClasses("primary", "md"), "bg-dental-coral hover:bg-[#963826]")}
          >
            Get a same-day slot
          </Link>
          <Link href="/dental-clinic/emergency" className={buttonClasses("secondary", "md")}>
            What to do now
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The week's timings as a definition list. */
export function HoursList({ className }: { className?: string }) {
  return (
    <dl className={cn("divide-y divide-dental-line/80", className)}>
      {HOURS.map((h) => (
        <div key={h.label} className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="font-medium text-dental-ink">{h.label}</dt>
          <dd className="text-right text-dental-body tabular-nums">
            {h.open && h.close ? `${formatTime(h.open)} to ${formatTime(h.close)}` : "Closed"}
            {h.note ? (
              <span className="block text-[0.8125rem] text-dental-muted">{h.note}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function RatingSummary({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-[1.5rem] bg-dental-paper p-6 shadow-dental-soft sm:p-8", className)}
    >
      <div className="flex items-end gap-4">
        <p className="font-dental-display text-[4rem] leading-none text-dental-ink">
          {CLINIC.rating.average}
        </p>
        <div className="pb-1.5">
          <Stars rating={CLINIC.rating.average} size={18} />
          <p className="mt-1 text-[0.875rem] text-dental-muted">
            from {CLINIC.rating.count} patient reviews
          </p>
        </div>
      </div>
      <ul className="mt-6 space-y-2">
        {RATING_BREAKDOWN.map((row) => (
          <li
            key={row.stars}
            className="flex items-center gap-3 text-[0.8125rem] text-dental-muted"
          >
            <span className="w-12 shrink-0">
              {row.stars} {row.stars === 1 ? "star" : "stars"}
            </span>
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-dental-sand">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-dental-brass"
                style={{ width: `${row.share}%` }}
              />
            </span>
            <span className="w-9 shrink-0 text-right tabular-nums">{row.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Book, call and WhatsApp side by side, for the ends of pages. */
export function ContactActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Link href="/dental-clinic/book" className={buttonClasses("primary", "lg")}>
        Book an appointment
      </Link>
      <CallButton className={buttonClasses("secondary", "lg")}>Call the studio</CallButton>
      <ChatButton className={buttonClasses("secondary", "lg")}>WhatsApp</ChatButton>
    </div>
  );
}
