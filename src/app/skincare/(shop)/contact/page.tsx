import { Clock, Mail, MapPin, Phone, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import ChatButton from "@/sites/skincare/components/ChatButton";
import ContactForm from "@/sites/skincare/components/ContactForm";
import { Container, PageHeader } from "@/sites/skincare/components/ui";
import { BRAND } from "@/sites/skincare/data/catalog";
import { CONTACT_PAGE } from "@/sites/skincare/content/pages";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  const rows = [
    { icon: Phone, label: "Phone", value: BRAND.supportPhone },
    { icon: Mail, label: "Email", value: BRAND.supportEmail },
    { icon: Clock, label: "Hours", value: CONTACT_PAGE.hours },
    { icon: MapPin, label: "Studio", value: CONTACT_PAGE.address.join(", ") },
  ];
  return (
    <Container className="pb-10">
      <PageHeader
        crumb="Contact"
        eyebrow="Contact"
        title={CONTACT_PAGE.title}
        intro={CONTACT_PAGE.intro}
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr] [&>*]:min-w-0">
        <div className="space-y-4">
          <div className="rounded-3xl bg-skin-forest p-6 text-white sm:p-8">
            <p className="font-skin-display text-2xl">Fastest: WhatsApp</p>
            <p className="mt-2 text-sm text-white/80">
              Track orders, ask about products or start a return. Most chats are answered in
              minutes.
            </p>
            <ChatButton className="mt-5 bg-white text-skin-forest hover:bg-skin-sand" />
          </div>
          <ul className="divide-y divide-skin-line rounded-3xl bg-white px-6 ring-1 ring-skin-line">
            {rows.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4 py-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-skin-accent" aria-hidden />
                <span className="text-sm">
                  <span className="block text-skin-subtle">{label}</span>
                  <span className="text-skin-ink">{value}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="flex gap-3 rounded-3xl bg-skin-saffron-soft/70 p-5 text-sm text-skin-body">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-skin-saffron-ink" aria-hidden />
            Oruvi never asks for your OTP, PIN or card details, and never asks you to pay on a phone
            call. If someone does, it is a scam.
          </p>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
