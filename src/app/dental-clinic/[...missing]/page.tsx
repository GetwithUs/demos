import { notFound } from "next/navigation";

/** Sends unknown /dental-clinic URLs to the clinic's own "not found" page, inside its layout. */
export default function MissingDentalPage() {
  notFound();
}
