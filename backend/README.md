# E-Commerce Backend (Express + TypeScript + MongoDB)

Production-style REST API for the e-commerce project. Follows:

```
Route → Controller → Service → Model → MongoDB
```

Controllers only handle HTTP; all business rules (stock checks, price
recalculation, order totals, review eligibility, payment verification) live
in `src/services/*`.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary + Razorpay keys
npm run seed            # creates ~150 products, 10 categories, admin + test user
npm run dev              # http://localhost:5000/api
```

Demo accounts created by the seed script:
- `admin@example.com` / `Admin@12345`
- `customer@example.com` / `Customer@12345`

## Key architectural decisions

- **Cloudinary & Razorpay never touch the frontend beyond a public key.**
  Uploads go `multer (memory) → cloudinaryService → Cloudinary`; MongoDB only
  stores `{ url, publicId }`. Payments go
  `paymentService → Razorpay SDK`, and the payment popup result is **never**
  trusted — `verifyRazorpaySignature` recomputes the HMAC server-side before
  an order is marked paid.
- **The backend recalculates every price.** `orderService.createOrderFromCart`
  ignores any client-sent totals, re-reads each product's current price and
  stock inside a MongoDB transaction, and only then creates the order and
  decrements stock.
- **Reviews require proof of purchase.** `reviewService.createReview` checks
  that the calling user (from the JWT, not the request body) owns a
  `DELIVERED` order containing that product.
- **Admin is enforced server-side.** `adminMiddleware` checks `req.user.role`
  on every `/api/admin/*` route and on write endpoints for products/categories.

## API surface

```
/api/auth            register, login, me
/api/products         list (search/filter/sort/paginate), details, admin CRUD, image mgmt
/api/products/:id/reviews   list + create reviews for a product
/api/reviews/:id       edit/delete own review
/api/categories        list, details, admin CRUD
/api/cart               get/add/update/remove/clear
/api/wishlist           get/add/remove/clear
/api/orders              create (from cart), list mine, details, cancel
/api/payments            create-order (Razorpay), verify, failed
/api/users/profile       update profile/avatar
/api/admin/*             dashboard stats, users, orders (list/status/payment)
```

Full response envelope:
```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "..." }
```

## Notes / things you'll still want to do before shipping

- Add integration tests (Jest + Supertest) around checkout and payment
  verification — those two flows are the ones worth the most test coverage.
- Add a Razorpay **webhook** endpoint as a backup to the client-driven verify
  call, in case the browser closes before `verify` fires after a successful
  payment.
- Swap the flat 18% tax / ₹79 shipping constants in `cartService`/`orderService`
  for whatever real rule you want, or move them to `.env`.
