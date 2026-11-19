import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Owner dashboard | Oruvi Skin", template: "%s | Oruvi Skin dashboard" },
  description: "Demo owner dashboard for the Oruvi Skin shop: orders, products, stock and sales.",
};

/** The owner dashboard. The shared skincare layout above adds the demo notice and saved data. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
