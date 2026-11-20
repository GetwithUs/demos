import { ArrowRight, BadgeCheck, Check, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  HeroProductChip,
  IngredientSpotlight,
  KitsAndOffers,
} from "@/sites/skincare/components/home/HomeClient";
import { ContentIcon } from "@/sites/skincare/components/icons";
import ProductRail from "@/sites/skincare/components/ProductRail";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import Newsletter from "@/sites/skincare/components/shop/Newsletter";
import { ButtonLink, Container, SectionHeading, Stars } from "@/sites/skincare/components/ui";
import { CATEGORIES, CONCERNS } from "@/sites/skincare/data/catalog";
import { productBySlug } from "@/sites/skincare/data/products";
import type { CategoryId, ConcernId } from "@/sites/skincare/data/types";
import {
  CATEGORY_TILES,
  CONCERN_TILES,
  HERO,
  PRESS,
  QUIZ_TEASER,
  TESTIMONIALS,
  TRUST_POINTS,
  WHY_ORUVI,
} from "@/sites/skincare/content/home";
import communityImage from "@/sites/skincare/images/community.jpg";
import heroImage from "@/sites/skincare/images/hero.jpg";
import routineImage from "@/sites/skincare/images/routine.jpg";
import textureImage from "@/sites/skincare/images/texture.jpg";

export const metadata: Metadata = {
  title: { absolute: "Oruvi Skin | Clinical skincare for Indian skin" },
};

export default function SkincareHome() {
  return (
    <>
      <Hero />
      <TrustStrip />

      <Container className="mt-20 sm:mt-24">
        <ProductRail
          source={{ kind: "bestsellers" }}
          heading={<SectionHeading eyebrow="Bestsellers" title="The ones India keeps reordering" />}
        />
      </Container>

      <ShopByConcern />

      <section
        className="mt-20 bg-skin-sand/60 py-16 sm:mt-24 sm:py-20"
        aria-labelledby="actives-title"
      >
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
          <div className="relative">
            <Image
              src={textureImage}
              alt="A swirl of rich white cream, showing an Oruvi texture"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-square w-full rounded-[2rem] object-cover"
            />
            <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/90 p-4 text-sm text-skin-body backdrop-blur sm:right-auto sm:max-w-xs">
              <p className="font-medium text-skin-ink">
                Every active, at a strength you can read on the label.
              </p>
              <p className="mt-1 text-xs text-skin-subtle">
                No hidden percentages, no added fragrance.
              </p>
            </div>
          </div>
          <div>
            <SectionHeading
              id="actives-title"
              eyebrow="Know your actives"
              title="Ingredients that do what they say"
            />
            <div className="mt-8">
              <IngredientSpotlight />
            </div>
          </div>
        </Container>
      </section>

      <ShopByCategory />

      <QuizTeaser />

      <Container className="mt-20 sm:mt-24">
        <SectionHeading
          eyebrow="Kits and offers"
          title="More routine, less spend"
          text="Bundle your routine, or stack an offer code with the prepaid discount."
        />
        <div className="mt-8">
          <KitsAndOffers />
        </div>
      </Container>

      <Container className="mt-20 sm:mt-24">
        <ProductRail
          source={{ kind: "new" }}
          heading={<SectionHeading eyebrow="Just launched" title="New launches" />}
        />
      </Container>

      <Reviews />
      <Press />
      <WhyOruvi />

      <Container className="mt-20 sm:mt-24">
        <div className="grid items-center gap-8 rounded-[2rem] bg-skin-accent-soft px-6 py-10 sm:px-12 lg:grid-cols-2">
          <div>
            <p className="font-skin-display text-3xl leading-tight text-skin-ink sm:text-4xl">
              Get 10% off your first routine
            </p>
            <p className="mt-2 text-skin-body">
              Join 80,000 readers of Skin Notes for ingredient explainers and early access to
              launches.
            </p>
          </div>
          <Newsletter />
        </div>
      </Container>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 -right-40 size-[38rem] rounded-full bg-skin-accent-soft/70 blur-3xl"
        aria-hidden
      />
      <Container className="relative grid items-center gap-12 pt-8 pb-14 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-16 lg:pb-20 [&>*]:min-w-0">
        <div className="animate-skin-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-skin-accent ring-1 ring-skin-line">
            <span className="size-1.5 rounded-full bg-skin-accent" aria-hidden />
            {HERO.eyebrow}
          </p>
          <h1 className="mt-5 font-skin-display text-[2.7rem] leading-[1.02] font-normal tracking-tight text-skin-ink sm:text-6xl lg:text-[4.4rem]">
            {HERO.title} <em className="font-normal text-skin-accent italic">{HERO.titleAccent}</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-skin-body">{HERO.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={HERO.primary.href} size="lg">
              {HERO.primary.label}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href={HERO.secondary.href} size="lg" variant="outline">
              {HERO.secondary.label}
            </ButtonLink>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-6 sm:flex sm:gap-x-10">
            {HERO.stats.map((s, i) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-0.5 text-sm text-skin-subtle">{s.label}</dt>
                <dd className="flex items-center gap-2 font-skin-display text-3xl text-skin-ink">
                  {s.value}
                  {i === 0 ? (
                    <Star className="size-5 fill-skin-star text-skin-star" aria-hidden />
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] animate-skin-fade-up [animation-delay:120ms]">
          <Image
            src={heroImage}
            alt="A woman with dewy skin spritzing an Oruvi face mist"
            preload
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[4/5] w-full rounded-[2rem] object-cover"
          />
          <HeroProductChip
            slug={HERO.featuredSlug}
            className="absolute -bottom-6 left-3 max-w-[calc(100%-1.5rem)] sm:-left-6 sm:max-w-sm"
          />
          <RotatingSeal className="absolute -top-5 right-3 sm:-right-6" />
        </div>
      </Container>
    </section>
  );
}

/** A slowly rotating circular badge drawn in SVG. */
function RotatingSeal({ className }: { className?: string }) {
  return (
    <div className={cn("size-28 sm:size-32", className)} aria-hidden>
      <div className="relative size-full rounded-full bg-skin-ink text-white shadow-xl">
        <svg viewBox="0 0 120 120" className="size-full animate-[skin-spin_24s_linear_infinite]">
          <defs>
            <path id="oruvi-seal-path" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
          </defs>
          <text fontSize="9" fill="currentColor" fontWeight="600">
            <textPath href="#oruvi-seal-path" textLength="272" lengthAdjust="spacing">
              DERMATOLOGIST TESTED · FRAGRANCE FREE ·
            </textPath>
          </text>
        </svg>
        <BadgeCheck
          className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-[#b9d3c4]"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <section aria-label="Why shoppers trust Oruvi" className="border-y border-skin-line bg-white">
      <Container>
        <ul className="-mx-4 skin-no-scrollbar flex snap-x gap-8 overflow-x-auto px-4 py-5 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible">
          {TRUST_POINTS.map((t) => (
            <li key={t.title} className="flex shrink-0 snap-start items-center gap-3 lg:shrink">
              <span className="grid size-10 place-items-center rounded-full bg-skin-accent-soft text-skin-accent">
                <ContentIcon name={t.icon} className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-medium text-skin-ink">{t.title}</span>
                <span className="block text-xs text-skin-subtle">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ShopByConcern() {
  return (
    <Container className="mt-20 sm:mt-24">
      <SectionHeading
        eyebrow="Shop by concern"
        title="What is your skin asking for?"
        action={
          <Link
            href="/skincare/skin-quiz"
            className="inline-flex items-center gap-1 text-sm font-medium text-skin-ink underline-offset-4 hover:underline"
          >
            Not sure? Take the quiz <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {(Object.keys(CONCERNS) as ConcernId[]).map((id) => {
          const tile = CONCERN_TILES[id];
          return (
            <li key={id}>
              <Link
                href={`/skincare/concerns/${id}`}
                className="group flex h-full min-h-40 flex-col justify-between rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-26px_rgba(31,36,32,0.5)] sm:min-h-48 sm:p-6"
                style={{ background: tile.tint }}
              >
                <span
                  className="font-skin-display text-[2rem] leading-none italic sm:text-[2.6rem]"
                  style={{ color: tile.ink }}
                >
                  {tile.mark}
                </span>
                <span>
                  <span className="flex items-center justify-between gap-2 text-[0.95rem] leading-snug font-medium text-skin-ink">
                    {CONCERNS[id].label}
                    <ArrowRight
                      className="size-4 shrink-0 transition group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-1 hidden text-sm text-skin-body sm:block">
                    {CONCERNS[id].blurb}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

function ShopByCategory() {
  return (
    <Container className="mt-20 sm:mt-24">
      <SectionHeading eyebrow="Shop by category" title="Build your routine, step by step" />
      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-5">
        {(Object.keys(CATEGORY_TILES) as CategoryId[]).map((id) => {
          const p = productBySlug(CATEGORY_TILES[id]);
          return (
            <li key={id}>
              <Link href={`/skincare/categories/${id}`} className="group block">
                <div
                  className="overflow-hidden rounded-2xl px-[18%] pt-[10%]"
                  style={{ background: p?.visual.tint }}
                >
                  {p ? (
                    <ProductVisual
                      spec={p.visual}
                      name={p.name}
                      className="transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <p className="mt-3 flex items-center justify-between font-skin-display text-lg text-skin-ink">
                  {CATEGORIES[id].plural}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

function QuizTeaser() {
  const am = [
    "salicylic-2-clearing-face-wash",
    "niacinamide-10-clarifying-serum",
    "invisible-sunscreen-spf50",
  ].map(productBySlug);
  const short = ["Salicylic face wash", "Niacinamide 10% serum", "SPF 50 sunscreen"];
  return (
    <section className="mt-20 sm:mt-24">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] bg-skin-forest text-white lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image
              src={routineImage}
              alt="A woman doing her skincare routine at a mirror"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-5 left-5 w-64 rounded-2xl bg-white p-4 text-skin-ink shadow-2xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
                Your AM routine
              </p>
              <ol className="mt-3 space-y-2.5">
                {am.map((p, i) =>
                  p ? (
                    <li key={p.slug} className="flex items-center gap-3">
                      <span
                        className="w-9 shrink-0 rounded-md px-0.5 pt-0.5"
                        style={{ background: p.visual.tint }}
                      >
                        <ProductVisual spec={p.visual} name={p.name} />
                      </span>
                      <span className="text-xs leading-snug">
                        <span className="text-skin-subtle">Step {i + 1}</span>
                        <span className="block font-medium">{short[i]}</span>
                      </span>
                    </li>
                  ) : null,
                )}
              </ol>
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:py-16">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#b9d3c4] uppercase">
              {QUIZ_TEASER.eyebrow}
            </p>
            <h2 className="mt-3 font-skin-display text-4xl leading-tight sm:text-5xl">
              {QUIZ_TEASER.title}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/80">{QUIZ_TEASER.text}</p>
            <ul className="mt-6 space-y-2.5">
              {QUIZ_TEASER.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="grid size-5 place-items-center rounded-full bg-white/15">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/skincare/skin-quiz"
              size="lg"
              className="mt-8 w-fit bg-white text-skin-forest hover:bg-skin-sand"
            >
              Take the skin quiz
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Reviews() {
  return (
    <section className="mt-20 sm:mt-24" aria-labelledby="reviews-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr] lg:gap-12 [&>*]:min-w-0">
          <div>
            <SectionHeading id="reviews-title" eyebrow="Real reviews" title="Loved across India" />
            <div className="mt-6 flex items-center gap-3">
              <span className="font-skin-display text-5xl text-skin-ink">4.6</span>
              <span>
                <Stars rating={4.6} size={18} />
                <span className="mt-1 block text-sm text-skin-subtle">
                  from 15,000+ verified reviews
                </span>
              </span>
            </div>
            <Image
              src={communityImage}
              alt="Friends with different Indian skin tones smiling together"
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="mt-8 hidden aspect-[7/5] w-full rounded-[1.5rem] object-cover lg:block"
            />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => {
              const p = productBySlug(t.slug);
              return (
                <li
                  key={t.name}
                  className="flex flex-col rounded-2xl border border-skin-line bg-white p-5"
                >
                  <Stars rating={t.rating} />
                  <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-skin-body">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-skin-line pt-4">
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-skin-ink">
                        {t.name}
                        <BadgeCheck
                          className="size-4 text-skin-accent"
                          aria-label="Verified buyer"
                        />
                      </p>
                      <p className="text-xs text-skin-subtle">
                        {t.city} · {t.skin} skin
                      </p>
                    </div>
                    {p ? (
                      <Link
                        href={`/skincare/products/${p.slug}`}
                        className="flex items-center gap-2 text-right text-xs text-skin-subtle hover:text-skin-ink"
                      >
                        <span className="hidden max-w-28 leading-snug sm:block">{p.name}</span>
                        <span
                          className="w-9 shrink-0 rounded-md px-0.5 pt-0.5"
                          style={{ background: p.visual.tint }}
                        >
                          <ProductVisual spec={p.visual} name={p.name} />
                        </span>
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function Press() {
  const style = {
    serif: "font-skin-display text-2xl",
    caps: "text-lg font-bold tracking-[0.3em]",
    italic: "font-skin-display text-2xl italic",
    lower: "text-2xl font-semibold tracking-tight",
  } as const;
  return (
    <section
      className="mt-20 border-y border-skin-line bg-white py-12 sm:mt-24"
      aria-label="Press mentions"
    >
      <Container>
        <p className="text-center text-xs font-semibold tracking-[0.18em] text-skin-subtle uppercase">
          As featured in
        </p>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRESS.map((p) => (
            <li key={p.name} className="text-center">
              <p className={cn("text-skin-ink/80", style[p.style as keyof typeof style])}>
                {p.name}
              </p>
              <p className="mx-auto mt-3 max-w-60 text-sm leading-relaxed text-skin-subtle">
                &ldquo;{p.quote}&rdquo;
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function WhyOruvi() {
  return (
    <Container className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-skin-subtle uppercase">
          Why Oruvi
        </p>
        <h2 className="mt-2 font-skin-display text-[1.85rem] leading-[1.1] tracking-tight text-skin-ink sm:text-[2.35rem]">
          Science-led, made for Indian skin
        </h2>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
      <p className="mt-6 text-center">
        <Link
          href="/skincare/about"
          className="inline-flex items-center gap-1 text-sm font-medium text-skin-ink underline-offset-4 hover:underline"
        >
          Read our story <ArrowRight className="size-4" aria-hidden />
        </Link>
      </p>
    </Container>
  );
}
