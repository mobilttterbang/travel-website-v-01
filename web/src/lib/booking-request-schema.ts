import { z } from "zod";

export const bookingRequestSchema = z.object({
  slug: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nights: z.number().int().min(1).max(30),
  guests: z.string().min(1).max(60),
  guestFirstName: z.string().min(1).max(80),
  guestLastName: z.string().min(1).max(80),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(1).max(40),
});

export const snapRequestSchema = bookingRequestSchema.extend({
  channel: z.enum(["card", "midtrans"]),
});

export const vaRequestSchema = bookingRequestSchema.extend({
  bank: z.enum(["BCA", "Mandiri", "BNI", "BRI", "Permata"]),
});
