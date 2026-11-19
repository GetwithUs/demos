import { CATEGORIES, CONCERNS, SKIN_TYPES } from "@/sites/skincare/data/catalog";
import type {
  CategoryId,
  ConcernId,
  Product,
  SkinType,
  Variant,
} from "@/sites/skincare/data/types";
import { INGREDIENTS, productIngredientIds } from "@/sites/skincare/content/ingredients";

/**
 * Pure catalogue helpers for the storefront: the variant a tile shows, listing filters that
 * live in the URL, sorting, search and the review rating breakdown. No React here, so it is
 * easy to test (tests/skincare/shop.test.ts).
 */

/** The size a tile or quick add uses: the first one in stock, else the first one. */
export function defaultVariant(product: Product): Variant {
  return product.variants.find((v) => v.stock > 0) ?? product.variants[0];
}

export function inStock(product: Product): boolean {
  return product.variants.some((v) => v.stock > 0);
}

const count = new Intl.NumberFormat("en-IN");

/** "2,841" or "1,20,000", Indian digit grouping. */
export function formatCount(n: number): string {
  return count.format(n);
}

/** "Only 4 left" style warning threshold. */
export const LOW_STOCK = 10;

export type SortKey = "popular" | "rating" | "newest" | "price-asc" | "price-desc";

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Top rated" },
  { id: "newest", label: "New launches" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

export type PriceBand = "under-400" | "400-600" | "600-1000" | "over-1000";

export const PRICE_BANDS: { id: PriceBand; label: string; min: number; max: number }[] = [
  { id: "under-400", label: "Under ₹400", min: 0, max: 399 },
  { id: "400-600", label: "₹400 to ₹600", min: 400, max: 600 },
  { id: "600-1000", label: "₹601 to ₹1,000", min: 601, max: 1000 },
  { id: "over-1000", label: "Above ₹1,000", min: 1001, max: Infinity },
];

export type Collection = "bestsellers" | "new" | "kits";

export type ShopFilters = {
  q: string;
  concern: ConcernId[];
  category: CategoryId[];
  skin: SkinType[];
  ingredient: string[];
  price: PriceBand[];
  inStock: boolean;
  fragranceFree: boolean;
  collection?: Collection;
  sort: SortKey;
};

export const EMPTY_FILTERS: ShopFilters = {
  q: "",
  concern: [],
  category: [],
  skin: [],
  ingredient: [],
  price: [],
  inStock: false,
  fragranceFree: false,
  sort: "popular",
};

type ParamReader = { get(name: string): string | null };

function list<T extends string>(raw: string | null, allowed: readonly string[]): T[] {
  if (!raw) return [];
  return [...new Set(raw.split(","))].filter((v) => allowed.includes(v)) as T[];
}

/** Reads filters from the URL (?concern=acne,oiliness&sort=rating ...), ignoring anything unknown. */
export function parseFilters(params: ParamReader): ShopFilters {
  const sort = params.get("sort");
  const collection = params.get("collection");
  return {
    q: (params.get("q") ?? "").trim().slice(0, 60),
    concern: list(params.get("concern"), Object.keys(CONCERNS)),
    category: list(params.get("category"), Object.keys(CATEGORIES)),
    skin: list(params.get("skin"), Object.keys(SKIN_TYPES)),
    ingredient: list(
      params.get("ingredient"),
      INGREDIENTS.map((i) => i.id),
    ),
    price: list(
      params.get("price"),
      PRICE_BANDS.map((b) => b.id),
    ),
    inStock: params.get("stock") === "1",
    fragranceFree: params.get("ff") === "1",
    collection:
      collection === "bestsellers" || collection === "new" || collection === "kits"
        ? collection
        : undefined,
    sort: SORTS.some((s) => s.id === sort) ? (sort as SortKey) : "popular",
  };
}

/** The query string for a filter state (without "?"); defaults are left out to keep URLs short. */
export function filtersToQuery(f: ShopFilters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.collection) p.set("collection", f.collection);
  if (f.concern.length) p.set("concern", f.concern.join(","));
  if (f.category.length) p.set("category", f.category.join(","));
  if (f.skin.length) p.set("skin", f.skin.join(","));
  if (f.ingredient.length) p.set("ingredient", f.ingredient.join(","));
  if (f.price.length) p.set("price", f.price.join(","));
  if (f.inStock) p.set("stock", "1");
  if (f.fragranceFree) p.set("ff", "1");
  if (f.sort !== "popular") p.set("sort", f.sort);
  return p.toString().replace(/%2C/g, ",");
}

/** How many filters are switched on (sort and search excluded), for the "Filters (3)" button. */
export function activeFilterCount(f: ShopFilters): number {
  return (
    f.concern.length +
    f.category.length +
    f.skin.length +
    f.ingredient.length +
    f.price.length +
    (f.inStock ? 1 : 0) +
    (f.fragranceFree ? 1 : 0)
  );
}

const NEW_DAYS = 120;

/** Launched in the last ~4 months, or tagged New by the owner. */
export function isNewLaunch(product: Product, today: Date): boolean {
  if (product.badges.includes("New")) return true;
  const age = (today.getTime() - new Date(product.launchedOn).getTime()) / 86_400_000;
  return age >= 0 && age <= NEW_DAYS;
}

export function applyFilters(
  products: Product[],
  f: ShopFilters,
  today: Date = new Date(),
): Product[] {
  const matchesQuery = f.q ? new Set(searchProducts(f.q, products).map((p) => p.slug)) : null;
  const result = products.filter((p) => {
    if (matchesQuery && !matchesQuery.has(p.slug)) return false;
    if (f.collection === "bestsellers" && !p.badges.includes("Bestseller")) return false;
    if (f.collection === "new" && !isNewLaunch(p, today)) return false;
    if (f.collection === "kits" && p.category !== "kits") return false;
    if (f.concern.length && !f.concern.some((c) => p.concerns.includes(c))) return false;
    if (f.category.length && !f.category.includes(p.category)) return false;
    if (f.skin.length && !f.skin.some((s) => p.skinTypes.includes(s))) return false;
    if (f.ingredient.length) {
      const ids = productIngredientIds(p);
      if (!f.ingredient.some((i) => ids.includes(i))) return false;
    }
    if (f.price.length) {
      const price = defaultVariant(p).price;
      const bands = PRICE_BANDS.filter((b) => f.price.includes(b.id));
      if (!bands.some((b) => price >= b.min && price <= b.max)) return false;
    }
    if (f.inStock && !inStock(p)) return false;
    if (f.fragranceFree && !p.fragranceFree) return false;
    return true;
  });
  return sortProducts(result, f.sort);
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  const price = (p: Product) => defaultVariant(p).price;
  switch (sort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "newest":
      list.sort((a, b) => b.launchedOn.localeCompare(a.launchedOn));
      break;
    case "price-asc":
      list.sort((a, b) => price(a) - price(b));
      break;
    case "price-desc":
      list.sort((a, b) => price(b) - price(a));
      break;
    default:
      // Bestsellers first, then by how many people bought (reviews stand in for sales).
      list.sort(
        (a, b) =>
          Number(b.badges.includes("Bestseller")) - Number(a.badges.includes("Bestseller")) ||
          b.reviewCount - a.reviewCount,
      );
  }
  // Sold-out products sink to the end, as on most stores.
  return list.sort((a, b) => Number(inStock(b)) - Number(inStock(a)));
}

/** Common shorthand people type into skincare search boxes. */
const SYNONYMS: Record<string, string> = {
  "vit c": "vitamin c",
  vitc: "vitamin c",
  spf: "sunscreen",
  sunblock: "sunscreen",
  "sun screen": "sunscreen",
  pimple: "acne",
  pimples: "acne",
  breakout: "acne",
  breakouts: "acne",
  tan: "pigmentation",
  "dark spots": "pigmentation",
  marks: "pigmentation",
  glow: "dullness",
  wrinkles: "ageing",
  "anti ageing": "ageing",
  aging: "ageing",
  facewash: "face wash",
  moisturizer: "moisturiser",
  "dark circles": "under-eye",
  kesar: "saffron",
  bha: "salicylic",
  aha: "glycolic",
  ha: "hyaluronic",
};

function normalise(text: string): string {
  let t = ` ${text
    .toLowerCase()
    .replace(/[^a-z0-9%.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
  for (const [from, to] of Object.entries(SYNONYMS)) {
    t = t.replace(` ${from} `, ` ${to} `);
  }
  return t.trim();
}

function haystack(p: Product) {
  return {
    name: p.name.toLowerCase(),
    ingredients: p.keyIngredients.map((k) => k.name.toLowerCase()).join(" "),
    concerns: p.concerns.map((c) => `${c} ${CONCERNS[c].label}`.toLowerCase()).join(" "),
    category:
      `${CATEGORIES[p.category].label} ${CATEGORIES[p.category].plural} ${p.category}`.toLowerCase(),
    rest: `${p.tagline} ${p.description} ${p.skinTypes.join(" ")}`.toLowerCase(),
  };
}

/** Products matching a free-text query, best match first. Every word must match somewhere. */
export function searchProducts(query: string, products: Product[]): Product[] {
  // Keep "vitamin c" together so it does not match every vitamin.
  const words = normalise(query)
    .replace(/vitamin (\w\d?)/g, "vitamin_$1")
    .split(" ")
    .map((w) => w.replace("_", " "))
    .filter((w) => w.length > 1);
  if (!words.length) return [];
  const scored: { p: Product; score: number }[] = [];
  for (const p of products) {
    const h = haystack(p);
    let score = 0;
    let all = true;
    for (const w of words) {
      const stem = w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w;
      const s =
        (h.name.includes(stem) ? 6 : 0) +
        (h.ingredients.includes(stem) ? 4 : 0) +
        (h.category.includes(stem) ? 3 : 0) +
        (h.concerns.includes(stem) ? 3 : 0) +
        (h.rest.includes(stem) ? 1 : 0);
      if (!s) all = false;
      score += s;
    }
    if (all && score) scored.push({ p, score: score + p.reviewCount / 100_000 });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.p);
}

/** Concerns, categories and ingredients whose names match the query, for search suggestions. */
export function searchShortcuts(query: string) {
  const q = normalise(query);
  if (q.length < 2) return [];
  const out: { label: string; hint: string; href: string }[] = [];
  for (const [id, c] of Object.entries(CONCERNS)) {
    if (c.label.toLowerCase().includes(q) || id.includes(q)) {
      out.push({ label: c.label, hint: "Concern", href: `/skincare/concerns/${id}` });
    }
  }
  for (const [id, c] of Object.entries(CATEGORIES)) {
    if (c.plural.toLowerCase().includes(q) || id.includes(q)) {
      out.push({ label: c.plural, hint: "Category", href: `/skincare/categories/${id}` });
    }
  }
  for (const i of INGREDIENTS) {
    if (i.name.toLowerCase().includes(q) || i.aka.some((a) => a.toLowerCase().includes(q))) {
      out.push({ label: i.name, hint: "Ingredient", href: `/skincare/shop?ingredient=${i.id}` });
    }
  }
  return out.slice(0, 4);
}

/**
 * Star counts (5 down to 1) for a product's rating and review count, shaped like real
 * skincare reviews: mostly 5s and 4s, a small tail of low ratings, averaging the shown rating.
 */
export function ratingBreakdown(
  rating: number,
  count: number,
): [number, number, number, number, number] {
  const p1 = rating >= 4.7 ? 0.01 : 0.03;
  const p2 = rating >= 4.7 ? 0.01 : 0.02;
  const p3 = rating >= 4.7 ? 0.03 : rating >= 4.5 ? 0.05 : 0.08;
  const rest = 1 - p1 - p2 - p3;
  const p5 = Math.min(rest, Math.max(0, rating - 4 * rest - 3 * p3 - 2 * p2 - p1));
  const p4 = rest - p5;
  const shares = [p5, p4, p3, p2, p1];
  const counts = shares.map((s) => Math.round(s * count));
  counts[0] += count - counts.reduce((a, b) => a + b, 0);
  return counts as [number, number, number, number, number];
}
