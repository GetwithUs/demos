import { AlertTriangle, CalendarClock, Clock, Siren } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CallButton, ChatButton } from "@/sites/dental-clinic/components/ActionButtons";
import { CtaBand, HoursList } from "@/sites/dental-clinic/components/sections";
import { Breadcrumbs, Container, buttonClasses } from "@/sites/dental-clinic/components/ui";
import { CLINIC } from "@/sites/dental-clinic/content/clinic";
import { EMERGENCY_FIRST_AID, EMERGENCY_SIGNS } from "@/sites/dental-clinic/content/studio";

export const metadata: Metadata = {
  title: "Dental emergency: same-day slots",
  description:
    "Toothache, swelling or a broken or knocked-out tooth in Dehradun? Ivorine Dental Studio keeps same-day emergency slots every day it is open, including Sunday mornings.",
};

export default function EmergencyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-dental-coral/15 bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--color-dental-coral-soft),transparent_65%)]">
        <Container className="pt-8 pb-14 sm:pt-10 sm:pb-20">
          <Breadcrumbs
            items={[{ href: "/dental-clinic", label: "Home" }, { label: "Dental emergency" }]}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="animate-dental-rise">
              <p className="inline-flex items-center gap-2 rounded-full bg-dental-coral px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white">
                <Siren aria-hidden="true" className="size-4" />
                Dental emergency
              </p>
              <h1 className="mt-5 font-dental-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.025em] text-balance text-dental-ink">
                Tooth pain? We keep same-day slots for you.
              </h1>
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-dental-body">
                We keep same-day slots free for emergencies every day we are open, including Sunday
                mornings. Book the next free slot online, or message us and we will fit you in.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/dental-clinic/book?treatment=tooth-pain"
                  className={cn(
                    buttonClasses("primary", "lg"),
                    "bg-dental-coral hover:bg-[#963826]",
                  )}
                >
                  Book a same-day slot
                </Link>
                <ChatButton className={buttonClasses("secondary", "lg")}>WhatsApp us</ChatButton>
                <CallButton className={buttonClasses("secondary", "lg")}>
                  Call {CLINIC.phone}
                </CallButton>
              </div>
            </div>
            <div className="flex gap-4 rounded-[1.5rem] border border-dental-coral/30 bg-dental-paper p-5 shadow-dental-soft">
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 size-6 shrink-0 text-dental-coral"
              />
              <p className="leading-relaxed text-dental-body">
                <strong className="font-semibold text-dental-ink">
                  Go to a hospital emergency department straight away
                </strong>{" "}
                if swelling is spreading to your eye or neck, if you find it hard to breathe or
                swallow, or after a serious injury to the face or jaw.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-24">
        <section aria-labelledby="signs-title">
          <h2
            id="signs-title"
            className="font-dental-display text-[2rem] leading-tight text-dental-ink"
          >
            What counts as a dental emergency
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EMERGENCY_SIGNS.map((s) => (
              <li
                key={s}
                className="flex items-center gap-3 rounded-2xl bg-dental-paper p-4 shadow-dental-soft"
              >
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-dental-coral" />
                <span className="font-medium text-dental-ink">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="aid-title" className="mt-20">
          <h2
            id="aid-title"
            className="font-dental-display text-[2rem] leading-tight text-dental-ink"
          >
            What to do right now
          </h2>
          <p className="mt-2 max-w-2xl text-dental-muted">
            General first aid until you can see a dentist. It does not replace an examination.
          </p>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {EMERGENCY_FIRST_AID.map((a) => (
              <li
                key={a.title}
                className="rounded-[1.5rem] border border-dental-line/80 bg-dental-paper p-6 sm:p-7"
              >
                <h3 className="font-dental-display text-[1.4rem] leading-tight text-dental-ink">
                  {a.title}
                </h3>
                <p className="mt-2 leading-relaxed text-dental-body">{a.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="when-title" className="mt-20 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.75rem] bg-dental-paper p-6 shadow-dental-soft sm:p-8">
            <h2
              id="when-title"
              className="flex items-center gap-2.5 font-dental-display text-[1.6rem] leading-tight text-dental-ink"
            >
              <Clock aria-hidden="true" className="size-5 text-dental-brass-deep" />
              When we can see you
            </h2>
            <HoursList className="mt-4" />
          </div>
          <div className="rounded-[1.75rem] bg-dental-mist p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 font-dental-display text-[1.6rem] leading-tight text-dental-ink">
              <CalendarClock aria-hidden="true" className="size-5 text-dental-spruce" />
              After hours
            </h2>
            <p className="mt-3 leading-relaxed text-dental-body">
              Registered patients and Ivorine Care Plan members can message the after-hours line,{" "}
              <span className="font-semibold text-dental-ink tabular-nums">
                {CLINIC.emergencyPhone}
              </span>
              , for advice from the dentist on call. We will tell you whether it can wait until
              morning, and keep the first slot of the day for you if it cannot.
            </p>
            <p className="mt-4 text-[0.875rem] text-dental-muted">
              The number is shown as text only on this demo website.
            </p>
          </div>
        </section>
      </Container>

      <CtaBand
        title="Do not wait it out."
        text="Most dental pain gets worse, not better. Book a same-day slot, or message us now."
      />
    </>
  );
}
