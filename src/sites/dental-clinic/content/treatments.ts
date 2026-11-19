import type { StaticImageData } from "next/image";
import type { DoctorId } from "@/sites/dental-clinic/content/doctors";
import consultation from "@/sites/dental-clinic/images/consultation.jpg";
import digitalScan from "@/sites/dental-clinic/images/digital-scan.jpg";
import kids from "@/sites/dental-clinic/images/kids.jpg";
import smileAligners from "@/sites/dental-clinic/images/smile-aligners.jpg";
import smileVeneers from "@/sites/dental-clinic/images/smile-veneers.jpg";
import smileWhitening from "@/sites/dental-clinic/images/smile-whitening.jpg";
import studioRoom from "@/sites/dental-clinic/images/studio-room.jpg";

export type ToothIconName =
  | "checkup"
  | "filling"
  | "root-canal"
  | "braces"
  | "implant"
  | "crown"
  | "whitening"
  | "veneers"
  | "kids"
  | "wisdom"
  | "emergency";

export type TreatmentCategory =
  "Prevent" | "Repair" | "Replace" | "Straighten" | "Brighten" | "Children" | "Surgery";

export type Faq = { q: string; a: string };

export type Treatment = {
  slug: string;
  name: string;
  /** Shorter name for chips, the booking flow and the chat assistant. */
  shortName: string;
  category: TreatmentCategory;
  icon: ToothIconName;
  /** One line for cards. */
  summary: string;
  /** Opening paragraph on the treatment page. */
  lead: string;
  priceFrom: number;
  priceUnit: string;
  priceOptions: { label: string; from: number; note?: string }[];
  /** Length of one visit. */
  duration: string;
  sittings: string;
  recovery: string;
  whatItIs: string[];
  whoNeedsIt: string[];
  steps: { title: string; text: string }[];
  aftercare: string[];
  faqs: Faq[];
  related: string[];
  doctors: DoctorId[];
  image: StaticImageData;
  imageAlt: string;
  emi: boolean;
  /** Minutes the booking flow reserves for a first appointment. */
  bookingMinutes: number;
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "check-up-and-cleaning",
    name: "Check-up and cleaning",
    shortName: "Check-up and cleaning",
    category: "Prevent",
    icon: "checkup",
    summary: "A thorough exam, digital X-rays if needed, and a gentle scale and polish.",
    lead: "Most dental problems are cheaper, quicker and more comfortable to fix when they are small. A check-up every six months and a professional clean keep them small.",
    priceFrom: 500,
    priceUnit: "consultation",
    priceOptions: [
      {
        label: "Consultation and check-up",
        from: 500,
        note: "Adjusted in treatment started the same day",
      },
      { label: "Digital X-ray (RVG), per film", from: 300 },
      { label: "Scaling and polishing, full mouth", from: 1500 },
      { label: "Air polishing for tea, coffee and tobacco stains", from: 2500 },
      { label: "Deep cleaning for gum disease, full mouth", from: 4000 },
    ],
    duration: "30 to 60 minutes",
    sittings: "1 sitting",
    recovery: "Back to normal straight away",
    whatItIs: [
      "Your dentist checks every tooth, your gums, your bite and the soft tissues of your mouth, and takes low-dose digital X-rays only where they are needed.",
      "A hygienist then removes hardened deposits (tartar or calculus) with an ultrasonic scaler and polishes away surface stains. Tartar cannot be brushed off at home, and it is the main cause of bleeding gums and bad breath.",
    ],
    whoNeedsIt: [
      "Everyone, every six months, even when nothing hurts",
      "Gums that bleed when you brush or floss",
      "Bad breath that does not go away",
      "Tea, coffee, paan or smoking stains",
      "Before pregnancy, surgery or a long trip abroad",
    ],
    steps: [
      {
        title: "Chat and history",
        text: "We ask about your health, medicines and anything that is bothering you.",
      },
      {
        title: "Examination",
        text: "A full check with an intraoral camera, so you see what we see on the screen.",
      },
      {
        title: "X-rays if needed",
        text: "Digital X-rays use far less radiation than film and show results in seconds.",
      },
      {
        title: "Scale and polish",
        text: "Ultrasonic cleaning followed by a polish. Numbing gel is available if your gums are sensitive.",
      },
      {
        title: "Your plan",
        text: "A written summary of what is healthy, what to watch and what needs treatment, with costs.",
      },
    ],
    aftercare: [
      "Mild sensitivity for a day or two is normal after scaling",
      "Avoid tea, coffee and turmeric-heavy food for a few hours after polishing",
      "Brush twice a day with a soft brush and clean between teeth daily",
    ],
    faqs: [
      {
        q: "Does scaling weaken teeth or create gaps?",
        a: "No. Scaling removes tartar, not tooth. Sometimes tartar was filling the space between teeth and swollen gums, so the gaps you notice afterwards were already there. As the gums heal they tighten again.",
      },
      {
        q: "How often should I get my teeth cleaned?",
        a: "Every six months suits most people. If you have gum disease, diabetes or braces, we may suggest every three to four months.",
      },
      {
        q: "Is the consultation fee charged again if I start treatment?",
        a: "If you start any treatment on the same day, the consultation fee is adjusted in the treatment cost.",
      },
    ],
    related: ["fillings", "teeth-whitening", "kids-dentistry"],
    doctors: ["rohan-negi", "sana-qureshi"],
    image: studioRoom,
    imageAlt: "A bright treatment room at Ivorine Dental Studio with a modern dental chair",
    emi: false,
    bookingMinutes: 45,
  },
  {
    slug: "fillings",
    name: "Tooth-coloured fillings",
    shortName: "Filling",
    category: "Repair",
    icon: "filling",
    summary: "Cavities repaired with composite that matches your tooth, usually in one visit.",
    lead: "A cavity caught early is a small, quick fix. We use tooth-coloured composite that bonds to the tooth, so we remove less healthy tooth and the filling blends in.",
    priceFrom: 1500,
    priceUnit: "per tooth",
    priceOptions: [
      { label: "Glass ionomer filling (often for children)", from: 900 },
      { label: "Composite filling, small", from: 1500 },
      { label: "Composite filling, large or two surfaces", from: 2500 },
      { label: "Ceramic inlay or onlay", from: 9000, note: "For large cavities in back teeth" },
    ],
    duration: "30 to 45 minutes per tooth",
    sittings: "1 sitting",
    recovery: "Eat normally once the numbness wears off",
    whatItIs: [
      "We gently clean out the decayed part of the tooth, then build it back with layers of composite resin that are hardened with a blue light.",
      "The colour is matched to your tooth and the filling is shaped and polished so your bite feels natural.",
    ],
    whoNeedsIt: [
      "A cavity found at your check-up or on an X-ray",
      "A tooth that is sensitive to sweets or cold",
      "Food getting stuck in the same spot",
      "An old silver filling that is cracked or leaking",
      "Chipped or worn front teeth",
    ],
    steps: [
      { title: "Check and X-ray", text: "We confirm how deep the cavity goes before starting." },
      {
        title: "Numbing if needed",
        text: "Many small fillings need no injection. For deeper ones we use numbing gel first, so you barely feel it.",
      },
      {
        title: "Clean and bond",
        text: "The decay is removed and the tooth is prepared so the filling bonds firmly.",
      },
      {
        title: "Layer and shape",
        text: "Composite is placed in thin layers, set with light, then shaped to your bite and polished.",
      },
    ],
    aftercare: [
      "Wait until numbness wears off before eating, so you do not bite your cheek",
      "Slight sensitivity to cold for a few days is common",
      "Tell us if your bite feels high after a day; a quick adjustment fixes it",
    ],
    faqs: [
      {
        q: "How long do composite fillings last?",
        a: "Usually many years, often seven to ten or more, depending on the size of the filling, your bite and how well the area is cleaned.",
      },
      {
        q: "Should I replace my old silver fillings?",
        a: "Only if they are cracked, leaking or decayed underneath. We will not replace a healthy filling just for looks unless you want it changed.",
      },
      {
        q: "Will a filling stop my toothache?",
        a: "If the pain is from a shallow or medium cavity, yes. If decay has reached the nerve, the tooth may need a root canal instead. The X-ray tells us which.",
      },
    ],
    related: ["root-canal-treatment", "check-up-and-cleaning", "crowns-and-bridges"],
    doctors: ["sana-qureshi", "rohan-negi"],
    image: consultation,
    imageAlt: "A dentist showing a patient her X-ray on a screen",
    emi: false,
    bookingMinutes: 45,
  },
  {
    slug: "root-canal-treatment",
    name: "Root canal treatment",
    shortName: "Root canal",
    category: "Repair",
    icon: "root-canal",
    summary: "Save an infected or painful tooth, often in a single comfortable sitting.",
    lead: "A root canal removes infection from inside the tooth and seals it, so you keep your own tooth instead of losing it. With modern numbing and rotary instruments it feels much like a long filling.",
    priceFrom: 4500,
    priceUnit: "per tooth, front teeth",
    priceOptions: [
      { label: "Front tooth", from: 4500 },
      { label: "Premolar", from: 5500 },
      { label: "Molar (back tooth)", from: 6500 },
      { label: "Re-treatment of an old root canal", from: 9000 },
      { label: "Crown after root canal", from: 5500, note: "Charged separately, see crowns" },
    ],
    duration: "60 to 90 minutes",
    sittings: "1 to 2 sittings, plus a visit for the crown",
    recovery: "Mild tenderness for two or three days",
    whatItIs: [
      "Inside every tooth is soft tissue called the pulp. When deep decay, a crack or an injury lets bacteria reach it, it becomes inflamed or infected and can cause severe pain or an abscess.",
      "We clean and shape the tiny canals with flexible rotary files, disinfect them and seal them. Most back teeth then need a crown to protect them from breaking.",
    ],
    whoNeedsIt: [
      "Toothache that throbs, wakes you at night or lingers after hot or cold",
      "Pain when biting down on one tooth",
      "A swelling or a pimple on the gum near a tooth",
      "A tooth that has darkened after an injury",
      "Deep decay seen on an X-ray, even without pain",
    ],
    steps: [
      {
        title: "Diagnosis",
        text: "A digital X-ray and simple tests tell us whether the nerve can be saved or needs treatment.",
      },
      {
        title: "Comfortable numbing",
        text: "Numbing gel first, then a slow injection. We wait until the tooth is fully numb.",
      },
      {
        title: "Clean and shape",
        text: "A rubber sheet isolates the tooth while rotary files clean the canals, guided by an apex locator.",
      },
      {
        title: "Disinfect and seal",
        text: "The canals are rinsed, dried and sealed. Badly infected teeth may need a second sitting.",
      },
      {
        title: "Protect",
        text: "A filling closes the tooth. For most back teeth we place a crown a week or two later.",
      },
    ],
    aftercare: [
      "Take the painkiller we suggest for the first day or two if you need it",
      "Avoid chewing hard food on the tooth until the crown is fitted",
      "Keep the crown appointment: an uncrowned back tooth can crack",
    ],
    faqs: [
      {
        q: "Is a root canal painful?",
        a: "The treatment is done with the tooth fully numb, so most patients feel pressure rather than pain. It is the infection that hurts, and the treatment relieves it. Some tenderness for a few days afterwards is normal.",
      },
      {
        q: "Can it really be done in one sitting?",
        a: "Many teeth can, especially when there is no large abscess. Badly infected teeth sometimes do better with medicine placed inside for a week between two sittings. We will tell you which applies to you.",
      },
      {
        q: "Why do I need a crown afterwards?",
        a: "A root-treated back tooth is more brittle. A crown holds it together so it does not split when you chew. Front teeth often do not need one.",
      },
      {
        q: "Is it better to just remove the tooth?",
        a: "Removing it is cheaper today, but replacing it later with an implant or bridge costs more, and neighbouring teeth can drift. Saving your own tooth is usually the better choice when it can be saved.",
      },
    ],
    related: ["crowns-and-bridges", "fillings", "dental-implants"],
    doctors: ["sana-qureshi"],
    image: digitalScan,
    imageAlt: "A dentist reviewing a digital scan of a tooth on a monitor",
    emi: true,
    bookingMinutes: 60,
  },
  {
    slug: "braces-and-aligners",
    name: "Braces and clear aligners",
    shortName: "Braces or aligners",
    category: "Straighten",
    icon: "braces",
    summary: "Metal, ceramic or near-invisible aligners, planned by a specialist orthodontist.",
    lead: "Straighter teeth are easier to clean and can make you smile more freely. Our orthodontist will tell you honestly whether braces or aligners suit your teeth, your budget and your routine.",
    priceFrom: 30000,
    priceUnit: "full treatment, metal braces",
    priceOptions: [
      { label: "Metal braces", from: 30000 },
      { label: "Ceramic (tooth-coloured) braces", from: 45000 },
      { label: "Self-ligating braces", from: 55000 },
      { label: "Clear aligners, mild cases", from: 65000 },
      { label: "Clear aligners, moderate to complex", from: 1_20_000 },
      { label: "Retainers after treatment, pair", from: 5000 },
    ],
    duration: "60 minutes for records, then 20 to 30 minute check-ins",
    sittings: "Usually 12 to 24 months, visits every 4 to 8 weeks",
    recovery: "Some soreness for a few days after each adjustment",
    whatItIs: [
      "Braces use small brackets and a wire to move teeth gradually. Aligners are a series of clear, removable trays, each one moving the teeth a little, changed every one to two weeks.",
      "Both work well for most people. Aligners are nearly invisible and come out for meals, but only work if worn 20 to 22 hours a day. Braces suit complex cases and people who would rather not have to remember.",
    ],
    whoNeedsIt: [
      "Crowded, crooked or overlapping teeth",
      "Gaps between teeth",
      "An overbite, underbite or crossbite",
      "Teeth that have shifted after earlier braces",
      "Children from about age 7, for an early growth check",
    ],
    steps: [
      {
        title: "Orthodontic consultation",
        text: "An exam and discussion of what you would like to change, with an honest view of what is possible.",
      },
      {
        title: "Records and 3D scan",
        text: "Photos, X-rays and a digital scan instead of messy impressions.",
      },
      {
        title: "Your digital plan",
        text: "For aligners, you see a simulation of how your teeth could move, before you commit.",
      },
      {
        title: "Fitting",
        text: "Braces are bonded in one visit of about an hour. Aligners arrive in two to three weeks.",
      },
      {
        title: "Check-ins and retainers",
        text: "Regular short visits, then retainers to hold the result.",
      },
    ],
    aftercare: [
      "Clean around brackets carefully; we show you how and give you a starter kit",
      "With aligners, brush before putting trays back in",
      "Wear retainers as advised, or teeth tend to move back",
    ],
    faqs: [
      {
        q: "Am I too old for braces?",
        a: "No. Healthy teeth can be moved at any age, and a large share of our orthodontic patients are adults. Gum health matters more than age.",
      },
      {
        q: "Braces or aligners: which is better?",
        a: "Neither is better for everyone. Aligners are discreet and removable; braces handle complex movements and need no discipline about wear time. Dr. Kunal will recommend what suits your case.",
      },
      {
        q: "Will it hurt?",
        a: "Expect pressure and soreness for two or three days after braces are fitted or tightened, or when you start a new aligner. Soft food and a mild painkiller help.",
      },
      {
        q: "Can I pay in instalments?",
        a: "Yes. Orthodontic fees are split into a down payment and monthly instalments, and no-cost EMI is available on cards through our payment partner.",
      },
    ],
    related: ["teeth-whitening", "smile-makeover", "kids-dentistry"],
    doctors: ["kunal-bhandari"],
    image: smileAligners,
    imageAlt: "A close-up of a smile with straight teeth after clear aligner treatment",
    emi: true,
    bookingMinutes: 45,
  },
  {
    slug: "dental-implants",
    name: "Dental implants",
    shortName: "Implants",
    category: "Replace",
    icon: "implant",
    summary: "Replace missing teeth with fixed teeth that look, feel and chew like your own.",
    lead: "An implant is a small titanium post that takes the place of a lost root. Once it has bonded with the bone, a crown is fixed on top. Nothing to remove at night, and neighbouring teeth are left untouched.",
    priceFrom: 30000,
    priceUnit: "per tooth, implant with crown",
    priceOptions: [
      {
        label: "Single implant with crown, Korean system",
        from: 30000,
        note: "3D CBCT scan charged separately",
      },
      { label: "Single implant with crown, premium Swiss or German system", from: 48000 },
      { label: "Bone graft, if needed", from: 8000 },
      { label: "Implant-supported denture, per jaw", from: 1_20_000 },
      { label: "Full arch fixed teeth on 4 to 6 implants, per jaw", from: 2_50_000 },
    ],
    duration: "60 to 90 minutes for placement",
    sittings: "Usually 3 to 4 visits over 3 to 4 months",
    recovery: "Most people return to work the next day",
    whatItIs: [
      "The implant is placed into the jawbone under local anaesthetic. Over the next two to four months, the bone grows tightly around it.",
      "We then attach a custom crown, matched to your other teeth. Several implants can also hold a bridge or a full set of fixed teeth.",
    ],
    whoNeedsIt: [
      "One or more missing teeth",
      "A tooth that cannot be saved and is due for removal",
      "Loose dentures that make eating or speaking difficult",
      "People who do not want neighbouring teeth cut down for a bridge",
    ],
    steps: [
      {
        title: "Consultation and 3D scan",
        text: "A CBCT scan shows the height and width of bone, so the implant can be planned precisely.",
      },
      {
        title: "Written plan and estimate",
        text: "You get every option, from implant brands to bridges, with costs, before deciding.",
      },
      {
        title: "Implant placement",
        text: "A short procedure under local anaesthetic. Most patients say it was easier than an extraction.",
      },
      {
        title: "Healing",
        text: "Two to four months for the bone to bond. A temporary tooth can be fitted for front teeth.",
      },
      {
        title: "Your new crown",
        text: "A digital scan is taken and the final crown is fitted and adjusted to your bite.",
      },
    ],
    aftercare: [
      "Soft, cool food for the first two days",
      "Take medicines exactly as prescribed",
      "Brush and clean around implants like natural teeth, and keep your six-monthly check-ups",
    ],
    faqs: [
      {
        q: "How long do implants last?",
        a: "With good cleaning, regular check-ups and no smoking, implants can last for many years and often decades. The crown on top may need replacing after ten to fifteen years of wear.",
      },
      {
        q: "Am I too old for an implant?",
        a: "Age itself is rarely the issue. Bone volume, gum health and conditions such as uncontrolled diabetes matter more, and we check all of these before recommending an implant.",
      },
      {
        q: "Does it hurt?",
        a: "The area is fully numb during placement. Most people need only a simple painkiller for a day or two afterwards.",
      },
      {
        q: "Why do implant prices vary so much?",
        a: "Mainly the implant system, whether bone grafting is needed and the crown material. We give you a written estimate for each option so you can compare.",
      },
    ],
    related: ["crowns-and-bridges", "wisdom-tooth-removal", "root-canal-treatment"],
    doctors: ["aditi-rawat", "vikram-thapliyal"],
    image: digitalScan,
    imageAlt: "A dentist using an intraoral scanner, with a 3D tooth model on the screen",
    emi: true,
    bookingMinutes: 45,
  },
  {
    slug: "crowns-and-bridges",
    name: "Crowns and bridges",
    shortName: "Crown or bridge",
    category: "Repair",
    icon: "crown",
    summary: "Strong, natural-looking caps for weak teeth, and bridges to fill a gap.",
    lead: "A crown covers and protects a tooth that is broken, heavily filled or root-treated. A bridge uses the teeth on either side of a gap to hold a replacement tooth.",
    priceFrom: 5500,
    priceUnit: "per crown, metal-ceramic",
    priceOptions: [
      { label: "Metal-ceramic (PFM) crown", from: 5500 },
      { label: "Zirconia crown", from: 9500 },
      { label: "E-max (all-ceramic) crown, for front teeth", from: 14000 },
      {
        label: "Three-tooth bridge, metal-ceramic",
        from: 16500,
        note: "Zirconia and E-max bridges cost more",
      },
    ],
    duration: "60 minutes, then 30 minutes for fitting",
    sittings: "2 sittings, about 5 to 7 days apart",
    recovery: "Back to normal the same day",
    whatItIs: [
      "We shape the tooth, take a digital scan and fit a temporary crown. The final crown is made in a dental lab and cemented at the second visit.",
      "Zirconia is very strong and suits back teeth. E-max is the most lifelike for front teeth. Metal-ceramic is a reliable, economical choice.",
    ],
    whoNeedsIt: [
      "A tooth after root canal treatment",
      "A cracked, broken or badly worn tooth",
      "A tooth with a filling larger than the tooth left around it",
      "One or two missing teeth, when an implant is not an option",
    ],
    steps: [
      { title: "Prepare", text: "The tooth is numbed and shaped so the crown fits without bulk." },
      {
        title: "Digital scan and shade",
        text: "A quick 3D scan replaces most messy impressions, and we match the shade in daylight.",
      },
      {
        title: "Temporary crown",
        text: "You leave with a temporary crown so the tooth is protected and looks normal.",
      },
      {
        title: "Fit and adjust",
        text: "The final crown is checked for fit, colour and bite, then cemented.",
      },
    ],
    aftercare: [
      "Avoid sticky food on the temporary crown",
      "Clean under a bridge daily with a floss threader or water flosser",
      "Do not use your teeth to open bottles or packets",
    ],
    faqs: [
      {
        q: "Which crown material should I choose?",
        a: "For back teeth, zirconia offers strength. For front teeth, E-max looks the most natural. Metal-ceramic costs less and has a long track record. We will show you samples.",
      },
      {
        q: "How long does a crown last?",
        a: "Commonly ten to fifteen years or more, depending on your bite, habits like grinding and how well you clean around it.",
      },
      {
        q: "Is a bridge better than an implant?",
        a: "A bridge is quicker and costs less upfront, but the teeth on each side have to be shaped. An implant leaves neighbours untouched. We will explain both for your situation.",
      },
    ],
    related: ["root-canal-treatment", "dental-implants", "smile-makeover"],
    doctors: ["aditi-rawat"],
    image: consultation,
    imageAlt: "A dentist explaining crown options to a patient",
    emi: true,
    bookingMinutes: 45,
  },
  {
    slug: "teeth-whitening",
    name: "Teeth whitening",
    shortName: "Whitening",
    category: "Brighten",
    icon: "whitening",
    summary: "Professional whitening in one visit, or custom trays to use at home.",
    lead: "Professional whitening safely lifts years of tea, coffee and food stains. We check your teeth and gums first, so it is done only when it is right for you.",
    priceFrom: 4500,
    priceUnit: "take-home kit",
    priceOptions: [
      { label: "Take-home whitening with custom trays", from: 4500 },
      { label: "In-studio whitening, one visit", from: 7500 },
      { label: "In-studio plus take-home top-up", from: 11000 },
    ],
    duration: "About 75 minutes in the studio",
    sittings: "1 visit, or 2 to 3 weeks at home",
    recovery: "Avoid strongly coloured food for 48 hours",
    whatItIs: [
      "A whitening gel breaks down the stains inside the enamel. In the studio we use a stronger gel with the gums protected; at home you wear thin custom trays for a short time each day.",
      "Results vary from person to person. Fillings, crowns and veneers do not change colour, so we plan around them.",
    ],
    whoNeedsIt: [
      "Teeth that have yellowed with age, tea, coffee or smoking",
      "Before a wedding, an event or a photo shoot",
      "People who want a brighter smile without changing tooth shape",
    ],
    steps: [
      {
        title: "Check and clean",
        text: "We check for cavities and gum problems and clean your teeth first, so the gel works evenly.",
      },
      {
        title: "Record your shade",
        text: "We note your starting shade so you can see the change.",
      },
      {
        title: "Whiten",
        text: "In the studio, the gel is applied in short rounds. For home whitening we make your custom trays.",
      },
      { title: "Review", text: "We compare shades and give you tips to keep the result." },
    ],
    aftercare: [
      "Skip tea, coffee, red sauces and turmeric for 48 hours",
      "Some sensitivity for a day or two is common and fades",
      "Use a desensitising toothpaste if your teeth are naturally sensitive",
    ],
    faqs: [
      {
        q: "Is whitening safe for my enamel?",
        a: "Professionally supervised whitening is considered safe for healthy teeth. Over-the-counter strips and DIY remedies, especially lemon or charcoal, can do more harm than good.",
      },
      {
        q: "How long does it last?",
        a: "Often one to two years, longer if you cut down on tea, coffee and smoking. A short top-up with your trays keeps it fresh.",
      },
      {
        q: "Will it whiten my crowns or fillings?",
        a: "No. Whitening works on natural enamel only. If visible fillings no longer match afterwards, they can be replaced to the new shade.",
      },
    ],
    related: ["check-up-and-cleaning", "smile-makeover", "braces-and-aligners"],
    doctors: ["aditi-rawat", "sana-qureshi"],
    image: smileWhitening,
    imageAlt: "A close-up of a bright smile after professional whitening",
    emi: false,
    bookingMinutes: 75,
  },
  {
    slug: "smile-makeover",
    name: "Smile makeover and veneers",
    shortName: "Smile makeover",
    category: "Brighten",
    icon: "veneers",
    summary: "Veneers, bonding and whitening, planned digitally so you preview your smile first.",
    lead: "A smile makeover combines treatments such as whitening, bonding, veneers and crowns to change the shape, colour and line of your smile. We design it digitally and try it in your mouth before anything is permanent.",
    priceFrom: 4500,
    priceUnit: "per tooth, composite veneer",
    priceOptions: [
      { label: "Digital smile design with mock-up", from: 2500, note: "Adjusted if you go ahead" },
      { label: "Composite bonding or veneer, per tooth", from: 4500 },
      { label: "Porcelain or E-max veneer, per tooth", from: 14000 },
      { label: "Complete smile makeover, planned as one package", from: 35000 },
      { label: "Gum contouring with laser", from: 5000 },
    ],
    duration: "60 to 120 minutes per visit",
    sittings: "2 to 4 visits over 2 to 3 weeks",
    recovery: "Little or none for most treatments",
    whatItIs: [
      "Veneers are thin shells of composite or porcelain bonded to the front of teeth to change their colour, shape or length. Porcelain lasts longer and resists staining; composite needs little or no drilling and costs less.",
      "Every makeover starts with photos, a scan and a digital design. You try a temporary mock-up in your mouth and can change it before anything is final.",
    ],
    whoNeedsIt: [
      "Chipped, worn or uneven front teeth",
      "Small gaps you would like closed without braces",
      "Stains that whitening cannot lift",
      "Before a wedding, with enough time to plan",
    ],
    steps: [
      {
        title: "Smile consultation",
        text: "We talk about what you like and dislike about your smile, and what you would like to keep.",
      },
      {
        title: "Photos, scan and design",
        text: "Your new smile is designed digitally around your face, lips and gum line.",
      },
      {
        title: "Try it in",
        text: "A temporary mock-up lets you see and feel the design in your own mouth.",
      },
      {
        title: "Prepare and record",
        text: "Teeth are prepared as little as possible and scanned for the lab.",
      },
      {
        title: "Bond and polish",
        text: "Veneers are bonded, checked in daylight and polished to a natural finish.",
      },
    ],
    aftercare: [
      "Avoid biting hard things like ice or nuts in their shells directly on veneers",
      "Wear a night guard if you grind your teeth",
      "Keep regular cleanings to protect the edges",
    ],
    faqs: [
      {
        q: "Will veneers look fake?",
        a: "Not when they are planned well. We design around your face and choose a natural shade and shape. You approve the mock-up before we start.",
      },
      {
        q: "How long do veneers last?",
        a: "Porcelain veneers often last ten years or more with care. Composite veneers usually need polishing or repair sooner, around five to seven years.",
      },
      {
        q: "How much time do I need before my wedding?",
        a: "Ideally three months, so there is time for whitening, any gum treatment and adjustments. A simpler bonding makeover can be done in two to three weeks.",
      },
    ],
    related: ["teeth-whitening", "crowns-and-bridges", "braces-and-aligners"],
    doctors: ["aditi-rawat"],
    image: smileVeneers,
    imageAlt: "A close-up of a natural-looking smile after porcelain veneers",
    emi: true,
    bookingMinutes: 60,
  },
  {
    slug: "kids-dentistry",
    name: "Children's dentistry",
    shortName: "Child's check-up",
    category: "Children",
    icon: "kids",
    summary: "Gentle, unhurried care for little teeth, from the first tooth to the teens.",
    lead: "Children who have good early visits usually grow up unafraid of the dentist. Our paediatric dentist keeps things calm, playful and honest, and parents can stay in the room.",
    priceFrom: 500,
    priceUnit: "first visit",
    priceOptions: [
      { label: "First visit and check-up", from: 500 },
      { label: "Fluoride varnish", from: 800 },
      { label: "Pit and fissure sealant, per tooth", from: 700 },
      { label: "Filling on a milk tooth", from: 1000 },
      { label: "Pulp treatment on a milk tooth", from: 3000 },
      { label: "Stainless steel or zirconia crown for a milk tooth", from: 3000 },
    ],
    duration: "20 to 45 minutes",
    sittings: "Depends on what is needed",
    recovery: "Back to school the same day",
    whatItIs: [
      "We check how teeth and jaws are growing, spot cavities early and protect teeth with fluoride and sealants. If treatment is needed, we explain it to your child in words they understand and go at their pace.",
      "Milk teeth matter: they hold space for adult teeth and help children eat and speak. Untreated decay in milk teeth can hurt and can affect the teeth coming in underneath.",
    ],
    whoNeedsIt: [
      "Every child by their first birthday, or when the first tooth appears",
      "Brown or white spots on teeth",
      "Thumb-sucking or mouth-breathing beyond age 4",
      "Crowding as adult teeth come in, from around age 7",
    ],
    steps: [
      {
        title: "Meet and play",
        text: "A ride in the chair, a look at the tools and a chance to ask questions.",
      },
      {
        title: "Gentle check",
        text: "We count teeth, look for spots and check how the jaws are growing.",
      },
      {
        title: "Protect",
        text: "Fluoride varnish and sealants where they help, with no drilling involved.",
      },
      {
        title: "Parent talk",
        text: "Simple advice on brushing, snacks, bottles and toothpaste amounts for your child's age.",
      },
    ],
    aftercare: [
      "No eating or drinking for 30 minutes after fluoride varnish",
      "Brush twice a day with a rice-grain smear of fluoride toothpaste under age 3, and a pea-sized amount from 3 to 6",
      "Keep sweet snacks to mealtimes",
    ],
    faqs: [
      {
        q: "When should my child first see a dentist?",
        a: "By the first birthday or within six months of the first tooth. Early visits are short and mostly about getting comfortable.",
      },
      {
        q: "Do milk teeth really need fillings?",
        a: "Often, yes. Some milk teeth stay until age 11 or 12, and a cavity can become painful or infected well before then.",
      },
      {
        q: "My child is scared. What do you do?",
        a: "We never rush or force treatment. We use tell-show-do, short visits and lots of praise. For the rare child who cannot manage, we discuss other options with you.",
      },
    ],
    related: ["check-up-and-cleaning", "braces-and-aligners", "fillings"],
    doctors: ["rohan-negi"],
    image: kids,
    imageAlt: "A smiling child in the dental chair while the dentist shows a toothbrush",
    emi: false,
    bookingMinutes: 30,
  },
  {
    slug: "wisdom-tooth-removal",
    name: "Wisdom tooth removal",
    shortName: "Wisdom tooth",
    category: "Surgery",
    icon: "wisdom",
    summary: "Careful removal of painful or stuck wisdom teeth by a specialist oral surgeon.",
    lead: "Wisdom teeth often do not have room to come in straight. When they keep getting infected, damage the tooth in front or cause pain, removing them is usually the kindest long-term choice.",
    priceFrom: 1500,
    priceUnit: "per tooth, simple removal",
    priceOptions: [
      { label: "Simple removal of an erupted wisdom tooth", from: 1500 },
      { label: "Surgical removal, partly erupted", from: 5000 },
      { label: "Surgical removal, fully impacted", from: 8000 },
      { label: "OPG (full mouth X-ray)", from: 600 },
    ],
    duration: "30 to 60 minutes per tooth",
    sittings: "1 sitting, with a check at one week",
    recovery: "Two to four days of swelling, a week to feel fully normal",
    whatItIs: [
      "Erupted wisdom teeth can often be removed like any other tooth. Impacted ones, which are stuck under the gum or bone, need a small surgical procedure.",
      "Our visiting oral and maxillofacial surgeon does these on Tuesdays and Fridays. Everything is planned from a full mouth X-ray, and a 3D scan when the tooth sits close to a nerve.",
    ],
    whoNeedsIt: [
      "Repeated pain or swelling around a back tooth",
      "Difficulty opening the mouth or a bad taste at the back",
      "Decay in the wisdom tooth or the tooth in front",
      "A wisdom tooth pushing into the tooth in front on an X-ray",
    ],
    steps: [
      {
        title: "Assessment",
        text: "An exam and an OPG X-ray, plus a 3D scan when the tooth is close to the nerve.",
      },
      {
        title: "Plan and consent",
        text: "We explain the procedure, the recovery and the risks in plain words.",
      },
      {
        title: "Removal",
        text: "Done under local anaesthetic. Many patients listen to music through it.",
      },
      {
        title: "Recovery kit",
        text: "You go home with written instructions, medicines and an ice pack.",
      },
      {
        title: "One-week check",
        text: "We check healing and remove stitches if they are not the dissolving kind.",
      },
    ],
    aftercare: [
      "Bite on the gauze for 45 minutes and rest for the day",
      "Ice packs for the first 24 hours, then warm salt-water rinses",
      "Soft, cool food; no smoking, straws or spitting for 48 hours",
    ],
    faqs: [
      {
        q: "Should all wisdom teeth come out?",
        a: "No. If they are healthy, fully in and easy to clean, they can stay. We only suggest removal when they are causing problems or are likely to.",
      },
      {
        q: "How long will I need off work?",
        a: "Most people take one or two days off. Fully impacted teeth may need a little longer.",
      },
      {
        q: "Can all four be removed together?",
        a: "Sometimes, yes. Many patients prefer one side at a time so they can chew on the other side. We will plan what suits you.",
      },
    ],
    related: ["dental-implants", "check-up-and-cleaning", "root-canal-treatment"],
    doctors: ["vikram-thapliyal"],
    image: studioRoom,
    imageAlt: "A calm, bright treatment room ready for a procedure",
    emi: false,
    bookingMinutes: 45,
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return TREATMENTS.find((t) => t.slug === slug);
}

export const CATEGORY_ORDER: TreatmentCategory[] = [
  "Prevent",
  "Repair",
  "Replace",
  "Straighten",
  "Brighten",
  "Children",
  "Surgery",
];

export const CATEGORY_BLURBS: Record<TreatmentCategory, string> = {
  Prevent: "Check-ups and cleanings that stop small problems from becoming big ones.",
  Repair: "Fillings, root canals and crowns that save the teeth you already have.",
  Replace: "Fixed, natural-looking replacements for missing teeth.",
  Straighten: "Braces and clear aligners for children, teenagers and adults.",
  Brighten: "Whitening, bonding and veneers, planned around your face.",
  Children: "Gentle care from the first tooth to the teens.",
  Surgery: "Wisdom teeth and other surgery by a specialist oral surgeon.",
};

export const CATEGORY_LABELS: Record<TreatmentCategory, string> = {
  Prevent: "Prevent problems",
  Repair: "Repair and save teeth",
  Replace: "Replace missing teeth",
  Straighten: "Straighten teeth",
  Brighten: "Brighten your smile",
  Children: "For children",
  Surgery: "Oral surgery",
};
