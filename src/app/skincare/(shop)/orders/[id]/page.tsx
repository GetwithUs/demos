import type { Metadata } from "next";
import OrderView from "@/sites/skincare/components/orders/OrderView";

export const metadata: Metadata = { title: "Your order" };

/** Order confirmation and tracking. Orders live in the browser, so the view is client-side. */
export default async function OrderPage({
  params,
  searchParams,
}: PageProps<"/skincare/orders/[id]">) {
  const { id } = await params;
  const { placed } = await searchParams;
  return <OrderView id={decodeURIComponent(id).toUpperCase()} placed={placed === "1"} />;
}
