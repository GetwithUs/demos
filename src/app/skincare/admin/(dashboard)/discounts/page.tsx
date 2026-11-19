import type { Metadata } from "next";
import Discounts from "@/sites/skincare/admin/views/Discounts";

export const metadata: Metadata = { title: "Discounts" };

export default function DiscountsPage() {
  return <Discounts />;
}
