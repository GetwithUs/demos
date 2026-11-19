import Link from "next/link";
import { ButtonLink, Container } from "@/sites/skincare/components/ui";

export default function ShopNotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-skin-display text-7xl text-skin-accent">404</p>
      <h1 className="mt-4 font-skin-display text-3xl text-skin-ink">We could not find that page</h1>
      <p className="mx-auto mt-2 max-w-md text-skin-subtle">
        It may have moved. Try searching, or start from our bestsellers.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/skincare/shop?collection=bestsellers">See bestsellers</ButtonLink>
        <Link
          href="/skincare"
          className="inline-flex h-11 items-center px-4 text-sm font-medium text-skin-ink underline"
        >
          Go to the home page
        </Link>
      </div>
    </Container>
  );
}
