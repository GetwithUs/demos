import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ToothIcon } from "@/sites/dental-clinic/components/icons";
import { Stars } from "@/sites/dental-clinic/components/ui";
import type { Doctor } from "@/sites/dental-clinic/content/doctors";
import type { Review } from "@/sites/dental-clinic/content/reviews";
import type { Treatment } from "@/sites/dental-clinic/content/treatments";
import { formatINR } from "@/sites/dental-clinic/lib/format";

export function TreatmentCard({
  treatment,
  className,
}: {
  treatment: Treatment;
  className?: string;
}) {
  return (
    <Link
      href={`/dental-clinic/treatments/${treatment.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-dental-line/80 bg-dental-paper p-5 shadow-dental-soft transition-[transform,box-shadow,border-color] duration-500 ease-dental hover:-translate-y-1 hover:border-dental-sage/70 hover:shadow-dental-lift sm:p-7",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -top-16 -right-16 size-40 rounded-full bg-dental-mint/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative flex items-start justify-between gap-4">
        <span className="grid size-13 place-items-center rounded-2xl bg-dental-mist text-dental-spruce ring-1 ring-dental-mint transition-colors duration-500 group-hover:bg-dental-spruce group-hover:text-dental-ivory">
          <ToothIcon name={treatment.icon} className="size-7" />
        </span>
        <span className="rounded-full bg-dental-sand px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-dental-brass-deep uppercase">
          {treatment.category}
        </span>
      </div>
      <h3 className="relative mt-4 font-dental-display text-[1.4rem] leading-tight text-dental-ink sm:mt-6">
        {treatment.name}
      </h3>
      <p className="relative mt-2.5 flex-1 leading-relaxed text-dental-muted">
        {treatment.summary}
      </p>
      <div className="relative mt-4 flex items-end justify-between gap-4 border-t border-dental-line/70 pt-3.5 sm:mt-6 sm:pt-4">
        <p className="text-[0.8125rem] leading-tight text-dental-muted">
          Starting from
          <span className="mt-0.5 block text-[1.15rem] font-semibold text-dental-ink tabular-nums">
            {formatINR(treatment.priceFrom)}
          </span>
        </p>
        <span className="grid size-10 place-items-center rounded-full border border-dental-ink/10 text-dental-spruce transition-all duration-500 ease-dental group-hover:translate-x-0.5 group-hover:border-dental-spruce group-hover:bg-dental-spruce group-hover:text-white">
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export function DoctorCard({ doctor, className }: { doctor: Doctor; className?: string }) {
  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-dental-sand">
        {doctor.photo ? (
          <Image
            src={doctor.photo}
            alt={`Portrait of ${doctor.name}`}
            fill
            sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-dental group-hover:scale-[1.03]"
          />
        ) : (
          <span className="grid h-full place-items-center font-dental-display text-5xl text-dental-spruce">
            {doctor.initials}
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-dental-paper/90 px-3 py-1 text-[0.75rem] font-semibold text-dental-ink backdrop-blur">
          {doctor.experienceYears} years
        </span>
      </div>
      <h3 className="mt-5 font-dental-display text-[1.35rem] leading-tight text-dental-ink">
        <Link
          href={`/dental-clinic/doctors#${doctor.id}`}
          className="rounded-sm underline-offset-4 hover:underline"
        >
          {doctor.name}
        </Link>
      </h3>
      <p className="mt-1 text-[0.9375rem] font-medium text-dental-spruce">{doctor.role}</p>
      <p className="mt-1.5 text-[0.8125rem] leading-snug text-dental-muted">
        {doctor.qualifications}
      </p>
    </article>
  );
}

const AVATAR_TINTS = [
  "bg-dental-mint text-dental-spruce",
  "bg-dental-brass-soft text-dental-brass-deep",
  "bg-dental-sand text-dental-ink",
  "bg-dental-mist text-dental-spruce-deep",
];

function initials(name: string) {
  const words = name
    .replace(/\(.*?\)/g, "")
    .replace(/^(Col\.|Dr\.)\s*/, "")
    .trim()
    .split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`;
}

export function ReviewCard({
  review,
  index = 0,
  className,
}: {
  review: Review;
  index?: number;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-[1.5rem] border border-dental-line/80 bg-dental-paper p-6 shadow-dental-soft sm:p-7",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <span className="rounded-full bg-dental-mist px-2.5 py-1 text-[0.75rem] font-medium text-dental-spruce">
          {review.treatment}
        </span>
      </div>
      <blockquote className="mt-4 flex-1">
        <p className="font-dental-display text-[1.2rem] leading-snug text-dental-ink">
          {review.title}
        </p>
        <p className="mt-3 leading-relaxed text-dental-body">{review.text}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-dental-line/70 pt-5">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full text-[0.875rem] font-semibold",
            AVATAR_TINTS[index % AVATAR_TINTS.length],
          )}
        >
          {initials(review.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-dental-ink">{review.name}</span>
          <span className="block text-[0.8125rem] text-dental-muted">
            {review.area}, {review.date}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** A wide, menu-style row for the treatments index: what it is, how long, and from how much. */
export function TreatmentRow({ treatment }: { treatment: Treatment }) {
  return (
    <Link
      href={`/dental-clinic/treatments/${treatment.slug}`}
      className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-3 rounded-[1.5rem] border border-dental-line/80 bg-dental-paper p-5 shadow-dental-soft transition-[transform,box-shadow,border-color] duration-500 ease-dental hover:-translate-y-0.5 hover:border-dental-sage/70 hover:shadow-dental-lift sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-6"
    >
      <span className="grid size-13 place-items-center self-start rounded-2xl bg-dental-mist text-dental-spruce ring-1 ring-dental-mint transition-colors duration-500 group-hover:bg-dental-spruce group-hover:text-dental-ivory sm:self-center">
        <ToothIcon name={treatment.icon} className="size-7" />
      </span>
      <span className="min-w-0">
        <span className="block font-dental-display text-[1.35rem] leading-tight text-dental-ink">
          {treatment.name}
        </span>
        <span className="mt-1 block leading-relaxed text-dental-muted">{treatment.summary}</span>
        <span className="mt-2 block text-[0.8125rem] font-medium text-dental-brass-deep">
          {treatment.sittings}
        </span>
      </span>
      <span className="col-start-2 flex items-center justify-between gap-5 border-t border-dental-line/70 pt-3 sm:col-start-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <span className="text-[0.8125rem] leading-tight text-dental-muted sm:text-right">
          Starting from
          <span className="mt-0.5 block text-[1.15rem] font-semibold text-dental-ink tabular-nums">
            {formatINR(treatment.priceFrom)}
          </span>
        </span>
        <span className="grid size-10 place-items-center rounded-full border border-dental-ink/10 text-dental-spruce transition-all duration-500 ease-dental group-hover:translate-x-0.5 group-hover:border-dental-spruce group-hover:bg-dental-spruce group-hover:text-white">
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </span>
    </Link>
  );
}
