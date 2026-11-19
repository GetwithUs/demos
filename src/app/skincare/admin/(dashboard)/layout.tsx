import type { ReactNode } from "react";
import AdminShell from "@/sites/skincare/admin/components/AdminShell";

/** Every signed-in dashboard page: sidebar, top bar and the sign-in guard. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
