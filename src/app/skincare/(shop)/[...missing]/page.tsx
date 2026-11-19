import { notFound } from "next/navigation";

/** Any other /skincare URL shows the shop's own 404 page, inside the shop header and footer. */
export default function MissingPage() {
  notFound();
}
