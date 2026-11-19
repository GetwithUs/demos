import type { DoctorId } from "@/sites/dental-clinic/content/doctors";
import { TREATMENTS, type ToothIconName } from "@/sites/dental-clinic/content/treatments";

export type BookingReason = {
  id: string;
  label: string;
  hint: string;
  icon: ToothIconName;
  minutes: number;
  /** Dentists who usually see this, shown as "Specialist" in the dentist picker. */
  doctors: DoctorId[];
  priceFrom: number;
  priceLabel: string;
};

export const CONSULTATION_FEE = 500;

export const BOOKING_REASONS: BookingReason[] = [
  {
    id: "consultation",
    label: "Not sure yet",
    hint: "A consultation and check-up, then advice from the right specialist",
    icon: "checkup",
    minutes: 30,
    doctors: ["aditi-rawat", "sana-qureshi"],
    priceFrom: CONSULTATION_FEE,
    priceLabel: "Consultation",
  },
  {
    id: "tooth-pain",
    label: "Tooth pain or emergency",
    hint: "Same-day slots are kept free for pain, swelling and broken teeth",
    icon: "emergency",
    minutes: 30,
    doctors: ["sana-qureshi"],
    priceFrom: CONSULTATION_FEE,
    priceLabel: "Emergency consultation",
  },
  ...TREATMENTS.map((t) => ({
    id: t.slug,
    label: t.name,
    hint: t.summary,
    icon: t.icon,
    minutes: t.bookingMinutes,
    doctors: t.doctors,
    priceFrom: t.priceFrom,
    priceLabel: `Starting price, ${t.priceUnit}`,
  })),
];

export function getReason(id: string | null | undefined): BookingReason | undefined {
  return BOOKING_REASONS.find((r) => r.id === id);
}

export const AFTER_BOOKING = [
  "In the real website, the front desk confirms on WhatsApp within two working hours.",
  "A reminder arrives on WhatsApp the evening before your visit.",
  "Please arrive ten minutes early for a first visit, with any old X-rays or reports.",
  "Need to change it? Reply to the reminder or book again here.",
] as const;
