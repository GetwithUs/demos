import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ContentIcon } from "@/sites/skincare/components/icons";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { ButtonLink, Container, PageHeader } from "@/sites/skincare/components/ui";
import { productBySlug } from "@/sites/skincare/data/products";
import { WHY_ORUVI } from "@/sites/skincare/content/home";
import { ABOUT } from "@/sites/skincare/content/pages";
import founderImage from "@/sites/skincare/images/founder.jpg";
import labImage from "@/sites/skincare/images/about-lab.jpg";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Oruvi Skin is a Dehradun skincare brand making clinical formulas for Indian skin and weather.",
};

export default function AboutPage() {
  const serum = productBySlug("vitamin-c-15-brightening-serum");
  return (
    <>
      <Container>
        <PageHeader
          crumb="Our story"
          eyebrow={ABOUT.eyebrow}
          title={ABOUT.title}
          className="max-w-4xl"
        />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
          <div className="relative">
            <Image
              src={founderImage}
              alt="Ritika Negi, founder and formulator of Oruvi Skin"
              sizes="(min-width: 1024px) 40vw, 100vw"
              preload
              className="aspect-[9/11] w-full rounded-[2rem] object-cover"
            />
            {serum ? (
              <div
                className="absolute -right-3 -bottom-6 w-32 rounded-2xl px-3 pt-3 shadow-xl sm:-right-8 sm:w-40"
                style={{ background: serum.visual.tint }}
              >
                <ProductVisual spec={serum.visual} name={serum.name} />
              </div>
            ) : null}
          </div>
          <div className="skin-prose text-[1.05rem] leading-relaxed text-skin-body">
            <p className="font-skin-display text-2xl leading-snug text-skin-ink">{ABOUT.intro}</p>
            {ABOUT.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Container>

      <section className="mt-20 border-y border-skin-line bg-white py-12">
        <Container>
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {ABOUT.numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse text-center">
                <dt className="mt-1 text-sm text-skin-subtle">{n.label}</dt>
                <dd className="font-skin-display text-5xl text-skin-ink">{n.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="mt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
          <Image
            src={labImage}
            alt="The Oruvi formulation lab in Dehradun"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="aspect-[16/10] w-full rounded-[2rem] object-cover"
          />
          <div>
            <h2 className="font-skin-display text-4xl leading-tight tracking-tight text-skin-ink">
              What we will always do
            </h2>
            <ul className="mt-6 space-y-5">
              {ABOUT.principles.map((p) => (
                <li key={p.title} className="border-l-2 border-skin-accent pl-4">
                  <p className="font-medium text-skin-ink">{p.title}</p>
                  <p className="mt-1 text-sm text-skin-body">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="mt-20">
        <h2 className="font-skin-display text-4xl tracking-tight text-skin-ink">
          The people behind Oruvi
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {ABOUT.team.map((t, i) => (
            <li key={t.name} className="rounded-3xl bg-white p-6 ring-1 ring-skin-line">
              <span
                className="grid size-14 place-items-center rounded-full font-skin-display text-xl text-white"
                style={{ background: ["#2f5d50", "#9c4238", "#8f5410"][i % 3] }}
                aria-hidden
              >
                {t.name
                  .replace("Dr. ", "")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
              <p className="mt-4 font-skin-display text-xl text-skin-ink">{t.name}</p>
              <p className="text-sm font-medium text-skin-accent">{t.role}</p>
              <p className="mt-2 text-sm text-skin-body">{t.text}</p>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-20">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_ORUVI.map((w) => (
            <li key={w.title} className="rounded-2xl bg-skin-sand/70 p-6">
              <span className="grid size-11 place-items-center rounded-full bg-white text-skin-accent">
                <ContentIcon name={w.icon} className="size-5" />
              </span>
              <h3 className="mt-5 font-skin-display text-xl text-skin-ink">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-skin-body">{w.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/skincare/shop" size="lg">
            Shop the range <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/skincare/ingredients" size="lg" variant="outline">
            Read the ingredient glossary
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
