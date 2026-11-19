import type { CategoryId, Order } from "@/sites/skincare/data/types";

/** Made-up business details for the demo GST invoice and settings page. */
export const STORE_DETAILS = {
  legalName: "Oruvi Skincare Private Limited",
  gstin: "05ABCDE1234F1Z5",
  pan: "ABCDE1234F",
  addressLines: ["2nd Floor, 14 Rajpur Road", "Hathibarkala, Dehradun"],
  city: "Dehradun",
  state: "Uttarakhand",
  pincode: "248001",
  stateCode: "05",
  owner: { name: "Nandini Bhatt", role: "Founder" },
} as const;

/** GST state codes, for "Place of supply" on the invoice. */
export const STATE_CODES: Record<string, string> = {
  "Jammu and Kashmir": "01",
  "Himachal Pradesh": "02",
  Punjab: "03",
  Chandigarh: "04",
  Uttarakhand: "05",
  Haryana: "06",
  Delhi: "07",
  Rajasthan: "08",
  "Uttar Pradesh": "09",
  Bihar: "10",
  Sikkim: "11",
  "Arunachal Pradesh": "12",
  Nagaland: "13",
  Manipur: "14",
  Mizoram: "15",
  Tripura: "16",
  Meghalaya: "17",
  Assam: "18",
  "West Bengal": "19",
  Jharkhand: "20",
  Odisha: "21",
  Chhattisgarh: "22",
  "Madhya Pradesh": "23",
  Gujarat: "24",
  "Dadra and Nagar Haveli and Daman and Diu": "26",
  Maharashtra: "27",
  Karnataka: "29",
  Goa: "30",
  Lakshadweep: "31",
  Kerala: "32",
  "Tamil Nadu": "33",
  Puducherry: "34",
  "Andaman and Nicobar Islands": "35",
  Telangana: "36",
  "Andhra Pradesh": "37",
  Ladakh: "38",
};

/** HSN codes: face washes are 3401 (washing preparations), everything else 3304 (skin care). */
export function hsnFor(category: CategoryId | undefined): string {
  return category === "cleansers" ? "3401" : "3304";
}

export type GstSplit =
  | { kind: "intra"; taxable: number; cgst: number; sgst: number; total: number }
  | { kind: "inter"; taxable: number; igst: number; total: number };

/** Splits the GST already inside the order total: CGST + SGST within Uttarakhand, IGST outside. */
export function gstSplit(order: Order): GstSplit {
  const gst = order.totals.gstIncluded;
  const taxable = order.totals.total - gst;
  if (order.address.state.trim().toLowerCase() === STORE_DETAILS.state.toLowerCase()) {
    const cgst = Math.floor(gst / 2);
    return { kind: "intra", taxable, cgst, sgst: gst - cgst, total: order.totals.total };
  }
  return { kind: "inter", taxable, igst: gst, total: order.totals.total };
}

/** Invoice number in the Indian financial-year style, e.g. "OS/26-27/41237". */
export function invoiceNumber(order: Order): string {
  const d = new Date(order.createdAt);
  const fyStart = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  const fy = `${String(fyStart).slice(2)}-${String(fyStart + 1).slice(2)}`;
  return `OS/${fy}/${order.id.replace(/\D/g, "")}`;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : "");
}

function threeDigits(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(`${hundreds ? "and " : ""}${twoDigits(rest)}`);
  return parts.join(" ");
}

/** Indian numbering in words: 123456 becomes "Rupees One Lakh Twenty Three Thousand Four Hundred and Fifty Six only". */
export function amountInWords(amount: number): string {
  const n = Math.round(Math.abs(amount));
  if (n === 0) return "Rupees Zero only";
  const crore = Math.floor(n / 10_000_000);
  const lakh = Math.floor(n / 100_000) % 100;
  const thousand = Math.floor(n / 1000) % 100;
  const rest = n % 1000;
  const parts: string[] = [];
  if (crore) parts.push(`${crore >= 100 ? threeDigits(crore) : twoDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (rest) parts.push(threeDigits(rest));
  return `Rupees ${parts.join(" ")} only`;
}
