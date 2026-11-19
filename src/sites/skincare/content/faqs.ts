import { CONCERNS, SHIPPING, SKIN_TYPES } from "@/sites/skincare/data/catalog";
import type { Product } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";

export type Faq = { q: string; a: string };

/** The help centre (/skincare/faqs), grouped. */
export const SITE_FAQS: { group: string; items: Faq[] }[] = [
  {
    group: "Orders and payment",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: `UPI (Google Pay, PhonePe, Paytm and any UPI app), credit and debit cards including RuPay, net banking and cash on delivery. Paying online takes an extra ${SHIPPING.prepaidPercent}% off, up to ₹${SHIPPING.prepaidMax}.`,
      },
      {
        q: "Is cash on delivery available?",
        a: `Yes, on most pincodes for orders up to ${formatINR(SHIPPING.codMax)}. A ₹${SHIPPING.codFee} cash handling fee applies. Check your pincode on any product page to see if COD is available for you.`,
      },
      {
        q: "How do I use a coupon code?",
        a: "Enter it in the cart or at checkout and tap Apply. Only one coupon works per order. The prepaid discount is added on top of any coupon.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "You can cancel from your order page any time before it ships. Once shipped, you can refuse delivery or request a return for unopened products.",
      },
    ],
  },
  {
    group: "Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Dehradun next day, nearby cities 1 to 2 days, metros 2 to 4 days and the rest of India 4 to 6 days. Remote areas can take up to 10 days.",
      },
      {
        q: "How much is delivery?",
        a: `Free on orders above ₹${SHIPPING.freeAbove}. Below that, a flat ₹${SHIPPING.fee}.`,
      },
      {
        q: "How do I track my order?",
        a: "Open Track order in the header and enter your order ID, or check your WhatsApp for live updates with the courier and AWB number.",
      },
    ],
  },
  {
    group: "Returns and refunds",
    items: [
      {
        q: "What is your return policy?",
        a: `Unopened products can be returned within ${SHIPPING.returnDays} days of delivery. For hygiene reasons, opened products cannot be returned unless they arrived damaged or wrong.`,
      },
      {
        q: "My product arrived damaged. What do I do?",
        a: "Message us on WhatsApp within 48 hours with a photo of the package and the product. We will send a replacement at no cost.",
      },
      {
        q: "When will I get my refund?",
        a: "Within 5 to 7 working days of the return reaching us, to your original payment method. Cash on delivery refunds go to your UPI ID or bank account.",
      },
    ],
  },
  {
    group: "Products and skin",
    items: [
      {
        q: "Are your products suitable for sensitive skin?",
        a: "Every product is dermatologist tested and fragrance free. Look for Sensitive under Suitable for on each product, and patch test anything new on your inner arm for 48 hours.",
      },
      {
        q: "Can I use niacinamide and vitamin C together?",
        a: "Yes. Modern formulas work fine together. If your skin is sensitive, use vitamin C in the morning and niacinamide at night.",
      },
      {
        q: "Are the products safe during pregnancy?",
        a: "Avoid retinol during pregnancy and breastfeeding. For everything else, please check with your doctor, who knows your history.",
      },
      {
        q: "Are you cruelty free and vegan?",
        a: "Yes. We never test on animals, at any stage, and every formula is vegan.",
      },
      {
        q: "How soon will I see results?",
        a: "Hydration is instant. Oil control and glow usually show in 2 to 4 weeks of daily use. Pigmentation and fine lines need 8 to 12 weeks. Results vary from person to person.",
      },
    ],
  },
];

const LONG_RESULTS = new Set(["pigmentation", "ageing"]);

/** Questions shoppers ask on a product page, built from the product's own data. */
export function productFaqs(product: Product): Faq[] {
  const types = product.skinTypes.map((t) => SKIN_TYPES[t].toLowerCase());
  const concerns = product.concerns.map((c) => CONCERNS[c].label.toLowerCase());
  const slow = product.concerns.some((c) => LONG_RESULTS.has(c));
  const keys = product.keyIngredients.map((k) => k.name.toLowerCase()).join(" ");
  const faqs: Faq[] = [
    {
      q: "Who is this for?",
      a: `It suits ${list(types)} skin, and is made for ${list(concerns)}.${product.skinTypes.includes("sensitive") ? " It is gentle enough for sensitive skin." : " If your skin is very sensitive, patch test first."}`,
    },
    {
      q: "When will I see results?",
      a: slow
        ? "Most people notice smoother, more even looking skin in 4 to 6 weeks, with spots and fine lines continuing to improve over 8 to 12 weeks of daily use."
        : "You will feel the difference from the first use. Visible changes usually show in 2 to 4 weeks with daily use.",
    },
    {
      q: "Can I use it morning and night?",
      a:
        product.when.length === 2
          ? "Yes, it is made for both. Always finish your morning routine with sunscreen."
          : product.when[0] === "AM"
            ? "It is made for mornings. Follow with sunscreen."
            : "Use it at night only, and wear sunscreen the next morning.",
    },
  ];
  if (/retinol/.test(keys)) {
    faqs.push({
      q: "Can I use it during pregnancy?",
      a: "No. Avoid retinol while pregnant, trying to conceive or breastfeeding.",
    });
    faqs.push({
      q: "Can I use it with acids?",
      a: "Not on the same night. Alternate retinol nights with glycolic or salicylic nights, and keep at least one rest night a week.",
    });
  } else if (/salicylic|glycolic/.test(keys)) {
    faqs.push({
      q: "Can I use it with retinol?",
      a: "Use them on different nights. In the morning, an acid face wash is fine with any serum.",
    });
  } else if (product.category === "sunscreens") {
    faqs.push({
      q: "Will it leave a white cast?",
      a: "No. It uses new-generation filters that go on clear on every Indian skin tone, including deeper skin.",
    });
    faqs.push({
      q: "How much should I apply?",
      a: "Two finger lengths for your face and neck. Reapply every 2 to 3 hours when outdoors.",
    });
  } else {
    faqs.push({
      q: "Can I layer it with other actives?",
      a: "Yes. It layers well with niacinamide, vitamin C and hyaluronic acid. Apply thinnest to thickest.",
    });
  }
  faqs.push({
    q: "Is it fragrance free and non-comedogenic?",
    a: product.fragranceFree
      ? "Yes. No added fragrance or essential oils, and it is tested to not clog pores."
      : "It contains a light fragrance. It is tested to not clog pores.",
  });
  return faqs;
}

function list(words: string[]): string {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}
