import type { Metadata } from "next";
import Overview from "@/sites/skincare/admin/views/Overview";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return <Overview />;
}
