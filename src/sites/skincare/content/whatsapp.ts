import { SHIPPING } from "@/sites/skincare/data/catalog";
import type { ConcernId, OrderStatus } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";

/** Copy for the mock WhatsApp chat (components/shop/WhatsAppChat). Nothing is sent anywhere. */
export const WA = {
  name: "Oruvi Skin",
  status: "Business account · replies instantly",
  notice: "Demo chat. Messages stay in this browser and are not sent anywhere.",
  greeting:
    "Hi! I am Ruvi, the Oruvi Skin assistant. I can track your order, help you pick products and answer questions about delivery and offers. What would you like to do?",
  menuPrompt: "Anything else I can help with?",
  askOrderId: "Sure. Please type your order ID. It starts with ORV, for example ORV-41207.",
  noOrders: "I do not see any orders from this browser yet.",
  chooseIntro: "Happy to help. What is your main skin concern right now?",
  chooseOutro:
    "For a full morning and night routine, the 2 minute skin quiz is the best place to start.",
  offers: [
    "Here are today's offers:",
    "GLOW10: 10% off any order, up to ₹300",
    "FIRST15: 15% off your first order above ₹999, up to ₹400",
    "DUO150: ₹150 off when you buy any 2 products",
    `Plus an extra ${SHIPPING.prepaidPercent}% off when you pay by UPI or card, and free delivery above ₹${SHIPPING.freeAbove}.`,
  ].join("\n"),
  askPincode:
    "Send me your 6 digit pincode and I will check the delivery date and cash on delivery for you.",
  codInfo: `Cash on delivery is available on most pincodes for orders up to ${formatINR(SHIPPING.codMax)}, with a ₹${SHIPPING.codFee} fee.`,
  expertConnecting: "Connecting you to a skin expert...",
  expertHello:
    "Hi, this is Neha from the Oruvi skin team. In the live store a real expert replies here, Monday to Saturday, 10 am to 7 pm. Tell me your skin type and what is bothering you most.",
  expertFollow:
    "Thank you for sharing. Start with the skin quiz for a full routine, and send me the result here. I will check it and adjust anything for you.",
  returns: `Unopened products can be returned within ${SHIPPING.returnDays} days of delivery. Damaged or wrong item? Send a photo within 48 hours and we will replace it free.`,
  fallback: "Sorry, I did not catch that. Here is what I can help with:",
  thanks: "You are welcome! Have a lovely day.",
  codConfirmAsk: (id: string, total: string) =>
    `Please confirm your cash on delivery order ${id} for ${total}. Confirmed orders are packed the same day.`,
  codConfirmed: (id: string) => `Thank you! ${id} is confirmed and will be packed today.`,
  codCancelled: (id: string) => `${id} has been cancelled. No payment is due.`,
};

export const WA_MENU = [
  { label: "Track my order", action: "track" },
  { label: "Help me choose a product", action: "choose" },
  { label: "Current offers", action: "offers" },
  { label: "Delivery and COD", action: "delivery" },
  { label: "Talk to a skin expert", action: "expert" },
] as const;

/** Concern buttons in "Help me choose", and the product the bot suggests for each. */
export const WA_CONCERNS: { id: ConcernId; label: string; slug: string }[] = [
  { id: "acne", label: "Acne", slug: "niacinamide-10-clarifying-serum" },
  { id: "pigmentation", label: "Dark spots and tan", slug: "alpha-arbutin-spot-corrector" },
  { id: "dullness", label: "Dullness", slug: "vitamin-c-15-brightening-serum" },
  { id: "dryness", label: "Dryness", slug: "ceramide-barrier-moisturiser" },
  { id: "oiliness", label: "Oily skin", slug: "salicylic-2-clearing-face-wash" },
  { id: "ageing", label: "Fine lines", slug: "retinol-0-3-night-serum" },
];

/** WhatsApp order update templates, as a store would send them. */
export const WA_STATUS: Partial<Record<OrderStatus, (first: string, id: string) => string>> = {
  placed: (first, id) =>
    `Hi ${first}, thank you for shopping with Oruvi Skin! We have received your order ${id}.`,
  confirmed: (first, id) => `Good news ${first}, your order ${id} is confirmed.`,
  packed: (_f, id) => `Your order ${id} is packed and waiting for the courier.`,
  shipped: (_f, id) => `Your order ${id} has shipped.`,
  "out-for-delivery": (_f, id) =>
    `Your order ${id} is out for delivery today. Please keep your phone handy.`,
  delivered: (first, id) =>
    `${id} has been delivered. Enjoy, ${first}! Reply with a rating from 1 to 5 to tell us how we did.`,
  cancelled: (_f, id) => `Your order ${id} has been cancelled.`,
};
