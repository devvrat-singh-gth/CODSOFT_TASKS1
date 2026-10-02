# aURaBazaar

aURaBazaar is a full-stack e-commerce application built around a separate Next.js frontend and Express REST API backend.

The application covers the main customer shopping workflow from product discovery to checkout and order tracking, while also providing an admin area for managing products, categories, users, reviews and orders.

The project focuses on a responsive user experience, clear frontend/backend separation and a maintainable service-based backend architecture.

## Features

### Customer

* User registration and login
* JWT-based authentication
* User profile management
* Product browsing
* Product detail pages
* Category-based browsing
* Search with debounced requests
* Product filtering and sorting
* Ratings and reviews
* Shopping cart
* Wishlist
* Quantity and stock handling
* Checkout flow
* Cash on Delivery support
* Razorpay payment integration
* Order history
* Individual order details and status timeline
* Responsive mobile, tablet and desktop layouts
* Light, dark and system themes

### Administration

* Protected admin dashboard
* Product management
* Product image uploads
* Category management
* Order management
* User management
* Review management
* Inventory-related product controls

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Axios
* Zustand
* React Hook Form
* Zod
* Lucide React
* Sonner

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* Cloudinary
* Razorpay
* Multer
* Request validation
* API rate limiting

## External Services

**MongoDB** stores application data including users, products, categories, carts, wishlists, orders, payments and reviews.

**Cloudinary** stores uploaded product and user media. The application stores Cloudinary URLs and public IDs instead of keeping uploaded files inside the repository.

**Razorpay** provides the online payment workflow.

## Project Structure

```text
Ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── providers/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   └── README.md
│
└── README.md
```

Generated directories such as `node_modules` and `.next` are intentionally excluded from the structure above.

## Application Workflow

```text
Browser
   │
   ▼
Next.js Frontend
   │
   │ REST API requests
   ▼
Express API
   │
   ├── Routes
   │
   ├── Middleware
   │
   ├── Controllers
   │
   ├── Services
   │
   └── Mongoose Models
           │
           ▼
        MongoDB

External integrations:
Express ──► Cloudinary
Express ──► Razorpay
```

The frontend is responsible for presentation, user interaction and client-side application state.

The backend owns business rules, validation, authentication, authorization, database access, media operations and payment processing.

## Main Shopping Flow

```text
Browse / Search Products
        │
        ▼
Product Details
        │
        ├── Wishlist
        │
        └── Add to Cart
                │
                ▼
               Cart
                │
                ▼
             Checkout
                │
        ┌───────┴────────┐
        ▼                ▼
       COD            Razorpay
        │                │
        └───────┬────────┘
                ▼
              Order
                │
                ▼
        Order History / Status
```

## Admin Flow

```text
Authenticated User
        │
        ▼
Admin Authorization
        │
        ▼
Admin Dashboard
        │
        ├── Products
        ├── Categories
        ├── Orders
        ├── Users
        └── Reviews
```

## Local Development

### Requirements

Install:

* Node.js
* npm
* MongoDB Atlas account or MongoDB instance
* Cloudinary account
* Razorpay credentials when testing online payments

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ecommerce
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create the backend environment file using:

```text
backend/.env.example
```

Then start the development server:

```bash
npm run dev
```

The backend normally runs at:

```text
http://localhost:5000
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

using:

```text
frontend/.env.example
```

Then run:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:3000
```

## Common Commands

### Frontend

```bash
cd frontend

npm install
npm run dev
npm run build
npm run start
npm run lint
```

### Backend

```bash
cd backend

npm install
npm run dev
npm run build
npm run start
```

Use the seed script defined by the backend package when sample database data is required.

## Environment Configuration

Environment files containing secrets must not be committed.

Use the provided examples as templates:

```text
backend/.env.example
frontend/.env.example
```

Backend configuration includes values for areas such as:

* MongoDB connection
* JWT configuration
* frontend origin
* Cloudinary
* Razorpay
* server configuration
* payment options

Frontend configuration contains only values intended to be exposed to the browser, such as the public API base URL and required public payment configuration.

## Data Areas

The backend currently maintains separate models for:

* Users
* Products
* Categories
* Carts
* Wishlists
* Orders
* Payments
* Reviews

This keeps customer activity, catalog information and transactional data separated while still allowing relationships through MongoDB references.

## API Organization

REST endpoints are grouped by domain:

```text
/api/auth
/api/users
/api/products
/api/categories
/api/cart
/api/wishlist
/api/orders
/api/payments
/api/reviews
/api/admin
```

Routes pass requests through the necessary validation, authentication and authorization middleware before reaching controllers and services.

## Security Already Included

The current project includes:

* Password-based authentication
* JWT authentication
* Protected routes
* Admin authorization
* Request validation
* API rate limiting
* Centralized error handling
* Upload restrictions
* Payment signature verification
* Environment-based secrets
* CORS configuration

Security-sensitive values remain outside source control.

## Development Notes

The frontend and backend are intentionally independent applications inside one repository.

This allows them to:

* run independently during development
* use separate environment files
* be deployed independently
* scale independently later
* preserve a clean REST API boundary

## Future Production Enhancements

This section tracks production hardening that is intentionally outside the current project scope. Once these items are completed, this entire section can be removed without changing the rest of the README.

### Deployment and Infrastructure

* Deploy the production frontend and backend
* Configure production environment variables separately from local development
* Configure production frontend/backend CORS allowlists
* Use custom production domains and HTTPS
* Add automated CI/CD for linting, testing and deployment
* Add staging and production environments
* Add Docker configuration if containerized deployment becomes necessary
* Add production health/readiness endpoints where required
* Define rollback procedures for failed deployments

### Authentication and Account Security

* Add secure password-reset and account-recovery flow
* Add email verification if required for production accounts
* Add refresh-token or hardened session strategy if long-lived authentication is required
* Review token storage and rotation strategy for production
* Add login/session revocation
* Add stronger brute-force protection
* Add optional multi-factor authentication for administrator accounts
* Add security-sensitive account activity notifications

### API and Application Security

* Perform a production security audit
* Apply production security headers
* Review CSP configuration
* Tighten CORS configuration
* Validate and sanitize every external input
* Review upload MIME-type and file-signature validation
* Add distributed rate-limit storage when running multiple backend instances
* Add audit logs for sensitive administrator actions
* Review authorization checks for object-level access
* Prevent sensitive information from appearing in production logs
* Run dependency vulnerability checks as part of CI

### Payment Production Hardening

* Switch Razorpay integration from test credentials to live credentials
* Configure and verify production webhooks
* Store and verify webhook event IDs
* Make payment/order operations idempotent
* Prevent duplicate payment/order processing
* Reconcile payment state with Razorpay before final order confirmation
* Handle failed, cancelled and interrupted payments
* Add refund processing where required
* Add cancellation/refund status handling
* Add payment reconciliation and operational logging
* Protect payment state transitions from client-side manipulation

### Orders and Inventory

* Make critical stock/order updates transaction-safe where necessary
* Prevent overselling during concurrent checkout requests
* Reserve or atomically decrement inventory during confirmed purchases
* Restore inventory correctly after applicable cancellations/refunds
* Formalize allowed order-status transitions
* Add order cancellation rules
* Add return/refund workflow if required by the final store policy
* Generate invoices or downloadable order receipts if required
* Add low-stock alerts for administrators

### Database Reliability

* Review and add production MongoDB indexes for common search/filter/sort fields
* Add unique indexes for fields that require uniqueness
* Review query performance using production-like data
* Configure database backups
* Define backup restore procedures
* Configure production database access/network restrictions
* Configure monitoring and alerts for database availability
* Add safe migration/data-maintenance procedures as the schema evolves

### Testing

* Add backend unit tests
* Add service-layer tests
* Add API integration tests
* Add authentication/authorization tests
* Add payment workflow tests
* Add frontend component tests
* Add critical user-flow tests
* Add end-to-end tests for:

  * registration/login
  * product browsing
  * search/filtering
  * cart
  * wishlist
  * checkout
  * payments
  * orders
  * admin operations
* Run automated tests through CI before production deployment

### Observability

* Add structured production logging
* Add centralized error tracking
* Add frontend error monitoring
* Add backend exception monitoring
* Add request correlation IDs where useful
* Add uptime monitoring
* Add API latency/error-rate monitoring
* Add alerts for payment and order-processing failures
* Add operational dashboards for production health

### Performance and Scalability

* Profile frontend bundle size
* Optimize large client-side dependencies
* Review Next.js rendering and caching strategies
* Optimize Cloudinary transformations and responsive images
* Add API/database caching where measurements justify it
* Add Redis when shared caching, sessions, queues or distributed rate limiting require it
* Introduce background job queues for slow or retryable tasks
* Review pagination limits for large catalogs
* Optimize database projections and population operations
* Load-test important APIs before meaningful production traffic
* Configure CDN and browser caching policies appropriately

### Search and Catalog Quality

* Add indexed/full-text search when catalog size outgrows basic MongoDB search
* Add search suggestions/autocomplete if required
* Improve typo tolerance and relevance ranking
* Add product recommendation/related-product logic if required
* Add recently viewed products if required
* Add advanced inventory and availability states

### Frontend Production Quality

* Complete accessibility testing against WCAG expectations
* Verify keyboard navigation across dialogs, drawers and forms
* Verify focus management and screen-reader labels
* Add route-level error boundaries where useful
* Add dedicated loading/not-found/error states where still missing
* Audit every layout across mobile, tablet and large desktop resolutions
* Run production Lighthouse audits
* Optimize Core Web Vitals
* Verify all interactive states with slow and failed API requests

### SEO and Discovery

* Finalize page-level metadata
* Add Open Graph metadata
* Add social preview assets
* Add canonical URLs where required
* Add sitemap generation
* Add robots configuration
* Add structured product data where appropriate
* Add descriptive product/category metadata
* Review indexability of customer-only and admin pages

### Email and Notifications

* Add provider-agnostic transactional email infrastructure if required
* Add order confirmation notifications
* Add payment confirmation notifications
* Add cancellation/refund notifications
* Add password-reset messages
* Add low-stock/admin alerts where useful
* Ensure email delivery failures do not break order processing

### Legal and Operational Requirements

Before operating as a real public store:

* Add finalized privacy policy
* Add terms and conditions
* Add shipping policy
* Add cancellation and refund policy
* Add cookie/privacy controls where legally required
* Define retention/deletion policy for user data
* Review payment-provider production requirements
* Review applicable tax/invoicing requirements
* Add customer support/contact workflow

### Documentation

* Publish formal API documentation
* Document authentication requirements for protected endpoints
* Document admin operations
* Document production environment configuration
* Document deployment and rollback procedures
* Document backup/restore procedures
* Keep `.env.example` files synchronized with required configuration

## Repository Layout

Detailed implementation notes are available inside the repository folders:

```text
frontend/README.md
backend/README.md
```

## License

This project was created as a full-stack development and portfolio project. Add the appropriate license before distributing or accepting external contributions.
