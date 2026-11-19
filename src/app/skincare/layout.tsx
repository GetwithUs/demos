import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import DemoBanner from "@/components/DemoBanner";
import DemoVisit from "@/components/DemoVisit";
import { cn } from "@/lib/cn";
import StoreHydrator from "@/sites/skincare/components/StoreHydrator";

const display = Fraunces({ subsets: ["latin"], variable: "--font-oruvi-display" });
const text = DM_Sans({ subsets: ["latin"], variable: "--font-oruvi-text" });

export const metadata: Metadata = {
  title: { default: "Oruvi Skin | Clinical skincare for Indian skin", template: "%s | Oruvi Skin" },
  description:
    "Serums, sunscreens and moisturisers with proven actives, made for Indian skin and weather. Free delivery above ₹499.",
};

/** Shared by the shop and the owner dashboard: fonts, the demo notice, saved data, visit count. */
export default function SkincareLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        display.variable,
        text.variable,
        "min-h-dvh bg-skin-bg font-skin-text text-skin-ink antialiased",
      )}
    >
      <DemoBanner business="skincare brand" />
      <StoreHydrator />
      <DemoVisit demo="skincare" />
      {children}
    </div>
  );
}
