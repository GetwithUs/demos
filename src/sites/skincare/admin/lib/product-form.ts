import type { Badge } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";

/** Validation shared by the edit and add product forms. Values come straight from inputs. */

export const BADGES: Badge[] = ["Bestseller", "New", "Award winner", "Limited"];

export type VariantDraft = { id: string; size: string; price: string; mrp: string; stock: string };

export type VariantErrors = Partial<Record<"size" | "price" | "mrp" | "stock", string>>;

const whole = (v: string) => (/^\d+$/.test(v.trim()) ? Number(v.trim()) : NaN);

export function validateVariant(v: VariantDraft, { checkSize = false } = {}): VariantErrors {
  const errors: VariantErrors = {};
  const price = whole(v.price);
  const mrp = whole(v.mrp);
  const stock = whole(v.stock);
  if (checkSize && !v.size.trim()) errors.size = "Enter the pack size, like 30 ml.";
  if (Number.isNaN(price) || price < 1) errors.price = "Enter a price in whole rupees.";
  else if (price > 100000) errors.price = "That price looks too high.";
  if (Number.isNaN(mrp) || mrp < 1) errors.mrp = "Enter the MRP in whole rupees.";
  else if (!Number.isNaN(price) && price > mrp)
    errors.price = `Price cannot be more than the MRP (${formatINR(mrp)}).`;
  if (Number.isNaN(stock)) errors.stock = "Enter stock as a whole number.";
  else if (stock > 99999) errors.stock = "Stock must be under 1,00,000.";
  return errors;
}

export function validateText(
  value: string,
  label: string,
  min: number,
  max: number,
): string | undefined {
  const n = value.trim().length;
  if (n < min)
    return min <= 1 ? `Enter the ${label}.` : `The ${label} needs at least ${min} characters.`;
  if (n > max) return `Keep the ${label} under ${max} characters (now ${n}).`;
  return undefined;
}

export const toNumber = (v: string) => Number(v.trim());

/** URL slug from a product name: "Rice Water Toner" becomes "rice-water-toner". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/%/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Variant id from its size: "30 ml" becomes "30ml". */
export function variantId(size: string, taken: string[]): string {
  const base =
    size
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9.]/g, "") || "size";
  let id = base;
  for (let i = 2; taken.includes(id); i++) id = `${base}-${i}`;
  return id;
}
