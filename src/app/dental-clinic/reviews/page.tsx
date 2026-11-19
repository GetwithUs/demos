import type { Metadata } from "next";
import ReviewsBrowser from "@/sites/dental-clinic/components/ReviewsBrowser";
import { CtaBand, RatingSummary } from "@/sites/dental-clinic/components/sections";
import { Container, PageIntro } from "@/sites/dental-clinic/components/ui";
import { CLINIC } from "@/sites/dental-clinic/content/clinic";
import { REVIEWS } from "@/sites/dental-clinic/content/reviews";

export const metadata: Metadata = {
  title: "Patient reviews",
  description: `Rated ${CLINIC.rating.average} out of 5 from ${CLINIC.rating.count} patient reviews. Read what patients say about Ivorine Dental Studio, Dehradun.`,
};

const HIGHLIGHTS = [
  { value: "96%", label: "say the dentist explained everything clearly" },
  { value: "9 in 10", label: "seen within 10 minutes of their slot" },
  { value: "4.9", label: "average for children's visits" },
];

export default function ReviewsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Patient reviews"
        title="In our patients’ words."
        intro="We ask every patient for honest feedback after their visit, and we read all of it, especially the four-star ones."
        crumbs={[{ label: "Reviews" }]}
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <RatingSummary />
          <ul className="grid gap-px overflow-hidden rounded-[1.5rem] bg-dental-line/80 sm:grid-cols-3 lg:grid-cols-1">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h.label}
                className="flex flex-col gap-2 bg-dental-paper p-6 max-sm:flex-row max-sm:items-center max-sm:gap-5 lg:flex-row lg:items-center lg:gap-5"
              >
                <span className="shrink-0 font-dental-display text-[2.1rem] leading-none whitespace-nowrap text-dental-spruce max-sm:w-28 lg:w-28">
                  {h.value}
                </span>
                <span className="text-[0.9375rem] leading-snug text-dental-body">{h.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <section aria-labelledby="all-reviews-title" className="mt-16">
          <h2 id="all-reviews-title" className="sr-only">
            All reviews
          </h2>
          <ReviewsBrowser reviews={REVIEWS} />
        </section>

        <p className="mt-10 text-[0.875rem] text-dental-muted">
          Reviews are shown as written, with light edits for length. Patients chose whether to show
          their full name.
        </p>
      </Container>

      <CtaBand />
    </>
  );
}
