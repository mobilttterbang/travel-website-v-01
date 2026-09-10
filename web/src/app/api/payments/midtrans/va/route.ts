import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeAmounts, createPendingBooking } from "@/lib/bookings";
import { getCoreApiClient, MidtransNotConfiguredError } from "@/lib/midtrans";
import { vaRequestSchema } from "@/lib/booking-request-schema";
import { addDaysISO } from "@/lib/format";

const BANK_CODE: Record<string, string> = { BCA: "bca", BNI: "bni", BRI: "bri", Permata: "permata" };

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const parsed = vaRequestSchema.safeParse(await req.json().catch(() => null));
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
    method: "VirtualAccount",
    amountSub: sub,
    amountTax: tax,
    amountTotal: total,
  });

  const orderId = `st-${booking.id}`;

  try {
    const core = getCoreApiClient();
    const customer_details = {
      first_name: input.guestFirstName,
      last_name: input.guestLastName,
      email: input.guestEmail,
      phone: input.guestPhone,
    };

    let vaNumber: string;
    let vaExpiry: Date;

    if (input.bank === "Mandiri") {
      const result = await core.charge({
        payment_type: "echannel",
        transaction_details: { order_id: orderId, gross_amount: total },
        customer_details,
        echannel: { bill_info1: "Payment for:", bill_info2: house.name },
      });
      vaNumber = `${result.biller_code}${result.bill_key ? " / " + result.bill_key : ""}`;
      vaExpiry = result.expiry_time ? new Date(result.expiry_time) : new Date(Date.now() + 24 * 3600 * 1000);

      await prisma.payment.update({
        where: { bookingId: booking.id },
        data: {
          midtransOrderId: orderId,
          midtransTransactionId: result.transaction_id,
          vaBank: input.bank,
          vaNumber,
          vaExpiry,
        },
      });
    } else {
      const result = await core.charge({
        payment_type: "bank_transfer",
        transaction_details: { order_id: orderId, gross_amount: total },
        customer_details,
        bank_transfer: { bank: BANK_CODE[input.bank] },
      });
      vaNumber = result.va_numbers?.[0]?.va_number ?? result.permata_va_number ?? "";
      vaExpiry = result.expiry_time ? new Date(result.expiry_time) : new Date(Date.now() + 24 * 3600 * 1000);

      await prisma.payment.update({
        where: { bookingId: booking.id },
        data: {
          midtransOrderId: orderId,
          midtransTransactionId: result.transaction_id,
          vaBank: input.bank,
          vaNumber,
          vaExpiry,
        },
      });
    }

    return NextResponse.json({
      bookingId: booking.id,
      ref: booking.ref,
      vaBank: input.bank,
      vaNumber,
      vaExpiry: vaExpiry.toISOString(),
    });
  } catch (err) {
    await prisma.booking.delete({ where: { id: booking.id } });
    if (err instanceof MidtransNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Midtrans VA charge failed", err);
    return NextResponse.json({ error: "Midtrans could not generate a virtual account. Try again." }, { status: 502 });
  }
}
