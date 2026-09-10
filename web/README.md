# Staycation

A travel/stay booking site — browse houses, hotels, villas and apartments, book them, pay, and manage your bookings.

Built with Next.js (App Router), PostgreSQL + Prisma, NextAuth, Tailwind CSS, and Midtrans for payments.

## What's in it

- **Landing page** — public marketing page with log in / sign up
- **Home** — filter the full list by type, country, city, bedrooms, rating and price
- **Browse by** — houses ranked by visitors and review score, with search and advanced filters
- **Stories** — guest reviews, linked back to the house each guest stayed in
- **House detail** — photos, description, specs, house rules, host contact and location, plus a booking sidebar
- **Booking** — a three-step flow: guest details → payment → confirmation
- **Profile & booking history** — editable profile with stay preferences, plus bookings you can edit, cancel (with a reason) and view invoices for

## Running it locally

You need Node.js 20.9+ and a PostgreSQL database.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env`** in this folder:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/staycation?schema=public"
   AUTH_SECRET="run: openssl rand -base64 32"

   # Optional — only needed to take real payments (see below)
   MIDTRANS_SERVER_KEY=""
   MIDTRANS_CLIENT_KEY=""
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=""
   MIDTRANS_IS_PRODUCTION="false"
   ```

3. **Create the tables and sample data**

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. **Start it**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 and log in with the demo account:
   **angga@staycation.id** / **password123**

## Deploying

The app needs a server and a PostgreSQL database — it can't be hosted as static files.

1. Import this repository on your hosting platform and set the **root directory to `web`**
2. Create a PostgreSQL database (most platforms offer one, or use Neon/Supabase) and set `DATABASE_URL`
3. Set `AUTH_SECRET` to a long random string
4. Deploy, then run the migration and seed against the production database:

   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   DATABASE_URL="your-production-url" npx prisma db seed
   ```

If `DATABASE_URL` is missing, the app fails fast with a message telling you so.

## Payments

Payments go through [Midtrans](https://midtrans.com). Card and multi-channel payments open Midtrans' own secure checkout (Snap), so card numbers are never sent to or stored on this server. Virtual account numbers are generated through the Midtrans Core API.

To enable payments, get sandbox keys from the [Midtrans dashboard](https://dashboard.sandbox.midtrans.com) and set the three `MIDTRANS_*` variables. Point Midtrans' payment notification URL at `https://your-domain/api/payments/midtrans/notification` so bookings flip to paid automatically.

Without keys the rest of the site works normally; payment attempts show a message saying Midtrans isn't configured.

## Handy commands

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # lint

npx prisma studio                        # browse the database in a UI
npx prisma db seed                       # load houses, stories and the demo account
npx tsx prisma/reset-demo-bookings.ts    # restore the demo account's sample bookings
```
