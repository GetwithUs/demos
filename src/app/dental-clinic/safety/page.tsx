import { Check, Cpu, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/sites/dental-clinic/components/sections";
import { Container, Eyebrow, PageIntro } from "@/sites/dental-clinic/components/ui";
import {
  SAFETY_EXTRAS,
  SAFETY_STEPS,
  STUDIO_PHOTOS,
  TECHNOLOGY,
} from "@/sites/dental-clinic/content/studio";
import studioRoom from "@/sites/dental-clinic/images/studio-room.jpg";

export const metadata: Metadata = {
  title: "Safety, sterilisation and technology",
  description:
    "How Ivorine Dental Studio sterilises every instrument with a Class B autoclave, and the technology we use: intraoral scanner, digital X-rays, rotary endodontics, microscope and laser.",
};

export default function SafetyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Safety and technology"
        title="Clean, careful and digital, every visit."
        intro="The things you cannot see matter most in a dental clinic. Here is exactly how we keep instruments sterile, and the equipment that makes treatment more precise and more comfortable."
        crumbs={[{ label: "Safety and technology" }]}
      />

      <Container className="py-16 sm:py-24">
        <section aria-labelledby="steril-title">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Eyebrow>Sterilisation</Eyebrow>
              <h2
                id="steril-title"
                className="mt-4 font-dental-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-dental-ink"
              >
                Four steps for every instrument.
              </h2>
            </div>
            <p className="leading-relaxed text-dental-muted lg:pb-2">
              The same sequence, every time, logged and checked weekly. Ask to see the sterilisation
              room on your visit; we are happy to show you.
            </p>
          </div>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[1.75rem] bg-dental-line/80 sm:grid-cols-2 lg:grid-cols-4">
            {SAFETY_STEPS.map((s, i) => (
              <li key={s.title} className="bg-dental-paper p-6 sm:p-7">
                <span className="font-dental-display text-[2.6rem] leading-none text-dental-brass">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-[1.125rem] font-semibold text-dental-ink">{s.title}</h3>
                <p className="mt-1.5 leading-relaxed text-dental-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-6 rounded-[1.75rem] bg-dental-mist p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
            <ShieldCheck
              aria-hidden="true"
              className="size-12 text-dental-spruce"
              strokeWidth={1.3}
            />
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {SAFETY_EXTRAS.map((item) => (
                <li key={item} className="flex gap-3 text-dental-body">
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-dental-spruce"
                    strokeWidth={2.4}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ul className="mt-16 grid gap-5 md:grid-cols-3">
          {STUDIO_PHOTOS.map((photo) => (
            <li key={photo.caption}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-dental-sand">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 380px, 92vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[0.9375rem] text-dental-muted">
                  {photo.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="tech-title"
          className="mt-24 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
        >
          <div>
            <Eyebrow>Technology</Eyebrow>
            <h2
              id="tech-title"
              className="mt-4 font-dental-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-dental-ink"
            >
              Equipment chosen for comfort and precision.
            </h2>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-t-[10rem] rounded-b-[2rem] bg-dental-sand">
              <Image
                src={studioRoom}
                alt="A treatment room with a modern dental chair by a large window"
                fill
                sizes="(min-width: 1024px) 440px, 92vw"
                className="object-cover"
              />
            </div>
          </div>
          <ul className="divide-y divide-dental-line border-y border-dental-line">
            {TECHNOLOGY.map((t) => (
              <li key={t.name} className="flex gap-5 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-dental-mist text-dental-spruce">
                  <Cpu aria-hidden="true" className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="font-semibold text-dental-ink">{t.name}</h3>
                  <p className="mt-1 leading-relaxed text-dental-muted">{t.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <CtaBand />
    </>
  );
}
