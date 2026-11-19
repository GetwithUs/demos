import { ArrowRight, CalendarClock, Check, Clock, Layers, Sparkles, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { ChatButton } from "@/sites/dental-clinic/components/ActionButtons";
import { TreatmentCard } from "@/sites/dental-clinic/components/cards";
import { CtaBand, FaqList } from "@/sites/dental-clinic/components/sections";
import {
  Breadcrumbs,
  Container,
  Eyebrow,
  buttonClasses,
} from "@/sites/dental-clinic/components/ui";
import { getDoctor } from "@/sites/dental-clinic/content/doctors";
import { EMI } from "@/sites/dental-clinic/content/payments";
import {
  CATEGORY_LABELS,
  TREATMENTS,
  getTreatment,
} from "@/sites/dental-clinic/content/treatments";
import { formatINR } from "@/sites/dental-clinic/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  return {
    title: `${treatment.name}, from ${formatINR(treatment.priceFrom)}`,
    description: `${treatment.summary} Starting from ${formatINR(treatment.priceFrom)} ${treatment.priceUnit}. ${treatment.sittings}. Book online at Ivorine Dental Studio, Rajpur Road.`,
  };
}

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  const related = treatment.related.map((s) => getTreatment(s)).filter((t) => t !== undefined);
  const doctors = treatment.doctors.map(getDoctor);
  const facts = [
    {
      icon: Wallet,
      label: "Starting from",
      value: formatINR(treatment.priceFrom),
      note: treatment.priceUnit,
    },
    { icon: Clock, label: "Visit length", value: treatment.duration },
    { icon: Layers, label: "Sittings", value: treatment.sittings },
    { icon: CalendarClock, label: "Recovery", value: treatment.recovery },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-dental-line/70 bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--color-dental-mint),transparent_60%)]">
        <Container className="pt-8 pb-14 sm:pt-10 sm:pb-20">
          <Breadcrumbs
            items={[
              { href: "/dental-clinic", label: "Home" },
              { href: "/dental-clinic/treatments", label: "Treatments" },
              { label: treatment.name },
            ]}
          />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="animate-dental-rise">
              <Eyebrow>{CATEGORY_LABELS[treatment.category]}</Eyebrow>
              <h1 className="mt-4 font-dental-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.025em] text-balance text-dental-ink">
                {treatment.name}
              </h1>
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-pretty text-dental-muted">
                {treatment.lead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/dental-clinic/book?treatment=${treatment.slug}`}
                  className={buttonClasses("primary", "lg")}
                >
                  Book a consultation
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <ChatButton className={buttonClasses("secondary", "lg")}>Ask a question</ChatButton>
              </div>
            </div>
            <div className="relative animate-dental-fade">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-dental-sand shadow-dental-lift">
                <Image
                  src={treatment.image}
                  alt={treatment.imageAlt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 480px, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-dental-line/80 bg-dental-line/80 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-dental-paper p-5 sm:p-6">
                <dt className="flex items-center gap-2 text-[0.8125rem] font-medium text-dental-muted">
                  <fact.icon
                    aria-hidden="true"
                    className="size-4 text-dental-brass-deep"
                    strokeWidth={1.7}
                  />
                  {fact.label}
                </dt>
                <dd className="mt-2 font-dental-display text-[1.25rem] leading-snug text-dental-ink sm:text-[1.4rem]">
                  {fact.value}
                  {fact.note ? (
                    <span className="mt-0.5 block font-dental-sans text-[0.8125rem] text-dental-muted">
                      {fact.note}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="grid gap-14 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="what-title">
            <h2
              id="what-title"
              className="font-dental-display text-[2rem] leading-tight text-dental-ink"
            >
              What it is
            </h2>
            <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-dental-body">
              {treatment.whatItIs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="who-title">
            <h2
              id="who-title"
              className="font-dental-display text-[2rem] leading-tight text-dental-ink"
            >
              Who it is for
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {treatment.whoNeedsIt.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl bg-dental-paper p-4 shadow-dental-soft"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-6 shrink-0 place-items-center rounded-full bg-dental-mint text-dental-spruce"
                  >
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="leading-snug text-dental-ink">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="steps-title">
            <h2
              id="steps-title"
              className="font-dental-display text-[2rem] leading-tight text-dental-ink"
            >
              Step by step
            </h2>
            <ol className="mt-8">
              {treatment.steps.map((s, i) => (
                <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < treatment.steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-11 bottom-1 left-[1.125rem] w-px bg-dental-line"
                    />
                  ) : null}
                  <span className="relative grid size-9 shrink-0 place-items-center rounded-full border border-dental-sage bg-dental-paper font-dental-display text-dental-spruce">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-semibold text-dental-ink">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-dental-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="after-title"
            className="rounded-[1.75rem] bg-dental-mist p-6 sm:p-8"
          >
            <h2
              id="after-title"
              className="flex items-center gap-2.5 font-dental-display text-[1.6rem] leading-tight text-dental-ink"
            >
              <Sparkles aria-hidden="true" className="size-5 text-dental-brass-deep" />
              Aftercare
            </h2>
            <ul className="mt-4 space-y-2.5">
              {treatment.aftercare.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-dental-body">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-dental-spruce"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq-title">
            <h2
              id="faq-title"
              className="font-dental-display text-[2rem] leading-tight text-dental-ink"
            >
              Questions about {treatment.shortName.toLowerCase()}
            </h2>
            <FaqList items={treatment.faqs} name="treatment-faq" className="mt-6" />
          </section>
        </div>

        <aside aria-label="Prices and booking" className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[1.75rem] border border-dental-line/80 bg-dental-paper p-6 shadow-dental-soft sm:p-7">
            <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-dental-brass-deep uppercase">
              Prices
            </p>
            <ul className="mt-4 divide-y divide-dental-line/80">
              {treatment.priceOptions.map((o) => (
                <li key={o.label} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="text-[0.9375rem] leading-snug text-dental-body">
                    {o.label}
                    {o.note ? (
                      <span className="block text-[0.8125rem] text-dental-muted">{o.note}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-right font-semibold text-dental-ink tabular-nums">
                    <span className="sr-only">from </span>
                    {formatINR(o.from)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-dental-muted">
              Starting prices. Your exact cost is confirmed in writing after an examination and any
              X-rays you need.
            </p>
            {treatment.emi ? (
              <p className="mt-4 rounded-xl bg-dental-brass-soft/70 px-4 py-3 text-[0.875rem] text-dental-ink">
                <span className="font-semibold">{EMI.headline}.</span> {EMI.months}, subject to
                approval.
              </p>
            ) : null}
            <Link
              href={`/dental-clinic/book?treatment=${treatment.slug}`}
              className={cn(buttonClasses("primary", "lg"), "mt-6 w-full")}
            >
              Book this treatment
            </Link>
            <Link
              href="/dental-clinic/fees"
              className={cn(buttonClasses("ghost", "md"), "mt-2 w-full")}
            >
              All fees, EMI and insurance
            </Link>
          </div>

          <div className="mt-5 rounded-[1.75rem] border border-dental-line/80 p-6">
            <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-dental-brass-deep uppercase">
              Who you will see
            </p>
            <ul className="mt-4 space-y-4">
              {doctors.map((d) => (
                <li key={d.id} className="flex items-center gap-3">
                  {d.photo ? (
                    <Image
                      src={d.photo}
                      alt=""
                      width={48}
                      height={48}
                      sizes="48px"
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-dental-mint font-semibold text-dental-spruce"
                    >
                      {d.initials}
                    </span>
                  )}
                  <span>
                    <Link
                      href={`/dental-clinic/doctors#${d.id}`}
                      className="block rounded-sm font-semibold text-dental-ink underline-offset-4 hover:underline"
                    >
                      {d.name}
                    </Link>
                    <span className="block text-[0.8125rem] text-dental-muted">{d.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>

      <section aria-labelledby="related-title" className="bg-dental-sand/60">
        <Container className="py-16 sm:py-24">
          <h2
            id="related-title"
            className="font-dental-display text-[2rem] leading-tight text-dental-ink"
          >
            Related treatments
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((t) => (
              <li key={t.slug}>
                <TreatmentCard treatment={t} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <div className="pt-3 sm:pt-5">
        <CtaBand
          title={`Questions about ${treatment.shortName.toLowerCase()}?`}
          text="Book a consultation and leave with a written plan and estimate, or ask the WhatsApp assistant first."
        />
      </div>
    </>
  );
}
