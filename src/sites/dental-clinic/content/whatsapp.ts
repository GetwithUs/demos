import { CLINIC, FULL_ADDRESS, HOURS_SUMMARY } from "@/sites/dental-clinic/content/clinic";
import { TREATMENTS, getTreatment } from "@/sites/dental-clinic/content/treatments";
import { formatINR } from "@/sites/dental-clinic/lib/format";

/**
 * The scripted WhatsApp assistant. It only ever answers from this file; nothing is sent to any
 * server. Text supports WhatsApp-style *bold* and line breaks.
 */
export type IntentId =
  | "menu"
  | "book"
  | "timings"
  | "prices"
  | "location"
  | "human"
  | "emergency"
  | "price-root-canal"
  | "price-implants"
  | "price-braces"
  | "price-whitening"
  | "emi"
  | "thanks";

export type ChatLink = { label: string; href: string };

export type BotReply = {
  text: string;
  links?: ChatLink[];
  /** Quick-reply buttons shown under this message. */
  chips?: IntentId[];
};

export const CHIP_LABELS: Record<IntentId, string> = {
  menu: "Main menu",
  book: "Book appointment",
  timings: "Timings",
  prices: "Treatment prices",
  location: "Location",
  human: "Talk to the front desk",
  emergency: "I'm in pain",
  "price-root-canal": "Root canal",
  "price-implants": "Implants",
  "price-braces": "Braces and aligners",
  "price-whitening": "Whitening",
  emi: "EMI options",
  thanks: "Thank you",
};

const MAIN_CHIPS: IntentId[] = ["book", "timings", "prices", "location", "human"];

export const GREETING: BotReply[] = [
  {
    text: `Namaste! Welcome to *${CLINIC.name}*, Rajpur Road, Dehradun.`,
  },
  {
    text: "I'm the studio's WhatsApp assistant. I can help you book, share timings and prices, or connect you to the front desk. What would you like to do?",
    chips: MAIN_CHIPS,
  },
];

function priceLine(slug: string): string {
  const t = getTreatment(slug);
  return t ? `${t.shortName}: from *${formatINR(t.priceFrom)}*` : "";
}

function treatmentDetail(slug: string, intro: string): BotReply[] {
  const t = getTreatment(slug);
  if (!t) return [];
  const options = t.priceOptions
    .slice(0, 4)
    .map((o) => `- ${o.label}: from ${formatINR(o.from)}`)
    .join("\n");
  return [
    {
      text: `${intro}\n\n*${t.name}*\n${options}\n\nVisits: ${t.sittings.toLowerCase()}.${t.emi ? "\nNo-cost EMI available." : ""}\n\nThe exact cost is confirmed after a check-up, with a written estimate.`,
      links: [
        {
          label: `About ${t.shortName.toLowerCase()}`,
          href: `/dental-clinic/treatments/${t.slug}`,
        },
        { label: "Book a consultation", href: `/dental-clinic/book?treatment=${t.slug}` },
      ],
      chips: ["prices", "emi", "book"],
    },
  ];
}

export function replyFor(intent: IntentId): BotReply[] {
  switch (intent) {
    case "menu":
      return [{ text: "Sure. What can I help you with?", chips: MAIN_CHIPS }];
    case "book":
      return [
        {
          text: "Happy to help you book. It takes about a minute online: choose the treatment, a date and a time, and you get a booking reference straight away.\n\nTap what you need, or choose *Not sure yet* for a consultation.",
          links: [
            {
              label: "Check-up and cleaning",
              href: "/dental-clinic/book?treatment=check-up-and-cleaning",
            },
            { label: "Tooth pain", href: "/dental-clinic/book?treatment=tooth-pain" },
            {
              label: "Braces or aligners",
              href: "/dental-clinic/book?treatment=braces-and-aligners",
            },
            { label: "Not sure yet", href: "/dental-clinic/book?treatment=consultation" },
          ],
          chips: ["timings", "human"],
        },
      ];
    case "timings":
      return [
        {
          text: `*Studio timings*\n${HOURS_SUMMARY.map((h) => `${h.days}: ${h.time}`).join("\n")}\n\nWe keep same-day slots for tooth pain every day we are open.`,
          chips: ["book", "location", "emergency"],
        },
      ];
    case "prices": {
      const lines = TREATMENTS.map((t) => `- ${priceLine(t.slug)}`).join("\n");
      return [
        {
          text: `*Starting prices*\n${lines}\n\nConsultation is ${formatINR(500)}, adjusted if treatment starts the same day. Final costs are confirmed after a check-up.`,
          links: [{ label: "See the full fee list", href: "/dental-clinic/fees" }],
          chips: ["price-root-canal", "price-implants", "price-braces", "price-whitening"],
        },
      ];
    }
    case "price-root-canal":
      return treatmentDetail(
        "root-canal-treatment",
        "Most root canals here are done in one sitting.",
      );
    case "price-implants":
      return treatmentDetail("dental-implants", "Implants are planned with a 3D scan first.");
    case "price-braces":
      return treatmentDetail(
        "braces-and-aligners",
        "Our orthodontist will tell you honestly which option suits you.",
      );
    case "price-whitening":
      return treatmentDetail("teeth-whitening", "We check your teeth and gums before whitening.");
    case "emi":
      return [
        {
          text: "*No-cost EMI* is available on treatments above ₹10,000, over 3 to 12 months, through our lending partner, subject to approval. Approval at the front desk takes about 10 minutes with PAN and Aadhaar.\n\nFor example, a ₹30,000 implant works out to about ₹2,500 a month over 12 months.",
          links: [{ label: "Fees, EMI and insurance", href: "/dental-clinic/fees" }],
          chips: ["book", "menu"],
        },
      ];
    case "location":
      return [
        {
          text: `*${CLINIC.name}*\n${FULL_ADDRESS}\n\n${CLINIC.landmark}\n\nFree basement parking for 10 cars, entry from the lane behind the building.`,
          links: [
            { label: "Get directions", href: CLINIC.directionsUrl },
            { label: "Contact and map", href: "/dental-clinic/contact" },
          ],
          chips: ["timings", "book"],
        },
      ];
    case "emergency":
      return [
        {
          text: "Sorry you're in pain. We keep *same-day emergency slots* every day we are open.\n\nIf you have swelling that affects breathing or swallowing, please go to the nearest hospital emergency department now.\n\nOtherwise, book the next free slot and choose *Tooth pain*. Rinse with warm salt water and take a painkiller you normally use until you're seen.",
          links: [
            { label: "Book an emergency slot", href: "/dental-clinic/book?treatment=tooth-pain" },
            { label: "Emergency advice", href: "/dental-clinic/emergency" },
          ],
          chips: ["human", "location"],
        },
      ];
    case "human":
      return [
        {
          text: "Connecting you to the front desk. A team member usually replies within a few minutes during studio hours.",
        },
        {
          text: "Hi, this is Pooja from the front desk. How can I help?\n\n_(Demo: in the real website, a person from the clinic replies here on WhatsApp. This chat ends here.)_",
          chips: ["menu"],
        },
      ];
    case "thanks":
      return [
        {
          text: "You're welcome! Wishing you a happy, healthy smile. Message any time.",
          chips: ["menu"],
        },
      ];
  }
}

export const FALLBACK: BotReply[] = [
  {
    text: "Thanks for your message. I'm an automated assistant, so I may not have understood. Pick an option below, or ask for the front desk and a person will reply.",
    chips: MAIN_CHIPS,
  },
];

const KEYWORDS: [IntentId, RegExp][] = [
  [
    "emergency",
    /\b(pain|hurt|hurts|ache|aching|swell|swelling|swollen|broke|broken|bleed|emergency|urgent)/i,
  ],
  ["price-root-canal", /\b(root canal|rct)\b/i],
  ["price-implants", /\bimplant/i],
  ["price-braces", /\b(brace|aligner|straight)/i],
  ["price-whitening", /\b(whiten|whitening|yellow|stain)/i],
  ["emi", /\b(emi|instal|loan|finance|insurance)/i],
  ["prices", /\b(price|cost|fee|fees|charge|rate|kitna|how much|rupees|rs)\b/i],
  ["book", /\b(book|appointment|slot|visit|schedule)/i],
  ["timings", /\b(time|timing|timings|open|close|hours|sunday|today)/i],
  ["location", /\b(where|address|location|map|direction|parking|reach)/i],
  ["human", /\b(human|person|staff|front desk|reception|call|talk)/i],
  ["thanks", /\b(thanks|thank you|thx|ok thanks|great)\b/i],
  ["menu", /\b(hi|hello|hey|namaste|menu|help|start)\b/i],
];

export function detectIntent(text: string): IntentId | null {
  for (const [intent, pattern] of KEYWORDS) {
    if (pattern.test(text)) return intent;
  }
  return null;
}
