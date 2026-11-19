export const PAYMENT_METHODS = ["UPI", "Debit and credit cards", "Net banking", "Cash"] as const;

export const EMI = {
  minimum: 10000,
  months: "3 to 12 months",
  headline: "No-cost EMI on treatments above ₹10,000",
  points: [
    "For implants, braces, aligners, crowns and smile makeovers",
    "3, 6, 9 or 12 monthly instalments through our lending partner, subject to approval",
    "Approval at the front desk in about 10 minutes with PAN and Aadhaar",
    "A small processing fee may apply; we show it before you sign",
    "Card EMI from most banks also works",
  ],
  example: {
    label: "A single implant with crown at ₹30,000, over 12 months",
    monthly: 2500,
  },
} as const;

export const INSURANCE_POINTS = [
  "Most Indian health insurance policies cover dental treatment only after an accident or when it needs hospitalisation.",
  "Some corporate and premium plans include an outpatient dental benefit, often ₹5,000 to ₹10,000 a year, paid back as a reimbursement.",
  "Cosmetic treatment such as whitening, veneers and aligners is usually excluded.",
  "We do not offer cashless dental treatment, but we prepare itemised bills, prescriptions and X-ray reports for your claim.",
] as const;

export const CARE_PLAN = {
  name: "Ivorine Care Plan",
  price: 1999,
  period: "per person, per year",
  includes: [
    "Two check-ups and two scale-and-polish cleanings",
    "Digital X-rays when your dentist needs them",
    "10% off all treatments, including implants and aligners",
    "Priority emergency slots and the after-hours advice line",
  ],
  note: "Family plan for up to four people at ₹6,499 a year.",
} as const;

export const ESTIMATE_PROMISE = [
  "Every price on this site is a starting price for the most common case.",
  "Your final cost is confirmed after an examination and any X-rays you need.",
  "You get a written, itemised estimate before treatment starts, and we ask before any change.",
] as const;

export const DIAGNOSTICS = [
  { label: "Consultation and check-up", from: 500 },
  { label: "Digital X-ray (RVG), per film", from: 300 },
  { label: "OPG, full mouth X-ray", from: 600 },
  { label: "3D CBCT scan, one jaw", from: 2500 },
] as const;
