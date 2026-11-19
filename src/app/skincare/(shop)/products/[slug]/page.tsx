import type { Metadata } from "next";
import ProductView from "@/sites/skincare/components/product/ProductView";
import { PRODUCTS, productBySlug } from "@/sites/skincare/data/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/skincare/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: `${product.tagline}. ${product.description}` };
}

/**
 * Product page. The view is a client component reading the live catalogue, so the owner's
 * price, stock and visibility changes show up, and products the owner adds work too.
 */
export default async function ProductPage({ params }: PageProps<"/skincare/products/[slug]">) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
