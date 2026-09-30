# E-Commerce Project

```
Ecommerce/
├── backend/    Express + TypeScript + MongoDB + Cloudinary + Razorpay
├── frontend/   Next.js (App Router) + TypeScript + Tailwind
└── README.md
```

## Quick start

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env    # fill MONGO_URI + JWT_SECRET at minimum
   npm run seed              # ~150 demo products, categories, admin + test user
   npm run dev                # http://localhost:5000/api
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev                # http://localhost:3000
   ```

Demo logins from the seed script:
- Admin: `admin@example.com` / `Admin@12345`
- Customer: `customer@example.com` / `Customer@12345`

See `backend/README.md` and `frontend/README.md` for the architecture notes
specific to each half.
