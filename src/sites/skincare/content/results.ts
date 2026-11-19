/**
 * "Tested results" blocks on product pages, written the way Indian D2C brands present consumer
 * studies. The brand is made up, so these figures are sample data and are labelled as such.
 */
export type ProductResults = {
  study: string;
  stats: { value: string; label: string }[];
};

export const RESULTS: Record<string, ProductResults> = {
  "niacinamide-10-clarifying-serum": {
    study:
      "8 week consumer study, 112 Indian participants with oily or acne-prone skin, used twice daily.",
    stats: [
      { value: "92%", label: "said skin looked less oily by week 2" },
      { value: "87%", label: "saw smaller-looking pores" },
      { value: "84%", label: "said acne marks looked lighter by week 8" },
    ],
  },
  "vitamin-c-15-brightening-serum": {
    study:
      "6 week consumer study, 98 participants with dull, uneven skin, used every morning with SPF.",
    stats: [
      { value: "94%", label: "said skin looked brighter" },
      { value: "86%", label: "saw a more even skin tone" },
      { value: "0", label: "colour change after 3 months at 40°C" },
    ],
  },
  "hyaluronic-hydrating-serum": {
    study:
      "Instrumental test (corneometer) on 30 volunteers, plus a 4 week use test on 104 participants.",
    stats: [
      { value: "2x", label: "skin hydration 1 hour after one use" },
      { value: "93%", label: "said skin felt plumper" },
      { value: "91%", label: "said it felt light, not sticky" },
    ],
  },
  "retinol-0-3-night-serum": {
    study: "12 week consumer study, 86 participants aged 28 to 50, used 3 to 7 nights a week.",
    stats: [
      { value: "89%", label: "said texture looked smoother" },
      { value: "81%", label: "saw softer-looking fine lines" },
      { value: "8%", label: "reported mild dryness, mostly in weeks 1 to 2" },
    ],
  },
  "alpha-arbutin-spot-corrector": {
    study:
      "8 week consumer study, 102 participants with tan or post-acne marks, used twice daily with SPF.",
    stats: [
      { value: "88%", label: "said dark spots looked lighter" },
      { value: "85%", label: "saw tan fade visibly" },
      { value: "97%", label: "had no redness or peeling" },
    ],
  },
  "salicylic-2-clearing-face-wash": {
    study: "4 week consumer study, 120 participants with oily, acne-prone skin, used twice daily.",
    stats: [
      { value: "90%", label: "said skin felt deep-cleaned, not stripped" },
      { value: "82%", label: "saw fewer blackheads" },
      { value: "79%", label: "said breakouts looked calmer" },
    ],
  },
  "ceramide-barrier-moisturiser": {
    study:
      "Barrier test (TEWL) on 32 volunteers, plus a 4 week use test on 110 participants with dry skin.",
    stats: [
      { value: "48 hr", label: "moisture measured after one application" },
      { value: "95%", label: "said tightness and flaking reduced" },
      { value: "92%", label: "said skin felt calmer" },
    ],
  },
  "oil-free-gel-moisturiser": {
    study: "4 week consumer study, 96 participants with oily skin in humid cities.",
    stats: [
      { value: "93%", label: "said it felt weightless" },
      { value: "88%", label: "said skin looked less shiny at midday" },
      { value: "0", label: "comedones in a non-comedogenicity test" },
    ],
  },
  "invisible-sunscreen-spf50": {
    study: "Use test on 140 participants across Fitzpatrick skin types III to VI.",
    stats: [
      { value: "98%", label: "saw no white cast on their skin tone" },
      { value: "95%", label: "said it was not greasy" },
      { value: "91%", label: "said it sat well under makeup" },
    ],
  },
  "kesar-glow-overnight-mask": {
    study: "2 week consumer study, 64 participants, used 3 nights a week.",
    stats: [
      { value: "91%", label: "said skin looked more radiant next morning" },
      { value: "88%", label: "said skin felt softer" },
      { value: "84%", label: "saw a more even-looking tone in 2 weeks" },
    ],
  },
  "glycolic-5-pore-refining-toner": {
    study: "4 week consumer study, 72 participants, used 3 nights a week.",
    stats: [
      { value: "89%", label: "said skin felt smoother" },
      { value: "83%", label: "said skin looked brighter" },
      { value: "78%", label: "saw refined-looking pores" },
    ],
  },
  "peptide-under-eye-cream": {
    study: "6 week consumer study, 70 participants, used morning and night.",
    stats: [
      { value: "87%", label: "said under-eyes looked less puffy" },
      { value: "76%", label: "saw dark circles look lighter" },
      { value: "100%", label: "had no stinging in an ophthalmologist-reviewed test" },
    ],
  },
};

/** Sun protection test cards for SPF products (sample data). */
export const SPF_TESTS: Record<
  string,
  { method: string; measured: string; uva: string; lab: string }
> = {
  "invisible-sunscreen-spf50": {
    method: "In vivo SPF test, ISO 24444:2019",
    measured: "SPF 54.6 measured",
    uva: "PA++++ (PFA 18.2, ISO 24442)",
    lab: "Independent CRO, 10 volunteers, report ORV-SPF-2025-07",
  },
  "spf30-lip-balm": {
    method: "In vivo SPF test, ISO 24444:2019",
    measured: "SPF 31.8 measured",
    uva: "Broad spectrum",
    lab: "Independent CRO, 10 volunteers, report ORV-SPF-2025-05",
  },
};
