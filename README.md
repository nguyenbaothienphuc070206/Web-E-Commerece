# Web E-Commerce (Next.js)

Modern e-commerce demo built with Next.js (App Router) + TypeScript.

## Requirements

- Node.js 18+ (recommended)
- npm (or pnpm/yarn)

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env.local
```

If `.env.example` does not exist yet, create `.env.local` and add only what you use.

## Environment variables

This project uses these server-side variables (some features are optional):

- `NEXT_PUBLIC_SUPABASE_URL` (required for DB-backed features)
- `SUPABASE_SERVICE_ROLE_KEY` (required for server-side search/chat/seed)
- `GEMINI_API_KEY` (required for search/chat embeddings and chat responses)
- `OPENAI_API_KEY` (required only for `/api/embed`)
- `ADMIN_SEED_SECRET` (required only for admin seed endpoint)

## Development

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` - start dev server
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run start` - start production server

## Notes

- API routes live under `app/api/*`.
- If you do not configure Supabase/Gemini, search/chat features will return server configuration errors.
