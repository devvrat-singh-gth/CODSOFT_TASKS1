# aURaBazaar Backend

The aURaBazaar backend is a TypeScript REST API built with Node.js, Express and MongoDB.

It manages authentication, authorization, products, categories, carts, wishlists, reviews, orders, payments, users, media uploads and administrator operations.

Business logic is separated from HTTP controllers through a service-based architecture.

## Tech Stack

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

## Architecture

```text
HTTP Request
     │
     ▼
    Route
     │
     ▼
 Middleware
     │
     ▼
 Controller
     │
     ▼
   Service
     │
     ▼
Mongoose Model
     │
     ▼
   MongoDB
```

External services are accessed through dedicated configuration/service layers rather than directly from route handlers.

## Source Structure

```text
src/
├── config/       # Database and third-party configuration
├── controllers/  # HTTP request/response handlers
├── middleware/   # Authentication, validation, errors, uploads, limits
├── models/       # Mongoose schemas and models
├── routes/       # REST endpoint definitions
├── scripts/      # Utility scripts such as database seeding
├── services/     # Business logic and database operations
├── types/        # Shared backend TypeScript types
├── utils/        # API helpers and reusable utilities
├── validators/   # Request validation rules
├── app.ts        # Express application
└── server.ts     # Server startup
```

## Domain Modules

The API contains dedicated modules for:

* Authentication
* Users
* Products
* Categories
* Cart
* Wishlist
* Orders
* Payments
* Reviews
* Administration

## Models

MongoDB persistence is organized around:

```text
User
Product
Category
Cart
Wishlist
Order
Payment
Review
```

## Request Processing

A normal request follows this pattern:

```text
Route
  │
  ├── Validation
  ├── Authentication when required
  └── Authorization when required
          │
          ▼
      Controller
          │
          ▼
        Service
          │
          ▼
      MongoDB / External Service
```

Controllers remain focused on HTTP concerns while services contain most domain operations.

## Authentication

Protected API endpoints use JWT authentication.

Authentication middleware:

1. reads the supplied authentication credentials
2. validates the token
3. identifies the authenticated user
4. makes the user available to protected handlers

Administrator operations additionally pass through admin authorization middleware.

Frontend route protection improves UX, but backend middleware remains responsible for actual access control.

## Products

The product API supports operations such as:

* product listing
* product details
* slug-based product retrieval
* search
* category filtering
* price filtering
* sorting
* pagination
* featured products
* administrator create/update/delete operations
* Cloudinary-backed product images

Public product queries only expose applicable active catalog entries.

## Categories

Categories are stored separately and referenced by products.

Public category filtering uses category slugs while MongoDB relationships use category object IDs internally.

## Cart and Wishlist

Authenticated users can maintain persistent:

* carts
* cart quantities
* wishlists

Product references are stored in MongoDB and expanded as required by API responses.

## Reviews

Review functionality supports product ratings and review data while keeping aggregate product rating information available for catalog displays.

Administrative review functionality allows moderation through protected API routes.

## Orders

The order layer manages checkout-generated order information, purchased items, totals, payment information and order status.

Users can access their own order history and individual orders.

Administrators can manage applicable order operations through admin endpoints.

## Payments

The payment module integrates Razorpay and includes signature-verification utilities.

Payment-sensitive verification is performed on the backend rather than trusting values supplied by the browser.

Cash on Delivery can also be enabled through backend configuration.

## Media Uploads

Uploads pass through upload middleware before being sent to Cloudinary.

The server does not rely on a permanent local image directory.

MongoDB stores Cloudinary metadata such as:

```text
url
publicId
```

This keeps application instances stateless with respect to uploaded media.

## Error Handling

The backend uses centralized error handling.

Reusable utilities provide consistent API errors and responses rather than manually constructing different response shapes in every controller.

The application also provides not-found handling for unsupported routes/resources.

## Validation

Request validation is separated by domain.

Validators currently cover areas including:

* authentication
* cart
* categories
* orders
* payments
* products
* reviews

Validation occurs before business logic whenever applicable.

## Rate Limiting

Rate limiting protects API routes from excessive requests.

Authentication endpoints use stricter limits than general API traffic.

Production deployments with multiple backend instances should eventually move rate-limit state to shared infrastructure.

## Environment Variables

Create:

```text
backend/.env
```

from:

```text
backend/.env.example
```

Configuration includes areas such as:

* server port
* frontend URL
* MongoDB connection
* JWT secret and expiration
* Cloudinary credentials
* Razorpay credentials
* Cash on Delivery configuration

Never commit the real `.env` file.

## Local Development

```bash
cd backend
npm install
npm run dev
```

The API normally runs at:

```text
http://localhost:5000
```

## Production Build

```bash
npm run build
npm run start
```

Use the seed script configured in `package.json` only when development/sample data is needed.

Do not run development seed operations against production unless explicitly designed for that environment.

## API Areas

The application exposes REST routes grouped around:

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

Specific route protection depends on the operation.

## Security Measures Already Present

The current backend includes:

* JWT authentication
* Admin authorization
* Request validation
* API rate limiting
* Upload controls
* Centralized error handling
* Environment-based secrets
* CORS configuration
* Razorpay signature verification
* Protected customer resources

## Cloudinary Flow

```text
Client Upload
     │
     ▼
Express Upload Middleware
     │
     ▼
Cloudinary Service
     │
     ▼
Cloudinary
     │
     ▼
URL + publicId
     │
     ▼
MongoDB Product/User Record
```

## Payment Flow

```text
Checkout
   │
   ▼
Backend Payment API
   │
   ▼
Razorpay Order
   │
   ▼
Frontend Razorpay Checkout
   │
   ▼
Payment Result
   │
   ▼
Backend Signature Verification
   │
   ▼
Payment / Order State
```

Payment verification must remain server-side.

## Future Production Enhancements

This section represents the remaining backend production-hardening work and can be removed once completed.

### Automated Testing

* Add unit tests for services and utilities
* Add controller/API integration tests
* Add authentication tests
* Add authorization tests
* Add validation tests
* Add product and inventory tests
* Add cart/wishlist tests
* Add order tests
* Add payment verification tests
* Add admin permission tests
* Run all tests automatically in CI

### Authentication Security

* Add password reset/account recovery
* Add email verification if required
* Add session/token revocation strategy
* Review production access-token lifetime
* Add refresh-token architecture if required
* Rotate refresh tokens when implemented
* Add administrator MFA if needed
* Add stronger suspicious-login/brute-force controls

### API Security

* Apply production security headers
* Review Content Security Policy requirements
* Harden production CORS allowlists
* Review every endpoint for object-level authorization
* Validate/sanitize all externally supplied data
* Review MongoDB query injection protections
* Strengthen upload MIME/file-signature verification
* Add audit logging for security-sensitive admin operations
* Add automated dependency vulnerability scanning
* Ensure secrets and sensitive request values never reach logs

### Rate Limiting

* Replace process-local rate-limit storage with shared storage when horizontally scaling
* Add endpoint-specific limits for expensive operations
* Add payment-specific protection
* Add upload-specific protection
* Monitor repeated authentication failures

### Payment Reliability

* Configure production Razorpay webhook handling
* Authenticate webhook signatures
* Store processed webhook event identifiers
* Make webhook handling idempotent
* Make payment confirmation idempotent
* Prevent duplicate orders/payments
* Reconcile ambiguous payment states with Razorpay
* Handle asynchronous payment updates
* Add refund support where required
* Add cancellation/refund state transitions
* Add reconciliation tooling/logging
* Test every payment failure/interruption path

### Orders and Inventory Consistency

* Use atomic operations/transactions where consistency requires them
* Prevent checkout from overselling products
* Safely decrement stock
* Restore applicable inventory after cancellations/refunds
* Validate all server-side prices at checkout
* Never trust totals calculated only by the client
* Define explicit allowed order-status transitions
* Protect administrative status changes
* Add cancellation/return/refund rules as required

### Database

* Review indexes for:

  * product slug
  * product search/filter fields
  * category slug
  * user email
  * order lookup fields
  * review/product relationships
* Add compound indexes based on measured query patterns
* Review slow queries
* Configure automated backups
* Document restore procedures
* Configure production IP/network access restrictions
* Review connection-pool configuration
* Plan safe schema/data migrations

### Observability

* Add structured logger
* Add request IDs/correlation IDs
* Add centralized exception monitoring
* Add production error tracking
* Add API latency monitoring
* Add database monitoring
* Add uptime monitoring
* Add payment failure alerts
* Add order-processing alerts
* Add log retention strategy

### Performance and Scaling

* Profile high-traffic API routes
* Optimize Mongoose projections and populations
* Review pagination limits
* Cache appropriate read-heavy responses
* Add Redis when shared caching is justified
* Add background queues for retryable/long-running work
* Avoid blocking request handlers with slow third-party tasks
* Add load testing
* Review MongoDB connection limits before scaling instances

### Cloudinary

* Apply production image transformation policies
* Validate accepted formats
* Review maximum dimensions/file sizes
* Ensure replaced/deleted product images are also cleaned from Cloudinary
* Add cleanup/reconciliation tooling for orphaned assets if required

### Deployment

* Deploy backend to production infrastructure
* Configure production secrets
* Separate development/staging/production configuration
* Add CI/CD
* Add health/readiness checks
* Add deployment rollback strategy
* Configure trusted proxy settings correctly for the hosting platform
* Verify HTTPS and secure origin configuration
* Review graceful shutdown behavior

### Documentation

* Add OpenAPI/Swagger documentation
* Document authenticated endpoints
* Document request/response schemas
* Document error response format
* Document payment callbacks/webhooks
* Document administrator operations
* Keep `.env.example` synchronized with configuration
* Document backup/recovery and production operations

### Production Operations

* Define database backup policy
* Define incident/error escalation procedure
* Define payment reconciliation procedure
* Define log retention policy
* Define admin access policy
* Add monitoring alerts before public production traffic
