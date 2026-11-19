import type { Metadata } from "next";
import CartPage from "@/sites/skincare/components/cart/CartPage";

export const metadata: Metadata = { title: "Your cart" };

export default function Page() {
  return <CartPage />;
}
