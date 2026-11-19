"use client";

import { Eye, EyeOff, Info, Lock, Mail, Store } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { BRAND } from "@/sites/skincare/data/catalog";
import { OWNER_LOGIN, useDemoStore } from "@/sites/skincare/lib/store";
import { Button, inputClass } from "@/sites/skincare/admin/components/ui";
import { useAdminReady } from "@/sites/skincare/admin/lib/hooks";
import { cn } from "@/lib/cn";

const HOME = "/skincare/admin";

/** Only paths inside the dashboard are allowed as a return address. */
function safeNext(next: string | null): string {
  return next && next.startsWith(HOME) && !next.startsWith(`${HOME}/login`) && !next.includes("//")
    ? next
    : HOME;
}

export default function SignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const ready = useAdminReady();
  const signedIn = useDemoStore((s) => s.ownerSignedIn);
  const signIn = useDemoStore((s) => s.signIn);
  const [email, setEmail] = useState<string>(OWNER_LOGIN.email);
  const [password, setPassword] = useState<string>(OWNER_LOGIN.password);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in (for example a second tab): go straight to the dashboard.
  useEffect(() => {
    if (ready && signedIn && !busy) router.replace(next);
  }, [ready, signedIn, busy, next, router]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!signIn(email, password)) {
      setError(
        `That email and password do not match. For this demo use ${OWNER_LOGIN.email} and ${OWNER_LOGIN.password}.`,
      );
      return;
    }
    setError("");
    setBusy(true);
    router.replace(next);
  };

  return (
    <main className="flex min-h-[calc(100dvh-2.5rem)] flex-col items-center justify-center bg-[#f6f5f2] px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <span
            aria-hidden
            className="grid size-12 place-items-center rounded-xl bg-skin-accent font-skin-display text-2xl font-semibold text-white shadow-sm"
          >
            O
          </span>
          <h1 className="mt-4 font-skin-display text-2xl font-semibold text-stone-900">
            Sign in to {BRAND.name}
          </h1>
          <p className="mt-1 text-sm text-stone-600">Manage your products, orders and customers.</p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7"
        >
          <div className="mb-5 flex gap-2.5 rounded-lg bg-skin-accent-soft px-3 py-2.5 text-[0.8125rem] text-skin-accent">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            <p>
              <span className="font-semibold">Demo login, already filled in.</span> Just press Sign
              in.
            </p>
          </div>

          <label
            htmlFor="email"
            className="mb-1.5 block text-[0.8125rem] font-medium text-stone-800"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-500"
            />
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "signin-error" : undefined}
              className={cn(inputClass, "h-11 pl-9")}
            />
          </div>

          <label
            htmlFor="password"
            className="mt-4 mb-1.5 block text-[0.8125rem] font-medium text-stone-800"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-500"
            />
            <input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "signin-error" : undefined}
              className={cn(inputClass, "h-11 pr-11 pl-9")}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-skin-accent"
            >
              {show ? (
                <EyeOff aria-hidden className="size-4" />
              ) : (
                <Eye aria-hidden className="size-4" />
              )}
            </button>
          </div>

          {error ? (
            <p id="signin-error" role="alert" className="mt-3 text-[0.8125rem] text-red-700">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            className="mt-6 h-11 w-full text-[0.9375rem]"
            disabled={!ready || busy}
          >
            {busy ? "Signing in" : ready ? "Sign in" : "Loading"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[0.8125rem] text-stone-600">
          <Link
            href="/skincare"
            className="inline-flex items-center gap-1.5 rounded font-medium text-stone-700 hover:text-stone-900 hover:underline"
          >
            <Store aria-hidden className="size-4" />
            Back to the {BRAND.name} shop
          </Link>
        </p>
      </div>
    </main>
  );
}
