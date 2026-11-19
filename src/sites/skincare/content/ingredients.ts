import type { ConcernId, Product } from "@/sites/skincare/data/types";

/** One active in the ingredient glossary, the "Shop by ingredient" menu and the listing filter. */
export type Ingredient = {
  id: string;
  name: string;
  /** Other names shoppers search for. */
  aka: string[];
  /** Short line for menus and chips. */
  short: string;
  whatItDoes: string;
  bestFor: ConcernId[];
  howToUse: string;
  pairsWith: string;
  avoidWith?: string;
  /** Matched against a product's key ingredients (and full list) to find products that contain it. */
  match: RegExp;
  /** Soft colour for the glossary card. */
  tint: string;
};

export const INGREDIENTS: Ingredient[] = [
  {
    id: "niacinamide",
    name: "Niacinamide",
    aka: ["vitamin B3", "nicotinamide"],
    short: "Oil control, pores and marks",
    whatItDoes:
      "A form of vitamin B3 that balances oil, strengthens the skin barrier and visibly fades dark marks. One of the most forgiving actives, so it suits most skin types.",
    bestFor: ["oiliness", "acne", "pigmentation"],
    howToUse: "Morning and night, after cleansing. 5% to 10% is plenty for most people.",
    pairsWith: "Hyaluronic acid, ceramides, salicylic acid, sunscreen.",
    match: /niacinamide/i,
    tint: "#e5ecdf",
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    aka: ["ethyl ascorbic acid", "ascorbic acid", "vit c"],
    short: "Glow and even tone",
    whatItDoes:
      "An antioxidant that brightens dull skin, helps fade tan and dark spots, and supports your sunscreen against pollution and UV damage.",
    bestFor: ["dullness", "pigmentation", "ageing"],
    howToUse: "Mornings, after cleansing and before moisturiser. Always follow with sunscreen.",
    pairsWith: "Sunscreen, hyaluronic acid, vitamin E, ferulic acid.",
    avoidWith: "Strong acids in the same routine if your skin is sensitive.",
    match: /ascorbic|vitamin c/i,
    tint: "#f7e6cc",
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic acid",
    aka: ["sodium hyaluronate", "HA"],
    short: "Deep hydration",
    whatItDoes:
      "A humectant that pulls water into the skin for a plump, smooth look. Multiple molecule sizes hydrate at different depths.",
    bestFor: ["dryness", "dullness", "ageing"],
    howToUse: "On slightly damp skin, morning and night, then seal in with moisturiser.",
    pairsWith: "Everything. It layers well under any serum or cream.",
    match: /hyaluronic/i,
    tint: "#e1ecf2",
  },
  {
    id: "salicylic-acid",
    name: "Salicylic acid",
    aka: ["BHA", "beta hydroxy acid"],
    short: "Clears pores and breakouts",
    whatItDoes:
      "An oil-soluble exfoliant that gets inside pores to clear oil and dead skin, which may help reduce blackheads and breakouts.",
    bestFor: ["acne", "oiliness"],
    howToUse:
      "In a face wash once or twice a day. Start once a day if your skin is dry or sensitive.",
    pairsWith: "Niacinamide, a light gel moisturiser, sunscreen.",
    avoidWith: "Retinol on the same night if you are just starting out.",
    match: /salicylic/i,
    tint: "#dfeee9",
  },
  {
    id: "retinol",
    name: "Retinol",
    aka: ["vitamin A", "retinoid"],
    short: "Texture and fine lines",
    whatItDoes:
      "A vitamin A derivative that speeds up skin renewal, so texture looks smoother, fine lines soften and pores stay clearer over 8 to 12 weeks.",
    bestFor: ["ageing", "acne", "dullness"],
    howToUse: "Night only. Start twice a week and build up slowly. Sunscreen every morning.",
    pairsWith: "Ceramides, hyaluronic acid, squalane.",
    avoidWith: "Glycolic or salicylic acid on the same night. Not for use during pregnancy.",
    match: /retinol/i,
    tint: "#ebe3f1",
  },
  {
    id: "alpha-arbutin",
    name: "Alpha arbutin",
    aka: ["arbutin"],
    short: "Dark spots and tan",
    whatItDoes:
      "Gently reduces the look of dark spots, tan and post-acne marks by slowing excess pigment, without the peeling of stronger options.",
    bestFor: ["pigmentation", "dullness"],
    howToUse: "Twice a day on spots or the whole face, followed by sunscreen in the day.",
    pairsWith: "Vitamin C, niacinamide, tranexamic acid, sunscreen.",
    match: /arbutin/i,
    tint: "#f3e1de",
  },
  {
    id: "tranexamic-acid",
    name: "Tranexamic acid",
    aka: ["TXA"],
    short: "Stubborn pigmentation",
    whatItDoes:
      "Targets stubborn, hormonal-looking pigmentation and tan. Works well alongside alpha arbutin and niacinamide.",
    bestFor: ["pigmentation"],
    howToUse: "Morning and night, after cleansing.",
    pairsWith: "Alpha arbutin, niacinamide, sunscreen.",
    match: /tranexamic/i,
    tint: "#f6e6e1",
  },
  {
    id: "glycolic-acid",
    name: "Glycolic acid",
    aka: ["AHA", "alpha hydroxy acid"],
    short: "Smooth, glowing skin",
    whatItDoes:
      "A small AHA that loosens dull surface cells for smoother, brighter skin and a more even tone.",
    bestFor: ["dullness", "pigmentation", "oiliness"],
    howToUse: "At night, 2 to 3 times a week to begin with. Sunscreen the next morning.",
    pairsWith: "Hyaluronic acid, ceramides.",
    avoidWith: "Retinol on the same night.",
    match: /glycolic/i,
    tint: "#e8eef6",
  },
  {
    id: "ceramides",
    name: "Ceramides",
    aka: ["ceramide NP", "skin lipids"],
    short: "Barrier repair",
    whatItDoes:
      "Lipids your skin already makes, which hold the barrier together. Topping them up helps skin hold water and feel less sensitive.",
    bestFor: ["dryness", "sensitivity", "ageing"],
    howToUse: "In a cleanser or moisturiser, morning and night.",
    pairsWith: "Retinol, acids, hyaluronic acid. They make strong actives easier to use.",
    match: /ceramide/i,
    tint: "#f1ebe1",
  },
  {
    id: "peptides",
    name: "Peptides",
    aka: ["signal peptides"],
    short: "Firmness and fine lines",
    whatItDoes: "Short chains of amino acids that support firmer, smoother looking skin over time.",
    bestFor: ["ageing"],
    howToUse: "Morning and night. Gentle enough for the under-eye area.",
    pairsWith: "Hyaluronic acid, retinol, vitamin C.",
    match: /peptide/i,
    tint: "#efe6f0",
  },
  {
    id: "saffron",
    name: "Kashmiri saffron",
    aka: ["kesar", "crocus sativus"],
    short: "Traditional glow",
    whatItDoes:
      "A treasured Indian ingredient rich in antioxidants, used for centuries for radiance and an even-looking tone.",
    bestFor: ["dullness", "pigmentation"],
    howToUse: "As the last step of your night routine.",
    pairsWith: "Peptides, squalane, vitamin C in the morning.",
    match: /saffron|kesar/i,
    tint: "#f8ead6",
  },
  {
    id: "uv-filters",
    name: "Broad spectrum UV filters",
    aka: ["SPF", "sunscreen", "PA++++"],
    short: "Daily sun protection",
    whatItDoes:
      "Protects from UVB (burning) and UVA (tanning and ageing). The most proven anti-ageing and anti-pigmentation step there is.",
    bestFor: ["sun-protection", "pigmentation", "ageing"],
    howToUse:
      "Two finger lengths for face and neck, every morning. Reapply every 2 to 3 hours outdoors.",
    pairsWith: "Vitamin C and niacinamide underneath.",
    match: /uv filters|spf/i,
    tint: "#fbf0d9",
  },
  {
    id: "caffeine",
    name: "Caffeine",
    aka: [],
    short: "Puffiness",
    whatItDoes: "Helps reduce the look of puffiness and tired eyes.",
    bestFor: ["ageing"],
    howToUse: "Pat a rice-grain amount around the eyes, morning and night.",
    pairsWith: "Peptides, vitamin K.",
    match: /caffeine/i,
    tint: "#efe7df",
  },
  {
    id: "squalane",
    name: "Squalane",
    aka: [],
    short: "Lightweight nourishment",
    whatItDoes: "A skin-friendly oil that softens and cushions without clogging pores.",
    bestFor: ["dryness", "ageing"],
    howToUse: "In serums and night masks, as a last step.",
    pairsWith: "Retinol, peptides.",
    match: /squalane/i,
    tint: "#f2efe6",
  },
];

/** Ingredient ids found in a product's key ingredients. */
export function productIngredientIds(product: Pick<Product, "keyIngredients">): string[] {
  const names = product.keyIngredients.map((k) => k.name).join(" | ");
  return INGREDIENTS.filter((i) => i.match.test(names)).map((i) => i.id);
}

export function ingredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}
