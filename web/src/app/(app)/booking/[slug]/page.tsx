import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getHouseBySlug } from "@/lib/houses-data";
import { housePlace } from "@/lib/houses";
import { BookingFlow } from "@/components/booking/booking-flow";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const house = await getHouseBySlug(slug);
  if (!house) notFound();

  const checkInRaw = typeof sp.checkIn === "string" ? sp.checkIn : "";
  const nightsRaw = typeof sp.nights === "string" ? Number(sp.nights) : NaN;
  if (!DATE_RE.test(checkInRaw) || !Number.isFinite(nightsRaw) || nightsRaw < 1) {
    redirect(`/house/${slug}`);
  }
  const nights = Math.min(30, Math.max(1, Math.round(nightsRaw)));

  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/");

  return (
    <BookingFlow
      house={{ slug: house.slug, name: house.name, place: housePlace(house), price: house.price }}
      checkIn={checkInRaw}
      nights={nights}
      initialGuest={{ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }}
    />
  );
}
