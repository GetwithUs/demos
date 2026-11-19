/** Made-up patient reviews. Names and stories are fictional. */
export type Review = {
  id: string;
  name: string;
  area: string;
  rating: 4 | 5;
  date: string;
  treatment: string;
  /** Matches a treatment slug when the review is about one, for filtering. */
  slug?: string;
  title: string;
  text: string;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Neha Bisht",
    area: "Vasant Vihar",
    rating: 5,
    date: "October 2026",
    treatment: "Root canal",
    slug: "root-canal-treatment",
    title: "I was dreading it for nothing",
    text: "I had put off my root canal for months because of horror stories. Dr. Sana explained every step, stopped when I raised my hand and it was done in one sitting. Honestly less uncomfortable than my last filling elsewhere.",
  },
  {
    id: "r2",
    name: "Arjun Mehra",
    area: "Jakhan",
    rating: 5,
    date: "September 2026",
    treatment: "Clear aligners",
    slug: "braces-and-aligners",
    title: "Nobody at work noticed",
    text: "Fourteen months of aligners with Dr. Kunal. He showed me the 3D preview before I paid anything and the final result is very close to it. The monthly instalments made it manageable.",
  },
  {
    id: "r3",
    name: "Kavita Joshi",
    area: "Dalanwala",
    rating: 5,
    date: "October 2026",
    treatment: "Child's check-up",
    slug: "kids-dentistry",
    title: "My son now asks when the next visit is",
    text: "Our five-year-old screamed at his last dentist. Dr. Rohan spent the first visit just letting him press buttons and count teeth. Two visits later he had two fillings done without a tear.",
  },
  {
    id: "r4",
    name: "Col. R. S. Kandari (retd.)",
    area: "Rajpur",
    rating: 5,
    date: "August 2026",
    treatment: "Dental implants",
    slug: "dental-implants",
    title: "Clear estimate, no surprises",
    text: "Dr. Aditi gave me a written estimate with two implant options and the final bill matched it to the rupee. I can finally chew on both sides again at 71.",
  },
  {
    id: "r5",
    name: "Simran Kaur",
    area: "Race Course",
    rating: 5,
    date: "November 2026",
    treatment: "Teeth whitening",
    slug: "teeth-whitening",
    title: "Lovely before my sister's wedding",
    text: "Did the in-studio whitening two weeks before the wedding. Slight sensitivity for a day, which they had warned me about. The lounge is so calm it did not feel like a clinic at all.",
  },
  {
    id: "r6",
    name: "Rahul Chauhan",
    area: "Ballupur",
    rating: 5,
    date: "July 2026",
    treatment: "Emergency visit",
    title: "Seen within two hours on a Sunday",
    text: "Cracked a tooth on a Sunday morning. Messaged on WhatsApp, got a slot at 12:30 and Dr. Sana had me out of pain by lunch. Very grateful.",
  },
  {
    id: "r7",
    name: "Priya Thapa",
    area: "Clement Town",
    rating: 5,
    date: "September 2026",
    treatment: "Smile makeover",
    slug: "smile-makeover",
    title: "Looks like my teeth, only better",
    text: "Six composite veneers for my chipped front teeth. I was scared it would look fake, but the mock-up let me see it first and we changed the shape twice. Worth every rupee.",
  },
  {
    id: "r8",
    name: "Manish Agarwal",
    area: "Nehru Colony",
    rating: 4,
    date: "June 2026",
    treatment: "Wisdom tooth",
    slug: "wisdom-tooth-removal",
    title: "Smooth surgery, a bit of a wait",
    text: "Had to wait about 20 minutes past my slot because an emergency came in, and they told me why. The surgery itself was quick and the swelling was gone in three days, exactly as Dr. Vikram said.",
  },
  {
    id: "r9",
    name: "Ananya Rawat",
    area: "Sahastradhara Road",
    rating: 5,
    date: "October 2026",
    treatment: "Check-up and cleaning",
    slug: "check-up-and-cleaning",
    title: "Most thorough check-up I have had",
    text: "They showed me my own teeth on the intraoral camera, which was a bit humbling. No pressure to do anything that was not needed, just a clean and a plan for one small filling.",
  },
  {
    id: "r10",
    name: "Deepak Semwal",
    area: "Prem Nagar",
    rating: 5,
    date: "August 2026",
    treatment: "Crown",
    slug: "crowns-and-bridges",
    title: "Crown fits perfectly",
    text: "Zirconia crown after my root canal. The digital scan meant no gooey impression, and the crown felt right the moment it went in. Spotless clinic and they open the instrument pouches in front of you.",
  },
  {
    id: "r11",
    name: "Fatima Siddiqui",
    area: "GMS Road",
    rating: 5,
    date: "September 2026",
    treatment: "Fillings",
    slug: "fillings",
    title: "Gentle and quick",
    text: "Two small fillings, no injection needed for one of them. In and out in 40 minutes, on time to the minute. The reminder on WhatsApp the day before was handy.",
  },
  {
    id: "r12",
    name: "Gaurav Negi",
    area: "Mussoorie",
    rating: 5,
    date: "July 2026",
    treatment: "Braces",
    slug: "braces-and-aligners",
    title: "Worth the drive down from Mussoorie",
    text: "My daughter's braces came off last month after 18 months. Appointments were always on time, which matters when you drive 35 km each way. Dr. Kunal is patient with teenagers.",
  },
];

export const RATING_BREAKDOWN = [
  { stars: 5, share: 92 },
  { stars: 4, share: 6 },
  { stars: 3, share: 1 },
  { stars: 2, share: 1 },
  { stars: 1, share: 0 },
] as const;
