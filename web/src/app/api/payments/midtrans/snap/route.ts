import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeAmounts, createPendingBooking } from "@/lib/bookings";
import { getSnapClient, MidtransNotConfiguredError } from "@/lib/midtrans";
import { snapRequestSchema } from "@/lib/booking-request-schema";
import { addDaysISO } from "@/lib/format";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const parsed = snapRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking details." }, { status: 400 });
  }
  const input = parsed.data;

  const house = await prisma.house.findUnique({ where: { slug: input.slug } });
  if (!house) {
    return NextResponse.json({ error: "House not found." }, { status: 404 });
  }

  const checkOutIso = addDaysISO(input.checkIn, input.nights);
  const { sub, tax, total } = computeAmounts(house.price, input.nights);

  const booking = await createPendingBooking({
    userId: session.user.id,
    houseId: house.id,
    checkIn: new Date(input.checkIn + "T00:00:00Z"),
    checkOut: new Date(checkOutIso + "T00:00:00Z"),
    guests: input.guests,
    guestFirstName: input.guestFirstName,
    guestLastName: input.guestLastName,
    guestEmail: input.guestEmail,
    guestPhone: input.guestPhone,
    method: input.channel === "card" ? "Card" : "Midtrans",
    amountSub: sub,
    amountTax: tax,
    amountTotal: total,
  });

  const orderId = `st-${booking.id}`;

  try {
    const snap = getSnapClient();
    const transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: total },
      credit_card: { secure: true },
      customer_details: {
        first_name: input.guestFirstName,
        last_name: input.guestLastName,
        email: input.guestEmail,
        phone: input.guestPhone,
      },
      item_details: [
        { id: house.id, name: `${house.name} · ${input.nights} night(s)`, price: sub, quantity: 1 },
        { id: "tax", name: "Tax (10%)", price: tax, quantity: 1 },
      ],
      enabled_payments: input.channel === "card" ? ["credit_card"] : undefined,
    });

    await prisma.payment.update({
      where: { bookingId: booking.id },
      data: {
        midtransOrderId: orderId,
        midtransSnapToken: transaction.token,
        midtransRedirectUrl: transaction.redirect_url,
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      ref: booking.ref,
      snapToken: transaction.token,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });
  } catch (err) {
    await prisma.booking.delete({ where: { id: booking.id } });
    if (err instanceof MidtransNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Midtrans Snap transaction failed", err);
    return NextResponse.json({ error: "Midtrans could not start this payment. Try again." }, { status: 502 });
  }
}
