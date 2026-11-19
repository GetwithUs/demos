import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/cn";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"] });
const text = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Demo websites | GetwithUs",
  description: "Two complete template websites by GetwithUs: a dental clinic and a skincare shop.",
};

const DEMOS = [
  {
    href: "/dental-clinic",
    kind: "Business website",
    name: "Ivorine Dental Studio",
    text: "A dental clinic in Dehradun: treatments with prices, doctors, smile gallery, online appointment booking and a WhatsApp assistant.",
    accent: "from-teal-200 to-sky-100",
  },
  {
    href: "/skincare",
    kind: "Online shop",
    name: "Oruvi Skin",
    text: "A skincare brand's store: shop by skin concern, product pages, cart, coupons, checkout with demo payment, order tracking and an owner dashboard.",
    accent: "from-amber-100 to-rose-100",
  },
] as const;

export default function DemosIndex() {
  return (
    <main
      className={cn(text.className, "min-h-dvh bg-[#f6f5f1] px-5 py-16 text-neutral-900 sm:py-24")}
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">GetwithUs</p>
        <h1
          className={cn(
            display.className,
            "mt-3 text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.03em]",
          )}
        >
          Demo websites
        </h1>
        <p className="mt-4 max-w-[38em] text-lg text-neutral-600">
          Complete, working templates you can click through like a real customer. The businesses are
          made up; bookings, orders and payments are pretend.
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {DEMOS.map((demo) => (
            <li key={demo.href}>
              <Link
                href={demo.href}
                className="group block h-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
              >
                <div className={cn("h-40 bg-gradient-to-br", demo.accent)} aria-hidden="true" />
                <div className="p-7">
                  <p className="text-sm font-semibold text-neutral-500">{demo.kind}</p>
                  <h2 className={cn(display.className, "mt-1 text-2xl font-bold tracking-tight")}>
                    {demo.name}
                  </h2>
                  <p className="mt-3 text-neutral-600">{demo.text}</p>
                  <p className="mt-6 font-semibold text-neutral-900">
                    Open the demo{" "}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
