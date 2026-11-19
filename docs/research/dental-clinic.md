# Dental clinic website research: Ivorine Dental Studio (Dehradun)

Purpose: inform pages, features, copy and prices for a mid-premium dental clinic demo site. Research date: 19 November 2026.

## Sites studied

Indian chains

- Clove Dental: https://clovedental.in/ (plus /appointments, /specialties/dental-crowns, cost pages)
- Sabka Dentist: https://www.sabkadentist.com/ and price list https://sabkadentist.com/complete-dental-pricelist/
- FMS Dental (Hyderabad): https://www.fmsdental.com/
- Partha Dental (South India): https://www.parthadental.com/
- Apollo Dental (formerly Apollo White Dental, old domain has a broken certificate): https://apollodental.in/

Independent clinics (tier 2)

- DantKala, Race Course, Dehradun: https://www.dantkala.com/
- Manya Dental, Ring Road, Dehradun: https://manyadental.com/
- Pristine Dental, Sector 19D, Chandigarh: https://pristinechd.com/
- Practo Dehradun clinic list (timings, fees): https://www.practo.com/dehradun/clinics/dental-clinics
- Jaipur timings only: Thaper Dental (thaperdentalclinic.com), Dental Seva (dentalseva.com), Chandraj (chandrajdentalclinic.com)

International (design)

- Grand Street Dental, New York: https://www.grandstreetdental.com/
- Pall Mall Dental, London: https://www.pallmalldental.co.uk/

Price, insurance and EMI sources

- teeth.in 2026 cost guide https://teeth.in/cost/ ; Clove cost pages (RCT, implant, braces, crowns, whitening); Credihealth Dehradun RCT; Replace Roots and Dentocare Dehradun implant pages; Medoc and Beyondental whitening guides; Dental Arch India and DentistInsider wisdom tooth guides; Toothtribe kids prices
- PolicyX, Tata AIG, SMC Insurance dental cover articles; Bajaj Mall EMI store, Sabka Dentist EMI page, Neoface Dental EMI page

## Standard page structure

Nav items seen most often: Treatments (dropdown), About, Our Doctors, Find a Clinic / Contact, Blog, Patient Safety (Clove, Partha), Book Appointment button, Call button. Boutique and UK sites add: New Patients, Smile Gallery, Fees.

Home section order seen most often (chains and good independents merged):

1. Hero with one promise line plus Book and Call/WhatsApp buttons (often an offer carousel at chains)
2. Trust stats strip: patients, years, doctors, Google rating with count, "open 7 days"
3. Treatments grid (8 to 12 tiles)
4. Short booking form or "what do you need help with?" concern picker
5. Why choose us: sterilisation, technology, specialists, transparent pricing
6. Before/after or patient video stories
7. Doctors (photo, degrees, years)
8. Membership or offers block (Clove plans 650 to 750, Pristine 2,499 per year)
9. Reviews carousel
10. Location / map / timings
11. FAQ (8 questions typical)
12. Blog teasers, final CTA, footer

## Features checklist

Booking

- [ ] MUST: "Book appointment" button in header, hero, every treatment page and sticky mobile bar
- [ ] MUST: Short form: name, phone, concern, preferred date, morning/evening slot
- [ ] MUST: Concern picker as first step (Clove has 8 concerns; FMS has 10)
- [ ] MUST: Confirmation screen with what happens next ("we will call or WhatsApp within 2 working hours", Pristine)
- [ ] NICE: Real slot picker (date plus time chips) like Grand Street / Pall Mall external schedulers
- [ ] NICE: Instant callback popup (Clove), add to calendar link

Contact and WhatsApp

- [ ] MUST: Floating WhatsApp button with prefilled message (Partha, Pristine, Apollo, Pall Mall)
- [ ] MUST: Tap to call number in header
- [ ] MUST: Map embed, address with landmark, parking note, "Get directions" (Pristine, Pall Mall travel block)
- [ ] NICE: Chat widget with quick replies (DantKala)

Trust

- [ ] MUST: Google rating with review count near the hero (Pall Mall 4.8 from 200+, Pristine 4.9 from 460+)
- [ ] MUST: Doctor cards with degrees, speciality, years, State Dental Council registration number
- [ ] MUST: Sterilisation section (Class B autoclave, sealed pouches, single use disposables)
- [ ] MUST: Technology list (intraoral scanner, RVG, OPG/CBCT, rotary endo, laser)
- [ ] NICE: Before/after gallery labelled by treatment
- [ ] NICE: Video testimonials, awards, press, "medically reviewed by" line on articles

Treatments

- [ ] MUST: Treatment index plus detail pages for the 8 to 10 core treatments
- [ ] MUST: "Starting from" price on each treatment page, with what is included
- [ ] MUST: FAQs per treatment
- [ ] NICE: Comparison tables (crown materials, braces vs aligners)

Content

- [ ] MUST: "Your first visit" page (what happens, how long, what to bring, price)
- [ ] MUST: Home FAQ (hours, Sunday, walk in, kids, EMI, insurance)
- [ ] NICE: Blog or patient guides (3 to 4 posts is enough for a demo)

Payments, EMI, insurance

- [ ] MUST: Price list page ("Fees") with starting prices and a disclaimer
- [ ] MUST: Payment methods line: UPI, cards, cash, net banking (Partha)
- [ ] MUST: EMI note: no cost EMI on treatments above a threshold via finance partner
- [ ] MUST: Honest insurance note (reimbursement bills, not cashless)
- [ ] NICE: Annual membership plan card
- [ ] NICE: EMI calculator on implants, aligners, braces ("from X per month", Sabka and Pall Mall do this)

Emergency

- [ ] MUST: "Dental emergency? Call now" strip with same day promise
- [ ] NICE: First aid tips (knocked out tooth, swelling, broken tooth)

Accessibility and mobile

- [ ] MUST: Sticky bottom bar on mobile: Call, WhatsApp, Book (Clove, Apollo, Grand Street)
- [ ] MUST: Large tap targets, readable 16px text, alt text, keyboard focus states, good contrast
- [ ] NICE: Hindi toggle or Hindi line in key CTAs (common need in Uttarakhand)
- [ ] NICE: Step free access and lift note on contact page

## Booking flows observed

- Clove Dental (3 steps): 1) city plus phone with OTP, 2) clinic plus date, 3) personal details plus consent checkbox. Separate "Instant callback" popup: city, captcha, consent. Home "needs selector": pick 1 of 8 concerns, then Continue.
- Sabka Dentist (1 step): name, city, phone, button "Book a Free Dental Check-up and Scan", then phone callback.
- FMS Dental (1 step): preferred clinic, "What do you need help with?" (10 options), "Request callback".
- Partha Dental (1 step, heavy): first name, last name, phone, email, state, branch, captcha. Separate WhatsApp "Enquiry" button with prefilled text.
- Pristine Dental (1 step): name, phone, email (optional), treatment of interest, preferred date, message. Promise: callback within 2 working hours. Plus external booking page and WhatsApp.
- DantKala: name, phone, email, preferred date and time, message. Chat widget routes to WhatsApp.
- Grand Street, Pall Mall: "Book online" goes to a third party scheduler with live slots; Pall Mall also offers virtual consultation.
- Pattern for Ivorine: concern, then date and slot, then name and phone, then confirmation (reference number, clinic address, WhatsApp follow up). No OTP needed in the demo.

## Trust signals

- Patient counts: Clove 30L+ patients, Sabka 16L+ smiles, Partha 15L+, Apollo 3M+ (small clinic version: "5,000+ smiles", Pristine)
- Years: Clove 15, FMS 30+, Pristine 14+
- Google rating plus count: Clove 4.9 (3L+ reviews), FMS 4.8 (4,847+), Pristine 4.9 (460+)
- Doctors: share of MDS specialists (Clove 65% MDS), named doctors with years and degrees (Apollo shows DCI registration)
- Sterilisation: Clove "4 step protocol", Partha Class B autoclave, disposable kits, HEPA air purification; DantKala "Dental Kitchen" with Class B autoclave, ultrasonic cleaning, sealed packs; FMS Class B autoclave plus OSHA based protocols
- Certifications: NABH (FMS flagship, DantKala Dehradun claims NABH), ISO 9001:2015 and ISO 45001 (FMS), Invisalign certified provider (Sabka)
- Technology logos: 3Shape TRIOS scanner, CBCT, OPG, RVG, lasers, CAD/CAM
- Awards and press logos (FMS, Grand Street press quotes)
- Corporate tie ups ("250+ companies", Clove), celebrity videos (Clove)
- Uniform pricing claim (Clove: same price at every clinic)

## Treatment detail page anatomy

Based on Clove crowns page plus boutique sites:

1. Hero: treatment name, plain English promise, "Starting from" price, Book and WhatsApp buttons
2. Quick facts strip: sittings, time per visit, pain level, recovery, how long it lasts
3. Is this for you? (symptoms or indications, 4 to 6 bullets)
4. What it is (2 short paragraphs)
5. Options compared (table: look, strength, life, price from)
6. Step by step, visit by visit
7. Price block: starting price, what is included, what changes the price, EMI line
8. Before/after cases (with consent note)
9. Technology used, and the doctor who does it
10. Aftercare tips (4 habits)
11. FAQs (6 to 9)
12. Reviews mentioning the treatment
13. Final CTA, "medically reviewed by Dr X, last updated" line

## Price table

All INR. "Typical range" mixes chain price lists, 2026 cost guides and Dehradun listings. Starting prices assume a mid-premium Dehradun clinic, priced between budget local clinics and national chains.

| Treatment                                 | Typical range in India 2025-26 (INR)                                                      | Suggested "starting from" for Ivorine | Sources                                                                                                                                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consultation (dentist exam)               | 150 to 700 (Dehradun Practo average 325); chains often free                               | 500                                   | [Practo Ddn](https://www.practo.com/dehradun/clinics/dental-clinics), [Sabka](https://sabkadentist.com/complete-dental-pricelist/)                                                            |
| Check-up plus scaling and polishing       | 500 to 3,000 (Sabka 500 / 1,500, Clove 1,690)                                             | 1,500                                 | [Sabka](https://sabkadentist.com/complete-dental-pricelist/), [teeth.in](https://teeth.in/cost/)                                                                                              |
| Deep cleaning (full mouth, gum treatment) | 3,000 to 8,000 (Sabka 6,000)                                                              | 4,000                                 | [Sabka](https://sabkadentist.com/complete-dental-pricelist/)                                                                                                                                  |
| Composite (tooth coloured) filling        | 500 to 5,000 per tooth (Sabka 1,500)                                                      | 1,500                                 | [Sabka](https://sabkadentist.com/complete-dental-pricelist/), [teeth.in](https://teeth.in/cost/)                                                                                              |
| Root canal, front tooth, single sitting   | 1,500 to 14,000; Dehradun 2,250 to 5,000                                                  | 4,500                                 | [teeth.in](https://teeth.in/cost/), [Credihealth Ddn](https://www.credihealth.com/procedures/dehradun/root-canal-treatment-cost)                                                              |
| Root canal, molar, single sitting         | 3,000 to 18,000 (Clove from 5,790, Sabka 2,750 to 4,100)                                  | 6,500                                 | [Clove](https://clovedental.in/root-canal-treatment-cost), [teeth.in](https://teeth.in/cost/)                                                                                                 |
| Crown, PFM                                | 3,000 to 10,000 (Clove 5,000, Sabka 8,000)                                                | 5,500                                 | [Clove](https://clovedental.in/specialties/dental-crowns), [Sabka](https://sabkadentist.com/complete-dental-pricelist/)                                                                       |
| Crown, zirconia                           | 7,500 to 20,000 (Clove 8,900, Sabka 11,000)                                               | 9,500                                 | same                                                                                                                                                                                          |
| Crown, E-max                              | 12,000 to 25,000 (Sabka premium 15,000)                                                   | 14,000                                | [Sabka](https://sabkadentist.com/complete-dental-pricelist/), [teeth.in](https://teeth.in/cost/)                                                                                              |
| Bridge, 3 unit PFM                        | 15,000 to 30,000 (priced per unit, 3,500 to 55,000 per unit)                              | 16,500                                | [teeth.in](https://teeth.in/cost/)                                                                                                                                                            |
| Implant, single, with crown               | 20,000 to 65,000; Dehradun starts 20,000 to 32,000 (Clove 24,700 to 63,900, Sabka 35,000) | 30,000 (CBCT extra)                   | [Clove](https://clovedental.in/cost/dental-implant-cost), [Replace Roots](https://www.replaceroots.com/dental-implants-dehradun/), [Dentocare](https://www.dentocareindia.com/dental-implant) |
| Braces, metal (full treatment)            | 18,000 to 90,000 (Clove 25,500 to 52,900, Sabka 40,000)                                   | 30,000                                | [Clove](https://clovedental.in/cost/teeth-braces-cost), [Sabka](https://sabkadentist.com/complete-dental-pricelist/)                                                                          |
| Braces, ceramic                           | 35,000 to 1,80,000 (Clove 47,900 to 59,900, Sabka 50,000)                                 | 45,000                                | same                                                                                                                                                                                          |
| Clear aligners (full case)                | 35,000 to 3,50,000 (Sabka 35,000, Clove Whistle 55,150; Invisalign higher)                | 65,000 (Invisalign quoted after scan) | [Clove](https://clovedental.in/cost/teeth-braces-cost), [teeth.in](https://teeth.in/cost/)                                                                                                    |
| Whitening, in-office                      | 4,000 to 25,000 (Clove from 4,990)                                                        | 7,500                                 | [Medoc](https://medoc.in/treatment-cost/teeth-whitening), [teeth.in](https://teeth.in/cost/teeth-whitening/)                                                                                  |
| Whitening, take-home trays                | 3,000 to 12,000                                                                           | 4,500                                 | [teeth.in](https://teeth.in/cost/teeth-whitening/), [Beyondental](https://beyondental.in/blog/teeth-whitening-cost-bangalore-2026-price-guide/)                                               |
| Veneer, composite (per tooth)             | 3,000 to 10,000 (Sabka 7,000)                                                             | 4,500                                 | [teeth.in](https://teeth.in/cost/veneers/), [Sabka](https://sabkadentist.com/complete-dental-pricelist/)                                                                                      |
| Veneer, porcelain or E-max (per tooth)    | 8,000 to 25,000 mid range, premium up to 55,000 (Sabka 13,500)                            | 14,000                                | [teeth.in](https://teeth.in/cost/veneers/), [CDIE](https://cdieindia.com/veneers-cost/)                                                                                                       |
| Smile makeover (6 to 10 teeth)            | 25,000 (composite) to 2,50,000 (porcelain)                                                | 35,000 (after smile design consult)   | [teeth.in](https://teeth.in/cost/veneers/)                                                                                                                                                    |
| Kids: fluoride varnish                    | 300 to 1,500 per session                                                                  | 800                                   | [Toothtribe](https://toothtribe.in/journal/blog/what-dental-treatments-cost-in-india-2026/), [teeth.in](https://teeth.in/cost/)                                                               |
| Kids: sealant (per tooth)                 | 300 to 1,500                                                                              | 700                                   | same                                                                                                                                                                                          |
| Kids: pulpectomy (milk tooth)             | 2,000 to 5,000, plus steel crown 2,000 to 4,500                                           | 3,000                                 | [Clove kids](https://clovedental.in/specialist/pediatric-dentists), [Toothtribe](https://toothtribe.in/journal/blog/what-dental-treatments-cost-in-india-2026/)                               |
| Simple extraction                         | 500 to 3,000 (Sabka 600)                                                                  | 1,000                                 | [Sabka](https://sabkadentist.com/complete-dental-pricelist/), [teeth.in](https://teeth.in/cost/tooth-extraction/)                                                                             |
| Wisdom tooth, surgical                    | 2,500 to 15,000, complex up to 20,000 (Clove 2,000 to 10,000)                             | 5,000                                 | [teeth.in](https://teeth.in/cost/tooth-extraction/), [Dental Arch](https://dentalarchindia.com/wisdom-tooth-extraction-cost/)                                                                 |
| Complete dentures (upper and lower)       | 8,000 to 1,20,000 (Sabka 17,000 Indian, 30,000 imported)                                  | 18,000                                | [Sabka](https://sabkadentist.com/complete-dental-pricelist/), [teeth.in](https://teeth.in/cost/)                                                                                              |
| Digital X-ray (RVG / IOPA)                | 80 to 700 per film                                                                        | 300                                   | [teeth.in](https://teeth.in/cost/)                                                                                                                                                            |
| OPG (full mouth X-ray)                    | 300 to 2,500                                                                              | 600                                   | [teeth.in](https://teeth.in/cost/)                                                                                                                                                            |
| CBCT (implant planning)                   | 2,000 to 4,000                                                                            | 2,500                                 | [Clove implant](https://clovedental.in/cost/dental-implant-cost)                                                                                                                              |

Price notes: chain pages contradict themselves (Clove RCT 5,790 vs Sabka 2,750 to 4,100; Clove zirconia 7,600 to 8,900 across pages). Always show "starting from", list what is included, and add "final cost confirmed after examination and X-ray". Sabka uses the line "These are indicative prices".

## Timings and emergency norms

- Dehradun independents: Mon to Sat, split shift is common: 10:00 AM to 2:00 PM and 5:00 PM to 8:00 PM (Practo shows many clinics "10 AM to 2 PM" as the morning slot). Larger clinics run 10:00 AM to 8:00 PM straight.
- Sunday in Dehradun: closed, by appointment, or a short morning (Bharat Dental Sun 10 AM to 3 PM; Manya runs Sunday "ortho day" 8:30 AM to 1:30 PM on 1st and 3rd Sundays).
- Manya shows summer and winter hours separately (winter closes earlier). Good local touch.
- Jaipur and Chandigarh: Mon to Sat 9 or 10 AM to 8 or 9 PM; Sunday 10 AM to 2 PM or 5:30 PM, or "Sunday on appointment".
- Chains: about 10 AM to 7 or 8 PM, "Open 7 days" (Clove, Partha 9 AM to 9 PM); same day appointments often available; walk ins accepted with possible wait.
- Emergency: chains mostly list "Emergency care" as a concern option only. FMS claims 24 hour emergency service. Pristine: call us, we will see you as soon as possible, often the same day (toothache, swelling, broken or knocked out tooth). True 24x7 dental cover is rare for single clinics; an after hours phone line for existing patients is a credible middle ground.

## Insurance and EMI norms

- Standard Indian health insurance (mediclaim) excludes routine dental care. Dental is paid only when it needs hospitalisation (for example jaw fracture, tumour surgery) or follows an accident. Implants, dentures, braces and cosmetic work are excluded unless caused by accident or cancer.
- Some premium plans and add-ons have an OPD dental benefit with small limits (often 5,000 to 10,000 a year), usually by reimbursement, sometimes with a 2 year waiting period (Tata AIG wording). Some corporate group policies include a small OPD limit.
- Standalone dental insurance is not really available in India (Tata AIG). Cashless dental OPD at a private clinic is rare; do not claim it.
- What clinics actually offer: itemised GST invoices, prescriptions and X-ray reports so patients can claim reimbursement. FMS lists government and PSU empanelment at one hospital, which is unusual.
- EMI: "No cost EMI" through finance partners is common for implants, aligners, braces and smile makeovers. Lenders seen: Bajaj Finserv (EMI Network card, dominant), Fibe, SaveIN, Snapmint, HDFC Credila. Tenures 3 to 24 months, approval at the clinic in minutes. "No cost" can still carry a processing or convenience fee. Credit card EMI via payment gateway (Razorpay, Pine Labs) also common.
- Typical copy: "0% EMI starting 2,000 per month" (Sabka), "easy EMI on selected treatments" (Partha).
- Memberships as an insurance substitute: Clove plans 650 to 750 with free consultation, X-ray and treatment coupons; Pristine 2,499 per year with check-ups, cleanings and discounts.

## Common patient questions

1. Is root canal treatment painful?
2. Can a root canal be done in one sitting? How many visits will I need?
3. Do I need a crown after a root canal?
4. How much will my treatment cost, and why is the final price only given after a check-up?
5. Is the first consultation free? What does it include?
6. Do you offer EMI or no cost EMI? On which treatments?
7. Does my health insurance cover dental treatment? Is it cashless?
8. At what age should my child first see a dentist? (Answer norm: by the first birthday or within 6 months of the first tooth)
9. Clear aligners or braces: which is better for me, and how long does each take?
10. How long do dental implants last? Is the surgery painful? Can diabetics or older people get implants?
11. Will teeth whitening make my teeth sensitive? How long do results last?
12. Does scaling damage enamel or loosen teeth? (very common Indian myth)
13. How do you sterilise instruments? Are the tools single use?
14. What should I do in a dental emergency, like a knocked out tooth or swelling?
15. Are you open on Sunday? Can I walk in without an appointment?
16. Which doctor will treat me? Do you have specialists (MDS)?
17. Does my wisdom tooth need to come out? How long is recovery?
18. PFM, zirconia or E-max: which crown should I choose, and how long will it last?
19. How long do veneers last, and do they damage natural teeth?
20. Can I get dental treatment or X-rays during pregnancy?
21. When can I eat after a filling, root canal or extraction?
22. Is parking available, and how do I reach the clinic?

## Design notes from top international clinics

- Grand Street Dental (NYC): two word hero ("Dentistry Redesigned") with a rotating press quote line; floating quick action bar (Gallery, Call, Book, Contact); before/after pairs with front and side angles, labelled by treatment ("14 Porcelain Veneers and Crowns"); Instagram style patient stories; services split into Cosmetic and Family and Restorative lists; warm, confident, playful tone.
- Pall Mall Dental (London): Google rating with count placed right under the hero headline; stats strip including "0% finance" and "late and weekend appointments"; travel directions block; new patient visit as a bullet list with one clear price ("All for 80 pounds"); full Fees page with "from" prices; finance shown as "from X per month"; team cards with post nominals and regulator registration number linked; floating WhatsApp; treatment tiles with verb led benefit lines ("Replace a missing tooth").
- Best website roundups (Arbor, Zen Dental Studio, Tend): calm palettes, generous white space, refined serif or distinctive type, real photography of the space, a boutique rather than clinical feel.
- Copyable patterns: one primary CTA colour used everywhere; price transparency as a trust tool; first visit explained step by step; reviews with source and count, not anonymous quotes; doctor credibility shown with verifiable registration.

## Decisions for the Ivorine demo

- Pages: Home, Treatments (index plus about 8 detail pages: check-up and cleaning, root canal, crowns and bridges, implants, braces and aligners, whitening, veneers and smile makeover, kids dentistry), Fees, Your First Visit, Doctors, Technology and Safety, Reviews and Smile Gallery, Contact, Book Appointment, Emergency.
- Home order: hero with rating, stats strip, concern picker, treatments grid, why Ivorine (safety, tech, specialists, transparent fees), smile gallery, doctors, reviews, first visit teaser, membership, location and hours, FAQ, final CTA.
- Booking: 4 steps (concern, date and slot, name and phone, confirmation) with WhatsApp prefilled alternative and callback promise within 2 working hours.
- Mobile: sticky bottom bar Call, WhatsApp, Book; floating WhatsApp on desktop.
- Prices: show "Starting from" values from the table, with inclusions and the line "final cost confirmed after examination and X-ray".
- Hours: Mon to Sat 10:00 AM to 8:00 PM, Sunday 10:00 AM to 2:00 PM by appointment; emergency same day slots and an after hours line for registered patients.
- Trust: Google rating 4.9 from about 600 reviews (fictional, mark as demo), years open, 3 or 4 doctors with BDS/MDS, years, Uttarakhand State Dental Council registration numbers (fictional), Class B autoclave, sealed pouches opened in front of you, single use disposables, intraoral scanner, RVG, OPG, CBCT on site or partnered, rotary endodontics, soft tissue laser.
- Payments: UPI, cards, cash; no cost EMI 3 to 12 months on treatments above 10,000 via finance partner; honest insurance note (reimbursement paperwork, not cashless).
- Membership: "Ivorine Care Plan" 1,999 per year: 2 check-ups, 2 cleanings, X-rays, 10% off treatments.
- Location copy: Rajpur Road area landmark plus parking note; summer and winter hours note optional.
- Keep a "Demo site, fictional clinic" footer note.
