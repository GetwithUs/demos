import type { Metadata } from "next";
import Analytics from "@/sites/skincare/admin/views/Analytics";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return <Analytics />;
}
