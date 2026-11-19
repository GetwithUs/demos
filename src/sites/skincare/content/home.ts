import type { CategoryId, ConcernId } from "@/sites/skincare/data/types";

export const HERO = {
  eyebrow: "Made in Dehradun, for Indian skin",
  title: "Clinical skincare that",
  titleAccent: "gets Indian weather.",
  text: "Proven actives at honest percentages, tested on Indian skin through humid monsoons, dry winters and city pollution. Fragrance free, dermatologist tested.",
  primary: { label: "Shop bestsellers", href: "/skincare/shop?collection=bestsellers" },
  secondary: { label: "Find your routine", href: "/skincare/skin-quiz" },
  stats: [
    { value: "4.6", label: "average from 15,000+ reviews" },
    { value: "2 lakh+", label: "orders delivered across India" },
  ],
  /** The product floating over the hero photo. */
  featuredSlug: "niacinamide-10-clarifying-serum",
};

export const TRUST_POINTS = [
  {
    icon: "stethoscope",
    title: "Dermatologist tested",
    text: "Patch tested on 50+ Indian volunteers",
  },
  {
    icon: "flask",
    title: "Honest percentages",
    text: "Every active and its strength on the label",
  },
  { icon: "leaf", title: "Fragrance free", text: "No added perfume or essential oils" },
  { icon: "rabbit", title: "Cruelty free", text: "Never tested on animals" },
  { icon: "recycle", title: "Recyclable packs", text: "Glass, PP and PCR plastic" },
] as const;

/** Short line and accent colour for each concern tile. */
export const CONCERN_TILES: Record<ConcernId, { tint: string; ink: string; mark: string }> = {
  acne: { tint: "#e5ecdf", ink: "#2f5d50", mark: "Clear" },
  pigmentation: { tint: "#f3e1de", ink: "#9c4238", mark: "Even" },
  dullness: { tint: "#f7e6cc", ink: "#8f5410", mark: "Glow" },
  dryness: { tint: "#e1ecf2", ink: "#2b5670", mark: "Plump" },
  oiliness: { tint: "#e8eee4", ink: "#3d5a3a", mark: "Matte" },
  ageing: { tint: "#ebe3f1", ink: "#5a3f6e", mark: "Smooth" },
  sensitivity: { tint: "#f8eee9", ink: "#8a4b3f", mark: "Calm" },
  "sun-protection": { tint: "#fbf0d9", ink: "#7a5310", mark: "Protect" },
};

/** The product shown on each category tile. */
export const CATEGORY_TILES: Record<CategoryId, string> = {
  serums: "vitamin-c-15-brightening-serum",
  sunscreens: "invisible-sunscreen-spf50",
  moisturisers: "ceramide-barrier-moisturiser",
  cleansers: "salicylic-2-clearing-face-wash",
  toners: "glycolic-5-pore-refining-toner",
  masks: "kesar-glow-overnight-mask",
  "eye-lip": "peptide-under-eye-cream",
  kits: "clear-skin-routine-kit",
};

/** "Know your actives" tabs on the home page. */
export const SPOTLIGHT = [
  {
    ingredient: "niacinamide",
    headline: "Niacinamide, the everyday multitasker",
    text: "At 10% with zinc, niacinamide balances oil through a humid day, helps keep pores clear and visibly fades the marks breakouts leave behind. It plays well with almost everything.",
    facts: ["Balances oil", "Refines pores", "Fades acne marks"],
    slug: "niacinamide-10-clarifying-serum",
  },
  {
    ingredient: "vitamin-c",
    headline: "Vitamin C, for glow you can see",
    text: "We use ethyl ascorbic acid, a stable vitamin C that does not turn orange in Indian heat. With ferulic acid it brightens tan and dull skin and backs up your sunscreen.",
    facts: ["Stable in heat", "Brightens tan", "Antioxidant shield"],
    slug: "vitamin-c-15-brightening-serum",
  },
  {
    ingredient: "salicylic-acid",
    headline: "Salicylic acid, deep inside pores",
    text: "An oil-soluble BHA that clears the oil and dead skin that clog pores. In a face wash it works daily without leaving skin stripped.",
    facts: ["Unclogs pores", "Fewer blackheads", "Daily gentle"],
    slug: "salicylic-2-clearing-face-wash",
  },
  {
    ingredient: "ceramides",
    headline: "Ceramides, your barrier's mortar",
    text: "Five skin-identical ceramides top up what dry, sensitive or over-exfoliated skin has lost, so it holds water and feels calm again.",
    facts: ["Repairs barrier", "48-hour moisture", "Calms tightness"],
    slug: "ceramide-barrier-moisturiser",
  },
];

/** Made-up publications for the press strip; the brand is fictional, so is its press. */
export const PRESS = [
  {
    name: "The Skin Ledger",
    style: "serif",
    quote: "The niacinamide serum that sells out every monsoon.",
  },
  {
    name: "GLOW WEEKLY",
    style: "caps",
    quote: "Finally, a sunscreen with no white cast on deeper skin tones.",
  },
  {
    name: "Doon Living",
    style: "italic",
    quote: "A Dehradun brand making clinical skincare feel calm.",
  },
  {
    name: "beauty brief",
    style: "lower",
    quote: "Honest percentages and fair prices. Rare in Indian skincare.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Ananya R.",
    city: "Dehradun",
    skin: "Oily, acne-prone",
    rating: 5,
    text: "My T-zone used to look like a mirror by noon. Six weeks of the niacinamide serum and the shine is far less, and my old acne marks look lighter.",
    slug: "niacinamide-10-clarifying-serum",
  },
  {
    name: "Kavya S.",
    city: "Hyderabad",
    skin: "Combination",
    rating: 5,
    text: "The only sunscreen I reapply happily. No white cast on my skin tone, no stickiness, and it sits well under makeup.",
    slug: "invisible-sunscreen-spf50",
  },
  {
    name: "Meera N.",
    city: "Kochi",
    skin: "Dry, sensitive",
    rating: 5,
    text: "The ceramide moisturiser saved my skin after an over-exfoliation disaster. No stinging, and the tight feeling was gone in a week.",
    slug: "ceramide-barrier-moisturiser",
  },
  {
    name: "Rohan M.",
    city: "Mumbai",
    skin: "Oily",
    rating: 4,
    text: "Bought the Clear Skin kit for my brother and ended up using it myself. Simple routine, card in the box explains everything.",
    slug: "clear-skin-routine-kit",
  },
  {
    name: "Ishita B.",
    city: "Kolkata",
    skin: "Normal",
    rating: 5,
    text: "Vitamin C that has not oxidised even after two months in Kolkata humidity. My skin looks brighter in photos without filters.",
    slug: "vitamin-c-15-brightening-serum",
  },
  {
    name: "Simran K.",
    city: "Chandigarh",
    skin: "Combination",
    rating: 5,
    text: "Delivery in two days, packed beautifully with a paper box and no plastic fill. The spot corrector is slowly fading my tan lines.",
    slug: "alpha-arbutin-spot-corrector",
  },
];

export const WHY_ORUVI = [
  {
    icon: "microscope",
    title: "Science first",
    text: "Formulated by cosmetic chemists with a dermatologist on every launch. Actives at the strengths research supports, not the trendiest number.",
  },
  {
    icon: "cloud-sun",
    title: "Made for Indian weather",
    text: "Stability tested at 40°C and 75% humidity. Textures that sit light in a Chennai summer and still feel enough in a Doon winter.",
  },
  {
    icon: "scan-face",
    title: "Tested on Indian skin",
    text: "Every product is patch tested on volunteers across Fitzpatrick types III to VI before it reaches you.",
  },
  {
    icon: "rabbit",
    title: "Kind by default",
    text: "Cruelty free and vegan, with no added fragrance in any leave-on product.",
  },
  {
    icon: "recycle",
    title: "Packs that come back",
    text: "Glass droppers, recyclable PP tubes and paper outer boxes. Return 5 empties with any order for a free lip balm.",
  },
];

export const QUIZ_TEASER = {
  eyebrow: "2 minute skin quiz",
  title: "Not sure where to start?",
  text: "Answer seven quick questions about your skin, your city and how much time you have. We will build a morning and night routine from our range, with the reason for every step.",
  points: [
    "Built around your skin type and concerns",
    "Adjusted for your climate",
    "Add the whole routine in one tap",
  ],
};

export const NEWSLETTER = {
  title: "Skin notes, once a fortnight",
  text: "Ingredient explainers, early access to launches and members-only offers. No spam, unsubscribe any time.",
};
