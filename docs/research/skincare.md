# Skincare D2C store research: Oruvi Skin (Dehradun)

Purpose: list the pages, features, offers and copy patterns a premium Indian D2C skincare store has, so the Oruvi Skin demo matches them. Research date: 19 November 2026.

## Sites studied

Indian D2C stores

- Minimalist: https://beminimalist.co/ (home, mega menu, cart drawer; PDP facts from search snippets of /products/niacinamide-10-with-matmarine, /products/multi-vitamin-spf-50, /products/light-fluid-spf-50-sunscreen)
- The Derma Co: https://thedermaco.com/ (home, mega menu, /pages/skin-assessment; PDP facts from snippets)
- Foxtale: https://www.foxtale.in/ (home, /collections/serums, /products/niacinamide-clarifying-serum, /cart)
- Plum: https://www.plumgoodness.com/ (home, mega menu, mini cart; PDP facts from snippets)
- Dot & Key: https://www.dotandkey.com/ (home, search overlay, mega menu)
- Deconstruct: https://thedeconstruct.in/ (home, mega menu; PDP facts from snippets)

Global benchmarks

- The Ordinary: https://theordinary.com/en-in/niacinamide-10-zinc-1-serum-100436.html, Regimen Builder write ups (Refinery29, Zennora)
- Glossier: https://www.glossier.com/
- Paula's Choice: https://www.paulaschoice.de/en/routine-finder (paulaschoice.com blocked fetching), https://www.paulaschoice.com/ingredient-dictionary

Checkout, tracking, WhatsApp

- GoKwik: https://www.gokwik.co/product/kwikcheckout ; Shiprocket Checkout (fastrr): https://checkout.shiprocket.in/ ; Razorpay Magic: https://razorpay.com/magic-checkout/
- Shiprocket tracking: https://www.shiprocket.in/shipment-tracking/ ; ClickPost: https://www.clickpost.ai/
- WhatsApp template guides: retner.ai, sparktg.com, vgraple.co.in

Note: most stores returned HTTP 429 after one page, so some details come from search snippets. Offer amounts and codes change weekly; treat them as patterns, not current prices.

## Standard page structure

Header (all six Indian stores)

- Announcement bar rotating 2 to 4 offers with codes: "Buy 2, Get 3rd Free" (Minimalist), "Buy 2 Get 2 Free on Selected Products | Use Coupon - B2G2" (Derma Co), "Buy 2 @ 699: Sale Ends Soon" (Dot & Key), "Free barrier-repair trio kit worth ₹397 on orders above ₹999" (Plum).
- Logo, mega menu, search, account, cart with count. Track Order is a top level link at Minimalist and Deconstruct.
- Mega menu columns: Shop by Concern, Shop by Ingredient, Skin Care steps (Cleanse, Tone, Treat, Moisturise, SPF, Under Eye), Shop by Skin Type, plus Bestsellers, New Launches, Combos or Kits, Gifting. Each menu has a promo tile ("New Launch: Retinol 0.1% Serum", Minimalist) or a "Customer Favorites" product panel (Derma Co).
- Other top level items seen: Free skin assessment (Derma Co), AI Assistants (Minimalist), Oily Skin Tested (Deconstruct), Get App.
- Mobile: drawer with the same groups plus Refer and Earn, Help, Chat with us. Derma Co adds a bottom tab bar: Home, Regimen, Profile, Cart.

Home section order (merged from Minimalist, Foxtale, Dot & Key, Deconstruct, Plum)

1. Announcement bar and header
2. Hero carousel (launch, sale, app offer); Dot & Key and Plum add a sale countdown
3. Bestsellers carousel, often tabbed by category (Dot & Key: Sunscreen, Moisturizer, Serum, Facewash, Lip Balm)
4. Shop by Category tiles
5. Shop by Concern tiles: Acne, Pigmentation, Dullness, Oiliness, Dryness, Ageing, Open Pores, Tan
6. New Launches carousel
7. Proof block: clinical before/after at 7, 14 and 28 days (Deconstruct) or brand pillars (Minimalist: Transparency, Efficacy, Affordable, Only the best)
8. Routines and Kits
9. Shop by Ingredient range (Dot & Key "Explore Our Range")
10. Shoppable videos (Dot & Key "Watch It. Love It.")
11. Testimonials ("What Our Customers Say", "Love That Keeps Us Going")
12. Featured In (press logos)
13. Latest blog posts
14. Loyalty coins and app block
15. Instagram grid, then footer (policies, caution notice, grievance officer, marketplace links, payment icons)

## Features checklist

### Header and navigation

- [ ] MUST: rotating announcement bar, 3 offers with codes, each linked to an offer collection (all six)
- [ ] MUST: mega menu with Concern, Ingredient, Category and Skin Type columns plus a promo tile (Minimalist, Dot & Key, Derma Co)
- [ ] MUST: Bestsellers, New Launches, Combos/Kits, Gifting reachable from the menu (Plum, Deconstruct, Dot & Key)
- [ ] MUST: Track Order link in header or menu (Minimalist, Deconstruct, Dot & Key)
- [ ] MUST: search overlay that, before typing, shows Recent searches, Popular Choices chips (Face Wash, Serum, Combos, Sunscreen) and "Recommended for you" products (Dot & Key)
- [ ] NICE: voice search with language picker: English, Hindi, Bengali, Tamil, Telugu and 5 more (Dot & Key)
- [ ] NICE: "Skin quiz" or "Free skin assessment" as a header link (Derma Co, Deconstruct)
- [ ] NICE: mobile bottom tab bar: Home, Regimen, Profile, Cart (Derma Co)

### Home

- [ ] MUST: section order as above
- [ ] MUST: concern picker: "What does your skin need help with?" and "Pick your serum: Fades Dark Spots, Brightens Skin, Controls Acne" (Foxtale)
- [ ] MUST: "Clinically Proven Results" before/after strip at day 7, 14, 28 (Deconstruct)
- [ ] MUST: trust icon row: Clinically Proven Results, Cruelty Free, Dermatologically Tested, Fragrance Free (Dot & Key, Foxtale)
- [ ] NICE: hero sale countdown, only with a real end time (Plum "Plum Plus Friday", Dot & Key)
- [ ] NICE: shoppable video reel (Dot & Key)
- [ ] NICE: brand pillars block (Minimalist)
- [ ] NICE: loyalty and app block: Minimalist MCash, Foxtale FoxCoins, Deconstruct Dcoins

### Listing

- [ ] MUST: filters: Concern, Skin Type, Category, Key Ingredient, Price, Size, Availability. Sort: Featured, Best selling, Price low to high, Price high to low, Newest, Top rated (standard Shopify set; exact labels hidden on JS pages)
- [ ] MUST: tile: image with hover swap, badge (BESTSELLER, NEW LAUNCH, TRENDING, GLOW HERO), name with active %, one line claim ("Dull to dewy in 60 secs"), stars with review count, price, MRP strike, "(20% OFF)", size chips, Add to cart (Foxtale, Dot & Key, Plum, Minimalist)
- [ ] MUST: offer line on tile: "GLOW20" (Foxtale), "Buy any 2 @ flat 25% off" (Plum), "B1G1" (Deconstruct)
- [ ] MUST: out of stock: "Sold out" label, greyed image, "Notify me" in place of Add (Minimalist, Glossier)
- [ ] MUST: "From ₹224" when sizes differ (Minimalist)
- [ ] NICE: skin type tags on tile (Dot & Key), wishlist heart, "Fragrance-Free" tag (Foxtale)

### Product page

- [ ] MUST: title with active and %, plus subtitle claim with timeframe and size: "Controls oil, reduces acne, and fades dark spots in 14 days | 30 ml" (Foxtale, Minimalist)
- [ ] MUST: star summary under title, linking to reviews
- [ ] MUST: price, MRP strike, % off, "MRP Incl. of all taxes", unit price ("₹12.58 /g", Plum)
- [ ] MUST: size selector with "Best Value" on the larger size (Foxtale 10 ml / 30 ml)
- [ ] MUST: offers block with best coupon auto applied ("GLOW20 applied") and other codes with copy button: "Buy 2 @ 749, FOX749" (Foxtale); ATC5 above ₹299, ATC10 above ₹599, ATC15 above ₹1399 (Minimalist)
- [ ] MUST: pincode check showing delivery date and COD availability; "95% orders are delivered within 3 days" (Plum)
- [ ] MUST: Add to cart plus Buy now; sticky bar on mobile
- [ ] MUST: service badges: Fast Shipping, Secure Checkout, Easy Order Tracking, Earn Reward Points (Foxtale); "Easy Replacements. Hassle-Free Returns." (Plum)
- [ ] MUST: quick facts: "For: Oily, sensitive, acne-prone skin", "Routine: Daily, morning & night", "Helps With: Dark Spots, Oil Control" (Foxtale); "Targets", "Suited for", "Format" (The Ordinary)
- [ ] MUST: "Hero Ingredients" cards with "How they help" (Foxtale) and source ("Niacinamide comes from Lonza, Switzerland", Minimalist)
- [ ] MUST: results block split into consumer study ("97% of users saw brighter skin"), instrument test ("37.75% sebum reduction after 28 days") and safety ("HRIPT on 216 volunteers") (Foxtale)
- [ ] MUST: How to Use steps plus "Things to keep in mind" (do not layer with Vitamin C, retinol, AHA BHA on the same day) (Foxtale; The Ordinary "Do not use with")
- [ ] MUST: full INCI ingredient list, pH, "free from" flags (The Ordinary, Minimalist, Derma Co)
- [ ] MUST: sunscreen test card: "IN-VIVO, ISO 24444:2019", "SPF value obtained: 56.6", "PA rating: ++++", lab name, study number (Minimalist); Derma Co adds a CTRI registration number
- [ ] MUST: "Pairs well with" pair and save showing saving ("saves ₹145") and "Complete Your Routine" in 4 steps (Foxtale)
- [ ] MUST: reviews: average, count, 5 to 1 star bars, tag stats ("95% Fades Dark Spots", "91% Lightweight Texture"), photo strip, filters (stars, with photos, skin type), Verified Buyer label, helpful votes
- [ ] MUST: FAQs accordion (Foxtale shows 32)
- [ ] NICE: ratings from other platforms: Nykaa, Amazon, Flipkart (Foxtale)
- [ ] NICE: "Is this product right for me?" AI answer with "not medical advice" note (The Ordinary)
- [ ] NICE: actives compatibility checker and Q&A tab (The Ordinary)
- [ ] NICE: coins earned line ("Get 55 foxcoins"), recycling instructions (The Ordinary)

### Cart

- [ ] MUST: slide out drawer with one progress bar for free delivery and gift tiers. Seen: Plum gifts at ₹999, ₹1399, ₹1699; Minimalist "SHOP FOR ₹799 AND GET A FREE SUNSCREEN" and surprise gift above ₹1199; Glossier "Buy more + save" ladder
- [ ] MUST: gift auto added at ₹0, removed if cart falls below the tier
- [ ] MUST: bundle price applied live: "Buy Any 2 @ 699", "Buy Any 3 @ 999 + 2 Free Gifts", "Buy Any 4 @ 1295 + 3 Free Gifts" (Dot & Key); "Buy 2, Get 3rd Free" (Minimalist)
- [ ] MUST: coupon list with best one applied and a "You saved ₹X" line
- [ ] MUST: upsell row of minis and bestsellers, quantity stepper, remove, empty state with "Shop Now"
- [ ] NICE: coins line ("Add ₹100 for 10% Mcash", Minimalist); prepaid nudge "Extra 5% off on prepaid orders" (Dot & Key)

### Checkout

- [ ] MUST: one page checkout sheet: mobile number then OTP; login with Truecaller or WhatsApp as options; returning shopper lands on saved addresses (GoKwik, fastrr, Razorpay Magic)
- [ ] MUST: address: pincode first, city and state autofill, flag missing house number (fastrr), Home/Work tag
- [ ] MUST: estimated delivery date before payment (fastrr, ClickPost)
- [ ] MUST: payments with UPI first (GPay, PhonePe, Paytm icons, any UPI ID, QR on desktop), then cards, netbanking, wallets, EMI/Pay Later, COD last
- [ ] MUST: COD fee shown on the COD row (Foxtale ₹40 per coupon sites) and prepaid discount on prepaid rows (about 5%)
- [ ] MUST: coupon dropdown inside checkout ("like Swiggy and Zomato", fastrr SOP)
- [ ] MUST: collapsible order summary, "Secured by" line, payment trust row
- [ ] NICE: partial COD (pay a small amount now), COD hidden above a cart limit, bank and wallet offers strip

### Orders and tracking

- [ ] MUST: thank you page: order ID, items, delivery date, payment mode, "Pay now and save ₹X" COD to prepaid offer with a timer (fastrr), referral prompt
- [ ] MUST: track page by order ID plus phone or email, or mobile plus OTP (Shiprocket)
- [ ] MUST: timeline: Order Placed, Confirmed, Packed, Shipped, In Transit, Out for Delivery, Delivered; courier, AWB, delivery date, WhatsApp help button
- [ ] MUST: account orders list with Cancel order, Return/Exchange (Plum Help menu)
- [ ] NICE: failed delivery actions: reschedule, fix address (ClickPost); product suggestions on the tracking page

### Skin quiz

- [ ] MUST: 5 to 7 steps with a progress stepper (Derma Co shows 5). Topics: skin type with one line descriptions (Paula's Choice: "My skin looks shiny and feels sleek to the touch"), main concern then branching sub concern (Derma Co: Acne to Papules, Pustules, Whiteheads, Blackheads, Open Pores), sensitivity, experience with actives and texture preference (The Ordinary), age band
- [ ] MUST: result: skin profile summary, AM and PM routines in application order, one line "why" per product, total price with kit saving, "Add full routine to cart", "Send my routine on WhatsApp" (The Ordinary emails it)
- [ ] NICE: "Skip this question" and "Select a maximum of two concerns" (Paula's Choice)
- [ ] NICE: entry CTA "Take Skin Test, 2 minutes, free" (Derma Co); selfie analysis (Derma Co app, Minimalist "Skin Insights")

### Trust and content

- [ ] MUST: claim badges: Dermatologically Tested, Clinically Tested, Cruelty Free, Vegan, Fragrance Free, Paraben Free, Sulfate Free (Foxtale, Plum, Dot & Key)
- [ ] MUST: "Featured In" press logos (Foxtale, Dot & Key)
- [ ] MUST: ingredient glossary (Foxtale footer "Ingredients Glossary"; Paula's Choice rates Best, Good, Average, Bad, Worst)
- [ ] MUST: blog with author and date ("Foxtale R&D Team")
- [ ] MUST: caution notice: brand never asks for OTP or payment on calls (Foxtale, Dot & Key, Deconstruct)
- [ ] MUST: footer with Grievance Redressal, Corporate Information, registered office, CIN, GST (Minimalist, Derma Co, Deconstruct)
- [ ] NICE: Team Dermatologists / Our Philosophy page (Deconstruct)
- [ ] NICE: "Also on" marketplace strip: Amazon, Flipkart, Nykaa, Myntra, Purplle, Blinkit, Zepto, Instamart (Deconstruct)
- [ ] NICE: empties recycling programme (Plum Empties4good)

### WhatsApp and support

- [ ] MUST: floating WhatsApp button; "AI WhatsApp Support" number in footer (Minimalist)
- [ ] MUST: WhatsApp flow previews: order confirmed, COD confirm with Confirm/Cancel buttons, shipped with tracking link, out for delivery, delivered plus review request, cart reminder 15 to 60 minutes after drop off
- [ ] MUST: unticked consent box at checkout: "Send order updates on WhatsApp"
- [ ] NICE: callback form "within 30 seconds" and "AI-powered help, Chat or Call" (Derma Co)

### Offers

- [ ] MUST: count bundles: B1G1 (Deconstruct), Buy 2 Get 3rd Free (Minimalist), Buy 2 Get 2 Free (Derma Co), Buy any 2 @ ₹699 (Dot & Key)
- [ ] MUST: cart value coupons in steps (Minimalist ATC5, ATC10, ATC15)
- [ ] MUST: free gift above a value (Plum ₹999), combos at up to 35% off (Deconstruct), extra 5% on prepaid (Dot & Key)
- [ ] NICE: coins and cashback (MCash, FoxCoins, Dcoins 10%), Refer and Earn ₹100 each (Derma Co)
- [ ] NICE: Build your own bundle or gift box, e-gift card (Minimalist, Plum); first order and app only offers

## Copy and compliance notes

- Claim words: "visibly", "helps", "may help", "appearance of", "for acne-prone skin", "in 4 weeks with daily use". Never "cures", "treats", "removes acne permanently", "100% results".
- Every number needs study type, people and days: "In a 28 day consumer study of 32 people, 94% said their skin looked more even". Label consumer perception separately from instrument results.
- Cosmetics cannot claim to treat disease (Drugs and Cosmetics Act); ASCI expects proof for every claim. Add "Patch test before use. Not a substitute for medical advice."
- Sunscreen: give SPF and PA as tested values with method (in vivo, ISO 24444:2019). Avoid "sunblock" and "full protection".
- Price display: "MRP ₹X (inclusive of all taxes)", unit price per g or ml, net quantity, country of origin, manufacturer or marketer name and address, customer care contact (Legal Metrology and E-Commerce Rules 2020).
- CCPA dark patterns guidelines 2023: no fake countdowns or fake "only 2 left", no pre-ticked paid add-ons, show the COD fee before the last step.
- Reviews: show Verified Buyer and do not hide negative reviews (The Ordinary "posts ALL reviews"; BIS IS 19000:2022).
- Do not use the PETA bunny or press logos of real outlets in the demo; use generic "Cruelty free" text and placeholder press names. Mark all study figures as sample data.
- Spelling: Indian English (moisturiser, colour), prices as ₹499.
