import { SHIPPING } from "@/sites/skincare/data/catalog";

/** Rotating offers in the slim bar above the header. */
export const ANNOUNCEMENTS = [
  { text: `Free delivery on orders above ₹${SHIPPING.freeAbove}`, href: "/skincare/shipping" },
  { text: "Use code GLOW10 for 10% off your order", href: "/skincare/shop?collection=bestsellers" },
  {
    text: `Extra ${SHIPPING.prepaidPercent}% off when you pay online with UPI or card`,
    href: "/skincare/shop",
  },
  {
    text: "New: Kesar Glow Overnight Mask, limited batch",
    href: "/skincare/products/kesar-glow-overnight-mask",
  },
  {
    text: "Stay safe: Oruvi never asks for your OTP or payment on a call",
    href: "/skincare/contact",
  },
] as const;

export type NavLink = { label: string; href: string; hint?: string };

/** "Shop" mega menu. Concern and category columns come from the catalogue. */
export const MEGA_FEATURES: { title: string; text: string; href: string; slug: string }[] = [
  {
    title: "Bestsellers",
    text: "The serums and sunscreens India keeps coming back for.",
    href: "/skincare/shop?collection=bestsellers",
    slug: "niacinamide-10-clarifying-serum",
  },
  {
    title: "New launches",
    text: "Kesar Glow Overnight Mask and Glycolic 5% Toner.",
    href: "/skincare/shop?collection=new",
    slug: "kesar-glow-overnight-mask",
  },
  {
    title: "Routine kits",
    text: "Complete routines in one box, at a better price.",
    href: "/skincare/categories/kits",
    slug: "clear-skin-routine-kit",
  },
];

export const PRIMARY_NAV: NavLink[] = [
  { label: "Bestsellers", href: "/skincare/shop?collection=bestsellers" },
  { label: "New launches", href: "/skincare/shop?collection=new" },
  { label: "Kits", href: "/skincare/categories/kits" },
  { label: "Skin quiz", href: "/skincare/skin-quiz" },
  { label: "Ingredients", href: "/skincare/ingredients" },
];

export const HELP_LINKS: NavLink[] = [
  { label: "Track your order", href: "/skincare/track" },
  { label: "Shipping and delivery", href: "/skincare/shipping" },
  { label: "Returns and refunds", href: "/skincare/returns" },
  { label: "FAQs", href: "/skincare/faqs" },
  { label: "Contact us", href: "/skincare/contact" },
];

export const POPULAR_SEARCHES = [
  "Niacinamide",
  "Sunscreen",
  "Vitamin C",
  "Acne",
  "Dark spots",
  "Moisturiser",
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Shop all", href: "/skincare/shop" },
      { label: "Bestsellers", href: "/skincare/shop?collection=bestsellers" },
      { label: "New launches", href: "/skincare/shop?collection=new" },
      { label: "Routine kits", href: "/skincare/categories/kits" },
      { label: "Sunscreens", href: "/skincare/categories/sunscreens" },
      { label: "Serums", href: "/skincare/categories/serums" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Take the skin quiz", href: "/skincare/skin-quiz" },
      { label: "Ingredient glossary", href: "/skincare/ingredients" },
      { label: "Our story", href: "/skincare/about" },
      { label: "My account", href: "/skincare/account" },
      { label: "Wishlist", href: "/skincare/wishlist" },
    ],
  },
  { title: "Help", links: HELP_LINKS },
];
