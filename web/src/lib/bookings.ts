import "server-only";
import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/generated/prisma/client";

export function generateBookingRef(): string {
  const n = 4000 + Math.floor(Math.random() * 5999);
  return `STC-${n}`;
}

export function computeAmounts(price: number, nights: number) {
  const sub = price * nights;
  const tax = Math.round(sub * 0.1);
  return { sub, tax, total: sub + tax };
}

export async function createPendingBooking(input: {
  userId: string;
  houseId: string;
  checkIn: Date;
  checkOut: Date;
  guests: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  method: PaymentMethod;
  amountSub: number;
  amountTax: number;
  amountTotal: number;
}) {
  return prisma.booking.create({
    data: {
      ref: generateBookingRef(),
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      status: "AwaitingPayment",
      guestFirstName: input.guestFirstName,
      guestLastName: input.guestLastName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      userId: input.userId,
      houseId: input.houseId,
      payment: {
        create: {
          method: input.method,
          status: "Pending",
          amountSub: input.amountSub,
          amountTax: input.amountTax,
          amountTotal: input.amountTotal,
        },
      },
    },
    include: { payment: true, house: true },
  });
}
