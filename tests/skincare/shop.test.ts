import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/sites/skincare/data/products";
import type { Product } from "@/sites/skincare/data/types";
import { productIngredientIds } from "@/sites/skincare/content/ingredients";
import type { QuizAnswers } from "@/sites/skincare/content/quiz";
import {
  activeFilterCount,
  applyFilters,
  defaultVariant,
  EMPTY_FILTERS,
  filtersToQuery,
  parseFilters,
  ratingBreakdown,
  searchProducts,
  sortProducts,
} from "@/sites/skincare/shop/catalog";
import {
  bestOffer,
  bestValueVariantId,
  cartMilestones,
  unitPrice,
} from "@/sites/skincare/shop/offers";
import { canCancel, normaliseOrderId } from "@/sites/skincare/shop/orders";
import { buildRoutine } from "@/sites/skincare/shop/quiz";

const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug)!;
const TODAY = new Date("2026-11-19T10:00:00+05:30");

describe("listing filters in the URL", () => {
  it("round-trips through the query string and drops unknown values", () => {
    const f = parseFilters(
      new URLSearchParams("concern=acne,nonsense&skin=oily&price=400-600&stock=1&sort=rating"),
    );
    expect(f.concern).toEqual(["acne"]);
    expect(f.skin).toEqual(["oily"]);
    expect(f.inStock).toBe(true);
    expect(f.sort).toBe("rating");
    expect(filtersToQuery(f)).toBe("concern=acne&skin=oily&price=400-600&stock=1&sort=rating");
    expect(activeFilterCount(f)).toBe(4);
  });

  it("leaves defaults out of the URL", () => {
    expect(filtersToQuery(EMPTY_FILTERS)).toBe("");
    expect(parseFilters(new URLSearchParams("sort=bogus")).sort).toBe("popular");
  });

  it("filters by concern, category and ingredient together", () => {
    const f = { ...EMPTY_FILTERS, concern: ["acne" as const], ingredient: ["niacinamide"] };
    const slugs = applyFilters(PRODUCTS, f, TODAY).map((p) => p.slug);
    expect(slugs).toContain("niacinamide-10-clarifying-serum");
    expect(slugs).toContain("clear-skin-routine-kit");
    expect(slugs).not.toContain("salicylic-2-clearing-face-wash");
  });

  it("filters by price band using the tile price", () => {
    const f = { ...EMPTY_FILTERS, price: ["over-1000" as const] };
    expect(applyFilters(PRODUCTS, f, TODAY).map((p) => p.slug)).toEqual(["clear-skin-routine-kit"]);
  });

  it("finds new launches by date and badge", () => {
    const f = { ...EMPTY_FILTERS, collection: "new" as const };
    const slugs = applyFilters(PRODUCTS, f, TODAY).map((p) => p.slug);
    expect(slugs).toEqual(
      expect.arrayContaining(["kesar-glow-overnight-mask", "glycolic-5-pore-refining-toner"]),
    );
    expect(slugs).not.toContain("niacinamide-10-clarifying-serum");
  });

  it("sorts by price and pushes sold-out products to the end", () => {
    const soldOut: Product = {
      ...bySlug("spf30-lip-balm"),
      variants: [{ ...bySlug("spf30-lip-balm").variants[0], stock: 0 }],
    };
    const list = [soldOut, ...PRODUCTS.filter((p) => p.slug !== "spf30-lip-balm")];
    const sorted = sortProducts(list, "price-asc");
    expect(sorted[sorted.length - 1].slug).toBe("spf30-lip-balm");
    const prices = sorted.slice(0, -1).map((p) => defaultVariant(p).price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});

describe("search", () => {
  it("understands shorthand like vit c and spf", () => {
    expect(searchProducts("vit c", PRODUCTS)[0].slug).toBe("vitamin-c-15-brightening-serum");
    expect(searchProducts("spf", PRODUCTS)[0].slug).toBe("invisible-sunscreen-spf50");
  });

  it("matches concerns and needs every word to match", () => {
    expect(searchProducts("pimples", PRODUCTS).map((p) => p.slug)).toContain(
      "salicylic-2-clearing-face-wash",
    );
    expect(searchProducts("niacinamide xyzzy", PRODUCTS)).toEqual([]);
  });
});

describe("ingredients", () => {
  it("maps key ingredients to glossary entries", () => {
    expect(productIngredientIds(bySlug("ceramide-barrier-moisturiser"))).toEqual(
      expect.arrayContaining(["ceramides", "niacinamide"]),
    );
    expect(productIngredientIds(bySlug("vitamin-c-15-brightening-serum"))).toContain("vitamin-c");
  });
});

describe("rating breakdown", () => {
  it.each(PRODUCTS.map((p) => [p.slug, p.rating, p.reviewCount] as const))(
    "%s adds up and averages its rating",
    (_s, rating, count) => {
      const b = ratingBreakdown(rating, count);
      expect(b.reduce((a, n) => a + n, 0)).toBe(count);
      expect(b.every((n) => n >= 0)).toBe(true);
      const mean = (5 * b[0] + 4 * b[1] + 3 * b[2] + 2 * b[3] + b[4]) / count;
      expect(Math.abs(mean - rating)).toBeLessThan(0.06);
    },
  );
});

describe("offers", () => {
  it("finds the best single-product price with a coupon and prepaid", () => {
    const serum = bySlug("niacinamide-10-clarifying-serum");
    const v = serum.variants.find((x) => x.id === "30ml")!;
    // ₹599 - 10% (₹60) = ₹539, then 5% prepaid (₹27) = ₹512.
    expect(bestOffer(serum, v)).toEqual({ code: "GLOW10", price: 539 });
    expect(bestOffer(serum, v, { prepaid: true })).toEqual({ code: "GLOW10", price: 512 });
  });

  it("prefers FIRST15 for a first order above ₹999", () => {
    const kit = bySlug("clear-skin-routine-kit");
    expect(bestOffer(kit, kit.variants[0], { isFirstOrder: true })?.code).toBe("FIRST15");
  });

  it("shows unit prices and the best-value size", () => {
    const serum = bySlug("niacinamide-10-clarifying-serum");
    expect(unitPrice(serum.variants[1])).toBe("₹19.97 per ml");
    expect(bestValueVariantId(serum)).toBe("30ml");
    expect(unitPrice(bySlug("clear-skin-routine-kit").variants[0])).toBeUndefined();
  });

  it("adds the first-order milestone only for new shoppers", () => {
    expect(cartMilestones(false).map((m) => m.at)).toEqual([499]);
    expect(cartMilestones(true).map((m) => m.at)).toEqual([499, 999]);
  });
});

describe("skin quiz routine", () => {
  const base: QuizAnswers = {
    skinType: "oily",
    concerns: ["acne", "pigmentation"],
    sensitivity: "low",
    age: "20s",
    climate: "humid",
    routine: "balanced",
    actives: "sometimes",
  };

  it("builds an oily, acne-prone routine around salicylic acid and niacinamide", () => {
    const r = buildRoutine(base, PRODUCTS);
    expect(r.am.map((s) => s.product.slug)).toEqual([
      "salicylic-2-clearing-face-wash",
      "niacinamide-10-clarifying-serum",
      "oil-free-gel-moisturiser",
      "invisible-sunscreen-spf50",
    ]);
    expect(r.pm.map((s) => s.product.slug)).toContain("retinol-0-3-night-serum");
    expect(r.kit?.slug).toBe("clear-skin-routine-kit");
  });

  it("keeps sensitive skin away from retinol and acids", () => {
    const r = buildRoutine(
      {
        ...base,
        skinType: "dry",
        sensitivity: "high",
        concerns: ["ageing", "dullness"],
        routine: "full",
      },
      PRODUCTS,
    );
    const slugs = r.products.map((p) => p.slug);
    expect(slugs).not.toContain("retinol-0-3-night-serum");
    expect(slugs).not.toContain("glycolic-5-pore-refining-toner");
    expect(slugs).not.toContain("salicylic-2-clearing-face-wash");
    expect(slugs).toContain("ceramide-barrier-moisturiser");
  });

  it("gives a three-step minimal routine and always includes sunscreen", () => {
    const r = buildRoutine(
      { ...base, routine: "minimal", skinType: "normal", climate: "cold" },
      PRODUCTS,
    );
    expect(r.am).toHaveLength(3);
    expect(r.pm).toHaveLength(3);
    expect(r.am.at(-1)?.product.slug).toBe("invisible-sunscreen-spf50");
  });

  it("skips products the owner has switched off", () => {
    const products = PRODUCTS.map((p) =>
      p.slug === "niacinamide-10-clarifying-serum" ? { ...p, active: false } : p,
    );
    const r = buildRoutine(base, products);
    expect(r.products.map((p) => p.slug)).not.toContain("niacinamide-10-clarifying-serum");
    expect(r.kit).toBeUndefined();
  });
});

describe("orders", () => {
  it("normalises typed order IDs", () => {
    expect(normaliseOrderId("orv 41207")).toBe("ORV-41207");
    expect(normaliseOrderId("41207")).toBe("ORV-41207");
    expect(normaliseOrderId("hello")).toBe("");
  });

  it("allows cancelling only before shipping", () => {
    const order = { status: "packed" } as Parameters<typeof canCancel>[0];
    expect(canCancel(order)).toBe(true);
    expect(canCancel({ ...order, status: "shipped" })).toBe(false);
  });
});
