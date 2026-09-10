import "server-only";
import { prisma } from "@/lib/prisma";

export type StoryCardData = {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  detail: string;
  stay: string;
  stayCity: string;
  when: string;
  houseSlug: string;
};

export async function getAllStories(): Promise<StoryCardData[]> {
  const rows = await prisma.story.findMany({
    include: { house: { select: { slug: true, name: true, city: true, country: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((s) => ({
    id: s.id,
    name: s.authorName,
    role: s.role,
    rating: s.rating,
    quote: s.quote,
    detail: s.detail,
    stay: s.house.name,
    stayCity: `${s.house.city}, ${s.house.country}`,
    when: s.stayedAt,
    houseSlug: s.house.slug,
  }));
}

export async function getStoriesForHouse(houseId: string): Promise<StoryCardData[]> {
  const rows = await prisma.story.findMany({
    where: { houseId },
    include: { house: { select: { slug: true, name: true, city: true, country: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((s) => ({
    id: s.id,
    name: s.authorName,
    role: s.role,
    rating: s.rating,
    quote: s.quote,
    detail: s.detail,
    stay: s.house.name,
    stayCity: `${s.house.city}, ${s.house.country}`,
    when: s.stayedAt,
    houseSlug: s.house.slug,
  }));
}

export async function getStoriesSummary() {
  const stories = await getAllStories();
  const avg = stories.length ? stories.reduce((a, s) => a + s.rating, 0) / stories.length : 0;
  return { count: stories.length, avgRating: avg.toFixed(1) };
}
