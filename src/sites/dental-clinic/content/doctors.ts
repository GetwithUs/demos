import type { StaticImageData } from "next/image";
import aditi from "@/sites/dental-clinic/images/doctor-aditi.jpg";
import kunal from "@/sites/dental-clinic/images/doctor-kunal.jpg";
import rohan from "@/sites/dental-clinic/images/doctor-rohan.jpg";
import sana from "@/sites/dental-clinic/images/doctor-sana.jpg";

export type DoctorId =
  "aditi-rawat" | "kunal-bhandari" | "sana-qureshi" | "rohan-negi" | "vikram-thapliyal";

export type Doctor = {
  id: DoctorId;
  name: string;
  role: string;
  qualifications: string;
  specialty: string;
  experienceYears: number;
  photo?: StaticImageData;
  initials: string;
  short: string;
  bio: string[];
  focus: string[];
  education: string[];
  languages: string[];
  /** Days in the studio, 0 is Sunday. */
  days: number[];
  visiting?: boolean;
};

export const DOCTORS: Doctor[] = [
  {
    id: "aditi-rawat",
    name: "Dr. Aditi Rawat",
    role: "Founder and lead prosthodontist",
    qualifications: "BDS, MDS (Prosthodontics and Crown and Bridge)",
    specialty: "Implants, crowns and smile makeovers",
    experienceYears: 15,
    photo: aditi,
    initials: "AR",
    short:
      "Plans every implant and smile makeover in the studio, and still takes the first consultation for most of them herself.",
    bio: [
      "Dr. Aditi grew up in Dehradun, trained in prosthodontics and spent six years in a busy implant practice before coming home to open Ivorine in 2013.",
      "She is known for long, unhurried consultations, for showing patients their scans on screen and for writing down every option with its cost before anything starts.",
    ],
    focus: [
      "Dental implants",
      "Crowns, bridges and veneers",
      "Full-mouth rehabilitation",
      "Dentures",
    ],
    education: [
      "MDS, Prosthodontics and Crown and Bridge",
      "BDS",
      "Fellowship in Oral Implantology",
    ],
    languages: ["English", "Hindi", "Garhwali"],
    days: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "kunal-bhandari",
    name: "Dr. Kunal Bhandari",
    role: "Orthodontist",
    qualifications: "BDS, MDS (Orthodontics and Dentofacial Orthopaedics)",
    specialty: "Braces and clear aligners",
    experienceYears: 11,
    photo: kunal,
    initials: "KB",
    short:
      "Straightens teeth for children, teenagers and adults, with metal, ceramic and self-ligating braces or clear aligners.",
    bio: [
      "Dr. Kunal has treated more than 1,200 orthodontic cases, from early growth guidance in children to aligners for working adults who would rather nobody noticed.",
      "He shows every patient a digital preview of their likely result before they decide, and is honest when aligners are not the best fit.",
    ],
    focus: [
      "Clear aligners",
      "Metal and ceramic braces",
      "Early orthodontics for children",
      "Retainers",
    ],
    education: [
      "MDS, Orthodontics and Dentofacial Orthopaedics",
      "BDS",
      "Certified clear aligner provider",
    ],
    languages: ["English", "Hindi", "Punjabi"],
    days: [1, 3, 5, 6],
  },
  {
    id: "sana-qureshi",
    name: "Dr. Sana Qureshi",
    role: "Endodontist",
    qualifications: "BDS, MDS (Conservative Dentistry and Endodontics)",
    specialty: "Root canals and tooth-saving treatment",
    experienceYears: 9,
    photo: sana,
    initials: "SQ",
    short:
      "Does the studio's root canals and re-treatments with rotary instruments and an operating microscope, often in one sitting.",
    bio: [
      "Dr. Sana's work is about keeping your own teeth. She handles root canals, re-treatments of older root canals and cracked teeth that others have suggested removing.",
      "Patients often tell us she is the reason they stopped dreading the dentist. She explains each step as she goes and stops whenever you raise a hand.",
    ],
    focus: [
      "Single-sitting root canals",
      "Root canal re-treatment",
      "Tooth-coloured fillings",
      "Cracked teeth",
    ],
    education: [
      "MDS, Conservative Dentistry and Endodontics",
      "BDS",
      "Course in microscope endodontics",
    ],
    languages: ["English", "Hindi", "Urdu"],
    days: [1, 2, 3, 4, 5, 6, 0],
  },
  {
    id: "rohan-negi",
    name: "Dr. Rohan Negi",
    role: "Paediatric dentist",
    qualifications: "BDS, MDS (Paediatric and Preventive Dentistry)",
    specialty: "Children's dentistry",
    experienceYears: 7,
    photo: rohan,
    initials: "RN",
    short:
      "Sees children from their first tooth to their teens, with a tell-show-do approach and plenty of patience.",
    bio: [
      "Dr. Rohan believes a child's first visits decide how they feel about dentists for life, so the early appointments are mostly about trust: a ride in the chair, counting teeth, a sticker.",
      "He also looks after preventive care for the whole family, from sealants and fluoride to cleanings for parents.",
    ],
    focus: [
      "First dental visits",
      "Fluoride and sealants",
      "Treating milk teeth",
      "Habit counselling",
    ],
    education: ["MDS, Paediatric and Preventive Dentistry", "BDS"],
    languages: ["English", "Hindi", "Garhwali"],
    days: [2, 4, 6, 0],
  },
  {
    id: "vikram-thapliyal",
    name: "Dr. Vikram Thapliyal",
    role: "Visiting oral and maxillofacial surgeon",
    qualifications: "BDS, MDS (Oral and Maxillofacial Surgery)",
    specialty: "Wisdom teeth and oral surgery",
    experienceYears: 16,
    initials: "VT",
    short:
      "Visits on Tuesdays and Fridays for wisdom tooth removal, complex extractions and bone grafting before implants.",
    bio: [
      "Dr. Vikram is a consultant oral surgeon who visits the studio twice a week for surgical cases that need a specialist's hands.",
    ],
    focus: ["Impacted wisdom teeth", "Surgical extractions", "Bone grafts", "Sinus lifts"],
    education: ["MDS, Oral and Maxillofacial Surgery", "BDS"],
    languages: ["English", "Hindi", "Garhwali"],
    days: [2, 5],
    visiting: true,
  },
];

export function getDoctor(id: DoctorId): Doctor {
  const doctor = DOCTORS.find((d) => d.id === id);
  if (!doctor) throw new Error(`Unknown doctor: ${id}`);
  return doctor;
}

export const RESIDENT_DOCTORS = DOCTORS.filter((d) => !d.visiting);
