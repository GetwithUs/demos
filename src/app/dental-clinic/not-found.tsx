import Link from "next/link";
import { ToothIcon } from "@/sites/dental-clinic/components/icons";
import { Container, buttonClasses } from "@/sites/dental-clinic/components/ui";

export default function DentalNotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-32">
      <span className="grid size-16 place-items-center rounded-2xl bg-dental-mist text-dental-spruce">
        <ToothIcon name="wisdom" className="size-9" />
      </span>
      <h1 className="mt-6 font-dental-display text-[clamp(2.2rem,5vw,3.25rem)] leading-tight text-dental-ink">
        This page seems to be missing.
      </h1>
      <p className="mt-3 max-w-md text-lg text-dental-muted">
        Like a wisdom tooth that never came in. Try the treatments page, or book a visit.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dental-clinic" className={buttonClasses("primary", "md")}>
          Back to home
        </Link>
        <Link href="/dental-clinic/treatments" className={buttonClasses("secondary", "md")}>
          All treatments
        </Link>
      </div>
    </Container>
  );
}
