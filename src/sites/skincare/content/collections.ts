import type { CategoryId, ConcernId } from "@/sites/skincare/data/types";

/** Intro copy for each concern landing page (/skincare/concerns/[id]). */
export const CONCERN_PAGES: Record<
  ConcernId,
  { title: string; intro: string; causes: string; ingredients: string[]; routine: string[] }
> = {
  acne: {
    title: "Acne and breakouts",
    intro:
      "Breakouts start when oil and dead skin clog a pore and bacteria move in. Humidity, stress and heavy products make it worse. A gentle, consistent routine works better than harsh scrubs.",
    causes: "Excess oil, clogged pores, hormones, humidity, heavy or pore-clogging products.",
    ingredients: ["salicylic-acid", "niacinamide", "retinol"],
    routine: [
      "Wash with salicylic acid morning and night",
      "Niacinamide serum to balance oil",
      "Oil-free gel moisturiser, even on oily skin",
      "Sunscreen so marks do not darken",
    ],
  },
  pigmentation: {
    title: "Dark spots and pigmentation",
    intro:
      "Indian skin makes melanin quickly, so sun, heat and every pimple can leave a mark. Fading them takes steady use of the right actives and, above all, daily sunscreen.",
    causes: "Sun exposure, post-acne marks, hormones, heat and friction.",
    ingredients: ["alpha-arbutin", "tranexamic-acid", "vitamin-c", "niacinamide"],
    routine: [
      "Vitamin C in the morning",
      "Alpha arbutin with tranexamic acid twice a day",
      "SPF 50 PA++++, reapplied outdoors",
      "Patience: 8 to 12 weeks with daily use",
    ],
  },
  dullness: {
    title: "Dullness",
    intro:
      "Dull skin is often a build-up of dead cells, dehydration and pollution. Gentle exfoliation, antioxidants and hydration bring back an even, healthy glow.",
    causes: "Dead skin build-up, dehydration, pollution, late nights.",
    ingredients: ["vitamin-c", "glycolic-acid", "saffron", "hyaluronic-acid"],
    routine: [
      "Vitamin C every morning",
      "Glycolic toner 2 to 3 nights a week",
      "Hydrating serum on damp skin",
      "An overnight mask before big days",
    ],
  },
  dryness: {
    title: "Dryness",
    intro:
      "Tight, flaky skin has a thirsty barrier. Hot showers, cold hill winters and air conditioning pull water out. Hydrate, then lock it in.",
    causes: "Weak skin barrier, cold or dry air, hot water, harsh cleansers.",
    ingredients: ["ceramides", "hyaluronic-acid", "squalane"],
    routine: [
      "A cream cleanser that does not strip",
      "Hyaluronic serum on damp skin",
      "Ceramide moisturiser morning and night",
      "Sunscreen, even in winter",
    ],
  },
  oiliness: {
    title: "Oiliness and large pores",
    intro:
      "Oily skin still needs moisture. Skipping it makes skin produce more oil. Balance oil with light textures and actives that keep pores clean.",
    causes: "Genetics, heat and humidity, over-washing, heavy creams.",
    ingredients: ["niacinamide", "salicylic-acid", "glycolic-acid"],
    routine: [
      "Salicylic face wash",
      "Niacinamide 10% serum",
      "Oil-free gel moisturiser",
      "A matte, invisible sunscreen",
    ],
  },
  ageing: {
    title: "Fine lines and ageing",
    intro:
      "Most visible ageing in India comes from the sun. Daily SPF, a retinoid at night and a strong barrier do more than any single miracle cream.",
    causes: "Sun damage, natural loss of collagen, dehydration.",
    ingredients: ["retinol", "peptides", "vitamin-c", "uv-filters"],
    routine: [
      "Vitamin C and SPF 50 in the morning",
      "Retinol at night, starting slowly",
      "Ceramides to keep skin comfortable",
      "Peptide eye cream morning and night",
    ],
  },
  sensitivity: {
    title: "Sensitive skin",
    intro:
      "Stinging, redness and reactions mean the barrier needs care. Fewer steps, no fragrance and soothing ingredients help skin settle.",
    causes: "A weak barrier, fragrance, over-exfoliation, sudden weather changes.",
    ingredients: ["ceramides", "hyaluronic-acid", "niacinamide"],
    routine: [
      "A gentle cream cleanser",
      "Hyaluronic acid with B5",
      "Ceramide moisturiser",
      "Patch test anything new for 48 hours",
    ],
  },
  "sun-protection": {
    title: "Sun protection",
    intro:
      "The single best step for tan, spots and early ageing. Indian UV levels are high all year, indoors near windows too.",
    causes: "UVA tans and ages skin, UVB burns it. Both are strong in India all year.",
    ingredients: ["uv-filters", "vitamin-c", "niacinamide"],
    routine: [
      "Two finger lengths of SPF 50 every morning",
      "Reapply every 2 to 3 hours outdoors",
      "SPF lip balm too",
      "Vitamin C underneath for extra defence",
    ],
  },
};

/** Intro copy for each category landing page (/skincare/categories/[id]). */
export const CATEGORY_PAGES: Record<CategoryId, { intro: string; tip: string }> = {
  cleansers: {
    intro:
      "Clean skin without the squeaky, tight feeling. One for oily and acne-prone skin, one for dry and sensitive.",
    tip: "Massage for 60 seconds so the actives have time to work.",
  },
  toners: {
    intro: "Exfoliating and hydrating mists that prep skin for everything after.",
    tip: "Acid toners go on at night, 2 to 3 times a week to begin with.",
  },
  serums: {
    intro:
      "Concentrated actives at honest strengths for acne, spots, glow, hydration and fine lines.",
    tip: "Use thinnest to thickest. Water serums first, oils last.",
  },
  moisturisers: {
    intro: "A gel for oily skin and humid days, a ceramide cream for dry and sensitive skin.",
    tip: "Apply on slightly damp skin to lock in more hydration.",
  },
  sunscreens: {
    intro: "SPF 50 PA++++ with no white cast and no grease, made to be worn every single day.",
    tip: "Two finger lengths for face and neck. Reapply every 2 to 3 hours outdoors.",
  },
  masks: {
    intro: "Overnight treatments for the nights your skin needs a little more.",
    tip: "Use as the last step of your night routine, 2 to 3 times a week.",
  },
  "eye-lip": {
    intro: "Targeted care for the thinnest skin on your face.",
    tip: "Pat, do not rub. Use your ring finger for the lightest touch.",
  },
  kits: {
    intro:
      "Complete routines in one box, with a printed routine card and a better price than buying separately.",
    tip: "A kit costs less than buying each product on its own, and makes an easy gift.",
  },
};
