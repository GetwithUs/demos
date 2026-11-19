"use client";

import { ArrowRight, LayoutDashboard, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, PaymentMarks, SocialIcon } from "@/sites/skincare/components/shop/Brand";
import Newsletter from "@/sites/skincare/components/shop/Newsletter";
import { BRAND } from "@/sites/skincare/data/catalog";
import { FOOTER_COLUMNS } from "@/sites/skincare/content/nav";

export default function ShopFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/skincare/checkout")) {
    return (
      <footer className="border-t border-skin-line py-6 text-center text-xs text-skin-subtle">
        <PaymentMarks className="justify-center" />
        <p className="mt-3">
          © 2026 {BRAND.name}. Payments on this demo are simulated, no money is charged.
        </p>
      </footer>
    );
  }

  return (
    <footer className="mt-20 bg-skin-forest text-white/85">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 pt-14 pb-10 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-10 [&>*]:min-w-0">
        <div>
          <Logo className="text-white [&_span]:text-white" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            {BRAND.tagline} Formulated and packed in Dehradun, Uttarakhand.
          </p>
          {/* The home page has its own newsletter band, so the footer skips it there. */}
          {pathname !== "/skincare" ? <Newsletter tone="dark" className="mt-7 max-w-md" /> : null}
          <div className="mt-7">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
              Follow @oruviskin
            </p>
            <ul className="mt-3 flex gap-2" aria-label="Social media (not linked in this demo)">
              {(["instagram", "youtube", "facebook", "x"] as const).map((n) => (
                <li key={n}>
                  <span
                    className="grid size-9 place-items-center rounded-full bg-white/10 text-white"
                    title={`${n} (demo, not linked)`}
                  >
                    <SocialIcon name={n} />
                    <span className="sr-only">{n}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/85 hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 rounded-2xl bg-white/[0.07] p-5 sm:col-span-3">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="text-sm">
                <p className="font-medium text-white">Customer care</p>
                <p className="mt-1 text-white/75">Mon to Sat, 10 am to 7 pm</p>
                <p className="mt-2 text-white/85">{BRAND.supportPhone}</p>
                <p className="text-white/85">{BRAND.supportEmail}</p>
              </div>
              <div className="text-sm">
                <p className="flex items-center gap-2 font-medium text-white">
                  <ShieldAlert className="size-4 text-[#f3c77a]" aria-hidden />
                  Beware of fraud calls
                </p>
                <p className="mt-1 text-white/75">
                  Oruvi never asks for your OTP, card details or payment on a phone call. Report
                  suspicious calls to our care team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <Link
          href="/skincare/admin"
          className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 px-5 py-4 text-sm transition hover:border-white/40 hover:bg-white/[0.04]"
        >
          <span className="flex items-center gap-3">
            <LayoutDashboard className="size-5 text-[#b9d3c4]" aria-hidden />
            <span>
              <span className="font-medium text-white">Shop owner?</span> See the owner dashboard:
              orders, stock, prices and sales.
            </span>
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-white">
            Open dashboard
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1320px] flex-col gap-4 border-t border-white/10 px-4 py-6 text-xs text-white/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="space-y-1">
          <p>© 2026 Oruvi Skin Private Limited. All rights reserved.</p>
          <p>
            CIN U00000UR2022PTC000000 · GSTIN 05AAAAA0000A1Z0 · Grievance officer: Sana Qureshi,{" "}
            {BRAND.supportEmail}
          </p>
        </div>
        <PaymentMarks />
      </div>
    </footer>
  );
}
