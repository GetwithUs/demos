"use client";

import { PhoneCall, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { WhatsAppIcon } from "@/sites/dental-clinic/components/icons";
import { buttonClasses } from "@/sites/dental-clinic/components/ui";
import { CLINIC } from "@/sites/dental-clinic/content/clinic";
import { useDentalUI } from "@/sites/dental-clinic/lib/ui-store";

/** The small notice every "Call" button opens instead of dialling a made-up number. */
export default function CallNotice() {
  const open = useDentalUI((s) => s.callNoticeOpen);
  const close = useDentalUI((s) => s.closeCallNotice);
  const openChat = useDentalUI((s) => s.openChat);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="dental-call-title"
      aria-describedby="dental-call-text"
      className="m-auto w-[min(calc(100vw-2rem),25rem)] overflow-visible rounded-[1.75rem] bg-transparent p-0 text-dental-body backdrop:bg-dental-ink/45 backdrop:backdrop-blur-[3px] open:animate-dental-pop"
    >
      <div className="relative rounded-[1.75rem] bg-dental-paper p-7 shadow-dental-float">
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-dental-muted transition-colors hover:bg-dental-sand hover:text-dental-ink"
        >
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">Close</span>
        </button>
        <div className="relative grid size-14 place-items-center rounded-full bg-dental-mint text-dental-spruce">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-dental-ping rounded-full bg-dental-sage/60"
          />
          <PhoneCall aria-hidden="true" className="relative size-6" strokeWidth={1.7} />
        </div>
        <h2
          id="dental-call-title"
          className="mt-5 font-dental-display text-[1.6rem] leading-tight text-dental-ink"
        >
          Calling the front desk
        </h2>
        <p className="mt-1 text-lg font-semibold tracking-wide text-dental-spruce tabular-nums">
          {CLINIC.phone}
        </p>
        <p id="dental-call-text" className="mt-4 leading-relaxed text-dental-muted">
          In the real website, this button calls the clinic straight from your phone. This is a
          demo, so no call is made.
        </p>
        <div className="mt-6 grid gap-2.5">
          <Link
            href="/dental-clinic/book"
            onClick={close}
            className={buttonClasses("primary", "md")}
          >
            Book online instead
          </Link>
          <button type="button" onClick={openChat} className={buttonClasses("secondary", "md")}>
            <WhatsAppIcon className="size-5 text-dental-wa-teal" />
            Try the WhatsApp assistant
          </button>
        </div>
      </div>
    </dialog>
  );
}
