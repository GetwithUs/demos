import type { Metadata } from "next";
import WishlistView from "@/sites/skincare/components/account/WishlistView";
import { Container, PageHeader } from "@/sites/skincare/components/ui";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <Container className="pb-10">
      <PageHeader crumb="Wishlist" title="Your wishlist" />
      <WishlistView />
    </Container>
  );
}
