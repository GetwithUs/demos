import { Check, CreditCard, FileText, ShieldQuestion } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import EmiCalculator from "@/sites/dental-clinic/components/EmiCalculator";
import { ToothIcon } from "@/sites/dental-clinic/components/icons";
import { CtaBand } from "@/sites/dental-clinic/components/sections";
import { Container, Eyebrow, PageIntro, buttonClasses } from "@/sites/dental-clinic/components/ui";
import {
  CARE_PLAN,
  DIAGNOSTICS,
  EMI,
  ESTIMATE_PROMISE,
  INSURANCE_POINTS,
  PAYMENT_METHODS,
} from "@/sites/dental-clinic/content/payments";
import { TREATMENTS } from "@/sites/dental-clinic/content/treatments";
import { formatINR } from "@/sites/dental-clinic/lib/format";

export const metadata: Metadata = {
  title: "Fees, EMI and insurance",
  description:
    "Starting prices for every treatment at Ivorine Dental Studio, Dehradun, with no-cost EMI from 3 to 12 months, the Ivorine Care Plan and honest notes on dental insurance.",
};

export default function FeesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Fees and payment"
        title="Clear prices, before you sit in the chair."
        intro="Starting prices for every treatment, an EMI calculator and plain answers about insurance. Your exact cost is always confirmed in writing after a check-up."
        crumbs={[{ label: "Fees and EMI" }]}
      />

      <Container className="py-16 sm:py-20">
        <ul className="grid gap-4 md:grid-cols-3">
          {ESTIMATE_PROMISE.map((line, i) => (
            <li
              key={line}
              className="flex gap-4 rounded-2xl bg-dental-paper p-5 shadow-dental-soft"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-dental-mint font-dental-display text-dental-spruce">
                {i + 1}
              </span>
              <p className="leading-relaxed text-dental-body">{line}</p>
            </li>
          ))}
        </ul>

        <section aria-labelledby="price-list-title" className="mt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="price-list-title"
              className="font-dental-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-dental-ink"
            >
              Price list
            </h2>
            <p className="text-[0.875rem] text-dental-muted">
              All prices in rupees, including GST where it applies.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-dental-line/80 bg-dental-paper shadow-dental-soft">
            <div className="border-b border-dental-line/80 p-5 sm:px-8">
              <h3 className="flex items-center gap-3 font-dental-display text-[1.35rem] text-dental-ink">
                <span className="grid size-10 place-items-center rounded-xl bg-dental-mist text-dental-spruce">
                  <FileText aria-hidden="true" className="size-5" strokeWidth={1.6} />
                </span>
                Consultation and X-rays
              </h3>
              <dl className="mt-4 grid gap-x-10 sm:grid-cols-2">
                {DIAGNOSTICS.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-dental-line py-2.5"
                  >
                    <dt className="text-dental-body">{d.label}</dt>
                    <dd className="font-semibold text-dental-ink tabular-nums">
                      {formatINR(d.from)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            {TREATMENTS.map((t) => (
              <div
                key={t.slug}
                className="border-b border-dental-line/80 p-5 last:border-b-0 sm:px-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-3 font-dental-display text-[1.35rem] text-dental-ink">
                    <span className="grid size-10 place-items-center rounded-xl bg-dental-mist text-dental-spruce">
                      <ToothIcon name={t.icon} className="size-6" />
                    </span>
                    {t.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    {t.emi ? (
                      <span className="rounded-full bg-dental-brass-soft px-2.5 py-1 text-[0.75rem] font-semibold text-dental-brass-deep">
                        EMI available
                      </span>
                    ) : null}
                    <Link
                      href={`/dental-clinic/treatments/${t.slug}`}
                      className="rounded-sm text-[0.875rem] font-semibold text-dental-spruce underline-offset-4 hover:underline"
                    >
                      Details<span className="sr-only"> about {t.name}</span>
                    </Link>
                  </div>
                </div>
                <dl className="mt-3 grid gap-x-10 sm:grid-cols-2">
                  {t.priceOptions.map((o) => (
                    <div
                      key={o.label}
                      className="flex items-baseline justify-between gap-4 border-b border-dashed border-dental-line py-2.5"
                    >
                      <dt className="text-dental-body">
                        {o.label}
                        {o.note ? (
                          <span className="block text-[0.8125rem] text-dental-muted">{o.note}</span>
                        ) : null}
                      </dt>
                      <dd className="shrink-0 font-semibold text-dental-ink tabular-nums">
                        <span className="text-[0.75rem] font-normal text-dental-muted">from </span>
                        {formatINR(o.from)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="emi-title"
          className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
        >
          <div>
            <Eyebrow>Pay over time</Eyebrow>
            <h2
              id="emi-title"
              className="mt-4 font-dental-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-dental-ink"
            >
              {EMI.headline}
            </h2>
            <ul className="mt-6 space-y-3">
              {EMI.points.map((p) => (
                <li key={p} className="flex gap-3 leading-relaxed text-dental-body">
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-dental-spruce"
                    strokeWidth={2.4}
                  />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-dental-line p-5">
              <CreditCard
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-dental-brass-deep"
              />
              <p className="text-dental-body">
                <span className="font-semibold text-dental-ink">We accept </span>
                {PAYMENT_METHODS.join(", ")}.
              </p>
            </div>
          </div>
          <EmiCalculator />
        </section>

        <section aria-labelledby="plan-title" className="mt-20 grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem] bg-dental-spruce p-7 text-dental-ivory sm:p-10">
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 size-64 rounded-full bg-[radial-gradient(circle,rgb(192_154_95/0.35),transparent_65%)]"
            />
            <p className="relative text-[0.75rem] font-semibold tracking-[0.16em] text-dental-brass uppercase">
              Membership
            </p>
            <h2
              id="plan-title"
              className="relative mt-3 font-dental-display text-[2.2rem] leading-tight text-white"
            >
              {CARE_PLAN.name}
            </h2>
            <p className="relative mt-2 font-dental-display text-[2.8rem] leading-none text-white">
              {formatINR(CARE_PLAN.price)}
              <span className="ml-2 font-dental-sans text-base text-dental-ivory/75">
                {CARE_PLAN.period}
              </span>
            </p>
            <ul className="relative mt-6 space-y-2.5">
              {CARE_PLAN.includes.map((item) => (
                <li key={item} className="flex gap-3 text-dental-ivory/90">
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-dental-brass"
                    strokeWidth={2.4}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="relative mt-5 text-[0.875rem] text-dental-ivory/70">{CARE_PLAN.note}</p>
            <Link
              href="/dental-clinic/book?treatment=check-up-and-cleaning"
              className={`${buttonClasses("light", "md")} relative mt-7`}
            >
              Start with a check-up
            </Link>
          </div>

          <div className="rounded-[2rem] border border-dental-line/80 bg-dental-paper p-7 sm:p-10">
            <ShieldQuestion
              aria-hidden="true"
              className="size-8 text-dental-brass-deep"
              strokeWidth={1.5}
            />
            <h2 className="mt-4 font-dental-display text-[2rem] leading-tight text-dental-ink">
              Does insurance cover it?
            </h2>
            <p className="mt-2 text-dental-muted">The honest answer: usually only in some cases.</p>
            <ul className="mt-6 space-y-3.5">
              {INSURANCE_POINTS.map((p) => (
                <li key={p} className="flex gap-3 leading-relaxed text-dental-body">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-dental-brass"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>

      <CtaBand
        title="Get your written estimate."
        text="Book a consultation for an itemised plan with every option and its cost, before anything begins."
      />
    </>
  );
}
