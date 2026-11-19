import type { Metadata } from "next";
import Products from "@/sites/skincare/admin/views/Products";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <Products />;
}
