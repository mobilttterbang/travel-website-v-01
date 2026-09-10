"use client";

import { useState } from "react";
import { useHouseFilters } from "@/components/filters/use-house-filters";
import { FilterIcon } from "@/components/ui/icons";
import { BED_OPTIONS, RATE_OPTIONS, TYPE_OPTIONS } from "@/lib/houses";

export function HomeSubNav({ countries, cities }: { countries: string[]; cities: string[] }) {
  const { filters, setFilter, clearFilters } = useHouseFilters();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-24 z-35 px-4 pt-4.5 sm:px-8 lg:px-14">
      <div
        className="glass mx-auto max-w-[1200px] rounded-sc-lg border border-white/85 p-2 shadow-[0_8px_24px_rgba(32,30,29,0.08)]"
        style={{ ["--glass-opacity" as string]: 0.7 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 pl-2.5 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Type</span>
          {TYPE_OPTIONS.map((label) => {
            const isActive = filters.type === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setFilter("type", label)}
                className="cursor-pointer rounded-pill border-0 px-5 py-2.5 text-sm font-bold"
                style={{ background: isActive ? "var(--sc-accent)" : "transparent", color: isActive ? "#fff" : "#605d5d" }}
              >
                {label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex cursor-pointer items-center gap-2.5 rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/80 px-5 py-2.5 text-sm font-bold hover:border-accent hover:text-accent"
          >
            <FilterIcon />
            {open ? "Hide filters" : "Filters"}
          </button>
        </div>
        {open && (
          <div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3 border-t border-[rgba(32,30,29,0.12)] pt-3.5 pb-1.5">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Country</span>
              <select
                value={filters.country}
                onChange={(e) => setFilter("country", e.target.value)}
                className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/92 px-4 py-2.5 text-sm"
              >
                <option>All countries</option>
                {countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">City</span>
              <select
                value={filters.city}
                onChange={(e) => setFilter("city", e.target.value)}
                className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/92 px-4 py-2.5 text-sm"
              >
                <option>All cities</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Bed / room size</span>
              <select
                value={filters.beds}
                onChange={(e) => setFilter("beds", e.target.value as typeof filters.beds)}
                className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/92 px-4 py-2.5 text-sm"
              >
                {BED_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Guest rating</span>
              <select
                value={filters.rate}
                onChange={(e) => setFilter("rate", e.target.value as typeof filters.rate)}
                className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/92 px-4 py-2.5 text-sm"
              >
                {RATE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">
                Price · {filters.maxPrice >= 900 ? "Any price" : `Up to $${filters.maxPrice}`}
              </span>
              <input
                type="range"
                min={20}
                max={900}
                step={20}
                value={filters.maxPrice}
                onChange={(e) => setFilter("maxPrice", Number(e.target.value))}
                className="mt-3 w-full accent-accent"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/80 px-4.5 py-2.5 text-sm font-bold text-muted hover:text-accent"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
