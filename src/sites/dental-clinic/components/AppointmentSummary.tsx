"use client";

import { CalendarCheck2, Clock, UserRound } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/sites/dental-clinic/components/ui";
import { clearAppointment, useStoredAppointment } from "@/sites/dental-clinic/lib/appointment";
import { formatDayLong, formatTime, toISODate } from "@/sites/dental-clinic/lib/format";

/**
 * "Your appointment" card for returning visitors, read from this browser's localStorage. Renders
 * nothing on the server and for visitors without an upcoming demo booking.
 */
export default function AppointmentSummary({
  className,
  showBookAnother = true,
}: {
  className?: string;
  showBookAnother?: boolean;
}) {
  const appointment = useStoredAppointment();
  if (!appointment) return null;
  const upcoming = appointment.dateISO >= toISODate(new Date());
  if (!upcoming) return null;

  return (
    <section
      aria-labelledby="dental-your-appointment"
      className={cn(
        "animate-dental-rise rounded-[1.5rem] border border-dental-sage/60 bg-dental-mist p-5 shadow-dental-soft sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-dental-spruce text-white">
            <CalendarCheck2 aria-hidden="true" className="size-6" strokeWidth={1.7} />
          </span>
          <div>
            <h2
              id="dental-your-appointment"
              className="text-[0.75rem] font-semibold tracking-[0.14em] text-dental-spruce uppercase"
            >
              Your appointment
            </h2>
            <p className="mt-1 font-dental-display text-[1.35rem] leading-tight text-dental-ink">
              {appointment.reasonLabel}
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] text-dental-body">
              <li className="flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4 text-dental-brass-deep" />
                {formatDayLong(appointment.dateISO)}, {formatTime(appointment.time)}
              </li>
              <li className="flex items-center gap-1.5">
                <UserRound aria-hidden="true" className="size-4 text-dental-brass-deep" />
                {appointment.doctorName ?? "First available dentist"}
              </li>
            </ul>
            <p className="mt-2 text-[0.8125rem] text-dental-muted">
              Reference{" "}
              <span className="font-semibold text-dental-ink tabular-nums">{appointment.ref}</span>.
              Demo booking, saved only in this browser.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:shrink-0">
          {showBookAnother ? (
            <Link href="/dental-clinic/book" className={buttonClasses("secondary", "sm")}>
              Book another
            </Link>
          ) : null}
          <button
            type="button"
            onClick={clearAppointment}
            className={buttonClasses("secondary", "sm")}
          >
            Cancel appointment
          </button>
        </div>
      </div>
    </section>
  );
}
