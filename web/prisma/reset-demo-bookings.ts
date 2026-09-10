/**
 * Restores the demo account's bookings to their seeded state.
 * Useful after clicking through the app (or running the e2e script) has
 * cancelled/edited rows and you want the sample data back.
 *
 *   npx tsx prisma/reset-demo-bookings.ts
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "angga@staycation.id";

const DEMO_BOOKINGS = [
  { slug: "village-angga", ref: "STC-4192", checkIn: "2027-01-20", checkOut: "2027-01-22", guests: "2 guests", status: "Upcoming" as const, cancelReason: "", paid: true },
  { slug: "blue-origin", ref: "STC-4021", checkIn: "2027-02-14", checkOut: "2027-02-17", guests: "4 guests", status: "AwaitingPayment" as const, cancelReason: "", paid: false },
  { slug: "podo-wae", ref: "STC-3877", checkIn: "2026-11-03", checkOut: "2026-11-05", guests: "2 guests", status: "Completed" as const, cancelReason: "", paid: true },
  { slug: "seattle-rain", ref: "STC-3610", checkIn: "2026-08-08", checkOut: "2026-08-12", guests: "3 guests", status: "Completed" as const, cancelReason: "", paid: true },
  { slug: "bobox", ref: "STC-3402", checkIn: "2026-04-19", checkOut: "2026-04-21", guests: "2 guests", status: "Cancelled" as const, cancelReason: "Dates no longer work", paid: false },
];

async function main() {
  const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!user) throw new Error(`Demo user ${DEMO_EMAIL} not found — run \`npx prisma db seed\` first.`);

  const removed = await prisma.booking.deleteMany({ where: { userId: user.id } });
  console.log(`Removed ${removed.count} existing booking(s) for ${DEMO_EMAIL}.`);

  for (const b of DEMO_BOOKINGS) {
    const house = await prisma.house.findUniqueOrThrow({ where: { slug: b.slug } });
    const nights = Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000);
    const sub = house.price * nights;
    const tax = Math.round(sub * 0.1);
    await prisma.booking.create({
      data: {
        ref: b.ref,
        checkIn: new Date(b.checkIn),
        checkOut: new Date(b.checkOut),
        guests: b.guests,
        status: b.status,
        cancelReason: b.cancelReason,
        guestFirstName: user.firstName,
        guestLastName: user.lastName,
        guestEmail: user.email,
        guestPhone: user.phone,
        userId: user.id,
        houseId: house.id,
        payment: {
          create: {
            method: "Card",
            status: b.paid ? "Paid" : "Pending",
            amountSub: sub,
            amountTax: tax,
            amountTotal: sub + tax,
            cardBrand: "Visa",
            cardLast4: "4242",
          },
        },
      },
    });
  }
  console.log(`Restored ${DEMO_BOOKINGS.length} demo bookings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
