import { ArrowRight, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import BeforeAfter from "@/sites/dental-clinic/components/BeforeAfter";
import { CtaBand } from "@/sites/dental-clinic/components/sections";
import { Container, PageIntro, buttonClasses } from "@/sites/dental-clinic/components/ui";
import { SMILE_CASES } from "@/sites/dental-clinic/content/gallery";

export const metadata: Metadata = {
  title: "Smile gallery: before and after",
  description:
    "Before and after photos of whitening, clear aligners and veneers at Ivorine Dental Studio, Dehradun. Drag to compare.",
};

export default function SmileGalleryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Smile gallery"
        title="Before and after, side by side."
        intro="Drag the handle, or use the arrow keys, to compare. Each case shows what was done, by whom and how long it took."
        crumbs={[{ label: "Smile gallery" }]}
      />

      <Container className="py-16 sm:py-24">
        <ul className="space-y-20 sm:space-y-28">
          {SMILE_CASES.map((c, i) => (
            <li
              key={c.id}
              className="dental-reveal grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14"
            >
              <BeforeAfter
                after={c.photo}
                before={c.before}
                alt={c.alt}
                sizes="(min-width: 1024px) 700px, 92vw"
                preload={i === 0}
                className={i % 2 === 1 ? "lg:order-2" : undefined}
              />
              <div>
                <p className="text-[0.75rem] font-semibold tracking-[0.16em] text-dental-brass-deep uppercase">
                  Case {i + 1}: {c.treatment}
                </p>
                <h2 className="mt-3 font-dental-display text-[clamp(1.8rem,3.6vw,2.4rem)] leading-tight text-dental-ink">
                  {c.title}
                </h2>
                <p className="mt-4 leading-relaxed text-dental-body">{c.story}</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-dental-line py-4 text-[0.9375rem]">
                  <div>
                    <dt className="text-[0.8125rem] text-dental-muted">Dentist</dt>
                    <dd className="font-medium text-dental-ink">{c.doctor}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] text-dental-muted">Time taken</dt>
                    <dd className="font-medium text-dental-ink">{c.duration}</dd>
                  </div>
                </dl>
                <Link
                  href={`/dental-clinic/treatments/${c.slug}`}
                  className={`${buttonClasses("ghost", "md")} mt-5`}
                >
                  About this treatment
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-20 flex max-w-3xl gap-3 rounded-2xl bg-dental-paper p-5 text-[0.9375rem] leading-relaxed text-dental-muted shadow-dental-soft">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-dental-brass-deep" />
          Photos are shared with each patient&rsquo;s written consent. Every mouth is different, so
          your result may differ; your dentist will show you a realistic preview before you start.
        </p>
      </Container>

      <CtaBand
        title="Picture your own smile."
        text="Start with a consultation. For aligners and makeovers, you see a digital preview before you decide."
      />
    </>
  );
}
