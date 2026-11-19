import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { CallButton, ChatButton } from "@/sites/dental-clinic/components/ActionButtons";

/** Sticky Call, WhatsApp and Book bar on phones. Most clinic visitors are on a phone. */
export default function MobileActionBar() {
  const item =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-[0.9375rem] font-semibold transition-colors";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-dental-line/80 bg-dental-paper/92 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-20px_rgb(16_45_42/0.45)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <CallButton className={`${item} bg-dental-sand text-dental-ink active:bg-dental-line`}>
          Call
        </CallButton>
        <ChatButton className={`${item} bg-dental-wa-deep text-white active:bg-dental-wa-teal`}>
          WhatsApp
        </ChatButton>
        <Link
          href="/dental-clinic/book"
          className={`${item} flex-[1.25] bg-dental-spruce text-white active:bg-dental-spruce-deep`}
        >
          <CalendarCheck aria-hidden="true" className="size-[1.1em]" strokeWidth={1.8} />
          Book
        </Link>
      </div>
    </div>
  );
}
