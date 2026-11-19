import type { Faq } from "@/sites/dental-clinic/content/treatments";

export type FaqGroup = { id: string; title: string; items: Faq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "visits",
    title: "Appointments and visits",
    items: [
      {
        q: "Do I need an appointment, or can I walk in?",
        a: "Appointments are best, so you are not kept waiting. We keep a few slots free every day for walk-ins and tooth pain, and on Sundays we see pre-booked patients and emergencies only.",
      },
      {
        q: "Are you open on Sundays?",
        a: "Yes, from 10:00 am to 2:00 pm, for pre-booked visits and emergencies. Monday to Saturday we are open from 10:00 am to 8:00 pm.",
      },
      {
        q: "What happens at my first visit?",
        a: "A relaxed conversation, a full check-up with an intraoral camera, X-rays only if needed, and a written plan with costs. It takes about 30 to 45 minutes. You are never asked to start treatment the same day unless you want to.",
      },
      {
        q: "What should I bring?",
        a: "Any old X-rays or reports, a list of medicines you take, and your insurance details if you plan to claim. Please arrive ten minutes early for a first visit.",
      },
      {
        q: "Can I choose my dentist?",
        a: "Yes. You can pick a dentist when you book, or let us match you with the right specialist for what you need.",
      },
    ],
  },
  {
    id: "costs",
    title: "Costs, EMI and insurance",
    items: [
      {
        q: "How much does a consultation cost?",
        a: "The consultation is ₹500. If you start any treatment on the same day, it is adjusted in the treatment cost.",
      },
      {
        q: "Why is the final price confirmed only after a check-up?",
        a: "The same treatment can need different work in different mouths. A root canal on a molar with curved canals takes longer than on a front tooth, for example. The prices on this site are starting prices, and you always get a written estimate before we begin.",
      },
      {
        q: "Do you offer EMI?",
        a: "Yes. No-cost EMI from 3 to 12 months is available on treatments above ₹10,000, such as implants, braces, aligners and smile makeovers, through our lending partner, subject to approval. Card EMI from your bank also works.",
      },
      {
        q: "Does my health insurance cover dental treatment?",
        a: "Most Indian health insurance policies cover dental treatment only after an accident or when hospitalisation is needed. Some corporate and premium plans include a small outpatient dental benefit. We do not offer cashless dental treatment, but we give you itemised bills, prescriptions and X-rays for reimbursement.",
      },
      {
        q: "Which payment methods do you accept?",
        a: "UPI, all major debit and credit cards, net banking and cash.",
      },
    ],
  },
  {
    id: "treatments",
    title: "Treatments",
    items: [
      {
        q: "Is root canal treatment painful?",
        a: "The tooth is fully numbed first, so most people feel pressure rather than pain. The infection is what hurts, and treatment relieves it. Mild tenderness for a few days afterwards is normal.",
      },
      {
        q: "Does scaling damage enamel or loosen teeth?",
        a: "No. Scaling removes tartar, not tooth. Teeth can feel slightly sensitive for a day or two, and gaps hidden by tartar may become visible until the gums heal.",
      },
      {
        q: "Aligners or braces: which is better?",
        a: "It depends on your teeth and your routine. Aligners are nearly invisible and removable but must be worn 20 to 22 hours a day. Braces handle complex cases and need no discipline about wear time. Our orthodontist will advise honestly.",
      },
      {
        q: "Can people with diabetes get implants?",
        a: "Often yes, when blood sugar is well controlled. We check your recent reports and plan with your physician where needed.",
      },
      {
        q: "Does whitening cause sensitivity?",
        a: "Some people feel mild sensitivity for a day or two. It fades on its own, and we can use a gentler gel or desensitising treatment if your teeth are naturally sensitive.",
      },
    ],
  },
  {
    id: "safety",
    title: "Safety and hygiene",
    items: [
      {
        q: "How do you sterilise instruments?",
        a: "Instruments are cleaned, sealed in pouches and sterilised in a Class B autoclave, the hospital-grade standard. Pouches are opened in front of you. Needles, gloves, suction tips and cups are single use.",
      },
      {
        q: "Are dental X-rays safe?",
        a: "Our digital X-rays use a very small dose, far lower than older film X-rays, and we take them only when they help a decision. Tell us if you are pregnant.",
      },
      {
        q: "Can I have dental treatment during pregnancy?",
        a: "Check-ups, cleanings and urgent treatment are generally safe, ideally in the second trimester. We plan around your pregnancy and avoid elective X-rays and cosmetic treatment until after.",
      },
    ],
  },
  {
    id: "children",
    title: "Children",
    items: [
      {
        q: "When should my child first see a dentist?",
        a: "By the first birthday, or within six months of the first tooth. Early visits are short and mostly about getting comfortable.",
      },
      {
        q: "Can I stay with my child during treatment?",
        a: "Yes. Parents are welcome in the room, and for little ones, sitting on your lap is often the easiest way to start.",
      },
    ],
  },
  {
    id: "emergencies",
    title: "Emergencies",
    items: [
      {
        q: "What counts as a dental emergency?",
        a: "Severe toothache, swelling in the face or gums, a knocked-out or broken tooth, bleeding that does not stop, or a lost crown with pain. Call or WhatsApp us and we will find you a same-day slot.",
      },
      {
        q: "What if it happens after hours?",
        a: "Registered patients can message the after-hours line for advice. If you have swelling that affects breathing or swallowing, or a jaw injury, go to the nearest hospital emergency department straight away.",
      },
    ],
  },
];

/** A short set for the home page. */
export const HOME_FAQS: Faq[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[1].items[2],
  FAQ_GROUPS[1].items[3],
  FAQ_GROUPS[2].items[0],
  FAQ_GROUPS[3].items[0],
];
