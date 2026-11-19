import type { Metadata } from "next";
import { PRODUCTS } from "@/sites/skincare/data/products";
import ProductEdit from "@/sites/skincare/admin/views/ProductEdit";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = PRODUCTS.find((p) => p.slug === slug)?.name;
  return { title: name ? `Edit ${name}` : "Edit product" };
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductEdit slug={slug} />;
}
