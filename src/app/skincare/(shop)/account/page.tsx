import type { Metadata } from "next";
import AccountView from "@/sites/skincare/components/account/AccountView";
import { Container, PageHeader } from "@/sites/skincare/components/ui";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return (
    <Container className="pb-10">
      <PageHeader
        crumb="My account"
        title="Hello there"
        intro="Your orders, wishlist and addresses on this demo are saved in this browser, so there is no sign-in. In a live store this is a one-tap OTP login."
      />
      <AccountView />
    </Container>
  );
}
