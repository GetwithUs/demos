import { BRAND, SHIPPING } from "@/sites/skincare/data/catalog";
import { formatINR } from "@/sites/skincare/lib/pricing";

export const ABOUT = {
  eyebrow: "Our story",
  title: "Skincare that starts with Indian skin, not ends with it.",
  intro:
    "Oruvi began in 2022 in a small lab on Rajpur Road, Dehradun. Our founder, cosmetic chemist Ritika Negi, was tired of serums made for cold, dry climates that pilled, oxidised or broke people out in an Indian monsoon.",
  story: [
    "So we started again from the skin up. Every Oruvi formula is built for heat and humidity, tested for stability at 40°C, and patch tested on Indian volunteers across skin tones before it is sold.",
    "We print every active and its strength on the front of the pack, because you deserve to know what you are paying for. No fillers dressed up as hero ingredients, no added fragrance, no vague promises.",
    "Today Oruvi is a team of 34 in Dehradun, shipping to every pincode we can reach. We still answer every WhatsApp message ourselves.",
  ],
  numbers: [
    { value: "2022", label: "started in Dehradun" },
    { value: "2 lakh+", label: "orders delivered" },
    { value: "15", label: "products, no fillers" },
    { value: "4.6", label: "average rating" },
  ],
  team: [
    {
      name: "Ritika Negi",
      role: "Founder and formulator",
      text: "Cosmetic chemist, 11 years in product development for Indian and global skincare labs.",
    },
    {
      name: "Dr. Arjun Bhatt",
      role: "Consulting dermatologist",
      text: "MD Dermatology. Reviews every formula and runs our patch testing panel.",
    },
    {
      name: "Sana Qureshi",
      role: "Head of customer care",
      text: "Leads the team that answers your WhatsApp questions, usually within minutes.",
    },
  ],
  principles: [
    {
      title: "Full disclosure",
      text: "Every active and its percentage on the label, and every ingredient listed online.",
    },
    {
      title: "Made for our weather",
      text: "Light textures that stay stable in heat and humidity.",
    },
    {
      title: "Fair pricing",
      text: "Clinical formulas at prices that make a full routine affordable.",
    },
    {
      title: "Less waste",
      text: "Glass droppers, recyclable tubes and paper outer boxes with no plastic fill.",
    },
  ],
};

export const SHIPPING_PAGE = {
  title: "Shipping and delivery",
  intro: `We ship from our warehouse in ${BRAND.city}. Orders placed before 2 pm (Monday to Saturday) leave the same day.`,
  zones: [
    { zone: "Dehradun", time: "Next day", cod: "Yes" },
    { zone: "Haridwar, Rishikesh, Saharanpur", time: "1 to 3 days", cod: "Yes" },
    { zone: "Delhi NCR, Chandigarh", time: "2 to 3 days", cod: "Yes" },
    { zone: "Mumbai, Pune, Bengaluru, Hyderabad", time: "3 to 4 days", cod: "Yes" },
    { zone: "Rest of India", time: "4 to 6 days", cod: "Yes" },
    { zone: "North East", time: "5 to 7 days", cod: "Yes" },
    { zone: "Ladakh, Andaman and Nicobar", time: "7 to 10 days", cod: "No" },
  ],
  points: [
    `Free delivery on orders above ₹${SHIPPING.freeAbove}. A flat ₹${SHIPPING.fee} below that.`,
    `Cash on delivery on orders up to ${formatINR(SHIPPING.codMax)}, with a ₹${SHIPPING.codFee} handling fee.`,
    `Pay online and get an extra ${SHIPPING.prepaidPercent}% off, up to ₹${SHIPPING.prepaidMax}.`,
    "We ship with Delhivery, Blue Dart, Ekart and Xpressbees. You get the courier name and AWB number on WhatsApp as soon as your order ships.",
    "No deliveries on Sundays and national holidays.",
  ],
};

export const RETURNS_PAGE = {
  title: "Returns and refunds",
  intro: `Changed your mind? Return any unopened product within ${SHIPPING.returnDays} days of delivery for a full refund.`,
  steps: [
    {
      title: "Request",
      text: "Message us on WhatsApp or email with your order ID and the product you want to return.",
    },
    {
      title: "Pickup",
      text: "We arrange a free pickup within 2 working days. Keep the product sealed in its box.",
    },
    { title: "Check", text: "Our warehouse checks the seal, usually the same day it arrives." },
    { title: "Refund", text: "Money back to your original payment method in 5 to 7 working days." },
  ],
  rules: [
    `Unopened, sealed products: returnable within ${SHIPPING.returnDays} days.`,
    "Opened or used products cannot be returned, for hygiene reasons.",
    "Damaged, leaking or wrong product: tell us within 48 hours with a photo and we replace it free.",
    "Free gifts and products bought on clearance are not returnable.",
    "Cash on delivery refunds go to your UPI ID or bank account.",
    "Prepaid orders cancelled before shipping are refunded in full within 24 hours.",
  ],
};

export const CONTACT_PAGE = {
  title: "We are here to help",
  intro:
    "Questions about an order, or not sure which product suits you? Our care team and in-house skin experts usually reply within an hour.",
  hours: "Monday to Saturday, 10 am to 7 pm",
  address: [
    "Oruvi Skin Private Limited",
    "2nd floor, 41 Rajpur Road",
    "Dehradun, Uttarakhand 248001",
  ],
  topics: [
    "Order status",
    "Returns and refunds",
    "Product advice",
    "Payment issue",
    "Bulk or gifting",
    "Something else",
  ],
};
