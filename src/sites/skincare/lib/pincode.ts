/**
 * Demo delivery check for Indian pincodes. The shop ships from Dehradun, so Dehradun is
 * next day, nearby cities and metros are 2 to 3 days, and the rest of India 4 to 6 days.
 * A handful of remote areas have no cash on delivery. Real stores call their courier's API.
 */

export type PincodeResult =
  | { ok: false; message: string }
  | {
      ok: true;
      city?: string;
      state?: string;
      minDays: number;
      maxDays: number;
      cod: boolean;
      /** e.g. "Delivery by Sat, 22 Nov" (uses maxDays from `from`). */
      message: string;
      /** The latest expected delivery date. */
      by: Date;
    };

type Zone = { city?: string; state: string; days: [number, number]; cod?: boolean };

/** Known 3-digit pincode prefixes, for city autofill and faster delivery. */
const PREFIXES: Record<string, Zone> = {
  "248": { city: "Dehradun", state: "Uttarakhand", days: [1, 1] },
  "249": { city: "Haridwar", state: "Uttarakhand", days: [1, 2] },
  "247": { city: "Saharanpur", state: "Uttar Pradesh", days: [2, 3] },
  "263": { state: "Uttarakhand", days: [2, 4] },
  "246": { state: "Uttarakhand", days: [3, 5] },
  "110": { city: "New Delhi", state: "Delhi", days: [2, 3] },
  "122": { city: "Gurugram", state: "Haryana", days: [2, 3] },
  "201": { city: "Noida", state: "Uttar Pradesh", days: [2, 3] },
  "160": { city: "Chandigarh", state: "Chandigarh", days: [2, 3] },
  "302": { city: "Jaipur", state: "Rajasthan", days: [3, 4] },
  "226": { city: "Lucknow", state: "Uttar Pradesh", days: [3, 4] },
  "400": { city: "Mumbai", state: "Maharashtra", days: [3, 4] },
  "411": { city: "Pune", state: "Maharashtra", days: [3, 4] },
  "560": { city: "Bengaluru", state: "Karnataka", days: [3, 4] },
  "500": { city: "Hyderabad", state: "Telangana", days: [3, 4] },
  "600": { city: "Chennai", state: "Tamil Nadu", days: [3, 5] },
  "700": { city: "Kolkata", state: "West Bengal", days: [3, 5] },
  "380": { city: "Ahmedabad", state: "Gujarat", days: [3, 5] },
  "682": { city: "Kochi", state: "Kerala", days: [4, 6] },
  "781": { city: "Guwahati", state: "Assam", days: [5, 7] },
  "744": { city: "Port Blair", state: "Andaman and Nicobar Islands", days: [7, 10], cod: false },
  "194": { city: "Leh", state: "Ladakh", days: [7, 10], cod: false },
};

/** First digit of a pincode to a broad region, for everything not listed above. */
const REGIONS: Record<string, Zone> = {
  "1": { state: "North India", days: [3, 5] },
  "2": { state: "North India", days: [3, 5] },
  "3": { state: "West India", days: [4, 6] },
  "4": { state: "West and Central India", days: [4, 6] },
  "5": { state: "South India", days: [4, 6] },
  "6": { state: "South India", days: [4, 6] },
  "7": { state: "East India", days: [5, 7] },
  "8": { state: "East India", days: [5, 7] },
};

function addDays(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  // No deliveries on Sunday: roll to Monday.
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d;
}

const dayFormat = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

/** "Sat, 22 Nov" */
export function formatDeliveryDate(date: Date): string {
  return dayFormat.format(date);
}

export function checkPincode(input: string, from: Date = new Date()): PincodeResult {
  const pin = input.replace(/\s/g, "");
  if (!/^[1-8]\d{5}$/.test(pin)) {
    return { ok: false, message: "Enter a valid 6-digit pincode." };
  }
  const zone = PREFIXES[pin.slice(0, 3)] ?? REGIONS[pin[0]];
  if (!zone) return { ok: false, message: "Sorry, we do not deliver to this pincode yet." };
  const by = addDays(from, zone.days[1]);
  const cod = zone.cod ?? true;
  return {
    ok: true,
    city: zone.city,
    state: zone.city ? zone.state : undefined,
    minDays: zone.days[0],
    maxDays: zone.days[1],
    cod,
    by,
    message: `Delivery by ${formatDeliveryDate(by)}${cod ? "" : ". Cash on delivery is not available here"}`,
  };
}
