/** Copy and options for the simulated checkout. No real payment details are ever collected. */

export const DEMO_NOTICE = "Demo payment: no real money is charged.";

export const UPI_ID = "oruviskin@okdemo";

export const UPI_APPS = [
  { name: "Google Pay", short: "G", colour: "#4285f4" },
  { name: "PhonePe", short: "Pe", colour: "#5f259f" },
  { name: "Paytm", short: "Pt", colour: "#00b9f1" },
  { name: "BHIM", short: "B", colour: "#f37021" },
];

/** A test card, shown read-only so nobody types real card details into a demo. */
export const DEMO_CARD = {
  number: "4111 1111 1111 1111",
  name: "DEMO CARD",
  expiry: "12/30",
  cvv: "123",
  network: "VISA",
};

export const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Yes Bank",
];

export const STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/** Steps shown on the "processing payment" screen. */
export const PROCESSING_STEPS = {
  upi: ["Waiting for you to approve in your UPI app", "Payment received", "Confirming your order"],
  card: ["Contacting your bank", "Verifying with 3D Secure", "Confirming your order"],
  netbanking: ["Redirecting to your bank", "Payment authorised", "Confirming your order"],
  cod: [
    "Checking cash on delivery for your pincode",
    "Reserving your products",
    "Confirming your order",
  ],
} as const;
