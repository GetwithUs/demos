import type { Metadata } from "next";
import { Suspense } from "react";
import Listing, { ListingSkeleton } from "@/sites/skincare/components/listing/Listing";
import { Container } from "@/sites/skincare/components/ui";

export const metadata: Metadata = {
  title: "Shop all skincare",
  description:
    "Serums, sunscreens, cleansers and moisturisers with proven actives. Filter by concern, skin type and ingredient.",
};

export default function ShopPage() {
  return (
    <Container className="pb-8">
      <Suspense
        fallback={
          <div className="pt-8">
            <div className="h-4 w-32 skin-skeleton rounded" />
            <div className="mt-5 h-12 w-72 skin-skeleton rounded" />
            <ListingSkeleton />
          </div>
        }
      >
        <Listing showHeader />
      </Suspense>
    </Container>
  );
}
