"use client";

import { useState } from "react";
import { useHouseFilters } from "@/components/filters/use-house-filters";
import { FilterIcon, SearchIcon } from "@/components/ui/icons";
import { BED_OPTIONS, DEFAULT_FILTERS, RATE_OPTIONS, TYPE_OPTIONS } from "@/lib/houses";

export function BrowseSearchBar({ countries, cities }: { countries: string[]; cities: string[] }) {
  const { filters, query, setFilter, setQuery, clearFilters, push } = useHouseFilters();
  const [open, setOpen] = useState(false);
  const searchActive = !!query || filters.type !== DEFAULT_FILTERS.type || filters.country !== DEFAULT_FILTERS.country || filters.city !== DEFAULT_FILTERS.city || filters.maxPrice !== DEFAULT_FILTERS.maxPrice || filters.beds !== DEFAULT_FILTERS.beds || filters.rate !== DEFAULT_FILTERS.rate;

  return (
    <div
      className="glass mb-6 rounded-sc-lg border border-white/90 p-3.5 shadow-[0_12px_34px_rgba(32,30,29,0.10)]"
      style={{ ["--glass-opacity" as string]: 0.72 }}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-0 flex-1 basis-[260px] items-center gap-3 rounded-pill border border-[rgba(32,30,29,0.12)] bg-white/90 px-5 py-3.5">
          <SearchIcon className="flex-none text-muted" />
          <input
            type="text"
            defaultValue={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a house, city or style — try “villa” or “Bogor”"
            className="min-w-0 flex-1 border-0 bg-transparent text-[15.5px] outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex cursor-pointer items-center gap-2.5 rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/86 px-5.5 py-3.5 text-[14.5px] font-bold hover:border-accent hover:text-accent"
        >
          <FilterIcon />
          {open ? "Hide advanced search" : "Advanced search"}
        </button>
        {searchActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer rounded-pill border border-[rgba(32,30,29,0.12)] bg-white/70 px-5 py-3.5 text-[14.5px] font-bold text-muted hover:text-accent"
          >
            Reset
          </button>
        )}
      </div>
      {open && (
        <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3 border-t border-[rgba(32,30,29,0.12)] pt-4 pb-1">
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
          <div className="flex flex-wrap items-end gap-2">
            {TYPE_OPTIONS.map((label) => {
              const isActive = filters.type === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => push({ type: label })}
                  className="cursor-pointer rounded-pill border px-4 py-2.5 text-[13px] font-bold"
                  style={{
                    background: isActive ? "var(--sc-accent)" : "transparent",
                    color: isActive ? "#fff" : "#605d5d",
                    borderColor: isActive ? "var(--sc-accent)" : "rgba(32,30,29,0.14)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
