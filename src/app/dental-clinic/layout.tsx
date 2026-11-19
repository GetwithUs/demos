import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import DemoBanner from "@/components/DemoBanner";
import DemoVisit from "@/components/DemoVisit";
import { cn } from "@/lib/cn";
import CallNotice from "@/sites/dental-clinic/components/CallNotice";
import MobileActionBar from "@/sites/dental-clinic/components/MobileActionBar";
import SiteFooter from "@/sites/dental-clinic/components/SiteFooter";
import SiteHeader from "@/sites/dental-clinic/components/SiteHeader";
import WhatsAppWidget from "@/sites/dental-clinic/components/WhatsAppWidget";
import { dentalDisplay, dentalSans } from "@/sites/dental-clinic/fonts";

export const metadata: Metadata = {
  title: {
    default: "Ivorine Dental Studio | Specialist dentists on Rajpur Road, Dehradun",
    template: "%s | Ivorine Dental Studio, Dehradun",
  },
  description:
    "Gentle, specialist dental care in Dehradun: check-ups, root canals, implants, braces and aligners, whitening and children's dentistry. Clear prices, no-cost EMI and online booking.",
};

export const viewport: Viewport = {
  themeColor: "#f8f4ec",
};

export default function DentalLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        dentalDisplay.variable,
        dentalSans.variable,
        "flex min-h-dvh flex-col bg-dental-ivory font-dental-sans text-dental-body antialiased selection:bg-dental-mint selection:text-dental-ink",
        "pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0",
      )}
    >
      <DemoBanner business="dental clinic" className="bg-dental-ink text-dental-ivory/85" />
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-dental-spruce px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
      <MobileActionBar />
      <WhatsAppWidget />
      <CallNotice />
      <DemoVisit demo="dental-clinic" />
    </div>
  );
}
