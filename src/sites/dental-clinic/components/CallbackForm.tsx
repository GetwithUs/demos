"use client";

import { CircleAlert, PhoneIncoming } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/sites/dental-clinic/components/ui";

const TIMES = ["Morning, 10 am to 1 pm", "Afternoon, 1 pm to 5 pm", "Evening, 5 pm to 8 pm"];

const fieldClass =
  "mt-2 block h-12 w-full rounded-xl border border-dental-line bg-white px-4 text-dental-ink transition-colors placeholder:text-dental-muted/70 hover:border-dental-sage focus-visible:border-dental-spruce focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-dental-spruce/25 aria-[invalid=true]:border-dental-coral";

/** "Request a call back", simulated: nothing is sent anywhere. */
export default function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState(TIMES[2]);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^(?:\+?91|0)?[6-9]\d{9}$/.test(phone.replace(/[\s()-]/g, "")))
      next.phone = "Enter a 10-digit Indian mobile number.";
    setErrors(next);
    if (next.name) return document.getElementById("dental-cb-name")?.focus();
    if (next.phone) return document.getElementById("dental-cb-phone")?.focus();
    setDone(name.trim().split(" ")[0]);
  }

  if (done) {
    return (
      <div role="status" className="animate-dental-pop rounded-2xl bg-dental-mist p-6">
        <PhoneIncoming aria-hidden="true" className="size-7 text-dental-spruce" strokeWidth={1.6} />
        <p className="mt-3 font-dental-display text-[1.5rem] leading-tight text-dental-ink">
          Thanks, {done}. We&rsquo;ll call you back.
        </p>
        <p className="mt-2 leading-relaxed text-dental-body">
          In the real website, the front desk calls back within two working hours, in the time you
          chose. <strong className="font-semibold">Demo: nothing was sent.</strong>
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(null);
            setName("");
            setPhone("");
          }}
          className={cn(buttonClasses("ghost", "md"), "mt-3")}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div>
        <label htmlFor="dental-cb-name" className="font-semibold text-dental-ink">
          Your name
        </label>
        <input
          id="dental-cb-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "dental-cb-name-error" : undefined}
          className={fieldClass}
        />
        {errors.name ? (
          <p
            id="dental-cb-name-error"
            className="mt-2 flex items-center gap-1.5 text-[0.875rem] font-medium text-dental-coral"
          >
            <CircleAlert aria-hidden="true" className="size-4" />
            {errors.name}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="dental-cb-phone" className="font-semibold text-dental-ink">
          Mobile number
        </label>
        <input
          id="dental-cb-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel-national"
          placeholder="98765 43210"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "dental-cb-phone-error" : undefined}
          className={fieldClass}
        />
        {errors.phone ? (
          <p
            id="dental-cb-phone-error"
            className="mt-2 flex items-center gap-1.5 text-[0.875rem] font-medium text-dental-coral"
          >
            <CircleAlert aria-hidden="true" className="size-4" />
            {errors.phone}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="dental-cb-time" className="font-semibold text-dental-ink">
          Best time to call
        </label>
        <select
          id="dental-cb-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={cn(fieldClass, "appearance-auto")}
        >
          {TIMES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <button type="submit" className={buttonClasses("primary", "lg")}>
        Request a call back
      </button>
    </form>
  );
}
