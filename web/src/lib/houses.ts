import type { House, HouseKind } from "@/generated/prisma/client";

export type HouseWithHost = House & {
  host: { id: string; name: string; phone: string; email: string; address: string };
};

export type HouseFilters = {
  type: "All" | HouseKind;
  country: string;
  city: string;
  maxPrice: number;
  beds: "Any" | "1–2 bedrooms" | "3–4 bedrooms" | "5+ bedrooms";
  rate: "Any" | "4.5+" | "4.7+" | "4.9+";
};

export const DEFAULT_FILTERS: HouseFilters = {
  type: "All",
  country: "All countries",
  city: "All cities",
  maxPrice: 900,
  beds: "Any",
  rate: "Any",
};

export const BED_OPTIONS = ["Any", "1–2 bedrooms", "3–4 bedrooms", "5+ bedrooms"] as const;
export const RATE_OPTIONS = ["Any", "4.5+", "4.7+", "4.9+"] as const;
export const TYPE_OPTIONS = ["All", "Apartment", "Hotel", "Villa", "Home"] as const;

function visitorCount(h: { visitors: string }): number {
  return parseInt(h.visitors.replace(/,/g, ""), 10) || 0;
}

export function heatScore(h: { rating: number; visitors: string; reviews: number }): number {
  return h.rating * Math.log(visitorCount(h) + 10) + h.reviews / 200;
}

export function hottestHouses<T extends { rating: number; visitors: string; reviews: number }>(houses: T[]): T[] {
  return houses.filter((h) => h.rating >= 4.7).sort((a, b) => heatScore(b) - heatScore(a));
}

function bedsOk(h: { bed: number }, beds: HouseFilters["beds"]): boolean {
  if (beds === "Any") return true;
  if (beds === "1–2 bedrooms") return h.bed <= 2;
  if (beds === "3–4 bedrooms") return h.bed >= 3 && h.bed <= 4;
  return h.bed >= 5;
}

function rateOk(h: { rating: number }, rate: HouseFilters["rate"]): boolean {
  if (rate === "Any") return true;
  return h.rating >= parseFloat(rate);
}

export function filterHouses<T extends { kind: HouseKind; country: string; city: string; price: number; bed: number; rating: number }>(
  houses: T[],
  f: HouseFilters
): T[] {
  return houses.filter(
    (h) =>
      (f.type === "All" || h.kind === f.type) &&
      (f.country === "All countries" || h.country === f.country) &&
      (f.city === "All cities" || h.city === f.city) &&
      h.price <= f.maxPrice &&
      bedsOk(h, f.beds) &&
      rateOk(h, f.rate)
  );
}

export function isFilterActive(f: HouseFilters): boolean {
  return (
    f.type !== DEFAULT_FILTERS.type ||
    f.country !== DEFAULT_FILTERS.country ||
    f.city !== DEFAULT_FILTERS.city ||
    f.maxPrice < DEFAULT_FILTERS.maxPrice ||
    f.beds !== DEFAULT_FILTERS.beds ||
    f.rate !== DEFAULT_FILTERS.rate
  );
}

export function searchHouses<T extends { name: string; city: string; country: string; kind: string; tags: string[] }>(
  houses: T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return houses;
  return houses.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q) ||
      h.kind.toLowerCase().includes(q) ||
      h.tags.join(" ").toLowerCase().includes(q)
  );
}

export function housePlace(h: { city: string; country: string }): string {
  return `${h.city}, ${h.country}`;
}

export type HouseCardData = {
  slug: string;
  name: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  visitors: string;
  kind: HouseKind;
  bed: number;
  tags: string[];
  popular: boolean;
};

export function parseFilters(sp: Record<string, string | string[] | undefined>): HouseFilters {
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const type = str(sp.type);
  const beds = str(sp.beds);
  const rate = str(sp.rate);
  const maxPriceRaw = str(sp.maxPrice);
  return {
    type: (TYPE_OPTIONS as readonly string[]).includes(type ?? "") ? (type as HouseFilters["type"]) : DEFAULT_FILTERS.type,
    country: str(sp.country) ?? DEFAULT_FILTERS.country,
    city: str(sp.city) ?? DEFAULT_FILTERS.city,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : DEFAULT_FILTERS.maxPrice,
    beds: (BED_OPTIONS as readonly string[]).includes(beds ?? "") ? (beds as HouseFilters["beds"]) : DEFAULT_FILTERS.beds,
    rate: (RATE_OPTIONS as readonly string[]).includes(rate ?? "") ? (rate as HouseFilters["rate"]) : DEFAULT_FILTERS.rate,
  };
}

export function toCard(h: HouseWithHost | House): HouseCardData {
  return {
    slug: h.slug,
    name: h.name,
    city: h.city,
    country: h.country,
    price: h.price,
    rating: h.rating,
    reviews: h.reviews,
    visitors: h.visitors,
    kind: h.kind,
    bed: h.bed,
    tags: h.tags,
    popular: h.popular,
  };
}
