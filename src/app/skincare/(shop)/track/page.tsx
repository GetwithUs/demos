import type { Metadata } from "next";
import TrackForm from "@/sites/skincare/components/orders/TrackForm";
import { Container, PageHeader } from "@/sites/skincare/components/ui";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackPage() {
  return (
    <Container className="pb-10">
      <PageHeader
        crumb="Track order"
        title="Track your order"
        intro="Enter your order ID and mobile number to see where your parcel is."
      />
      <div className="mt-8">
        <TrackForm />
      </div>
    </Container>
  );
}
