import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { CallButton, ChatButton } from "@/sites/dental-clinic/components/ActionButtons";
import Logo from "@/sites/dental-clinic/components/Logo";
import OpenStatus from "@/sites/dental-clinic/components/OpenStatus";
import { Container } from "@/sites/dental-clinic/components/ui";
import { CLINIC, HOURS_SUMMARY } from "@/sites/dental-clinic/content/clinic";
import { MAIN_NAV, MORE_NAV } from "@/sites/dental-clinic/content/nav";
import { TREATMENTS } from "@/sites/dental-clinic/content/treatments";

const linkClass =
  "rounded-sm text-dental-ivory/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-dental-ivory";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-dental-spruce-deep text-dental-ivory/80">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(159_188_174/0.16),transparent_65%)]"
      />
      <Container className="relative pt-16 pb-10 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-xs leading-relaxed text-dental-ivory/75">
              Gentle, specialist dentistry for families and professionals on Rajpur Road, Dehradun,
              since {CLINIC.since}.
            </p>
            <OpenStatus tone="light" className="mt-6" />
            <p className="mt-6 text-[0.8125rem] text-dental-ivory/60">{CLINIC.registration}.</p>
          </div>

          <nav aria-label="Treatments">
            <h2 className="text-[0.75rem] font-semibold tracking-[0.16em] text-dental-brass uppercase">
              Treatments
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
              {TREATMENTS.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={`/dental-clinic/treatments/${t.slug}`} className={linkClass}>
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dental-clinic/treatments"
                  className={`${linkClass} font-semibold text-white`}
                >
                  All treatments
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="The studio">
            <h2 className="text-[0.75rem] font-semibold tracking-[0.16em] text-dental-brass uppercase">
              The studio
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
              {[...MAIN_NAV.slice(1), ...MORE_NAV].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.75rem] font-semibold tracking-[0.16em] text-dental-brass uppercase">
              Visit and contact
            </h2>
            <address className="mt-4 flex gap-3 text-[0.9375rem] leading-relaxed not-italic">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-dental-brass" />
              <span>
                {CLINIC.address.line1}
                <br />
                {CLINIC.address.line2}
                <br />
                {CLINIC.address.city}, {CLINIC.address.state} {CLINIC.address.pin}
              </span>
            </address>
            <dl className="mt-5 space-y-1.5 text-[0.9375rem]">
              {HOURS_SUMMARY.map((h) => (
                <div key={h.days}>
                  <dt className="font-semibold text-dental-ivory">{h.days}</dt>
                  <dd className="text-dental-ivory/75">{h.time}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-col items-start gap-2.5 text-[0.9375rem]">
              <CallButton
                label={`Call the studio, ${CLINIC.phone} (demo)`}
                className="inline-flex items-center gap-2.5 rounded-sm font-semibold text-white tabular-nums hover:text-dental-brass-soft focus-visible:outline-dental-ivory"
              >
                {CLINIC.phone}
              </CallButton>
              <ChatButton
                label={`WhatsApp ${CLINIC.whatsapp} (demo chat)`}
                className="inline-flex items-center gap-2.5 rounded-sm font-semibold text-white tabular-nums hover:text-dental-brass-soft focus-visible:outline-dental-ivory"
              >
                {CLINIC.whatsapp}
              </ChatButton>
              <p className="inline-flex items-center gap-2.5 text-dental-ivory/75">
                <Mail aria-hidden="true" className="size-4 shrink-0" />
                {CLINIC.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.8125rem] text-dental-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Ivorine Dental Studio, Dehradun.</p>
          <p>
            A fictional clinic on a demo website. Doctors, patients and reviews are made up. Prices
            are illustrative.
          </p>
        </div>
      </Container>
    </footer>
  );
}
