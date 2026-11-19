import Link from "next/link";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/sites/dental-clinic/components/icons";

export default function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href="/dental-clinic"
      className={cn("group inline-flex items-center gap-2.5 rounded-md", className)}
    >
      <LogoMark className="h-9 w-auto transition-transform duration-500 ease-dental group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-dental-display text-[1.45rem] font-medium tracking-[-0.01em]",
            tone === "dark" ? "text-dental-ink" : "text-dental-ivory",
          )}
        >
          Ivorine
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] font-semibold tracking-[0.28em] uppercase",
            tone === "dark" ? "text-dental-brass-deep" : "text-dental-brass",
          )}
        >
          Dental Studio
        </span>
      </span>
      <span className="sr-only">, home</span>
    </Link>
  );
}
