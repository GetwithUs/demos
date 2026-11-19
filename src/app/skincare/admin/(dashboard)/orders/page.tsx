import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/sites/skincare/admin/components/ui";
import Orders from "@/sites/skincare/admin/views/Orders";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<PageSkeleton rows={1} />}>
      <Orders />
    </Suspense>
  );
}
