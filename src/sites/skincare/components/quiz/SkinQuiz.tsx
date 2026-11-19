"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  Moon,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/cn";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { buttonClass } from "@/sites/skincare/components/ui";
import { productBySlug } from "@/sites/skincare/data/products";
import { QUIZ, type QuizAnswers } from "@/sites/skincare/content/quiz";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useProducts } from "@/sites/skincare/lib/store";
import { useAddToCart } from "@/sites/skincare/shop/actions";
import { defaultVariant, inStock } from "@/sites/skincare/shop/catalog";
import { buildRoutine, type RoutineStep } from "@/sites/skincare/shop/quiz";
import { useShopUI } from "@/sites/skincare/shop/ui";

type Draft = Partial<QuizAnswers>;

/** Seven-question skin quiz that builds an AM and PM routine from the catalogue. */
export default function SkinQuiz() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pointerPick = useRef(false);

  useEffect(() => {
    if (phase !== "intro") headingRef.current?.focus();
  }, [phase, step]);

  if (phase === "intro") return <Intro onStart={() => setPhase("quiz")} />;
  if (phase === "result") {
    return (
      <Result
        answers={draft as QuizAnswers}
        headingRef={headingRef}
        onRetake={() => {
          setDraft({});
          setStep(0);
          setPhase("quiz");
        }}
      />
    );
  }

  const q = QUIZ[step];
  const value = draft[q.id];
  const answered = Array.isArray(value) ? value.length > 0 : Boolean(value);
  const next = () => (step === QUIZ.length - 1 ? setPhase("result") : setStep(step + 1));

  const pickSingle = (v: string) => {
    setDraft((d) => ({ ...d, [q.id]: v }));
    // Mouse and touch picks move on by themselves; keyboard users (arrow keys) press Next.
    if (pointerPick.current) setTimeout(next, 260);
    pointerPick.current = false;
  };
  const toggleMulti = (v: string, max: number) => {
    setDraft((d) => {
      const list = ((d[q.id] as string[] | undefined) ?? []).slice();
      const i = list.indexOf(v);
      if (i >= 0) list.splice(i, 1);
      else if (list.length < max) list.push(v);
      return { ...d, [q.id]: list };
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="sr-only">Skin quiz</h1>
      <div className="flex items-center justify-between text-sm text-skin-subtle">
        <span>
          Question {step + 1} of {QUIZ.length}
        </span>
        <button
          type="button"
          onClick={() => setPhase("intro")}
          className="underline-offset-4 hover:text-skin-ink hover:underline"
        >
          Exit quiz
        </button>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-skin-sand"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={QUIZ.length}
        aria-valuenow={step + 1}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-skin-accent transition-[width] duration-500"
          style={{ width: `${((step + 1) / QUIZ.length) * 100}%` }}
        />
      </div>

      <fieldset key={q.id} className="mt-10 animate-skin-fade-up">
        <legend className="contents">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-skin-display text-3xl leading-tight text-skin-ink outline-none sm:text-4xl"
          >
            {q.title}
          </h2>
        </legend>
        <p className="mt-2 text-skin-subtle">{q.help}</p>
        <div className={cn("mt-7 grid gap-3", q.options.length > 5 ? "sm:grid-cols-2" : "")}>
          {q.kind === "multi"
            ? q.options.map((o) => {
                const list = (value as string[] | undefined) ?? [];
                const pos = list.indexOf(o.value);
                const checked = pos >= 0;
                const full = list.length >= q.max && !checked;
                return (
                  <label
                    key={o.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-2xl border bg-white px-5 py-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                      checked
                        ? "border-skin-ink ring-1 ring-skin-ink"
                        : "border-skin-line hover:border-skin-ink/40",
                      full && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      disabled={full}
                      onChange={() => toggleMulti(o.value, q.max)}
                    />
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                        checked ? "border-skin-ink bg-skin-ink text-white" : "border-skin-line",
                      )}
                      aria-hidden
                    >
                      {checked ? pos + 1 : null}
                    </span>
                    <span className="font-medium text-skin-ink">{o.label}</span>
                    {pos === 0 ? (
                      <span className="ml-auto text-xs text-skin-accent">Main concern</span>
                    ) : null}
                  </label>
                );
              })
            : q.options.map((o) => {
                const checked = value === o.value;
                return (
                  <label
                    key={o.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-2xl border bg-white px-5 py-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                      checked
                        ? "border-skin-ink ring-1 ring-skin-ink"
                        : "border-skin-line hover:border-skin-ink/40",
                    )}
                    onPointerDown={() => {
                      pointerPick.current = true;
                    }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="sr-only"
                      checked={checked}
                      onChange={() => pickSingle(o.value)}
                    />
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border-2",
                        checked ? "border-skin-ink" : "border-skin-line",
                      )}
                      aria-hidden
                    >
                      {checked ? <span className="size-2.5 rounded-full bg-skin-ink" /> : null}
                    </span>
                    <span>
                      <span className="block font-medium text-skin-ink">{o.label}</span>
                      {o.hint ? <span className="text-sm text-skin-subtle">{o.hint}</span> : null}
                    </span>
                  </label>
                );
              })}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => (step ? setStep(step - 1) : setPhase("intro"))}
          className={buttonClass("ghost", "md")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!answered}
          className={buttonClass("primary", "md")}
        >
          {step === QUIZ.length - 1 ? "See my routine" : "Next"}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  const stack = [
    "gentle-ceramide-cream-cleanser",
    "vitamin-c-15-brightening-serum",
    "invisible-sunscreen-spf50",
  ].map(productBySlug);
  return (
    <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-skin-forest p-8 text-white sm:p-12 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-[#b9d3c4] uppercase">
          2 minute skin quiz
        </p>
        <h1 className="mt-3 font-skin-display text-4xl leading-tight sm:text-6xl">
          Your routine, built around your skin
        </h1>
        <p className="mt-4 max-w-lg text-white/80">
          Seven questions about your skin, your city and your time. You get a morning and night
          routine from our range, with the reason for every step, made with input from our
          consulting dermatologist.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-white/90">
          {["Takes about 2 minutes", "No sign-up needed", "Add the whole routine in one tap"].map(
            (t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-4 text-[#b9d3c4]" aria-hidden />
                {t}
              </li>
            ),
          )}
        </ul>
        <button
          type="button"
          onClick={onStart}
          className={buttonClass(
            "primary",
            "lg",
            "mt-8 bg-white text-skin-forest hover:bg-skin-sand",
          )}
        >
          Start the quiz
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      <div className="relative mx-auto flex w-full max-w-sm items-end justify-center gap-3">
        {stack.map((p, i) =>
          p ? (
            <div
              key={p.slug}
              className={cn("w-1/3 rounded-2xl px-2 pt-3", i === 1 && "-translate-y-6")}
              style={{ background: p.visual.tint }}
            >
              <ProductVisual spec={p.visual} name={p.name} className="animate-skin-float" />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

function Result({
  answers,
  onRetake,
  headingRef,
}: {
  answers: QuizAnswers;
  onRetake: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const products = useProducts();
  const addToCart = useAddToCart();
  const open = useShopUI((s) => s.open);
  const toast = useShopUI((s) => s.toast);
  const routine = buildRoutine(answers, products);
  const buyable = routine.products.filter(inStock);
  const price = buyable.reduce((s, p) => s + defaultVariant(p).price, 0);
  const mrp = buyable.reduce((s, p) => s + defaultVariant(p).mrp, 0);

  const addAll = (list = buyable) => {
    list.forEach((p) => addToCart(p, defaultVariant(p).id, 1, { openCart: false }));
    toast(`Added ${list.length} products to your cart`);
    open("cart");
  };

  return (
    <div className="animate-skin-fade-up">
      <div className="rounded-[2rem] bg-skin-accent-soft p-6 sm:p-10">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-skin-accent uppercase">
          <Sparkles className="size-4" aria-hidden /> Your skin profile
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 font-skin-display text-4xl leading-tight text-skin-ink outline-none sm:text-5xl"
        >
          Your personalised routine
        </h1>
        <ul className="mt-5 flex flex-wrap gap-2">
          {routine.profile.map((p) => (
            <li key={p} className="rounded-full bg-white px-3.5 py-1.5 text-sm text-skin-ink">
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RoutineColumn
          title="Morning"
          icon={<Sun className="size-5" aria-hidden />}
          steps={routine.am}
          tone="bg-skin-saffron-soft text-skin-saffron-ink"
        />
        <RoutineColumn
          title="Night"
          icon={<Moon className="size-5" aria-hidden />}
          steps={routine.pm}
          tone="bg-[#e6e3f1] text-[#4b3f7a]"
        />
      </div>

      {routine.extras.length ? (
        <div className="mt-6">
          <RoutineColumn
            title="For your full ritual"
            icon={<Sparkles className="size-5" aria-hidden />}
            steps={routine.extras}
            tone="bg-skin-rose-soft text-skin-rose-ink"
            grid
          />
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-skin-line sm:p-8">
          <h2 className="font-skin-display text-2xl text-skin-ink">Your whole routine</h2>
          <p className="mt-1 text-sm text-skin-subtle">
            {buyable.length} products, each used in the steps above.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {buyable.map((p) => (
              <li
                key={p.slug}
                className="w-14 rounded-xl px-1 pt-1"
                style={{ background: p.visual.tint }}
                title={p.name}
              >
                <ProductVisual spec={p.visual} name={p.name} />
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-skin-ink tabular-nums">
              {formatINR(price)}
            </span>
            <s className="text-skin-subtle">{formatINR(mrp)}</s>
          </p>
          <p className="mt-1 text-sm text-skin-success">
            Save {formatINR(mrp - price)} on MRP, plus {formatINR(150)} more with code DUO150
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addAll()}
              disabled={!buyable.length}
              className={buttonClass("primary", "lg")}
            >
              <ShoppingBag className="size-4" aria-hidden />
              Add whole routine to cart
            </button>
            <button type="button" onClick={onRetake} className={buttonClass("ghost", "lg")}>
              <RotateCcw className="size-4" aria-hidden />
              Retake quiz
            </button>
          </div>
          {routine.kit && inStock(routine.kit) ? (
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-skin-sand/70 p-4">
              <span
                className="w-14 shrink-0 rounded-xl px-1 pt-1"
                style={{ background: routine.kit.visual.tint }}
              >
                <ProductVisual spec={routine.kit.visual} name={routine.kit.name} />
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block font-medium text-skin-ink">
                  Or save with the {routine.kit.name}
                </span>
                <span className="text-skin-body">
                  Four of these steps in one box for {formatINR(defaultVariant(routine.kit).price)}.
                </span>
              </span>
              <Link
                href={`/skincare/products/${routine.kit.slug}`}
                className="shrink-0 text-sm font-medium text-skin-accent hover:underline"
              >
                View kit
              </Link>
            </div>
          ) : null}
        </div>
        <div className="rounded-3xl bg-skin-forest p-6 text-white sm:p-8">
          <h2 className="flex items-center gap-2 font-skin-display text-2xl">
            <Lightbulb className="size-5 text-[#f3c77a]" aria-hidden /> Tips for your skin
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            {routine.tips.map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[#b9d3c4]" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-white/60">
            This routine is general guidance, not medical advice. For persistent acne, rashes or
            sudden changes, see a dermatologist.
          </p>
        </div>
      </div>
    </div>
  );
}

function RoutineColumn({
  title,
  icon,
  steps,
  tone,
  grid = false,
}: {
  title: string;
  icon: ReactNode;
  steps: RoutineStep[];
  tone: string;
  grid?: boolean;
}) {
  const addToCart = useAddToCart();
  return (
    <section
      className="rounded-3xl bg-white p-6 ring-1 ring-skin-line sm:p-8"
      aria-label={`${title} routine`}
    >
      <h2 className="flex items-center gap-3 font-skin-display text-2xl text-skin-ink">
        <span className={cn("grid size-10 place-items-center rounded-full", tone)}>{icon}</span>
        {title}
      </h2>
      <ol className={cn("mt-6", grid ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4" : "space-y-5")}>
        {steps.map((s, i) => {
          const v = defaultVariant(s.product);
          return (
            <li key={`${s.step}-${s.product.slug}`} className="flex gap-4">
              <Link
                href={`/skincare/products/${s.product.slug}`}
                className="w-20 shrink-0 self-start rounded-xl px-1.5 pt-1.5"
                style={{ background: s.product.visual.tint }}
                tabIndex={-1}
                aria-hidden
              >
                <ProductVisual spec={s.product.visual} name={s.product.name} />
              </Link>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.14em] text-skin-subtle uppercase">
                  {grid ? s.step : `Step ${i + 1}: ${s.step}`}
                </p>
                <Link
                  href={`/skincare/products/${s.product.slug}`}
                  className="mt-0.5 block font-medium text-skin-ink hover:underline"
                >
                  {s.product.name}
                </Link>
                <p className="mt-1 text-sm text-skin-body">{s.why}</p>
                {s.note ? (
                  <p className="mt-1 text-xs font-medium text-skin-accent">{s.note}</p>
                ) : null}
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="font-semibold text-skin-ink">{formatINR(v.price)}</span>
                  {inStock(s.product) ? (
                    <button
                      type="button"
                      onClick={() => addToCart(s.product, v.id)}
                      className="font-medium text-skin-accent hover:underline"
                    >
                      Add<span className="sr-only"> {s.product.name}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-skin-subtle">Out of stock</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
