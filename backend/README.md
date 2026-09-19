# Backend

Backend API for the WorkOrbit Project Management Tool.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Neon
- JWT Authentication

## Workflow

```text
Client Request
      │
      ▼
Express Routes
      │
      ▼
Controllers
      │
      ▼
Prisma ORM
      │
      ▼
Neon PostgreSQL
```

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
CLIENT_URL=
```

## Installation

```bash
npm install

npm run dev
```

Runs on:

```text
http://localhost:5000
```