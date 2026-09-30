# E-Commerce Frontend (Next.js + TypeScript + Tailwind)

App Router frontend for the storefront + admin panel. Talks only to the
Express backend over REST — no Cloudinary or Razorpay secrets ever live here,
only the public `NEXT_PUBLIC_RAZORPAY_KEY_ID`.

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your running backend
npm run dev                   # http://localhost:3000
```

## Structure

```
src/
├── app/           Next.js App Router pages (routing + composition only)
├── components/    ui / layout / products / cart / checkout / orders / auth / admin
├── services/      one file per backend resource — the only place Axios is used
├── store/         Zustand: auth, cart, wishlist, ui (theme)
├── hooks/         useAuth, useCart, useWishlist, useProducts, useDebounce
├── providers/     ThemeProvider (light/dark/system), AuthProvider
├── types/         shared TS interfaces mirroring the backend models
└── utils/         formatCurrency, formatDate, cn, loadRazorpayScript
```

## Notes

- Product/category detail routes are folders named `[slug]` per the frozen
  structure, but the value passed is actually the MongoDB `_id`, since the
  backend's `GET /api/products/:id` looks up by id. Swap in a real slug once
  a slug-based backend route exists — nothing else on the page needs to change.
- `RazorpayButton.tsx` is the only place that talks to the Razorpay JS SDK,
  and it never marks a payment successful itself — it hands the gateway's
  response to `/api/payments/verify` and reacts to what the backend decides.
- Admin pages live under `/admin` and are wrapped in `ProtectedRoute
  adminOnly`, but that's a UX guard only — the backend's `adminMiddleware`
  is what actually enforces it.
