"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  CircleAlert,
  Clock,
  Info,
  Stethoscope,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/cn";
import AppointmentSummary from "@/sites/dental-clinic/components/AppointmentSummary";
import { ToothIcon } from "@/sites/dental-clinic/components/icons";
import { buttonClasses } from "@/sites/dental-clinic/components/ui";
import {
  AFTER_BOOKING,
  BOOKING_REASONS,
  CONSULTATION_FEE,
  getReason,
} from "@/sites/dental-clinic/content/booking";
import { CLINIC, FULL_ADDRESS } from "@/sites/dental-clinic/content/clinic";
import { DOCTORS, type DoctorId } from "@/sites/dental-clinic/content/doctors";
import {
  makeReference,
  saveAppointment,
  type StoredAppointment,
} from "@/sites/dental-clinic/lib/appointment";
import {
  formatDayLong,
  formatDayParts,
  formatINR,
  formatTime,
  toMinutes,
} from "@/sites/dental-clinic/lib/format";
import { groupSlots, slotsForDay, upcomingDays } from "@/sites/dental-clinic/lib/schedule";

const STEPS = ["Treatment", "Date", "Time", "Your details", "Review"] as const;
type Step = 1 | 2 | 3 | 4 | 5 | 6;

type Details = {
  name: string;
  phone: string;
  email: string;
  firstVisit: "" | "yes" | "no";
  notes: string;
  reminders: boolean;
};
type Field = "name" | "phone" | "email" | "firstVisit" | "notes";
type Errors = Partial<Record<Field, string>>;

const EMPTY_DETAILS: Details = {
  name: "",
  phone: "",
  email: "",
  firstVisit: "",
  notes: "",
  reminders: true,
};

const PHONE_PATTERN = /^(?:\+?91|0)?([6-9]\d{9})$/;

function validate(details: Details): Errors {
  const errors: Errors = {};
  const name = details.name.trim();
  if (name.length < 2) errors.name = "Please enter the patient's full name.";
  else if (!/^[\p{L} .'-]+$/u.test(name)) errors.name = "Please use letters only in the name.";
  const phone = details.phone.replace(/[\s()-]/g, "");
  if (!phone) errors.phone = "Please enter a mobile number, so the studio can confirm.";
  else if (!PHONE_PATTERN.test(phone))
    errors.phone = "Enter a 10-digit Indian mobile number, for example 98765 43210.";
  if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim()))
    errors.email = "That email address does not look complete.";
  if (!details.firstVisit) errors.firstVisit = "Please choose yes or no.";
  if (details.notes.length > 400) errors.notes = "Please keep notes under 400 characters.";
  return errors;
}

function formatPhone(raw: string): string {
  const match = raw.replace(/[\s()-]/g, "").match(PHONE_PATTERN);
  if (!match) return raw;
  const digits = match[1];
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function addMinutes(hhmm: string, minutes: number): string {
  const total = toMinutes(hhmm) + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}${String(total % 60).padStart(2, "0")}`;
}

/** Builds a calendar file in the browser. Nothing is uploaded. */
function downloadCalendarFile(appointment: StoredAppointment) {
  const date = appointment.dateISO.replaceAll("-", "");
  const start = appointment.time.replace(":", "");
  const end = addMinutes(appointment.time, appointment.minutes);
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ivorine Dental Studio//Demo booking//EN",
    "BEGIN:VEVENT",
    `UID:${appointment.ref}@ivorinedental.example`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Kolkata:${date}T${start}00`,
    `DTEND;TZID=Asia/Kolkata:${date}T${end}00`,
    `SUMMARY:Dental appointment (demo): ${appointment.reasonLabel}`,
    `LOCATION:${FULL_ADDRESS.replaceAll(",", "\\,")}`,
    `DESCRIPTION:Demo booking ${appointment.ref}. No real appointment was made.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `ivorine-appointment-${appointment.ref}.ics`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function RadioCard({
  id,
  name,
  value,
  checked,
  disabled,
  onChange,
  className,
  children,
  describedBy,
}: {
  id?: string;
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  className?: string;
  children: ReactNode;
  describedBy?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer rounded-2xl border border-dental-line bg-dental-paper transition-[border-color,background-color,box-shadow] duration-200",
        "hover:border-dental-sage has-[:checked]:border-dental-spruce has-[:checked]:bg-dental-mist has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-dental-spruce)]",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dental-spruce",
        disabled && "cursor-not-allowed opacity-55 hover:border-dental-line",
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-2 flex items-center gap-1.5 text-[0.875rem] font-medium text-dental-coral"
    >
      <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
      {message}
    </p>
  );
}

const inputClass =
  "mt-2 block h-12 w-full rounded-xl border border-dental-line bg-white px-4 text-[1rem] text-dental-ink shadow-[inset_0_1px_2px_rgb(16_45_42/0.04)] transition-colors placeholder:text-dental-muted/70 hover:border-dental-sage focus-visible:border-dental-spruce focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-dental-spruce/25 aria-[invalid=true]:border-dental-coral";

export default function BookingWizard({
  initialReason = null,
  initialDoctor = null,
}: {
  initialReason?: string | null;
  initialDoctor?: string | null;
}) {
  const [step, setStep] = useState<Step>(1);
  const [reasonId, setReasonId] = useState<string | null>(getReason(initialReason)?.id ?? null);
  const [doctorId, setDoctorId] = useState<DoctorId | "any">(
    DOCTORS.find((d) => d.id === initialDoctor)?.id ?? "any",
  );
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<Errors>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<StoredAppointment | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);

  const reason = getReason(reasonId);
  const doctor = DOCTORS.find((d) => d.id === doctorId);

  // Dates and slots depend on today's date, so they are only worked out once the visitor
  // reaches those steps in the browser, never during server rendering.
  const days = useMemo(
    () => (step >= 2 && step <= 5 ? upcomingDays(new Date(), 14, doctor?.days) : []),
    [step, doctor],
  );
  const day = days.find((d) => d.iso === dateISO);
  const slots = useMemo(() => (day ? slotsForDay(day, new Date(), doctor?.id) : []), [day, doctor]);

  useEffect(() => {
    if (!navigated.current) return;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.closest("section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function goTo(next: Step) {
    navigated.current = true;
    setStepError(null);
    setStep(next);
  }

  function next() {
    if (step === 1 && !reason) return setStepError("Please choose what you would like to book.");
    if (step === 2 && !day) return setStepError("Please choose a day.");
    if (step === 3 && !time) return setStepError("Please choose a time.");
    if (step === 4) {
      const found = validate(details);
      setErrors(found);
      const first = (["name", "phone", "email", "firstVisit", "notes"] as Field[]).find(
        (f) => found[f],
      );
      if (first) {
        document
          .getElementById(first === "firstVisit" ? "dental-first-yes" : `dental-${first}`)
          ?.focus();
        return;
      }
    }
    goTo((step + 1) as Step);
  }

  function confirm() {
    if (!reason || !dateISO || !time) return;
    const appointment: StoredAppointment = {
      ref: makeReference(),
      reasonId: reason.id,
      reasonLabel: reason.label === "Not sure yet" ? "Consultation and check-up" : reason.label,
      doctorName: doctor?.name ?? null,
      dateISO,
      time,
      minutes: reason.minutes,
      name: details.name.trim(),
      phone: formatPhone(details.phone),
      email: details.email.trim(),
      firstVisit: details.firstVisit === "yes",
      reminders: details.reminders,
      notes: details.notes.trim(),
      createdAt: new Date().toISOString(),
    };
    saveAppointment(appointment);
    setConfirmed(appointment);
    goTo(6);
  }

  function startOver() {
    setReasonId(null);
    setDoctorId("any");
    setDateISO(null);
    setTime(null);
    setDetails(EMPTY_DETAILS);
    setErrors({});
    setConfirmed(null);
    goTo(1);
  }

  function update<K extends keyof Details>(key: K, value: Details[K]) {
    setDetails((d) => ({ ...d, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const freeCount = slots.filter((s) => s.status === "free").length;

  if (step === 6 && confirmed) {
    return <Confirmation appointment={confirmed} headingRef={headingRef} onStartOver={startOver} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <section
        aria-labelledby="dental-step-title"
        className="scroll-mt-28 rounded-[2rem] border border-dental-line/80 bg-dental-paper p-5 shadow-dental-soft sm:p-8 lg:p-10"
      >
        {/* Progress */}
        <div>
          <p className="text-[0.8125rem] font-semibold text-dental-muted sm:hidden">
            Step {step} of {STEPS.length}: {STEPS[step - 1]}
          </p>
          <div
            aria-hidden="true"
            className="mt-2 h-1 overflow-hidden rounded-full bg-dental-sand sm:hidden"
          >
            <div
              className="h-full rounded-full bg-dental-spruce transition-[width] duration-500 ease-dental"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>
          <ol className="hidden items-center gap-2 sm:flex">
            {STEPS.map((label, i) => {
              const n = (i + 1) as Step;
              const done = n < step;
              const current = n === step;
              return (
                <li
                  key={label}
                  className="flex flex-1 items-center gap-2"
                  aria-current={current ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-[0.75rem] font-bold transition-colors",
                      done && "bg-dental-spruce text-white",
                      current && "bg-dental-ink text-white ring-4 ring-dental-mint",
                      !done && !current && "bg-dental-sand text-dental-muted",
                    )}
                  >
                    {done ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : n}
                  </span>
                  <span
                    className={cn(
                      "text-[0.8125rem] font-semibold whitespace-nowrap",
                      current ? "text-dental-ink" : "text-dental-muted",
                    )}
                  >
                    {label}
                    {done ? <span className="sr-only"> (done)</span> : null}
                  </span>
                  {i < STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={cn("h-px flex-1", done ? "bg-dental-spruce" : "bg-dental-line")}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-8">
          {step === 1 ? (
            <>
              <AppointmentSummary showBookAnother={false} className="mb-8" />
              <h2
                id="dental-step-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-dental-display text-[1.85rem] leading-tight text-dental-ink focus:outline-none"
              >
                What would you like to book?
              </h2>
              <p className="mt-2 text-dental-muted">
                Choose a treatment, or &ldquo;Not sure yet&rdquo; and we will find the right
                dentist.
              </p>
              <fieldset className="mt-6">
                <legend className="sr-only">Treatment</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {BOOKING_REASONS.map((r) => (
                    <RadioCard
                      key={r.id}
                      name="reason"
                      value={r.id}
                      checked={reasonId === r.id}
                      onChange={(value) => {
                        setReasonId(value);
                        setStepError(null);
                      }}
                      className={cn(
                        "items-start gap-3.5 p-4",
                        r.id === "tooth-pain" && "border-dental-coral/30",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-xl",
                          r.id === "tooth-pain"
                            ? "bg-dental-coral-soft text-dental-coral"
                            : "bg-dental-mist text-dental-spruce",
                        )}
                      >
                        <ToothIcon name={r.icon} className="size-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-dental-ink">{r.label}</span>
                        <span className="mt-0.5 block text-[0.875rem] leading-snug text-dental-muted">
                          {r.hint}
                        </span>
                        <span className="mt-1.5 block text-[0.8125rem] font-medium text-dental-spruce">
                          {r.id === "consultation" || r.id === "tooth-pain"
                            ? `${formatINR(r.priceFrom)} consultation`
                            : `From ${formatINR(r.priceFrom)}`}
                        </span>
                      </span>
                    </RadioCard>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="font-semibold text-dental-ink">
                  Preferred dentist{" "}
                  <span className="font-normal text-dental-muted">(optional)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[{ id: "any" as const, name: "First available", role: "" }, ...DOCTORS].map(
                    (d) => {
                      const specialist = d.id !== "any" && reason?.doctors.includes(d.id);
                      return (
                        <RadioCard
                          key={d.id}
                          name="doctor"
                          value={d.id}
                          checked={doctorId === d.id}
                          onChange={(value) => {
                            setDoctorId(value as DoctorId | "any");
                            setDateISO(null);
                            setTime(null);
                          }}
                          className="items-center gap-2 rounded-full px-4 py-2.5"
                        >
                          <span className="text-[0.9375rem] font-medium text-dental-ink">
                            {d.name}
                          </span>
                          {specialist ? (
                            <span className="rounded-full bg-dental-brass-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-dental-brass-deep">
                              Specialist
                            </span>
                          ) : null}
                        </RadioCard>
                      );
                    },
                  )}
                </div>
                {doctor ? (
                  <p className="mt-3 text-[0.875rem] text-dental-muted">
                    {doctor.name} is in the studio on{" "}
                    {doctor.days
                      .map(
                        (n) =>
                          [
                            "Sundays",
                            "Mondays",
                            "Tuesdays",
                            "Wednesdays",
                            "Thursdays",
                            "Fridays",
                            "Saturdays",
                          ][n],
                      )
                      .join(", ")
                      .replace(/, ([^,]*)$/, " and $1")}
                    .
                  </p>
                ) : null}
              </fieldset>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h2
                id="dental-step-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-dental-display text-[1.85rem] leading-tight text-dental-ink focus:outline-none"
              >
                Choose a day
              </h2>
              <p className="mt-2 text-dental-muted">
                The next two weeks. Sundays are 10:00 am to 2:00 pm.
                {doctor ? ` Days when ${doctor.name} is not in are greyed out.` : ""}
              </p>
              <fieldset className="mt-6">
                <legend className="sr-only">Day</legend>
                <div className="grid grid-cols-3 gap-2.5 min-[480px]:grid-cols-4 md:grid-cols-7">
                  {days.map((d) => {
                    const parts = formatDayParts(d.iso);
                    const free = d.available
                      ? slotsForDay(d, new Date(), doctor?.id).filter((s) => s.status === "free")
                          .length
                      : 0;
                    const full = d.available && free === 0;
                    return (
                      <RadioCard
                        key={d.iso}
                        name="day"
                        value={d.iso}
                        checked={dateISO === d.iso}
                        disabled={!d.available || full}
                        onChange={(value) => {
                          setDateISO(value);
                          setTime(null);
                          setStepError(null);
                        }}
                        className="flex-col items-center px-1 py-3 text-center"
                      >
                        <span className="text-[0.75rem] font-semibold tracking-wide text-dental-muted uppercase">
                          {d.isToday ? "Today" : parts.weekday}
                        </span>
                        <span className="mt-0.5 font-dental-display text-[1.6rem] leading-none text-dental-ink">
                          {parts.day}
                        </span>
                        <span className="text-[0.75rem] text-dental-muted">{parts.month}</span>
                        <span
                          className={cn(
                            "mt-1.5 text-[0.6875rem] leading-tight font-semibold",
                            !d.available || full
                              ? "text-dental-muted"
                              : free <= 4
                                ? "text-dental-brass-deep"
                                : "text-dental-success",
                          )}
                        >
                          {!d.available
                            ? "Not in"
                            : full
                              ? "Full"
                              : free <= 4
                                ? `${free} left`
                                : d.reducedHours
                                  ? "Morning"
                                  : "Open"}
                        </span>
                      </RadioCard>
                    );
                  })}
                </div>
              </fieldset>
            </>
          ) : null}

          {step === 3 && day ? (
            <>
              <h2
                id="dental-step-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-dental-display text-[1.85rem] leading-tight text-dental-ink focus:outline-none"
              >
                Choose a time
              </h2>
              <p className="mt-2 text-dental-muted">
                {formatDayLong(day.iso)}. {freeCount} of {slots.length} slots free
                {doctor ? ` with ${doctor.name}` : ""}.
              </p>
              <fieldset className="mt-6 space-y-6">
                <legend className="sr-only">Time</legend>
                {groupSlots(slots).map((group) => (
                  <div key={group.label}>
                    <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-dental-brass-deep uppercase">
                      {group.label}
                    </p>
                    <div className="mt-2.5 grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-6">
                      {group.slots.map((slot) => (
                        <RadioCard
                          key={slot.time}
                          name="time"
                          value={slot.time}
                          checked={time === slot.time}
                          disabled={slot.status !== "free"}
                          onChange={(value) => {
                            setTime(value);
                            setStepError(null);
                          }}
                          className="justify-center rounded-xl px-1 py-2.5"
                        >
                          <span
                            className={cn(
                              "text-[0.9375rem] font-semibold text-dental-ink tabular-nums",
                              slot.status !== "free" &&
                                "font-normal text-dental-muted line-through",
                            )}
                          >
                            {formatTime(slot.time)}
                          </span>
                          {slot.status !== "free" ? (
                            <span className="sr-only">
                              {slot.status === "booked" ? " (booked)" : " (too soon)"}
                            </span>
                          ) : null}
                        </RadioCard>
                      ))}
                    </div>
                  </div>
                ))}
              </fieldset>
              <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-dental-muted">
                <span aria-hidden="true" className="text-dental-muted line-through">
                  9:30 am
                </span>
                means the slot is already booked.
              </p>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <h2
                id="dental-step-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-dental-display text-[1.85rem] leading-tight text-dental-ink focus:outline-none"
              >
                Your details
              </h2>
              <p className="mt-2 text-dental-muted">
                For the patient who is coming in. Fields marked * are needed.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="dental-name" className="font-semibold text-dental-ink">
                    Full name *
                  </label>
                  <input
                    id="dental-name"
                    value={details.name}
                    onChange={(e) => update("name", e.target.value)}
                    autoComplete="name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "dental-name-error" : undefined}
                    className={inputClass}
                    placeholder="For example, Ananya Rawat"
                  />
                  <FieldError id="dental-name-error" message={errors.name} />
                </div>
                <div>
                  <label htmlFor="dental-phone" className="font-semibold text-dental-ink">
                    Mobile number *
                  </label>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-4 mt-1 -translate-y-1/2 font-medium text-dental-muted"
                    >
                      +91
                    </span>
                    <input
                      id="dental-phone"
                      type="tel"
                      inputMode="tel"
                      value={details.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      autoComplete="tel-national"
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={
                        errors.phone ? "dental-phone-error dental-phone-hint" : "dental-phone-hint"
                      }
                      className={cn(inputClass, "pl-13")}
                      placeholder="98765 43210"
                    />
                  </div>
                  <p id="dental-phone-hint" className="mt-1.5 text-[0.8125rem] text-dental-muted">
                    Used for the WhatsApp confirmation and reminder.
                  </p>
                  <FieldError id="dental-phone-error" message={errors.phone} />
                </div>
                <div>
                  <label htmlFor="dental-email" className="font-semibold text-dental-ink">
                    Email <span className="font-normal text-dental-muted">(optional)</span>
                  </label>
                  <input
                    id="dental-email"
                    type="email"
                    inputMode="email"
                    value={details.email}
                    onChange={(e) => update("email", e.target.value)}
                    autoComplete="email"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "dental-email-error" : undefined}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                  <FieldError id="dental-email-error" message={errors.email} />
                </div>
                <fieldset
                  className="sm:col-span-2"
                  aria-describedby={errors.firstVisit ? "dental-first-error" : undefined}
                >
                  <legend className="font-semibold text-dental-ink">
                    First visit to Ivorine? *
                  </legend>
                  <div className="mt-2 flex gap-2.5">
                    {(["yes", "no"] as const).map((value) => (
                      <RadioCard
                        key={value}
                        id={value === "yes" ? "dental-first-yes" : undefined}
                        name="first-visit"
                        value={value}
                        checked={details.firstVisit === value}
                        onChange={() => update("firstVisit", value)}
                        className={cn(
                          "min-w-28 justify-center px-5 py-3",
                          errors.firstVisit && "border-dental-coral",
                        )}
                      >
                        <span className="font-medium text-dental-ink">
                          {value === "yes" ? "Yes, first time" : "No, I've been before"}
                        </span>
                      </RadioCard>
                    ))}
                  </div>
                  <FieldError id="dental-first-error" message={errors.firstVisit} />
                </fieldset>
                <div className="sm:col-span-2">
                  <label htmlFor="dental-notes" className="font-semibold text-dental-ink">
                    Anything we should know?{" "}
                    <span className="font-normal text-dental-muted">(optional)</span>
                  </label>
                  <textarea
                    id="dental-notes"
                    value={details.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    aria-invalid={errors.notes ? true : undefined}
                    aria-describedby={
                      errors.notes ? "dental-notes-error dental-notes-count" : "dental-notes-count"
                    }
                    className={cn(inputClass, "h-auto py-3 leading-relaxed")}
                    placeholder="For example: pain on the lower left since Tuesday, nervous about injections, diabetic"
                  />
                  <p
                    id="dental-notes-count"
                    className="mt-1.5 text-right text-[0.75rem] text-dental-muted tabular-nums"
                  >
                    {details.notes.length} / 400
                  </p>
                  <FieldError id="dental-notes-error" message={errors.notes} />
                </div>
                <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={details.reminders}
                    onChange={(e) => update("reminders", e.target.checked)}
                    className="mt-1 size-4.5 shrink-0 accent-dental-spruce"
                  />
                  <span className="text-[0.9375rem] text-dental-body">
                    Send me a confirmation and a reminder the evening before, on WhatsApp.
                  </span>
                </label>
              </div>
            </>
          ) : null}

          {step === 5 && reason && day && time ? (
            <>
              <h2
                id="dental-step-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-dental-display text-[1.85rem] leading-tight text-dental-ink focus:outline-none"
              >
                Check and confirm
              </h2>
              <p className="mt-2 text-dental-muted">Make sure everything looks right.</p>
              <dl className="mt-6 divide-y divide-dental-line rounded-2xl border border-dental-line">
                {[
                  {
                    label: "Treatment",
                    value:
                      reason.label === "Not sure yet" ? "Consultation and check-up" : reason.label,
                    step: 1 as Step,
                  },
                  {
                    label: "Dentist",
                    value: doctor?.name ?? "First available dentist",
                    step: 1 as Step,
                  },
                  { label: "Date", value: formatDayLong(day.iso), step: 2 as Step },
                  {
                    label: "Time",
                    value: `${formatTime(time)}, about ${reason.minutes} minutes`,
                    step: 3 as Step,
                  },
                  { label: "Patient", value: details.name.trim(), step: 4 as Step },
                  { label: "Mobile", value: formatPhone(details.phone), step: 4 as Step },
                  ...(details.email.trim()
                    ? [{ label: "Email", value: details.email.trim(), step: 4 as Step }]
                    : []),
                  {
                    label: "First visit",
                    value: details.firstVisit === "yes" ? "Yes" : "No",
                    step: 4 as Step,
                  },
                  ...(details.notes.trim()
                    ? [{ label: "Notes", value: details.notes.trim(), step: 4 as Step }]
                    : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4 px-4 py-3 sm:px-5">
                    <dt className="w-24 shrink-0 text-[0.875rem] text-dental-muted">{row.label}</dt>
                    <dd className="min-w-0 flex-1 font-medium break-words text-dental-ink">
                      {row.value}
                    </dd>
                    <dd>
                      <button
                        type="button"
                        onClick={() => goTo(row.step)}
                        className="rounded-sm text-[0.875rem] font-semibold text-dental-spruce underline-offset-4 hover:underline"
                      >
                        Change<span className="sr-only"> {row.label.toLowerCase()}</span>
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex gap-3 rounded-2xl bg-dental-brass-soft/60 p-4 text-[0.9375rem] leading-relaxed text-dental-body">
                <Info
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-dental-brass-deep"
                />
                <p>
                  Consultation fee {formatINR(CONSULTATION_FEE)}, paid at the studio and adjusted if
                  treatment starts the same day. Pay by UPI, card or cash.
                </p>
              </div>
            </>
          ) : null}

          {stepError ? (
            <p role="alert" className="mt-6 flex items-center gap-2 font-medium text-dental-coral">
              <CircleAlert aria-hidden="true" className="size-4.5" />
              {stepError}
            </p>
          ) : null}

          {/* On phones the buttons stay in reach above the Call, WhatsApp and Book bar. */}
          <div className="mt-8 flex items-center gap-3 border-t border-dental-line pt-6 max-md:sticky max-md:bottom-[calc(4.35rem+env(safe-area-inset-bottom))] max-md:z-10 max-md:-mx-5 max-md:bg-dental-paper/95 max-md:px-5 max-md:pt-4 max-md:pb-4 max-md:backdrop-blur sm:justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => goTo((step - 1) as Step)}
                className={cn(buttonClasses("secondary", "lg"), "max-sm:px-5")}
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                className={cn(buttonClasses("primary", "lg"), "max-sm:flex-1 max-sm:px-4")}
              >
                {step === 4
                  ? "Review booking"
                  : `Continue to ${(STEPS as readonly string[])[step]?.toLowerCase()}`}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={confirm}
                className={cn(buttonClasses("primary", "lg"), "max-sm:flex-1")}
              >
                <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                Confirm booking
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Running summary on larger screens. */}
      <aside aria-label="Your booking so far" className="hidden lg:sticky lg:top-28 lg:block">
        <div className="rounded-[1.5rem] border border-dental-line/80 bg-dental-paper/70 p-6">
          <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-dental-brass-deep uppercase">
            Your booking
          </p>
          <ul className="mt-4 space-y-4 text-[0.9375rem]">
            <SummaryRow
              icon={<Stethoscope className="size-4" />}
              label="Treatment"
              value={
                reason
                  ? reason.label === "Not sure yet"
                    ? "Consultation and check-up"
                    : reason.label
                  : null
              }
            />
            <SummaryRow
              icon={<UserRound className="size-4" />}
              label="Dentist"
              value={doctor?.name ?? "First available"}
            />
            <SummaryRow
              icon={<CalendarDays className="size-4" />}
              label="Date"
              value={day ? formatDayLong(day.iso) : null}
            />
            <SummaryRow
              icon={<Clock className="size-4" />}
              label="Time"
              value={time ? `${formatTime(time)}, about ${reason?.minutes ?? 30} min` : null}
            />
          </ul>
          {reason ? (
            <p className="mt-5 border-t border-dental-line pt-4 text-[0.875rem] text-dental-muted">
              {reason.priceLabel}:{" "}
              <span className="font-semibold text-dental-ink">
                from {formatINR(reason.priceFrom)}
              </span>
            </p>
          ) : null}
        </div>
        <p className="mt-4 px-2 text-[0.8125rem] leading-relaxed text-dental-muted">
          Prefer to talk? Use the WhatsApp assistant, or visit us at {CLINIC.address.line2}.
        </p>
      </aside>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-dental-mist text-dental-spruce"
      >
        {icon}
      </span>
      <span>
        <span className="block text-[0.75rem] text-dental-muted">{label}</span>
        <span
          className={cn("block font-medium", value ? "text-dental-ink" : "text-dental-muted/80")}
        >
          {value ?? "Not chosen yet"}
        </span>
      </span>
    </li>
  );
}

function Confirmation({
  appointment,
  headingRef,
  onStartOver,
}: {
  appointment: StoredAppointment;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStartOver: () => void;
}) {
  return (
    <section
      aria-labelledby="dental-step-title"
      className="mx-auto max-w-3xl scroll-mt-28 overflow-hidden rounded-[2rem] border border-dental-line/80 bg-dental-paper shadow-dental-lift"
    >
      <div className="relative bg-dental-spruce px-6 py-10 text-center text-dental-ivory sm:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(30rem_14rem_at_50%_0%,rgb(192_154_95/0.35),transparent_70%)]"
        />
        <span className="relative mx-auto grid size-16 animate-dental-pop place-items-center rounded-full bg-dental-ivory text-dental-spruce">
          <Check aria-hidden="true" className="size-8" strokeWidth={2.5} />
        </span>
        <h2
          id="dental-step-title"
          ref={headingRef}
          tabIndex={-1}
          className="relative mt-5 font-dental-display text-[clamp(1.9rem,5vw,2.6rem)] leading-tight text-white focus:outline-none"
        >
          You&rsquo;re booked in, {appointment.name.split(" ")[0]}
        </h2>
        <p className="relative mt-2 text-dental-ivory/85">
          {formatDayLong(appointment.dateISO)} at {formatTime(appointment.time)}
        </p>
      </div>

      <div className="p-6 sm:p-10">
        <div
          role="note"
          className="flex gap-3 rounded-2xl border border-dental-brass/40 bg-dental-brass-soft/70 p-4 text-[0.9375rem] leading-relaxed text-dental-ink"
        >
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-dental-brass-deep" />
          <p>
            <strong className="font-semibold">Demo: no real appointment was made.</strong> Nothing
            was sent to any clinic. This booking is saved only in your browser so the site can show
            &ldquo;Your appointment&rdquo; when you come back.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-dental-sage bg-dental-mist/60 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-dental-spruce uppercase">
              Booking reference
            </p>
            <p className="font-dental-display text-[1.6rem] tracking-wide text-dental-ink tabular-nums">
              {appointment.ref}
            </p>
          </div>
          <dl className="mt-4 grid gap-x-6 gap-y-3 text-[0.9375rem] sm:grid-cols-2">
            <div>
              <dt className="text-[0.8125rem] text-dental-muted">Treatment</dt>
              <dd className="font-medium text-dental-ink">{appointment.reasonLabel}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-dental-muted">Dentist</dt>
              <dd className="font-medium text-dental-ink">
                {appointment.doctorName ?? "First available dentist"}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-dental-muted">Patient</dt>
              <dd className="font-medium text-dental-ink">
                {appointment.name}, {appointment.phone}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-dental-muted">Where</dt>
              <dd className="font-medium text-dental-ink">{CLINIC.address.line1}, Rajpur Road</dd>
            </div>
          </dl>
        </div>

        <h3 className="mt-8 font-semibold text-dental-ink">What happens next</h3>
        <ol className="mt-3 space-y-2.5">
          {AFTER_BOOKING.map((item, i) => (
            <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-dental-body">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-dental-mist text-[0.75rem] font-bold text-dental-spruce">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => downloadCalendarFile(appointment)}
            className={buttonClasses("primary", "lg")}
          >
            <CalendarPlus aria-hidden="true" className="size-4.5" />
            Add to calendar
          </button>
          <Link href="/dental-clinic/first-visit" className={buttonClasses("secondary", "lg")}>
            Prepare for your visit
          </Link>
          <button type="button" onClick={onStartOver} className={buttonClasses("ghost", "lg")}>
            Book another appointment
          </button>
        </div>
      </div>
    </section>
  );
}
