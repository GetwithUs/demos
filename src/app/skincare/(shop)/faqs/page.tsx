import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import ChatButton from "@/sites/skincare/components/ChatButton";
import { Container, PageHeader } from "@/sites/skincare/components/ui";
import { BRAND } from "@/sites/skincare/data/catalog";
import { SITE_FAQS } from "@/sites/skincare/content/faqs";

export const metadata: Metadata = { title: "Help centre and FAQs" };

export default function FaqsPage() {
  return (
    <Container className="pb-10">
      <PageHeader
        crumb="FAQs"
        eyebrow="Help centre"
        title="Frequently asked questions"
        intro="Quick answers about orders, delivery, returns and our products."
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] [&>*]:min-w-0">
        <div className="space-y-10">
          {SITE_FAQS.map((g, gi) => (
            <section key={g.group} aria-labelledby={`faq-group-${gi}`}>
              <h2 id={`faq-group-${gi}`} className="font-skin-display text-2xl text-skin-ink">
                {g.group}
              </h2>
              <div className="mt-3 divide-y divide-skin-line border-y border-skin-line">
                {g.items.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-skin-ink [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown
                        className="size-5 shrink-0 transition group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-skin-body">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="self-start rounded-3xl bg-skin-accent-soft p-6 lg:sticky lg:top-24">
          <p className="font-skin-display text-2xl text-skin-ink">Still need help?</p>
          <p className="mt-2 text-sm text-skin-body">
            Our care team and skin experts reply on WhatsApp, Monday to Saturday, 10 am to 7 pm.
          </p>
          <ChatButton className="mt-5 w-full" />
          <p className="mt-5 text-sm text-skin-body">
            Or write to {BRAND.supportEmail}
            <br />
            Call {BRAND.supportPhone}
          </p>
        </aside>
      </div>
    </Container>
  );
}
