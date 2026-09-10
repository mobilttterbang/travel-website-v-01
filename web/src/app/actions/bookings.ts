"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { computeAmounts } from "@/lib/bookings";
import { nightsBetween } from "@/lib/format";

export async function updateBookingDates(input: {
  bookingId: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "You must be logged in." };

  const booking = await prisma.booking.findUnique({ where: { id: input.bookingId }, include: { house: true } });
  if (!booking || booking.userId !== session.user.id) {
    return { ok: false, error: "Booking not found." };
  }
  if (booking.status === "Cancelled" || booking.status === "Completed") {
    return { ok: false, error: "This booking can no longer be edited." };
  }

  const checkIn = new Date(input.checkIn + "T00:00:00Z");
  const checkOut = new Date(input.checkOut + "T00:00:00Z");
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    return { ok: false, error: "Check-out must be after check-in." };
  }

  const nights = nightsBetween(checkIn, checkOut);
  const { sub, tax, total } = computeAmounts(booking.house.price, nights);

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      checkIn,
      checkOut,
      guests: input.guests.trim() || booking.guests,
      payment: {
        update: { amountSub: sub, amountTax: tax, amountTotal: total },
      },
    },
  });

  revalidatePath("/profile");
  return { ok: true };
}

export async function cancelBookingAction(input: {
  bookingId: string;
  reason: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "You must be logged in." };
  if (!input.reason.trim()) return { ok: false, error: "Pick a reason to continue." };

  const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
  if (!booking || booking.userId !== session.user.id) {
    return { ok: false, error: "Booking not found." };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "Cancelled", cancelReason: input.reason.trim() },
  });

  revalidatePath("/profile");
  return { ok: true };
}
