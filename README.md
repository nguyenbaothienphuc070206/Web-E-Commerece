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

Auth (required for login/session):

- `AUTH_SECRET` (required, random secret used to sign the HttpOnly session cookie)
- `ADMIN_EMAIL` (optional, seeds an admin user at runtime)
- `ADMIN_PASSWORD` (optional, seeds an admin user at runtime)

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

## Database (Supabase) setup

This repo supports **real persistence** (users / carts / orders / products) when Supabase is configured.

1. Create a Supabase project.
2. Open **SQL Editor** and run the schema in:
   - `supabase/schema.sql`
3. Create `.env.local` from `.env.example` and fill at least:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AUTH_SECRET`

After that:

- `/api/products` reads from the `products` table (fallbacks to mock constants if Supabase is not configured).
- `/api/orders` persists orders to the `orders` table.
- `/api/cart` persists carts to the `carts` table.
- `/api/auth/register` and `/api/auth/login` persist users to the `users` table (fallbacks to in-memory when Supabase is not configured).

## Email notifications (real SMTP)

This repo can send **real email notifications** (order confirmation + status updates) from server-side order routes.

Note: `/api/notifications` is **admin-only** and intended for manual testing / admin tooling (to prevent abuse).

1. Fill these variables in `.env.local`:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - Optional: `SMTP_FROM` (defaults to `SMTP_USER`)
   - Optional: `SMTP_SECURE` (`true`/`false`, defaults to `true` when port is `465`)

If SMTP is not configured, `/api/notifications` returns `503`.

## Payments (Stripe)

This repo supports **real card payments** via Stripe Checkout.

1. Create a Stripe account and get keys.
2. Add these variables to `.env.local`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - Optional (client): `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Configure a webhook in Stripe Dashboard:
   - Endpoint URL: `https://<your-domain>/api/payments/stripe/webhook`
   - Events: `checkout.session.completed`

When Stripe is configured, Checkout offers **Card (Stripe)**. Orders start as `pending_payment` and become `paid` after the webhook.

## Security hardening (RLS)

If you want **strong DB security**, you can enable strict RLS and remove direct access for `anon`/`authenticated`.

1. Run the base schema:
   - `supabase/schema.sql`
2. Then run RLS hardening:
   - `supabase/rls.sql`

In this mode the app expects server-side routes to use `SUPABASE_SERVICE_ROLE_KEY` (server-only) for DB reads/writes.

## Deploy to Vercel (public link)

1. Push your code to GitHub.
2. Go to https://vercel.com/new and import your GitHub repository.
3. In **Project Settings → General → Root Directory**, set it to `Web-E-Commerece-main`.
4. In **Project Settings → Environment Variables**, add at least:
   - `AUTH_SECRET`
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` (if you need `/admin`)
   - Plus any keys you use: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ADMIN_SEED_SECRET`
5. Click **Deploy**.

After deploy, Vercel will give you a public URL like:

- `https://<your-project>.vercel.app`

That URL stays working even if you close VS Code or turn off your PC.
