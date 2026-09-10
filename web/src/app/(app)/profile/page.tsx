import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getHouseCities } from "@/lib/houses-data";
import { housePlace } from "@/lib/houses";
import { ProfileView } from "@/components/profile/profile-view";
import type { BookingRow, ProfileUser } from "@/lib/profile-types";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const [user, bookings, cities] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { house: { include: { host: true } }, payment: true },
      orderBy: { checkIn: "desc" },
    }),
    getHouseCities(),
  ]);

  if (!user) redirect("/");

  const profileUser: ProfileUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    memberSince: user.memberSince,
    bio: user.bio,
    preferredStyles: user.preferredStyles,
    preferredCities: user.preferredCities,
    budgetBand: user.budgetBand,
  };

  const rows: BookingRow[] = bookings.map((b) => ({
    id: b.id,
    ref: b.ref,
    status: b.status,
    cancelReason: b.cancelReason,
    checkIn: b.checkIn.toISOString().slice(0, 10),
    checkOut: b.checkOut.toISOString().slice(0, 10),
    guests: b.guests,
    createdAt: b.createdAt.toISOString(),
    houseSlug: b.house.slug,
    houseName: b.house.name,
    housePlace: housePlace(b.house),
    houseKind: b.house.kind,
    housePrice: b.house.price,
    guestFirstName: b.guestFirstName,
    guestLastName: b.guestLastName,
    guestEmail: b.guestEmail,
    guestPhone: b.guestPhone,
    amountSub: b.payment?.amountSub ?? 0,
    amountTax: b.payment?.amountTax ?? 0,
    amountTotal: b.payment?.amountTotal ?? 0,
    hostName: b.house.host.name,
    hostAddress: b.house.host.address,
    hostPhone: b.house.host.phone,
    hostEmail: b.house.host.email,
  }));

  return <ProfileView user={profileUser} bookings={rows} cities={cities} />;
}
