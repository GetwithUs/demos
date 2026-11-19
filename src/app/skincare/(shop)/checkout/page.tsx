import type { Metadata } from "next";
import Checkout from "@/sites/skincare/components/checkout/Checkout";

export const metadata: Metadata = { title: "Secure checkout" };

export default function CheckoutPage() {
  return <Checkout />;
}
