# GetwithUs demo websites

Complete, clickable template websites we show to clients. The businesses are made up, every page
says so, and bookings, orders and payments are pretend. Served at **getwithus.in/demos** through
the main site (Next.js multi-zones: this app has `basePath: "/demos"`).

| Demo                                     | Path                    | What it shows                                                                                                               |
| ---------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Ivorine Dental Studio (business website) | `/demos/dental-clinic`  | Treatments with prices, dentists, smile gallery, reviews, fees and EMI, online booking, a WhatsApp assistant                |
| Oruvi Skin (online shop)                 | `/demos/skincare`       | Shop by concern, product pages, cart and coupons, checkout with demo payment, order tracking, skin quiz, WhatsApp assistant |
| Oruvi Skin owner dashboard               | `/demos/skincare/admin` | Sales, orders, GST invoices, products, stock, customers, discounts, analytics (demo login pre-filled)                       |

Everything runs in the visitor's browser: no database, no network calls. Shop orders, the owner's
edits and dental bookings are kept in localStorage, so each visitor has their own sandbox.

## Develop

```sh
pnpm install
pnpm dev          # http://localhost:3100/demos
pnpm check        # typecheck, lint, tests
pnpm build
```

- Photos: labelled placeholders at exact sizes, listed in `src/sites/*/images/PHOTOS.md`. Replace a
  file under the same name to swap in a real photo. Product images are SVG pack renders
  (`src/sites/skincare/components/ProductVisual.tsx`).
- New placeholder: `pnpm placeholder <file.jpg> <width> <height> "<what it shows>" "#hex"`.
- Visit counting: one anonymous `demo_visited` event per visit to PostHog through the main site's
  `/gwr` proxy, which posts "Someone visited the ... demo" to Discord. Needs `NEXT_PUBLIC_POSTHOG_KEY`
  (see `.env.example`); without it nothing is sent.
- Research behind each demo: `docs/research/`.
