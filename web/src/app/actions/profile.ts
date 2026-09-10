"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  memberSince: string;
  bio: string;
  preferredStyles: string[];
  preferredCities: string[];
  budgetBand: string;
};

export async function updateProfile(input: UpdateProfileInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "You must be logged in." };

  if (!input.firstName.trim() || !input.email.trim()) {
    return { ok: false, error: "Name and email are required." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      memberSince: input.memberSince.trim(),
      bio: input.bio.trim(),
      preferredStyles: input.preferredStyles,
      preferredCities: input.preferredCities,
      budgetBand: input.budgetBand,
    },
  });

  revalidatePath("/profile");
  return { ok: true };
}
