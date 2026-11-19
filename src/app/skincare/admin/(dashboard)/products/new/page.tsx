import type { Metadata } from "next";
import ProductNew from "@/sites/skincare/admin/views/ProductNew";

export const metadata: Metadata = { title: "Add product" };

export default function NewProductPage() {
  return <ProductNew />;
}
