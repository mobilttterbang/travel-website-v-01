import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyNotificationSignature } from "@/lib/midtrans";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.order_id || !body?.status_code || !body?.gross_amount || !body?.signature_key) {
    return NextResponse.json({ error: "Malformed notification." }, { status: 400 });
  }

  const valid = verifyNotificationSignature({
    order_id: body.order_id,
    status_code: body.status_code,
    gross_amount: body.gross_amount,
    signature_key: body.signature_key,
  });
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
  }

  const payment = await prisma.payment.findUnique({ where: { midtransOrderId: body.order_id } });
  if (!payment) {
    return NextResponse.json({ error: "Unknown order." }, { status: 404 });
  }

  const transactionStatus = body.transaction_status as string | undefined;
  const fraudStatus = body.fraud_status as string | undefined;

  let paymentStatus: "Pending" | "Paid" | "Failed" | "Expired" = payment.status;
  let bookingStatus: "Upcoming" | "AwaitingPayment" | null = null;

  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    if (!fraudStatus || fraudStatus === "accept") {
      paymentStatus = "Paid";
      bookingStatus = "Upcoming";
    }
  } else if (transactionStatus === "pending") {
    paymentStatus = "Pending";
  } else if (transactionStatus === "expire") {
    paymentStatus = "Expired";
  } else if (transactionStatus === "deny" || transactionStatus === "cancel") {
    paymentStatus = "Failed";
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: paymentStatus,
      midtransTransactionId: body.transaction_id ?? payment.midtransTransactionId,
    },
  });

  if (bookingStatus) {
    await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: bookingStatus } });
  }

  return NextResponse.json({ ok: true });
}
