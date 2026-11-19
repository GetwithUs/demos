import type { Metadata } from "next";
import FaqBrowser from "@/sites/dental-clinic/components/FaqBrowser";
import { CtaBand } from "@/sites/dental-clinic/components/sections";
import { Container, PageIntro } from "@/sites/dental-clinic/components/ui";
import { FAQ_GROUPS } from "@/sites/dental-clinic/content/faqs";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers about appointments, costs, EMI, insurance, root canals, aligners, implants, whitening, children's visits, sterilisation and emergencies at Ivorine Dental Studio, Dehradun.",
};

export default function FaqsPage() {
  return (
    <>
      <PageIntro
        eyebrow="FAQs"
        title="Good questions, plain answers."
        intro="The questions patients ask us most, about visits, costs, treatments and safety."
        crumbs={[{ label: "FAQs" }]}
      />
      <Container className="py-16 sm:py-20">
        <FaqBrowser groups={FAQ_GROUPS} />
      </Container>
      <CtaBand
        title="Still wondering about something?"
        text="Ask the WhatsApp assistant, or book a consultation and ask the dentist in person."
      />
    </>
  );
}
