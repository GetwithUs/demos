"use client";

import { Segmented } from "@/sites/skincare/admin/components/ui";
import { RANGES, type RangeKey } from "@/sites/skincare/admin/lib/metrics";

/** Today, 7 days or 30 days. */
export default function RangeSwitch({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (r: RangeKey) => void;
}) {
  return (
    <Segmented
      label="Date range"
      options={RANGES.map((r) => ({ value: r.key, label: r.label }))}
      value={value}
      onChange={onChange}
    />
  );
}
