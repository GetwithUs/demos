import type { StaticImageData } from "next/image";
import smileAligners from "@/sites/dental-clinic/images/smile-aligners.jpg";
import smileVeneers from "@/sites/dental-clinic/images/smile-veneers.jpg";
import smileWhitening from "@/sites/dental-clinic/images/smile-whitening.jpg";

/**
 * Before and after cases. Each pair uses one "after" photo; the "before" is the same photo with
 * a CSS filter, until real case photos (with patient consent) replace them.
 */
export type SmileCase = {
  id: string;
  title: string;
  treatment: string;
  slug: string;
  doctor: string;
  duration: string;
  story: string;
  photo: StaticImageData;
  /** A real "before" photo, when available. Without it the slider dulls the "after" photo. */
  before?: StaticImageData;
  alt: string;
};

export const SMILE_CASES: SmileCase[] = [
  {
    id: "whitening",
    title: "Tea stains lifted before a wedding",
    treatment: "In-studio whitening",
    slug: "teeth-whitening",
    doctor: "Dr. Aditi Rawat",
    duration: "1 visit, 75 minutes",
    story:
      "Years of strong chai had left an even yellow tint. One in-studio session and a week of take-home top-ups brightened her smile by several shades.",
    photo: smileWhitening,
    alt: "A smile with yellow tea stains before whitening and noticeably brighter teeth after",
  },
  {
    id: "aligners",
    title: "Crowding straightened with aligners",
    treatment: "Clear aligners",
    slug: "braces-and-aligners",
    doctor: "Dr. Kunal Bhandari",
    duration: "14 months",
    story:
      "Overlapping lower front teeth that trapped food. Twenty-eight sets of clear aligners, worn through two job changes, without anyone noticing.",
    photo: smileAligners,
    alt: "Crowded front teeth before clear aligners and an even, straight smile after",
  },
  {
    id: "veneers",
    title: "Chipped front teeth rebuilt",
    treatment: "Six composite veneers",
    slug: "smile-makeover",
    doctor: "Dr. Aditi Rawat",
    duration: "3 visits over 2 weeks",
    story:
      "A fall from a scooter years ago left two chipped front teeth. A digital mock-up, then six composite veneers matched to the natural shade.",
    photo: smileVeneers,
    alt: "Chipped and uneven front teeth before veneers and a natural, even smile after",
  },
];
