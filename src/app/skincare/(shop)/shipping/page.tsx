import { Check } from "lucide-react";
import type { Metadata } from "next";
import PincodeCheck from "@/sites/skincare/components/PincodeCheck";
import { Container, PageHeader } from "@/sites/skincare/components/ui";
import { SHIPPING_PAGE } from "@/sites/skincare/content/pages";

export const metadata: Metadata = { title: "Shipping and delivery" };

export default function ShippingPage() {
  return (
    <Container className="pb-10">
      <PageHeader
        crumb="Shipping"
        eyebrow="Policies"
        title={SHIPPING_PAGE.title}
        intro={SHIPPING_PAGE.intro}
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <div>
          <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-skin-line">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Delivery times by region</caption>
              <thead className="bg-skin-sand/70 text-skin-ink">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Delivering to
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Usually takes
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Cash on delivery
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-skin-line text-skin-body">
                {SHIPPING_PAGE.zones.map((z) => (
                  <tr key={z.zone}>
                    <th scope="row" className="px-5 py-3 font-medium text-skin-ink">
                      {z.zone}
                    </th>
                    <td className="px-5 py-3">{z.time}</td>
                    <td className="px-5 py-3">{z.cod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-8 space-y-3">
            {SHIPPING_PAGE.points.map((p) => (
              <li key={p} className="flex gap-3 text-[0.95rem] text-skin-body">
                <Check className="mt-0.5 size-5 shrink-0 text-skin-accent" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="self-start lg:sticky lg:top-24">
          <PincodeCheck title="Check delivery to your pincode" />
        </div>
      </div>
    </Container>
  );
}
