export type NavLink = { href: string; label: string };

export const MAIN_NAV: NavLink[] = [
  { href: "/dental-clinic/treatments", label: "Treatments" },
  { href: "/dental-clinic/doctors", label: "Dentists" },
  { href: "/dental-clinic/smile-gallery", label: "Smile gallery" },
  { href: "/dental-clinic/fees", label: "Fees and EMI" },
  { href: "/dental-clinic/reviews", label: "Reviews" },
  { href: "/dental-clinic/contact", label: "Contact" },
];

export const MORE_NAV: NavLink[] = [
  { href: "/dental-clinic/first-visit", label: "Your first visit" },
  { href: "/dental-clinic/safety", label: "Safety and technology" },
  { href: "/dental-clinic/faqs", label: "FAQs" },
  { href: "/dental-clinic/emergency", label: "Dental emergency" },
];
