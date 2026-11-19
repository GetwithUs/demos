import type { CategoryId, ConcernId, Coupon, SkinType } from "@/sites/skincare/data/types";

export const BRAND = {
  name: "Oruvi Skin",
  short: "Oruvi",
  tagline: "Clinical actives, made for Indian skin and weather.",
  city: "Dehradun",
  supportEmail: "care@oruviskin.example",
  /** Shown as text only; never a working link (it is made up). */
  supportPhone: "+91 98765 43210",
} as const;

export const CONCERNS: Record<ConcernId, { label: string; blurb: string }> = {
  acne: { label: "Acne and breakouts", blurb: "Clear clogged pores and calm active breakouts." },
  pigmentation: {
    label: "Dark spots and pigmentation",
    blurb: "Fade spots, tan and post-acne marks.",
  },
  dullness: { label: "Dullness", blurb: "Bring back glow and even skin tone." },
  dryness: { label: "Dryness", blurb: "Deep hydration and a stronger skin barrier." },
  oiliness: { label: "Oiliness and large pores", blurb: "Control shine, refine pores." },
  ageing: { label: "Fine lines and ageing", blurb: "Smooth fine lines and firm the skin." },
  sensitivity: { label: "Sensitive skin", blurb: "Soothe redness with gentle formulas." },
  "sun-protection": {
    label: "Sun protection",
    blurb: "High protection without a white cast.",
  },
};

export const CATEGORIES: Record<CategoryId, { label: string; plural: string }> = {
  cleansers: { label: "Cleanser", plural: "Cleansers" },
  toners: { label: "Toner", plural: "Toners and mists" },
  serums: { label: "Serum", plural: "Serums" },
  moisturisers: { label: "Moisturiser", plural: "Moisturisers" },
  sunscreens: { label: "Sunscreen", plural: "Sunscreens" },
  masks: { label: "Mask", plural: "Masks" },
  "eye-lip": { label: "Eye and lip care", plural: "Eye and lip care" },
  kits: { label: "Kit", plural: "Routine kits" },
};

export const SKIN_TYPES: Record<SkinType, string> = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  normal: "Normal",
  sensitive: "Sensitive",
};

/** Delivery and payment rules, used by pricing.ts and shown in the shop's copy. */
export const SHIPPING = {
  /** Free delivery when the cart (after coupon) reaches this amount. */
  freeAbove: 499,
  fee: 49,
  /** Extra charge for cash on delivery. */
  codFee: 40,
  /** Cash on delivery is available up to this order value. */
  codMax: 5000,
  /** Extra discount for paying online. */
  prepaidPercent: 5,
  prepaidMax: 100,
  /** Days a customer has to request a return on an unopened product. */
  returnDays: 7,
} as const;

export const COUPONS: Coupon[] = [
  {
    code: "GLOW10",
    description: "10% off your order, up to ₹300",
    kind: "percent",
    value: 10,
    minSubtotal: 0,
    maxDiscount: 300,
    active: true,
  },
  {
    code: "FIRST15",
    description: "15% off your first order above ₹999, up to ₹400",
    kind: "percent",
    value: 15,
    minSubtotal: 999,
    maxDiscount: 400,
    firstOrderOnly: true,
    active: true,
  },
  {
    code: "DUO150",
    description: "₹150 off when you buy any 2 products",
    kind: "flat",
    value: 150,
    minSubtotal: 0,
    minItems: 2,
    active: true,
  },
];
