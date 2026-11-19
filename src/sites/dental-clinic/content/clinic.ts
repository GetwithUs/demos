/**
 * Facts about the (made-up) clinic used across the site. The phone numbers are shown as text
 * only and are never dialable: a made-up number could belong to a real person.
 */
export const CLINIC = {
  name: "Ivorine Dental Studio",
  shortName: "Ivorine",
  tagline: "Gentle, specialist dentistry on Rajpur Road",
  city: "Dehradun",
  since: 2013,
  phone: "0135 246 8000",
  whatsapp: "+91 98970 24680",
  emergencyPhone: "+91 98970 24681",
  email: "hello@ivorinedental.example",
  careersEmail: "careers@ivorinedental.example",
  address: {
    line1: "2nd floor, Kesar Court",
    line2: "112 Rajpur Road, near Dilaram Chowk",
    city: "Dehradun",
    state: "Uttarakhand",
    pin: "248001",
  },
  landmark:
    "A white stone building with an olive awning, about 300 m from Dilaram Chowk on the left as you drive towards Rajpur.",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Dilaram+Chowk%2C+Rajpur+Road%2C+Dehradun%2C+Uttarakhand",
  rating: { average: 4.9, count: 640 },
  patients: "21,000+",
  registration: "Registered with the Uttarakhand State Dental Council",
} as const;

export const FULL_ADDRESS = `${CLINIC.address.line1}, ${CLINIC.address.line2}, ${CLINIC.address.city}, ${CLINIC.address.state} ${CLINIC.address.pin}`;

export type DayHours = {
  /** 0 is Sunday, as in Date.getDay(). */
  day: number;
  label: string;
  /** Opening and closing times as "HH:MM" in IST, or null when closed. */
  open: string | null;
  close: string | null;
  note?: string;
};

/** Weekly timings, Monday first for display. */
export const HOURS: DayHours[] = [
  { day: 1, label: "Monday", open: "10:00", close: "20:00" },
  { day: 2, label: "Tuesday", open: "10:00", close: "20:00" },
  { day: 3, label: "Wednesday", open: "10:00", close: "20:00" },
  { day: 4, label: "Thursday", open: "10:00", close: "20:00" },
  { day: 5, label: "Friday", open: "10:00", close: "20:00" },
  { day: 6, label: "Saturday", open: "10:00", close: "20:00" },
  {
    day: 0,
    label: "Sunday",
    open: "10:00",
    close: "14:00",
    note: "Pre-booked visits and emergencies",
  },
];

export const HOURS_SUMMARY = [
  { days: "Monday to Saturday", time: "10:00 am to 8:00 pm" },
  { days: "Sunday", time: "10:00 am to 2:00 pm, by appointment" },
] as const;

export const GETTING_HERE = [
  {
    title: "Parking",
    text: "Free basement parking for 10 cars, entry from the lane behind the building. Two-wheelers can park at the front.",
  },
  {
    title: "Lift and access",
    text: "A lift goes to the second floor and the studio is step-free inside, with a wheelchair-friendly washroom.",
  },
  {
    title: "By auto or cab",
    text: "Ask for Kesar Court, Rajpur Road. Most drivers know it as the building just past Dilaram Chowk.",
  },
  {
    title: "From the Clock Tower",
    text: "About 2.5 km and 10 minutes up Rajpur Road, longer in evening traffic.",
  },
] as const;

export const SOCIAL_PROOF = [
  { value: "12 years", label: "Caring for Dehradun, since 2013" },
  { value: CLINIC.patients, label: "Patients seen" },
  { value: `${CLINIC.rating.average}`, label: `Average from ${CLINIC.rating.count} reviews` },
  { value: "4", label: "Specialist dentists (MDS)" },
] as const;
