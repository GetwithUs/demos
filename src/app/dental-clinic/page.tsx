import {
  ArrowRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Car,
  Check,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ChatButton } from "@/sites/dental-clinic/components/ActionButtons";
import AppointmentSummary from "@/sites/dental-clinic/components/AppointmentSummary";
import BeforeAfter from "@/sites/dental-clinic/components/BeforeAfter";
import { DoctorCard, ReviewCard, TreatmentCard } from "@/sites/dental-clinic/components/cards";
import MapIllustration from "@/sites/dental-clinic/components/MapIllustration";
import OpenStatus from "@/sites/dental-clinic/components/OpenStatus";
import {
  CtaBand,
  EmergencyBand,
  FaqList,
  HoursList,
  RatingSummary,
} from "@/sites/dental-clinic/components/sections";
import {
  Container,
  Eyebrow,
  SectionHeading,
  Stars,
  buttonClasses,
} from "@/sites/dental-clinic/components/ui";
import {
  CLINIC,
  FULL_ADDRESS,
  GETTING_HERE,
  SOCIAL_PROOF,
} from "@/sites/dental-clinic/content/clinic";
import { RESIDENT_DOCTORS } from "@/sites/dental-clinic/content/doctors";
import { HOME_FAQS } from "@/sites/dental-clinic/content/faqs";
import { SMILE_CASES } from "@/sites/dental-clinic/content/gallery";
import { CARE_PLAN, EMI } from "@/sites/dental-clinic/content/payments";
import { REVIEWS } from "@/sites/dental-clinic/content/reviews";
import { CONCERNS, FIRST_VISIT_STEPS, WHY_US } from "@/sites/dental-clinic/content/studio";
import { TREATMENTS } from "@/sites/dental-clinic/content/treatments";
import hero from "@/sites/dental-clinic/images/hero.jpg";
import lounge from "@/sites/dental-clinic/images/studio-lounge.jpg";
import { formatINR } from "@/sites/dental-clinic/lib/format";

export const metadata: Metadata = {
  title: { absolute: "Ivorine Dental Studio | Specialist dentists on Rajpur Road, Dehradun" },
  description:
    "Gentle, specialist dentistry in Dehradun. Root canals, implants, braces and aligners, whitening and children's dentistry, with clear starting prices, no-cost EMI and online booking.",
};

const FEATURED = [
  "check-up-and-cleaning",
  "root-canal-treatment",
  "dental-implants",
  "braces-and-aligners",
  "teeth-whitening",
  "kids-dentistry",
];

const AVATARS = [
  { initials: "NB", tint: "bg-dental-mint text-dental-spruce" },
  { initials: "AM", tint: "bg-dental-brass-soft text-dental-brass-deep" },
  { initials: "KJ", tint: "bg-dental-sand text-dental-ink" },
  { initials: "SK", tint: "bg-dental-spruce text-white" },
];

export default function DentalHome() {
  const featured = TREATMENTS.filter((t) => FEATURED.includes(t.slug));
  const featuredCase = SMILE_CASES[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_32rem_at_88%_8%,var(--color-dental-mint),transparent_62%),radial-gradient(36rem_26rem_at_0%_100%,var(--color-dental-brass-soft),transparent_65%)]"
        />
        <Container className="relative grid items-center gap-12 pt-8 pb-16 sm:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pt-16 lg:pb-24">
          <div className="animate-dental-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-dental-line bg-dental-paper/80 py-1.5 pr-4 pl-3 shadow-dental-soft backdrop-blur">
              <OpenStatus />
            </p>
            <h1 className="mt-6 font-dental-display text-[clamp(2.75rem,7.4vw,5.1rem)] leading-[0.98] font-normal tracking-[-0.03em] text-balance text-dental-ink">
              Gentle, <em className="text-dental-spruce italic">unhurried</em> dentistry on Rajpur
              Road.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-pretty text-dental-muted sm:text-[1.1875rem]">
              Specialist dentists for every kind of care, a written estimate before anything starts,
              and same-day slots for tooth pain. From a child&rsquo;s first check-up to implants and
              aligners, in one calm studio in Dehradun.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dental-clinic/book" className={buttonClasses("primary", "lg")}>
                Book an appointment
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <ChatButton className={buttonClasses("secondary", "lg")}>Ask on WhatsApp</ChatButton>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="flex -space-x-1.5">
                  {AVATARS.map((a) => (
                    <span
                      key={a.initials}
                      className={cn(
                        "grid size-9 place-items-center rounded-full text-[0.6875rem] font-bold ring-2 ring-dental-ivory",
                        a.tint,
                      )}
                    >
                      {a.initials}
                    </span>
                  ))}
                </div>
                <div>
                  <Stars rating={CLINIC.rating.average} size={15} />
                  <p className="text-[0.875rem] text-dental-muted">
                    <span className="font-semibold text-dental-ink">{CLINIC.rating.average}</span>{" "}
                    from {CLINIC.rating.count} patient reviews
                  </p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-[0.875rem] text-dental-muted">
                <BadgeIndianRupee
                  aria-hidden="true"
                  className="size-5 text-dental-brass-deep"
                  strokeWidth={1.6}
                />
                No-cost EMI available
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[22rem] animate-dental-fade sm:max-w-[30rem] lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-t-[999px] rounded-b-[2.4rem] border border-dental-brass/40"
            />
            <div className="relative aspect-[4/4.4] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-dental-sand shadow-dental-lift sm:aspect-[1080/1320]">
              <Image
                src={hero}
                alt="A smiling patient chatting with her dentist in a bright treatment room at Ivorine"
                fill
                preload
                sizes="(min-width: 1024px) 520px, (min-width: 640px) 480px, 92vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-2 flex max-w-[15.5rem] animate-dental-float items-start gap-3 rounded-2xl bg-dental-paper/95 p-4 shadow-dental-lift backdrop-blur sm:-left-8">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-dental-mint text-dental-spruce">
                <ShieldCheck aria-hidden="true" className="size-5" strokeWidth={1.7} />
              </span>
              <p className="text-[0.8125rem] leading-snug text-dental-body">
                <span className="block font-semibold text-dental-ink">Sterile, sealed kits</span>
                Opened in front of you, every visit
              </p>
            </div>
            <div className="absolute top-10 -right-2 hidden items-center gap-2.5 rounded-2xl bg-dental-paper/95 px-4 py-3 shadow-dental-lift backdrop-blur [animation-delay:1.5s] sm:flex sm:animate-dental-float lg:-right-6">
              <Sparkles aria-hidden="true" className="size-5 text-dental-brass" />
              <p className="text-[0.8125rem] leading-tight text-dental-body">
                <span className="block font-semibold text-dental-ink">Root canals</span>
                often in one sitting
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <AppointmentSummary className="mb-12" />
      </Container>

      {/* Trust stats */}
      <section
        aria-label="The studio in numbers"
        className="border-y border-dental-line/80 bg-dental-paper/60"
      >
        <Container>
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {SOCIAL_PROOF.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col-reverse justify-end gap-1.5 py-7 md:px-8 md:first:pl-0",
                  i < 2 && "border-b border-dental-line/80 md:border-b-0",
                  i % 2 === 1 && "border-l border-dental-line/80 pl-5",
                  i === 2 && "md:border-l md:border-dental-line/80",
                )}
              >
                <dt className="text-[0.875rem] leading-snug text-dental-muted">{stat.label}</dt>
                <dd className="font-dental-display text-[2.4rem] leading-none text-dental-ink tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Concern picker */}
      <section aria-labelledby="dental-concern-title" className="dental-reveal">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2
              id="dental-concern-title"
              className="shrink-0 font-dental-display text-[1.75rem] leading-tight text-dental-ink sm:text-[2rem]"
            >
              What brings you in?
            </h2>
            <ul className="flex flex-wrap gap-2.5 lg:max-w-[50rem] lg:justify-end">
              {CONCERNS.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="group inline-flex items-center gap-2 rounded-full border border-dental-line bg-dental-paper px-4 py-2.5 text-[0.9375rem] font-medium text-dental-ink shadow-dental-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-dental-spruce hover:bg-dental-spruce hover:text-white"
                  >
                    {c.label}
                    <span className="hidden text-[0.8125rem] text-dental-muted transition-colors group-hover:text-white/80 sm:inline">
                      {c.hint}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Treatments */}
      <section aria-labelledby="dental-treatments-title" className="dental-reveal">
        <Container className="pb-20 sm:pb-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              id="dental-treatments-title"
              eyebrow="Treatments"
              title="Everything your smile needs, under one roof."
              intro="Clear starting prices on every treatment, and a written estimate after your check-up."
            />
            <Link
              href="/dental-clinic/treatments"
              className={cn(buttonClasses("secondary", "md"), "self-start md:self-auto")}
            >
              All {TREATMENTS.length} treatments
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <li key={t.slug}>
                <TreatmentCard treatment={t} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Why Ivorine */}
      <section
        aria-labelledby="dental-why-title"
        className="relative overflow-hidden bg-dental-spruce-deep text-dental-ivory"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(40rem_30rem_at_100%_0%,rgb(159_188_174/0.18),transparent_60%)]"
        />
        <Container className="relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="dental-reveal">
            <div className="relative mx-auto aspect-[4/5] max-w-[28rem] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-dental-spruce lg:max-w-none">
              <Image
                src={lounge}
                alt="The calm waiting area at Ivorine, with a 'Smile like you mean it' sign and an olive tree"
                fill
                sizes="(min-width: 1024px) 460px, 92vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-[0.875rem] text-dental-ivory/70">
              The lounge on the second floor of Kesar Court. Tea is on us.
            </p>
          </div>
          <div className="dental-reveal">
            <Eyebrow className="text-dental-brass">Why Ivorine</Eyebrow>
            <h2
              id="dental-why-title"
              className="mt-4 font-dental-display text-[clamp(2rem,4.4vw,3.15rem)] leading-[1.06] tracking-[-0.02em] text-balance text-white"
            >
              A boutique studio, run the way you would want a dentist to work.
            </h2>
            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {WHY_US.map((item) => (
                <li key={item.title}>
                  <span
                    aria-hidden="true"
                    className="grid size-9 place-items-center rounded-full border border-dental-brass/50 text-dental-brass"
                  >
                    <Check className="size-4" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-4 text-[1.0625rem] font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-dental-ivory/75">{item.text}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/dental-clinic/safety"
              className="mt-10 inline-flex items-center gap-2 rounded-sm font-semibold text-dental-brass-soft underline-offset-4 hover:underline focus-visible:outline-dental-ivory"
            >
              How we keep you safe, and the technology we use
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Before and after */}
      <section aria-labelledby="dental-gallery-title" className="dental-reveal">
        <Container className="grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <BeforeAfter
            after={featuredCase.photo}
            before={featuredCase.before}
            alt={featuredCase.alt}
            sizes="(min-width: 1024px) 680px, 92vw"
          />
          <div>
            <SectionHeading
              id="dental-gallery-title"
              eyebrow="Smile gallery"
              title="Real changes, explained honestly."
            />
            <p className="mt-6 font-dental-display text-[1.3rem] leading-snug text-dental-ink">
              {featuredCase.title}
            </p>
            <p className="mt-3 leading-relaxed text-dental-muted">{featuredCase.story}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-dental-line py-4 text-[0.9375rem]">
              <div>
                <dt className="text-[0.8125rem] text-dental-muted">Treatment</dt>
                <dd className="font-medium text-dental-ink">{featuredCase.treatment}</dd>
              </div>
              <div>
                <dt className="text-[0.8125rem] text-dental-muted">Time taken</dt>
                <dd className="font-medium text-dental-ink">{featuredCase.duration}</dd>
              </div>
            </dl>
            <Link
              href="/dental-clinic/smile-gallery"
              className={cn(buttonClasses("secondary", "md"), "mt-7")}
            >
              See more smiles
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Doctors */}
      <section aria-labelledby="dental-doctors-title" className="dental-reveal bg-dental-sand/60">
        <Container className="py-20 sm:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              id="dental-doctors-title"
              eyebrow="Your dentists"
              title="Four specialists, one shared way of working."
              intro="Every dentist at Ivorine holds a master's degree (MDS) in their field and is registered with the Uttarakhand State Dental Council."
            />
            <Link
              href="/dental-clinic/doctors"
              className={cn(buttonClasses("secondary", "md"), "self-start md:self-auto")}
            >
              Meet the team
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="dental-rail -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {RESIDENT_DOCTORS.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                className="w-[70vw] max-w-[18rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Reviews */}
      <section aria-labelledby="dental-reviews-title" className="dental-reveal">
        <Container className="py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading
                id="dental-reviews-title"
                eyebrow="Patient reviews"
                title="Kind words from Dehradun."
              />
              <RatingSummary className="mt-8" />
              <Link
                href="/dental-clinic/reviews"
                className={cn(buttonClasses("ghost", "md"), "mt-6")}
              >
                Read all reviews
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <ul className="dental-rail -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
              {REVIEWS.slice(0, 4).map((review, i) => (
                <li
                  key={review.id}
                  className="w-[84vw] max-w-[22rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
                >
                  <ReviewCard review={review} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* First visit and fees */}
      <section aria-label="Your first visit and fees" className="dental-reveal">
        <Container className="grid gap-5 pb-20 sm:pb-28 lg:grid-cols-2">
          <article className="flex flex-col rounded-[2rem] border border-dental-line/80 bg-dental-paper p-7 shadow-dental-soft sm:p-10">
            <Eyebrow>New patients</Eyebrow>
            <h2 className="mt-4 font-dental-display text-[2rem] leading-tight text-dental-ink">
              Your first visit, step by step
            </h2>
            <p className="mt-3 text-dental-muted">
              About 30 to 45 minutes. Consultation {formatINR(500)}, adjusted if treatment starts
              the same day.
            </p>
            <ol className="mt-7 flex-1 space-y-4">
              {FIRST_VISIT_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-dental-mist font-dental-display text-dental-spruce">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-dental-ink">{s.title}. </span>
                    <span className="text-dental-muted">{s.text}</span>
                  </p>
                </li>
              ))}
            </ol>
            <Link
              href="/dental-clinic/first-visit"
              className={cn(buttonClasses("ghost", "md"), "mt-7 self-start")}
            >
              What to expect and what to bring
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-[2rem] bg-dental-mint/70 p-7 sm:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-24 -bottom-24 size-72 rounded-full border-[28px] border-dental-paper/50"
            />
            <Eyebrow>Fees and payment</Eyebrow>
            <h2 className="relative mt-4 font-dental-display text-[2rem] leading-tight text-dental-ink">
              {EMI.headline}
            </h2>
            <p className="relative mt-3 text-dental-body">
              Spread implants, braces, aligners and smile makeovers over {EMI.months}, subject to
              approval. UPI, cards and cash welcome.
            </p>
            <div className="relative mt-7 rounded-2xl bg-dental-paper p-5 shadow-dental-soft">
              <p className="text-[0.875rem] text-dental-muted">{EMI.example.label}</p>
              <p className="mt-1 font-dental-display text-[2.2rem] leading-none text-dental-ink">
                {formatINR(EMI.example.monthly)}
                <span className="ml-1.5 font-dental-sans text-base text-dental-muted">a month</span>
              </p>
            </div>
            <div className="relative mt-4 flex flex-1 flex-col justify-end rounded-2xl border border-dental-spruce/15 bg-dental-paper/60 p-5">
              <p className="font-semibold text-dental-ink">
                {CARE_PLAN.name}: {formatINR(CARE_PLAN.price)} a year
              </p>
              <p className="mt-1 text-[0.9375rem] text-dental-body">
                Two check-ups and cleanings, X-rays, and 10% off all treatments.
              </p>
            </div>
            <Link
              href="/dental-clinic/fees"
              className={cn(buttonClasses("ghost", "md"), "relative mt-7 self-start")}
            >
              Full fee list, EMI and insurance
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </article>
        </Container>
      </section>

      <Container className="dental-reveal pb-20 sm:pb-28">
        <EmergencyBand />
      </Container>

      {/* FAQs */}
      <section aria-labelledby="dental-faq-title" className="dental-reveal">
        <Container className="grid gap-10 pb-20 sm:pb-28 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <SectionHeading
              id="dental-faq-title"
              eyebrow="Questions"
              title="Asked at the front desk every day."
            />
            <p className="mt-5 leading-relaxed text-dental-muted">
              Something else on your mind? Ask the WhatsApp assistant, or see every answer on the
              FAQ page.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dental-clinic/faqs" className={buttonClasses("secondary", "md")}>
                All FAQs
              </Link>
              <ChatButton className={buttonClasses("ghost", "md")}>Ask on WhatsApp</ChatButton>
            </div>
          </div>
          <FaqList items={HOME_FAQS} name="home-faq" />
        </Container>
      </section>

      {/* Location and timings */}
      <section aria-labelledby="dental-visit-title" className="dental-reveal bg-dental-sand/60">
        <Container className="grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <MapIllustration />
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {GETTING_HERE.slice(1, 3).map((note) => (
                <li key={note.title} className="rounded-2xl bg-dental-paper/70 p-4">
                  <p className="font-semibold text-dental-ink">{note.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-dental-muted">
                    {note.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              id="dental-visit-title"
              eyebrow="Visit us"
              title="On Rajpur Road, near Dilaram Chowk."
            />
            <address className="mt-6 flex gap-3 leading-relaxed text-dental-body not-italic">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-dental-brass-deep" />
              {FULL_ADDRESS}
            </address>
            <p className="mt-3 flex gap-3 leading-relaxed text-dental-muted">
              <Car aria-hidden="true" className="mt-1 size-5 shrink-0 text-dental-brass-deep" />
              {GETTING_HERE[0].text}
            </p>
            <HoursList className="mt-6 border-y border-dental-line" />
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={CLINIC.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "md")}
              >
                Get directions
                <ArrowUpRight aria-hidden="true" className="size-4" />
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
              <Link href="/dental-clinic/contact" className={buttonClasses("secondary", "md")}>
                Contact and parking
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <div className="pt-3 sm:pt-5">
        <CtaBand />
      </div>
    </>
  );
}
