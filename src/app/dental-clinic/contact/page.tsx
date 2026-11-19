import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { CallButton, ChatButton } from "@/sites/dental-clinic/components/ActionButtons";
import CallbackForm from "@/sites/dental-clinic/components/CallbackForm";
import { WhatsAppIcon } from "@/sites/dental-clinic/components/icons";
import MapIllustration from "@/sites/dental-clinic/components/MapIllustration";
import OpenStatus from "@/sites/dental-clinic/components/OpenStatus";
import { EmergencyBand, HoursList } from "@/sites/dental-clinic/components/sections";
import { Container, PageIntro, buttonClasses } from "@/sites/dental-clinic/components/ui";
import { CLINIC, FULL_ADDRESS, GETTING_HERE } from "@/sites/dental-clinic/content/clinic";

export const metadata: Metadata = {
  title: "Contact, timings and directions",
  description:
    "Ivorine Dental Studio, Kesar Court, Rajpur Road near Dilaram Chowk, Dehradun. Open Monday to Saturday 10 am to 8 pm, Sunday 10 am to 2 pm. Free parking.",
};

const cardClass =
  "group flex h-full w-full flex-col items-start rounded-[1.5rem] border border-dental-line/80 bg-dental-paper p-6 text-left shadow-dental-soft transition-[transform,box-shadow] duration-500 ease-dental hover:-translate-y-1 hover:shadow-dental-lift";

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Visit, call or message." crumbs={[{ label: "Contact" }]}>
        <p className="mt-6">
          <OpenStatus />
        </p>
      </PageIntro>

      <Container className="py-16 sm:py-20">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <CallButton showIcon={false} className={cardClass}>
              <span className="grid size-11 place-items-center rounded-xl bg-dental-mint text-dental-spruce">
                <Phone aria-hidden="true" className="size-5" strokeWidth={1.7} />
              </span>
              <span className="mt-5 text-[0.8125rem] font-semibold text-dental-muted">
                Call the front desk
              </span>
              <span className="mt-1 font-dental-display text-[1.4rem] text-dental-ink tabular-nums">
                {CLINIC.phone}
              </span>
              <span className="mt-auto pt-3 text-[0.8125rem] text-dental-muted">
                During studio hours
              </span>
            </CallButton>
          </li>
          <li>
            <ChatButton showIcon={false} className={cardClass}>
              <span className="grid size-11 place-items-center rounded-xl bg-[#dcf8e7] text-dental-wa-deep">
                <WhatsAppIcon className="size-6" />
              </span>
              <span className="mt-5 text-[0.8125rem] font-semibold text-dental-muted">
                WhatsApp
              </span>
              <span className="mt-1 font-dental-display text-[1.4rem] text-dental-ink tabular-nums">
                {CLINIC.whatsapp}
              </span>
              <span className="mt-auto pt-3 text-[0.8125rem] text-dental-muted">
                Instant replies, any time
              </span>
            </ChatButton>
          </li>
          <li>
            <div className={cardClass}>
              <span className="grid size-11 place-items-center rounded-xl bg-dental-brass-soft text-dental-brass-deep">
                <Mail aria-hidden="true" className="size-5" strokeWidth={1.7} />
              </span>
              <span className="mt-5 text-[0.8125rem] font-semibold text-dental-muted">Email</span>
              <span className="mt-1 text-[1.0625rem] font-semibold text-dental-ink">
                {CLINIC.email.split("@")[0]}@<wbr />
                {CLINIC.email.split("@")[1]}
              </span>
              <span className="mt-auto pt-3 text-[0.8125rem] text-dental-muted">
                Replies within a working day
              </span>
            </div>
          </li>
          <li>
            <a
              href={CLINIC.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span className="grid size-11 place-items-center rounded-xl bg-dental-sand text-dental-ink">
                <MapPin aria-hidden="true" className="size-5" strokeWidth={1.7} />
              </span>
              <span className="mt-5 text-[0.8125rem] font-semibold text-dental-muted">Visit</span>
              <span className="mt-1 text-[1.0625rem] leading-snug font-semibold text-dental-ink">
                Kesar Court, Rajpur Road
              </span>
              <span className="mt-auto flex items-center gap-1 pt-3 text-[0.8125rem] font-semibold text-dental-spruce">
                Get directions
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </span>
            </a>
          </li>
        </ul>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <section aria-labelledby="find-title">
            <h2
              id="find-title"
              className="font-dental-display text-[2rem] leading-tight text-dental-ink"
            >
              Finding us
            </h2>
            <address className="mt-4 flex gap-3 leading-relaxed text-dental-body not-italic">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-dental-brass-deep" />
              {FULL_ADDRESS}
            </address>
            <p className="mt-2 pl-8 leading-relaxed text-dental-muted">{CLINIC.landmark}</p>
            <MapIllustration className="mt-6" />
            <a
              href={CLINIC.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClasses("primary", "md")} mt-5`}
            >
              Open in Google Maps
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {GETTING_HERE.map((note) => (
                <li key={note.title} className="rounded-2xl bg-dental-paper p-5 shadow-dental-soft">
                  <p className="font-semibold text-dental-ink">{note.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-dental-muted">
                    {note.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-8">
            <section
              aria-labelledby="hours-title"
              className="rounded-[1.75rem] bg-dental-paper p-6 shadow-dental-soft sm:p-8"
            >
              <h2
                id="hours-title"
                className="font-dental-display text-[1.6rem] leading-tight text-dental-ink"
              >
                Studio timings
              </h2>
              <HoursList className="mt-4" />
              <p className="mt-4 text-[0.875rem] leading-relaxed text-dental-muted">
                Closed on Diwali, Holi and Independence Day. Emergency advice is available on
                WhatsApp for registered patients.
              </p>
            </section>
            <section
              aria-labelledby="callback-title"
              className="rounded-[1.75rem] border border-dental-line/80 p-6 sm:p-8"
            >
              <h2
                id="callback-title"
                className="font-dental-display text-[1.6rem] leading-tight text-dental-ink"
              >
                Request a call back
              </h2>
              <p className="mt-2 mb-6 text-[0.9375rem] text-dental-muted">
                Leave your number and the front desk will ring you.
              </p>
              <CallbackForm />
            </section>
          </div>
        </div>

        <EmergencyBand className="mt-16" />
      </Container>
    </>
  );
}
