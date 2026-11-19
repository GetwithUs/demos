/** Shared types for the Oruvi Skin demo shop (storefront and owner dashboard). */

export type ConcernId =
  | "acne"
  | "pigmentation"
  | "dullness"
  | "dryness"
  | "oiliness"
  | "ageing"
  | "sensitivity"
  | "sun-protection";

export type CategoryId =
  "cleansers" | "toners" | "serums" | "moisturisers" | "sunscreens" | "masks" | "eye-lip" | "kits";

export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type Badge = "Bestseller" | "New" | "Award winner" | "Limited";

/** How a product's pack is drawn (see components/ProductVisual). */
export type VisualShape = "dropper" | "pump" | "tube" | "jar" | "mist" | "stick" | "box";

export type ProductVisualSpec = {
  shape: VisualShape;
  /** Pack colour. */
  body: string;
  /** Cap, pump or lid colour. */
  cap: string;
  /** Liquid seen through a clear pack (droppers and mists). */
  liquid?: string;
  /** Label background. */
  labelBg: string;
  /** Label text colour. */
  labelInk: string;
  /** Short label text, up to two lines split by "\n" (e.g. "Niacinamide\n10% + Zinc"). */
  label: string;
  /** Soft background tint behind the pack. */
  tint: string;
};

export type Variant = {
  id: string;
  /** Pack size as shown, e.g. "30 ml". */
  size: string;
  /** Selling price in rupees, GST included. */
  price: number;
  /** Maximum retail price in rupees, GST included. */
  mrp: number;
  /** Units in stock at the start of the demo. */
  stock: number;
};

export type KeyIngredient = { name: string; amount?: string; benefit: string };

export type Product = {
  slug: string;
  name: string;
  /** One line under the name. */
  tagline: string;
  category: CategoryId;
  concerns: ConcernId[];
  skinTypes: SkinType[];
  keyIngredients: KeyIngredient[];
  description: string;
  benefits: string[];
  howToUse: string[];
  /** Full ingredient list (INCI). */
  ingredients: string;
  texture: string;
  /** "AM", "PM" or both. */
  when: ("AM" | "PM")[];
  variants: Variant[];
  rating: number;
  reviewCount: number;
  badges: Badge[];
  visual: ProductVisualSpec;
  /** Slugs shown as "Pairs well with" / "Frequently bought together". */
  pairsWith: string[];
  fragranceFree: boolean;
  /** ISO date; newest first in "New launches". */
  launchedOn: string;
  /** False when the owner has switched it off in the dashboard. */
  active: boolean;
};

export type CartLine = { slug: string; variantId: string; qty: number };

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type Address = {
  name: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderItem = {
  slug: string;
  variantId: string;
  name: string;
  size: string;
  price: number;
  mrp: number;
  qty: number;
};

export type CartTotals = {
  itemCount: number;
  /** Sum of MRP x quantity. */
  mrpTotal: number;
  /** Sum of selling price x quantity. */
  subtotal: number;
  /** MRP total minus subtotal. */
  productSavings: number;
  couponCode?: string;
  couponDiscount: number;
  /** Extra discount for paying online (not cash on delivery). */
  prepaidDiscount: number;
  shipping: number;
  codFee: number;
  total: number;
  /** GST already included in the total (18% on cosmetics). */
  gstIncluded: number;
  /** Rupees still needed for free delivery; 0 once it is free. */
  freeShippingGap: number;
};

export type OrderEvent = { status: OrderStatus; at: string; note?: string };

export type Order = {
  /** e.g. "ORV-48213" */
  id: string;
  createdAt: string;
  items: OrderItem[];
  totals: CartTotals;
  payment: {
    method: PaymentMethod;
    status: "paid" | "pending" | "refunded";
    /** Demo transaction reference for prepaid orders. */
    ref?: string;
  };
  address: Address;
  status: OrderStatus;
  history: OrderEvent[];
  courier?: string;
  awb?: string;
  /** "seed" orders are sample data for the dashboard; "visitor" orders were placed in this browser. */
  source: "seed" | "visitor";
};

export type Coupon = {
  code: string;
  description: string;
  kind: "percent" | "flat";
  value: number;
  /** Minimum cart subtotal in rupees. */
  minSubtotal: number;
  /** Cap for percentage coupons. */
  maxDiscount?: number;
  minItems?: number;
  firstOrderOnly?: boolean;
  active: boolean;
};
