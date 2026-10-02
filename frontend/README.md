# aURaBazaar Frontend

The aURaBazaar frontend is a responsive e-commerce web application built with Next.js, React and TypeScript.

It communicates with the aURaBazaar REST API for authentication, products, categories, cart, wishlist, checkout, payments, orders, reviews and administration.

## Tech Stack

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

## Main Features

### Storefront

* Responsive landing page
* Featured product presentation
* Product browsing
* Product search
* Debounced search requests
* Category browsing
* Product filtering
* Product sorting
* Pagination
* Product detail pages
* Responsive product image galleries
* Ratings and reviews
* Stock information

### Shopping

* Add/remove cart items
* Quantity management
* Cart totals
* Wishlist
* Checkout
* Address form
* Payment selection
* Cash on Delivery workflow
* Razorpay checkout integration
* Order history
* Order detail pages
* Order status timeline

### User Experience

* Registration
* Login
* Protected pages
* User profile
* Authenticated navigation
* Mobile navigation drawer
* Responsive layouts
* Skeleton/loading states
* Empty states
* Toast notifications
* Light theme
* Dark theme
* System theme support

### Administration

Protected administrator routes provide interfaces for:

* Dashboard statistics
* Products
* Product creation and editing
* Categories
* Orders
* Users
* Reviews

## Frontend Architecture

```text
src/
├── app/          # Routes and page layouts
├── components/   # Reusable UI and domain components
├── hooks/        # Reusable application hooks
├── lib/          # Shared constants/configuration
├── providers/    # Global React providers
├── services/     # REST API client functions
├── store/        # Client-side state
├── types/        # TypeScript application models
└── utils/        # Formatting and helper functions
```

## Application Layers

### `app/`

Contains Next.js routes for:

```text
/
├── products/
├── categories/
├── cart/
├── wishlist/
├── checkout/
├── orders/
├── profile/
├── login/
├── register/
└── admin/
```

Dynamic routes are used for product, category, order and admin product pages.

### `components/`

Reusable components are organized by domain:

```text
admin/
auth/
cart/
checkout/
layout/
orders/
products/
ui/
```

This prevents large route files from owning all UI logic.

### `services/`

Services provide the boundary between UI code and the backend API.

Examples include:

* authentication
* products
* categories
* cart
* wishlist
* orders
* payments
* reviews

Pages and hooks call these services rather than manually repeating API requests.

### `hooks/`

Application hooks encapsulate reusable behavior such as:

* authentication
* product retrieval
* cart state
* wishlist state
* debouncing

### `store/`

Client-side stores maintain shared application state for areas including:

* authentication
* cart
* wishlist
* UI state

### `providers/`

Global providers initialize application-level functionality such as:

* authentication
* theme state

## Request Flow

```text
Page / Component
      │
      ▼
Hook / Event Handler
      │
      ▼
Service
      │
      ▼
Axios API Client
      │
      ▼
Express REST API
```

The frontend does not directly access MongoDB or Cloudinary credentials.

All protected business operations are performed through the backend API.

## Product Search

Search is integrated with the products route.

The navigation search:

1. stores the current input value
2. debounces typing
3. updates the `/products?search=...` URL
4. allows the products page to request matching data

This avoids making an API request for every individual keystroke.

## Product Filtering

The products page supports filters such as:

* category
* minimum price
* maximum price
* sorting

Category filtering uses the category slug expected by the backend API.

Filters are presented through responsive drawer/sheet behavior depending on screen size.

## Authentication

Frontend authentication communicates with the backend authentication endpoints and exposes authenticated state through the application's auth layer.

Protected UI checks are used for customer and administrator routes.

Backend authorization remains the authoritative security layer.

Client-side protected routes should never be treated as a replacement for API authorization.

## Themes

The application supports:

* Light
* Dark
* System

Theme-dependent UI is implemented using Tailwind dark-mode classes and the global theme provider.

Brand assets can also respond to the current theme.

## Responsive Design

The frontend is designed for:

* Mobile
* Tablet
* Laptop
* Desktop
* Large desktop displays

Layouts use responsive sizing, flexible containers and breakpoint-aware navigation rather than maintaining separate applications for mobile and desktop.

## Environment Variables

Create:

```text
frontend/.env.local
```

from:

```text
frontend/.env.example
```

Only public/browser-safe configuration should use `NEXT_PUBLIC_*` variables.

Never expose backend secrets, JWT secrets, MongoDB credentials, Cloudinary secrets or Razorpay secret keys through frontend environment variables.

## Local Development

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend must also be running and accessible through the frontend API configuration.

## Production Build

```bash
npm run build
npm run start
```

Run lint checks with:

```bash
npm run lint
```

## Important Directories

```text
public/
```

Contains browser-accessible static assets such as logos and favicons.

```text
src/app/
```

Contains Next.js routes and layouts.

```text
src/components/
```

Contains reusable application UI.

```text
src/services/
```

Contains backend API integrations.

```text
src/store/
```

Contains shared client-side state.

```text
src/types/
```

Contains shared frontend TypeScript interfaces.

## Static Assets

Files inside:

```text
public/
```

are available from the site root.

For example:

```text
public/logo.svg
```

is accessed as:

```text
/logo.svg
```

## API Error Handling

The shared Axios API client centralizes request behavior and API error handling.

Individual pages/components should display user-friendly states using:

* loading indicators
* skeletons
* empty states
* toast messages
* dedicated error UI where appropriate

## Build Requirements

Before a production frontend deployment:

```bash
npm install
npm run lint
npm run build
```

The build should complete without TypeScript or Next.js errors.

## Future Production Enhancements

This section represents remaining frontend production hardening. It can be removed once the production work is complete.

### Reliability

* Add route-level error boundaries where necessary
* Add consistent retry/recovery behavior for recoverable requests
* Verify every important page under API failure conditions
* Verify session-expiration behavior
* Improve offline/network-loss messaging
* Ensure duplicate user actions cannot submit checkout/payment operations repeatedly

### Testing

* Add unit tests for utilities and hooks
* Add component tests
* Add authentication UI tests
* Add cart/wishlist tests
* Add product search/filter tests
* Add checkout tests
* Add administrator UI tests
* Add end-to-end customer flows
* Run frontend tests automatically through CI

### Accessibility

* Perform complete keyboard-navigation review
* Validate focus trapping/restoration for drawers and dialogs
* Review color contrast
* Review form labels and error associations
* Validate screen-reader naming
* Verify reduced-motion behavior
* Run automated accessibility checks in CI where practical

### Performance

* Run production Lighthouse audits
* Optimize Core Web Vitals
* Review client bundle size
* Dynamically load heavy UI where appropriate
* Optimize hero/carousel behavior
* Review unnecessary client components
* Reduce avoidable rerenders
* Review API request duplication
* Optimize responsive image sizes
* Verify Cloudinary/Next.js image optimization configuration

### SEO

* Complete route-specific metadata
* Add Open Graph metadata
* Add social preview images
* Add sitemap
* Add robots rules
* Add canonical URLs where required
* Add product structured data
* Prevent account/admin/private pages from inappropriate indexing

### Production Deployment

* Configure production API URL
* Configure allowed image hosts
* Configure production environment variables
* Verify HTTPS-only production requests
* Configure frontend deployment pipeline
* Add deployment preview/staging workflow
* Add frontend monitoring/error tracking

### User Experience

* Test all supported viewport sizes
* Verify loading, empty and failure states
* Improve slow-network behavior
* Validate touch targets
* Validate checkout on mobile devices
* Verify browser compatibility
* Add user-friendly maintenance/unavailable-service states if required
