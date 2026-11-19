import { ArrowRight, CalendarDays, GraduationCap, Languages } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CtaBand } from "@/sites/dental-clinic/components/sections";
import { Container, PageIntro, Pill, buttonClasses } from "@/sites/dental-clinic/components/ui";
import { DOCTORS, RESIDENT_DOCTORS } from "@/sites/dental-clinic/content/doctors";

export const metadata: Metadata = {
  title: "Our dentists",
  description:
    "Meet the specialist dentists at Ivorine Dental Studio, Dehradun: a prosthodontist, an orthodontist, an endodontist, a paediatric dentist and a visiting oral surgeon.",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK = [1, 2, 3, 4, 5, 6, 0];

function WeekDays({ days }: { days: number[] }) {
  return (
    <ul
      className="flex gap-1"
      aria-label={`In the studio on ${days.map((d) => DAY_NAMES[d]).join(", ")}`}
    >
      {WEEK.map((d) => (
        <li
          key={d}
          aria-hidden="true"
          className={cn(
            "grid h-7 w-9 place-items-center rounded-md text-[0.6875rem] font-semibold",
            days.includes(d)
              ? "bg-dental-spruce text-white"
              : "bg-dental-sand text-dental-muted/70",
          )}
        >
          {DAY_NAMES[d]}
        </li>
      ))}
    </ul>
  );
}

export default function DoctorsPage() {
  const visiting = DOCTORS.filter((d) => d.visiting);

  return (
    <>
      <PageIntro
        eyebrow="Our dentists"
        title="Specialists who take their time."
        intro={`Every dentist at Ivorine holds a master's degree in their speciality and is registered with the Uttarakhand State Dental Council. Between them, more than 40 years of looking after Dehradun's teeth.`}
        crumbs={[{ label: "Dentists" }]}
      />

      <Container className="py-16 sm:py-24">
        <div className="space-y-20 sm:space-y-28">
          {RESIDENT_DOCTORS.map((doctor, i) => (
            <article
              key={doctor.id}
              id={doctor.id}
              aria-labelledby={`${doctor.id}-name`}
              className="dental-reveal grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-20"
            >
              <div
                className={cn("relative mx-auto w-full max-w-[26rem]", i % 2 === 1 && "lg:order-2")}
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-t-[999px] rounded-b-[2.3rem] border border-dental-brass/40"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-dental-sand">
                  {doctor.photo ? (
                    <Image
                      src={doctor.photo}
                      alt={`Portrait of ${doctor.name}`}
                      fill
                      sizes="(min-width: 1024px) 416px, 90vw"
                      loading={i === 0 ? "eager" : undefined}
                      className="object-cover"
                    />
                  ) : null}
                </div>
              </div>
              <div>
                <p className="text-[0.75rem] font-semibold tracking-[0.16em] text-dental-brass-deep uppercase">
                  {doctor.specialty}
                </p>
                <h2
                  id={`${doctor.id}-name`}
                  className="mt-3 font-dental-display text-[clamp(2.1rem,4.5vw,3rem)] leading-[1.05] tracking-[-0.02em] text-dental-ink"
                >
                  {doctor.name}
                </h2>
                <p className="mt-2 text-lg font-medium text-dental-spruce">{doctor.role}</p>
                <p className="mt-1 text-[0.9375rem] text-dental-muted">
                  {doctor.qualifications}. {doctor.experienceYears} years of experience.
                </p>
                <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-dental-body">
                  {doctor.bio.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {doctor.focus.map((f) => (
                    <li key={f}>
                      <Pill>{f}</Pill>
                    </li>
                  ))}
                </ul>
                <dl className="mt-7 grid gap-5 border-t border-dental-line pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center gap-2 text-[0.8125rem] font-semibold text-dental-ink">
                      <GraduationCap aria-hidden="true" className="size-4 text-dental-brass-deep" />
                      Education
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-dental-muted">
                      {doctor.education.join(". ")}.
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-[0.8125rem] font-semibold text-dental-ink">
                      <Languages aria-hidden="true" className="size-4 text-dental-brass-deep" />
                      Speaks
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] text-dental-muted">
                      {doctor.languages.join(", ")}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="flex items-center gap-2 text-[0.8125rem] font-semibold text-dental-ink">
                      <CalendarDays aria-hidden="true" className="size-4 text-dental-brass-deep" />
                      In the studio
                    </dt>
                    <dd className="mt-2">
                      <WeekDays days={doctor.days} />
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/dental-clinic/book?doctor=${doctor.id}`}
                  className={cn(buttonClasses("primary", "md"), "mt-8")}
                >
                  Book with {doctor.name}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section aria-labelledby="visiting-title" className="mt-24">
          <h2
            id="visiting-title"
            className="font-dental-display text-[1.75rem] leading-tight text-dental-ink"
          >
            Visiting consultant
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {visiting.map((doctor) => (
              <article
                key={doctor.id}
                id={doctor.id}
                className="scroll-mt-28 rounded-[1.75rem] border border-dental-line/80 bg-dental-paper p-6 shadow-dental-soft sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-16 shrink-0 place-items-center rounded-full bg-dental-mint font-dental-display text-2xl text-dental-spruce"
                  >
                    {doctor.initials}
                  </span>
                  <div>
                    <h3 className="font-dental-display text-[1.5rem] leading-tight text-dental-ink">
                      {doctor.name}
                    </h3>
                    <p className="text-[0.9375rem] font-medium text-dental-spruce">{doctor.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-[0.9375rem] text-dental-muted">
                  {doctor.qualifications}. {doctor.experienceYears} years of experience.
                </p>
                <p className="mt-3 leading-relaxed text-dental-body">{doctor.short}</p>
                <div className="mt-5">
                  <WeekDays days={doctor.days} />
                </div>
              </article>
            ))}
            <div className="rounded-[1.75rem] bg-dental-mist p-6 sm:p-8">
              <h3 className="font-dental-display text-[1.5rem] leading-tight text-dental-ink">
                The people behind the chair
              </h3>
              <p className="mt-3 leading-relaxed text-dental-body">
                Our dentists are supported by two trained dental hygienists, three chairside
                assistants and a front desk team who will remember your name. Every member of the
                team is trained in basic life support and infection control.
              </p>
            </div>
          </div>
        </section>
      </Container>

      <CtaBand
        title="Not sure who to see?"
        text="Book a consultation and we will match you with the right specialist, or ask the WhatsApp assistant."
      />
    </>
  );
}
