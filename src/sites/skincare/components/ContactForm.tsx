"use client";

import { CircleCheck } from "lucide-react";
import { useId, useState } from "react";
import { buttonClass } from "@/sites/skincare/components/ui";
import { CONTACT_PAGE } from "@/sites/skincare/content/pages";

const field =
  "mt-1.5 h-12 w-full rounded-xl border border-skin-line bg-white px-3.5 text-[0.95rem] text-skin-ink focus:border-skin-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-accent/25 aria-[invalid=true]:border-skin-danger";

/** Contact form. Simulated: nothing is sent; the shopper gets a made-up ticket number. */
export default function ContactForm() {
  const [ticket, setTicket] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const id = useId();

  if (ticket) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-skin-line" role="status">
        <CircleCheck className="mx-auto size-12 text-skin-success" aria-hidden />
        <p className="mt-4 font-skin-display text-2xl text-skin-ink">
          Thank you, we have your message
        </p>
        <p className="mt-2 text-skin-body">
          Your ticket number is <strong className="tracking-wide">{ticket}</strong>. Our team
          usually replies within an hour on working days.
        </p>
        <p className="mt-3 text-xs text-skin-subtle">Demo: nothing was sent anywhere.</p>
        <button
          type="button"
          onClick={() => setTicket(null)}
          className={buttonClass("outline", "md", "mt-6")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="rounded-3xl bg-white p-6 ring-1 ring-skin-line sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const get = (k: string) => String(data.get(k) ?? "").trim();
        const next: Record<string, string> = {};
        if (get("name").length < 2) next.name = "Please enter your name.";
        const contact = get("contact");
        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) &&
          !/^[6-9]\d{9}$/.test(contact.replace(/\D/g, "").slice(-10))
        )
          next.contact = "Enter an email address or a 10-digit mobile number.";
        if (get("message").length < 10) next.message = "Tell us a little more so we can help.";
        setErrors(next);
        if (Object.keys(next).length) return;
        setTicket(`OSC-${String(Math.floor(100000 + Math.random() * 900000))}`);
      }}
    >
      <h2 className="font-skin-display text-2xl text-skin-ink">Send us a message</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-medium text-skin-ink">
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            className={field}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={`${id}-name-e`}
          />
          <p id={`${id}-name-e`} className="mt-1 text-xs text-skin-danger">
            {errors.name}
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-contact`} className="text-sm font-medium text-skin-ink">
            Email or mobile
          </label>
          <input
            id={`${id}-contact`}
            name="contact"
            className={field}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={`${id}-contact-e`}
          />
          <p id={`${id}-contact-e`} className="mt-1 text-xs text-skin-danger">
            {errors.contact}
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-topic`} className="text-sm font-medium text-skin-ink">
            Topic
          </label>
          <select id={`${id}-topic`} name="topic" className={field}>
            {CONTACT_PAGE.topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-order`} className="text-sm font-medium text-skin-ink">
            Order ID (optional)
          </label>
          <input id={`${id}-order`} name="order" placeholder="ORV-41207" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className="text-sm font-medium text-skin-ink">
            Message
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            className={`${field} h-auto py-3`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={`${id}-message-e`}
          />
          <p id={`${id}-message-e`} className="mt-1 text-xs text-skin-danger">
            {errors.message}
          </p>
        </div>
      </div>
      <button type="submit" className={buttonClass("primary", "lg", "mt-4")}>
        Send message
      </button>
    </form>
  );
}
