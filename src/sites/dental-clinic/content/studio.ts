import type { StaticImageData } from "next/image";
import consultation from "@/sites/dental-clinic/images/consultation.jpg";
import digitalScan from "@/sites/dental-clinic/images/digital-scan.jpg";
import sterilisation from "@/sites/dental-clinic/images/sterilisation.jpg";

export const WHY_US = [
  {
    title: "Specialists for each kind of care",
    text: "Root canals by an endodontist, braces by an orthodontist, children with a paediatric dentist. You see the right person, not whoever is free.",
  },
  {
    title: "A written estimate, every time",
    text: "Starting prices on the website, and an itemised estimate before any treatment. No surprises on the bill.",
  },
  {
    title: "Comfort comes first",
    text: "Numbing gel before injections, breaks whenever you raise a hand, and time to ask questions. Nobody is rushed.",
  },
  {
    title: "Hospital-grade sterilisation",
    text: "Class B autoclave, sealed pouches opened in front of you and single-use disposables.",
  },
  {
    title: "Digital from start to finish",
    text: "Low-dose digital X-rays, an intraoral camera and 3D scans instead of messy impressions.",
  },
  {
    title: "Evenings and Sundays",
    text: "Open until 8:00 pm six days a week and on Sunday mornings, with same-day slots for tooth pain.",
  },
] as const;

export const SAFETY_STEPS = [
  {
    title: "Clean",
    text: "Instruments are scrubbed and ultrasonically cleaned to remove every trace of debris.",
  },
  { title: "Seal", text: "Each set is packed in a dated, sealed pouch with a colour indicator." },
  {
    title: "Sterilise",
    text: "A Class B vacuum autoclave sterilises them, the standard used in hospitals.",
  },
  {
    title: "Open in front of you",
    text: "Your pouch is opened at the chair, so you can see it is fresh.",
  },
] as const;

export const SAFETY_EXTRAS = [
  "Single-use needles, gloves, masks, suction tips, cups and bibs",
  "Surfaces disinfected between every patient",
  "Water lines flushed and treated daily",
  "Air purifiers in every treatment room",
  "A log of every sterilisation cycle, checked weekly",
] as const;

export type Technology = { name: string; text: string };

export const TECHNOLOGY: Technology[] = [
  {
    name: "Intraoral scanner",
    text: "A small wand takes a 3D scan of your teeth in minutes, for crowns, aligners and implants. No gagging on impression trays.",
  },
  {
    name: "Digital X-rays (RVG)",
    text: "Images appear on screen in seconds, with far less radiation than film.",
  },
  {
    name: "OPG and 3D CBCT",
    text: "Full mouth X-rays in the studio, and 3D scans for implants and wisdom teeth through a partner imaging centre two minutes away.",
  },
  {
    name: "Rotary endodontics",
    text: "Flexible motor-driven files and an apex locator for faster, more precise root canals.",
  },
  {
    name: "Operating microscope",
    text: "Magnification that helps find hidden canals and fine cracks.",
  },
  {
    name: "Soft-tissue laser",
    text: "For gum contouring and some gum treatments, often with less bleeding.",
  },
  {
    name: "Intraoral camera",
    text: "You see exactly what the dentist sees, on the screen in front of you.",
  },
];

export type StudioPhoto = { src: StaticImageData; alt: string; caption: string };

export const STUDIO_PHOTOS: StudioPhoto[] = [
  {
    src: sterilisation,
    alt: "The sterilisation room with an autoclave and sealed instrument pouches",
    caption: "The sterilisation room",
  },
  {
    src: digitalScan,
    alt: "A dentist scanning a patient's teeth with an intraoral scanner",
    caption: "3D scans instead of impressions",
  },
  {
    src: consultation,
    alt: "A dentist showing a patient an X-ray on a screen",
    caption: "Every plan explained on screen",
  },
];

export const FIRST_VISIT_STEPS = [
  {
    title: "Book in a minute",
    text: "Online, on WhatsApp or by phone. Tell us if anything hurts and we will see you sooner.",
  },
  {
    title: "A quick welcome",
    text: "Arrive ten minutes early for a short health form and a cup of tea in the lounge.",
  },
  {
    title: "Talk, then check-up",
    text: "Your dentist listens first, then checks every tooth with an intraoral camera you can watch.",
  },
  {
    title: "X-rays only if needed",
    text: "Low-dose digital X-rays, taken only when they help a decision.",
  },
  {
    title: "Your written plan",
    text: "Options, timelines and costs in writing. Take it home, think it over, ask questions on WhatsApp.",
  },
] as const;

export const FIRST_VISIT_BRING = [
  "Old X-rays, reports or treatment records, if you have them",
  "A list of medicines you take, and any allergies",
  "Your insurance or corporate health card, if you plan to claim",
  "Your reading glasses, if you need them for forms",
] as const;

export const EMERGENCY_SIGNS = [
  "Severe or throbbing toothache",
  "Swelling of the face or gums",
  "A knocked-out or broken tooth",
  "Bleeding that will not stop",
  "A lost crown or filling with pain",
  "A painful wisdom tooth",
] as const;

export const EMERGENCY_FIRST_AID = [
  {
    title: "Knocked-out adult tooth",
    text: "Hold it by the crown, not the root. Rinse it gently in milk without scrubbing and try to put it back in its socket. If you cannot, keep it in milk and come in within the hour.",
  },
  {
    title: "Broken or chipped tooth",
    text: "Rinse with warm water, save any pieces and press gauze on any bleeding. A cold compress on the cheek helps with swelling.",
  },
  {
    title: "Toothache",
    text: "Rinse with warm salt water and floss gently to remove trapped food. Do not put aspirin or clove oil directly on the gum. A painkiller you normally take can help until you are seen.",
  },
  {
    title: "Swelling",
    text: "Hold a cold compress on the outside of the cheek and do not apply heat. If swelling spreads towards the eye or neck, or makes breathing or swallowing difficult, go to a hospital emergency department straight away.",
  },
] as const;

/** Concerns for the "What brings you in?" picker on the home page. */
export const CONCERNS = [
  { label: "Tooth pain", href: "/dental-clinic/emergency", hint: "Same-day slots" },
  {
    label: "Bleeding gums",
    href: "/dental-clinic/treatments/check-up-and-cleaning",
    hint: "Cleaning and gum care",
  },
  {
    label: "Missing tooth",
    href: "/dental-clinic/treatments/dental-implants",
    hint: "Implants and bridges",
  },
  {
    label: "Crooked teeth",
    href: "/dental-clinic/treatments/braces-and-aligners",
    hint: "Braces and aligners",
  },
  { label: "Stained teeth", href: "/dental-clinic/treatments/teeth-whitening", hint: "Whitening" },
  {
    label: "Chipped teeth",
    href: "/dental-clinic/treatments/smile-makeover",
    hint: "Bonding and veneers",
  },
  {
    label: "My child's teeth",
    href: "/dental-clinic/treatments/kids-dentistry",
    hint: "Children's dentistry",
  },
  {
    label: "Just a check-up",
    href: "/dental-clinic/treatments/check-up-and-cleaning",
    hint: "Check-up and cleaning",
  },
] as const;
