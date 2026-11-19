import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/sites/skincare/admin/components/ui";
import Customers from "@/sites/skincare/admin/views/Customers";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <Suspense fallback={<PageSkeleton rows={1} />}>
      <Customers />
    </Suspense>
  );
}
