"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DEFAULT_FILTERS, parseFilters, type HouseFilters } from "@/lib/houses";

export function useHouseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const spRecord = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const filters = useMemo(() => parseFilters(spRecord), [spRecord]);
  const query = searchParams.get("q") ?? "";

  const push = useCallback(
    (next: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value === undefined || value === "" || String(value) === String((DEFAULT_FILTERS as Record<string, unknown>)[key])) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setFilter = useCallback(
    <K extends keyof HouseFilters>(key: K, value: HouseFilters[K]) => push({ [key]: value as string | number }),
    [push]
  );

  const setQuery = useCallback((value: string) => push({ q: value }), [push]);

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return { filters, query, setFilter, setQuery, clearFilters, push };
}
