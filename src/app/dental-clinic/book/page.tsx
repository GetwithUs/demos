import { Clock, ShieldCheck, Wallet } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import BookingFromParams from "@/sites/dental-clinic/components/BookingFromParams";
import BookingWizard from "@/sites/dental-clinic/components/BookingWizard";
import { Container, PageIntro } from "@/sites/dental-clinic/components/ui";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Book a dental appointment at Ivorine Dental Studio, Rajpur Road, Dehradun, in about a minute. Same-day slots for tooth pain.",
};

const PROMISES = [
  { icon: Clock, text: "Takes about a minute" },
  { icon: Wallet, text: "Pay at the studio, nothing online" },
  { icon: ShieldCheck, text: "Same-day slots for tooth pain" },
];

export default function BookPage() {
  return (
    <>
      <PageIntro
        eyebrow="Book an appointment"
        title="Book your visit."
        crumbs={[{ label: "Book" }]}
        className="[&>div]:pb-10 sm:[&>div]:pb-12"
      >
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-dental-body">
          {PROMISES.map((p) => (
            <li key={p.text} className="flex items-center gap-2">
              <p.icon
                aria-hidden="true"
                className="size-4 text-dental-brass-deep"
                strokeWidth={1.8}
              />
              {p.text}
            </li>
          ))}
        </ul>
      </PageIntro>
      <Container className="py-10 sm:py-14">
        <Suspense fallback={<BookingWizard />}>
          <BookingFromParams />
        </Suspense>
      </Container>
    </>
  );
}
