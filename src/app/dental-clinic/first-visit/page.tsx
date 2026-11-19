import { Baby, Check, HeartHandshake, Hand, Headphones, MessageCircleQuestion } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, FaqList } from "@/sites/dental-clinic/components/sections";
import { Container, Eyebrow, PageIntro, buttonClasses } from "@/sites/dental-clinic/components/ui";
import { FAQ_GROUPS } from "@/sites/dental-clinic/content/faqs";
import { FIRST_VISIT_BRING, FIRST_VISIT_STEPS } from "@/sites/dental-clinic/content/studio";
import consultation from "@/sites/dental-clinic/images/consultation.jpg";
import kids from "@/sites/dental-clinic/images/kids.jpg";
import { formatINR } from "@/sites/dental-clinic/lib/format";

export const metadata: Metadata = {
  title: "Your first visit",
  description:
    "What happens at your first visit to Ivorine Dental Studio, Dehradun: how long it takes, what it costs, what to bring, and how we look after nervous patients.",
};

const NERVOUS = [
  {
    icon: Hand,
    title: "Raise a hand, we stop",
    text: "Agree a stop signal before we start. We always pause when you use it.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Nothing without explaining",
    text: "We tell you what each step will feel like before we do it.",
  },
  {
    icon: Headphones,
    title: "Bring your own music",
    text: "Headphones are welcome, and we have a few spare pairs.",
  },
  {
    icon: HeartHandshake,
    title: "Numbing gel first",
    text: "Injections are given slowly, after a numbing gel, and only when needed.",
  },
];

export default function FirstVisitPage() {
  const visitFaqs = FAQ_GROUPS[0].items;

  return (
    <>
      <PageIntro
        eyebrow="New patients"
        title="Your first visit, without the guesswork."
        intro={`About 30 to 45 minutes, ${formatINR(500)} for the consultation, and you leave with a written plan. You are never asked to start treatment the same day unless you want to.`}
        crumbs={[{ label: "Your first visit" }]}
      />

      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <section aria-labelledby="steps-title">
            <h2
              id="steps-title"
              className="font-dental-display text-[2rem] leading-tight text-dental-ink"
            >
              What happens, step by step
            </h2>
            <ol className="mt-8">
              {FIRST_VISIT_STEPS.map((s, i) => (
                <li key={s.title} className="relative flex gap-5 pb-9 last:pb-0">
                  {i < FIRST_VISIT_STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-12 bottom-1 left-[1.375rem] w-px bg-dental-line"
                    />
                  ) : null}
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-dental-spruce font-dental-display text-lg text-white">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-[1.125rem] font-semibold text-dental-ink">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-dental-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-dental-sand">
              <Image
                src={consultation}
                alt="A dentist explaining an X-ray on a screen to a patient"
                fill
                sizes="(min-width: 1024px) 460px, 92vw"
                loading="eager"
                className="object-cover"
              />
            </div>
            <section
              aria-labelledby="bring-title"
              className="rounded-[1.75rem] bg-dental-paper p-6 shadow-dental-soft sm:p-8"
            >
              <h2
                id="bring-title"
                className="font-dental-display text-[1.5rem] leading-tight text-dental-ink"
              >
                What to bring
              </h2>
              <ul className="mt-4 space-y-3">
                {FIRST_VISIT_BRING.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-dental-body">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-dental-spruce"
                      strokeWidth={2.4}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section aria-labelledby="nervous-title" className="mt-24">
          <Eyebrow>Feeling nervous?</Eyebrow>
          <h2
            id="nervous-title"
            className="mt-4 max-w-2xl font-dental-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-dental-ink"
          >
            You are not alone. About a third of our patients tell us the same.
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {NERVOUS.map((n) => (
              <li
                key={n.title}
                className="rounded-[1.5rem] border border-dental-line/80 bg-dental-paper p-6"
              >
                <n.icon
                  aria-hidden="true"
                  className="size-7 text-dental-spruce"
                  strokeWidth={1.5}
                />
                <h3 className="mt-4 font-semibold text-dental-ink">{n.title}</h3>
                <p className="mt-1.5 leading-relaxed text-dental-muted">{n.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="kids-title"
          className="mt-24 grid items-center gap-10 overflow-hidden rounded-[2rem] bg-dental-brass-soft/60 lg:grid-cols-2"
        >
          <div className="relative aspect-[4/3] h-full lg:aspect-auto lg:min-h-[22rem]">
            <Image
              src={kids}
              alt="A smiling child in the dental chair while the dentist shows a toothbrush"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-7 pt-0 sm:p-10 lg:pt-10">
            <Baby aria-hidden="true" className="size-8 text-dental-brass-deep" strokeWidth={1.5} />
            <h2
              id="kids-title"
              className="mt-4 font-dental-display text-[2rem] leading-tight text-dental-ink"
            >
              Bringing a child?
            </h2>
            <p className="mt-3 leading-relaxed text-dental-body">
              First visits for children are short and playful: a ride in the chair, counting teeth
              and a sticker at the end. Parents stay in the room. Morning slots suit little ones
              best.
            </p>
            <Link
              href="/dental-clinic/treatments/kids-dentistry"
              className={`${buttonClasses("secondary", "md")} mt-6`}
            >
              Children&rsquo;s dentistry
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="visit-faq-title"
          className="mt-24 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"
        >
          <h2
            id="visit-faq-title"
            className="font-dental-display text-[2rem] leading-tight text-dental-ink"
          >
            Questions before your visit
          </h2>
          <FaqList items={visitFaqs} name="visit-faq" />
        </section>
      </Container>

      <CtaBand
        title="Book your first visit."
        text={`Consultation ${formatINR(500)}, adjusted if treatment starts the same day.`}
      />
    </>
  );
}
