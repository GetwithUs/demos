import type { Metadata } from "next";
import OrderDetail from "@/sites/skincare/admin/views/OrderDetail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${decodeURIComponent(id)}` };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
