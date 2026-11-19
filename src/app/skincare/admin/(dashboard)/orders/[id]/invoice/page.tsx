import type { Metadata } from "next";
import Invoice from "@/sites/skincare/admin/views/Invoice";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Invoice for ${decodeURIComponent(id)}` };
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;
  return <Invoice id={id} />;
}
