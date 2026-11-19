"use client";

import { useSearchParams } from "next/navigation";
import BookingWizard from "@/sites/dental-clinic/components/BookingWizard";

/**
 * Reads ?treatment= and ?doctor= so links from treatment pages, dentist profiles and the
 * WhatsApp assistant open the booking flow with a choice already made.
 */
export default function BookingFromParams() {
  const params = useSearchParams();
  const treatment = params.get("treatment");
  const doctor = params.get("doctor");
  return (
    <BookingWizard
      key={`${treatment ?? ""}|${doctor ?? ""}`}
      initialReason={treatment}
      initialDoctor={doctor}
    />
  );
}
