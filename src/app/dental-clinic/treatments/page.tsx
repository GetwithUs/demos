import type { Metadata } from "next";
import Link from "next/link";
import { TreatmentRow } from "@/sites/dental-clinic/components/cards";
import { CtaBand, EmergencyBand } from "@/sites/dental-clinic/components/sections";
import { Container, PageIntro } from "@/sites/dental-clinic/components/ui";
import { ESTIMATE_PROMISE } from "@/sites/dental-clinic/content/payments";
import {
  CATEGORY_BLURBS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  TREATMENTS,
} from "@/sites/dental-clinic/content/treatments";

export const metadata: Metadata = {
  title: "Treatments and starting prices",
  description:
    "Check-ups, fillings, root canals, braces and aligners, implants, crowns, whitening, veneers, children's dentistry and wisdom tooth removal in Dehradun, with clear starting prices.",
};

export default function TreatmentsPage() {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    id: category.toLowerCase(),
    treatments: TREATMENTS.filter((t) => t.category === category),
  })).filter((g) => g.treatments.length > 0);

  return (
    <>
      <PageIntro
        eyebrow="Treatments"
        title="Care for every stage of your smile."
        intro="Ten treatments, each led by the right specialist. Every page shows what happens, how long it takes and a starting price, so there are no surprises."
        crumbs={[{ label: "Treatments" }]}
      >
        <nav aria-label="Treatment groups" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex rounded-full border border-dental-line bg-dental-paper/80 px-4 py-2 text-[0.875rem] font-medium text-dental-ink transition-colors hover:border-dental-spruce hover:bg-dental-spruce hover:text-white"
                >
                  {CATEGORY_LABELS[g.category]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      <Container className="py-16 sm:py-20">
        <div className="divide-y divide-dental-line/80">
          {groups.map((g, i) => (
            <section
              key={g.id}
              id={g.id}
              aria-labelledby={`${g.id}-title`}
              className="grid scroll-mt-28 gap-6 py-12 first:pt-0 last:pb-0 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12"
            >
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="font-dental-display text-[1rem] text-dental-brass-deep">0{i + 1}</p>
                <h2
                  id={`${g.id}-title`}
                  className="mt-1 font-dental-display text-[1.75rem] leading-tight text-dental-ink sm:text-[2rem]"
                >
                  {CATEGORY_LABELS[g.category]}
                </h2>
                <p className="mt-2 leading-relaxed text-dental-muted">
                  {CATEGORY_BLURBS[g.category]}
                </p>
              </div>
              <ul className="grid gap-4">
                {g.treatments.map((t) => (
                  <li key={t.slug}>
                    <TreatmentRow treatment={t} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside
          aria-label="About our prices"
          className="mt-20 grid gap-6 rounded-[2rem] bg-dental-paper p-7 shadow-dental-soft sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
        >
          <h2 className="font-dental-display text-[1.75rem] leading-tight text-dental-ink">
            How our prices work
          </h2>
          <div>
            <ul className="space-y-2.5">
              {ESTIMATE_PROMISE.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-dental-body">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-dental-brass"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/dental-clinic/fees"
              className="mt-5 inline-block rounded-sm font-semibold text-dental-spruce underline underline-offset-4"
            >
              See the full fee list, EMI and insurance
            </Link>
          </div>
        </aside>

        <EmergencyBand className="mt-10" />
      </Container>

      <CtaBand />
    </>
  );
}
