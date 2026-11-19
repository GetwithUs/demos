import { CONCERNS, SKIN_TYPES } from "@/sites/skincare/data/catalog";
import type { ConcernId, Product } from "@/sites/skincare/data/types";
import type { QuizAnswers } from "@/sites/skincare/content/quiz";

/**
 * Turns skin quiz answers into a morning and night routine from the live catalogue. Only
 * products that are switched on in the dashboard are used; a missing product just drops
 * its step. Pure, so it is unit tested (tests/skincare/shop.test.ts).
 */

export type RoutineStep = { step: string; product: Product; why: string; note?: string };

export type Routine = {
  profile: string[];
  am: RoutineStep[];
  pm: RoutineStep[];
  extras: RoutineStep[];
  /** Every product in the routine, once. */
  products: Product[];
  /** A kit that covers most of the routine for less, if there is one. */
  kit?: Product;
  tips: string[];
};

const S = {
  salicylicWash: "salicylic-2-clearing-face-wash",
  gentleCleanser: "gentle-ceramide-cream-cleanser",
  niacinamide: "niacinamide-10-clarifying-serum",
  vitaminC: "vitamin-c-15-brightening-serum",
  hyaluronic: "hyaluronic-hydrating-serum",
  retinol: "retinol-0-3-night-serum",
  arbutin: "alpha-arbutin-spot-corrector",
  glycolic: "glycolic-5-pore-refining-toner",
  ceramideCream: "ceramide-barrier-moisturiser",
  gel: "oil-free-gel-moisturiser",
  spf: "invisible-sunscreen-spf50",
  mask: "kesar-glow-overnight-mask",
  eye: "peptide-under-eye-cream",
  lip: "spf30-lip-balm",
  kit: "clear-skin-routine-kit",
} as const;

const WHY: Record<string, string> = {
  [S.salicylicWash]:
    "Salicylic acid clears the oil and dead skin that clog pores, without leaving skin tight.",
  [S.gentleCleanser]:
    "Cleans without disturbing your skin barrier, so the steps after it sting less.",
  [S.niacinamide]:
    "Niacinamide balances oil, keeps pores clearer and fades marks. It suits almost everyone.",
  [S.vitaminC]: "Stable vitamin C for glow and even tone, and extra defence under your sunscreen.",
  [S.hyaluronic]: "Hydration without heaviness. Apply on damp skin so it has water to hold on to.",
  [S.retinol]: "Encapsulated retinol renews skin slowly through the night for smoother texture.",
  [S.arbutin]: "Alpha arbutin with tranexamic acid works on spots and tan from two sides, gently.",
  [S.glycolic]:
    "Gentle glycolic exfoliation for smoother, brighter skin. Two to three nights a week.",
  [S.ceramideCream]:
    "Ceramides rebuild your barrier so skin holds water and handles actives better.",
  [S.gel]: "Weightless hydration that dries matte, made for oily skin and humid days.",
  [S.spf]: "The step that protects everything else you do. SPF 50 PA++++ with no white cast.",
  [S.mask]: "Saffron and peptides as an overnight treat for a rested morning glow.",
  [S.eye]: "Caffeine and peptides for puffiness and fine lines around the eyes.",
  [S.lip]: "Lips tan and dry out too. SPF 30 with a soft tint.",
};

const AM_SERUM: Record<ConcernId, (sensitive: boolean) => string> = {
  acne: () => S.niacinamide,
  oiliness: () => S.niacinamide,
  pigmentation: (s) => (s ? S.arbutin : S.vitaminC),
  dullness: (s) => (s ? S.hyaluronic : S.vitaminC),
  dryness: () => S.hyaluronic,
  ageing: (s) => (s ? S.hyaluronic : S.vitaminC),
  sensitivity: () => S.hyaluronic,
  "sun-protection": (s) => (s ? S.niacinamide : S.vitaminC),
};

function pmCandidates(concern: ConcernId, canRetinol: boolean, canAcid: boolean): string[] {
  switch (concern) {
    case "acne":
      return canRetinol ? [S.retinol, S.niacinamide] : [S.niacinamide];
    case "oiliness":
      return [S.niacinamide];
    case "pigmentation":
    case "sun-protection":
      return [S.arbutin];
    case "dullness":
      return canAcid ? [S.glycolic, S.hyaluronic] : [S.hyaluronic];
    case "ageing":
      return canRetinol ? [S.retinol, S.hyaluronic] : [S.hyaluronic];
    case "dryness":
    case "sensitivity":
      return [S.hyaluronic];
  }
}

const SENSITIVITY_LABEL = {
  low: "Resilient",
  some: "Sometimes sensitive",
  high: "Reactive",
} as const;
const CLIMATE_LABEL = {
  humid: "Hot and humid",
  "hot-dry": "Hot and dry",
  cold: "Cool and hilly",
  city: "City pollution",
} as const;

export function buildRoutine(a: QuizAnswers, products: Product[]): Routine {
  const find = (slug: string) => products.find((p) => p.slug === slug && p.active);
  const sensitive = a.skinType === "sensitive" || a.sensitivity === "high";
  const oilyish = a.skinType === "oily" || (a.skinType === "combination" && a.climate === "humid");
  const canRetinol = !sensitive && a.age !== "under-20";
  const canAcid = !sensitive;
  const wants = (c: ConcernId) => a.concerns.includes(c);
  const concerns: ConcernId[] = a.concerns.length
    ? a.concerns
    : [
        oilyish
          ? "oiliness"
          : a.skinType === "dry"
            ? "dryness"
            : sensitive
              ? "sensitivity"
              : "dullness",
      ];

  const step = (label: string, slug: string, note?: string): RoutineStep | undefined => {
    const product = find(slug);
    return product ? { step: label, product, why: WHY[slug] ?? product.tagline, note } : undefined;
  };

  const cleanserSlug =
    !sensitive &&
    (a.skinType === "oily" || a.skinType === "combination") &&
    (wants("acne") || wants("oiliness") || a.climate === "humid")
      ? S.salicylicWash
      : S.gentleCleanser;
  const moisturiserSlug = oilyish ? S.gel : S.ceramideCream;

  const amSerum = AM_SERUM[concerns[0]](sensitive);
  let pmSerum: string | undefined;
  for (const c of concerns) {
    const option = pmCandidates(c, canRetinol, canAcid).find((s) => s !== amSerum);
    if (option) {
      pmSerum = option;
      break;
    }
  }
  pmSerum ??= pmCandidates(concerns[0], canRetinol, canAcid)[0];

  const retinolNote =
    pmSerum === S.retinol && a.actives === "never"
      ? "New to retinol: start twice a week and build up over a month."
      : pmSerum === S.retinol
        ? "Skip it on nights you exfoliate."
        : undefined;
  const pmIsToner = pmSerum === S.glycolic;

  const am: (RoutineStep | undefined)[] = [
    step("Cleanse", cleanserSlug),
    step("Treat", amSerum),
    a.routine === "minimal" && oilyish ? undefined : step("Moisturise", moisturiserSlug),
    step("Protect", S.spf, "Two finger lengths. Reapply outdoors."),
  ];
  if (a.routine === "minimal" && !oilyish) am.splice(1, 1);

  const pm: (RoutineStep | undefined)[] = [
    step(
      "Cleanse",
      cleanserSlug,
      a.climate === "city"
        ? "Massage for a full minute to lift pollution and sunscreen."
        : undefined,
    ),
    pmIsToner
      ? step("Exfoliate", S.glycolic, "Two to three nights a week. Other nights, skip this step.")
      : step("Treat", pmSerum, retinolNote),
    pmIsToner && a.routine !== "minimal" ? step("Hydrate", S.hyaluronic) : undefined,
    step("Moisturise", moisturiserSlug),
  ];

  const extras: (RoutineStep | undefined)[] = [];
  if (a.routine === "full") {
    if (
      canAcid &&
      !pmIsToner &&
      pmSerum !== S.retinol &&
      (wants("dullness") || wants("oiliness") || wants("pigmentation"))
    ) {
      extras.push(step("Exfoliate", S.glycolic, "Two nights a week, before your serum."));
    }
    if (wants("ageing") || a.age === "30s" || a.age === "40s" || a.age === "50-plus") {
      extras.push(step("Eye care", S.eye, "Morning and night, a rice grain per eye."));
    }
    if (wants("dullness") || wants("dryness") || wants("pigmentation")) {
      extras.push(step("Weekly treat", S.mask, "Two nights a week as your last step."));
    }
    extras.push(step("Lips", S.lip, "Every time you step out."));
  }

  const clean = (list: (RoutineStep | undefined)[]) =>
    list.filter((s): s is RoutineStep => Boolean(s));
  const amSteps = clean(am);
  const pmSteps = clean(pm);
  const extraSteps = clean(extras);
  const unique = new Map<string, Product>();
  for (const s of [...amSteps, ...pmSteps, ...extraSteps]) unique.set(s.product.slug, s.product);

  const kit = find(S.kit);
  const kitParts: string[] = [S.salicylicWash, S.niacinamide, S.gel, S.spf];
  const kitFits = kit && kitParts.every((slug) => unique.has(slug));

  const tips: string[] = [];
  if (a.climate === "humid")
    tips.push("In humid weather keep layers thin. A gel moisturiser is enough, even at night.");
  if (a.climate === "hot-dry")
    tips.push(
      "Hot, dry air pulls water out of skin. Apply serums on damp skin and moisturise twice a day.",
    );
  if (a.climate === "cold")
    tips.push(
      "Hill winters are drying. Skip hot water on your face and keep a balm handy for lips.",
    );
  if (a.climate === "city")
    tips.push(
      "Pollution sticks to sweat and sunscreen. A thorough evening cleanse matters more than any serum.",
    );
  if (sensitive)
    tips.push(
      "Patch test each new product on your inner arm for 48 hours, and add one new product a week.",
    );
  else tips.push("Add one new product a week so you know what is working.");
  tips.push("Give it 4 to 6 weeks of daily use before you judge results.");

  return {
    profile: [
      SKIN_TYPES[a.skinType],
      SENSITIVITY_LABEL[a.sensitivity],
      CLIMATE_LABEL[a.climate],
      ...concerns.map((c) => CONCERNS[c].label),
    ],
    am: amSteps,
    pm: pmSteps,
    extras: extraSteps,
    products: [...unique.values()],
    kit: kitFits ? kit : undefined,
    tips,
  };
}
