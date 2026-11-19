import { Fraunces, Hanken_Grotesk } from "next/font/google";

/** Headings: a soft, warm serif with optical sizing, for the boutique feel. */
export const dentalDisplay = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-dental-display",
  display: "swap",
});

/** Body and interface text: a clear, friendly grotesk that stays readable on small phones. */
export const dentalSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-dental-sans",
  display: "swap",
});
