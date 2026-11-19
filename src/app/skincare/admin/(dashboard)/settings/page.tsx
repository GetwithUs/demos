import type { Metadata } from "next";
import Settings from "@/sites/skincare/admin/views/Settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <Settings />;
}
