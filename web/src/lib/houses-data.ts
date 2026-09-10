import "server-only";
import { prisma } from "@/lib/prisma";
import type { HouseWithHost } from "@/lib/houses";

export async function getAllHouses(): Promise<HouseWithHost[]> {
  return prisma.house.findMany({ include: { host: true }, orderBy: { name: "asc" } });
}

export async function getHouseBySlug(slug: string): Promise<HouseWithHost | null> {
  return prisma.house.findUnique({ where: { slug }, include: { host: true } });
}

export async function getHouseCities(): Promise<string[]> {
  const rows = await prisma.house.findMany({ select: { city: true }, distinct: ["city"], orderBy: { city: "asc" } });
  return rows.map((r) => r.city);
}

export async function getHouseCountries(): Promise<string[]> {
  const rows = await prisma.house.findMany({ select: { country: true }, distinct: ["country"], orderBy: { country: "asc" } });
  return rows.map((r) => r.country);
}
