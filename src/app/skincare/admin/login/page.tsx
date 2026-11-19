import type { Metadata } from "next";
import { Suspense } from "react";
import SignIn from "@/sites/skincare/admin/views/SignIn";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#f6f5f2]" />}>
      <SignIn />
    </Suspense>
  );
}
