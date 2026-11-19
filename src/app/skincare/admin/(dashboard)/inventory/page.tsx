import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/sites/skincare/admin/components/ui";
import Inventory from "@/sites/skincare/admin/views/Inventory";

export const metadata: Metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <Suspense fallback={<PageSkeleton rows={1} />}>
      <Inventory />
    </Suspense>
  );
}
