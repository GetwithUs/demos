import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import ChatButton from "@/sites/skincare/components/ChatButton";
import { Container, PageHeader } from "@/sites/skincare/components/ui";
import { RETURNS_PAGE } from "@/sites/skincare/content/pages";

export const metadata: Metadata = { title: "Returns and refunds" };

export default function ReturnsPage() {
  return (
    <Container className="pb-10">
      <PageHeader
        crumb="Returns"
        eyebrow="Policies"
        title={RETURNS_PAGE.title}
        intro={RETURNS_PAGE.intro}
      />
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RETURNS_PAGE.steps.map((s, i) => (
          <li key={s.title} className="rounded-3xl bg-white p-6 ring-1 ring-skin-line">
            <span className="grid size-9 place-items-center rounded-full bg-skin-accent text-sm font-semibold text-white">
              {i + 1}
            </span>
            <h2 className="mt-4 font-skin-display text-xl text-skin-ink">{s.title}</h2>
            <p className="mt-1 text-sm text-skin-body">{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <section aria-labelledby="returns-rules">
          <h2 id="returns-rules" className="font-skin-display text-2xl text-skin-ink">
            The fine print, in plain words
          </h2>
          <ul className="mt-4 space-y-3">
            {RETURNS_PAGE.rules.map((r) => (
              <li key={r} className="flex gap-3 text-[0.95rem] text-skin-body">
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-skin-accent" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </section>
        <aside className="self-start rounded-3xl bg-skin-accent-soft p-6">
          <p className="font-skin-display text-2xl text-skin-ink">Start a return</p>
          <p className="mt-2 text-sm text-skin-body">
            Send us your order ID on WhatsApp and we will book a free pickup.
          </p>
          <ChatButton label="Start on WhatsApp" className="mt-5" />
        </aside>
      </div>
    </Container>
  );
}
