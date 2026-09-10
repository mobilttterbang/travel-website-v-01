import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { PillLink } from "@/components/ui/buttons";
import { BrowseSearchBar } from "@/components/filters/browse-search-bar";
import { HouseCard } from "@/components/house/house-card";
import { StorySlider } from "@/components/story/story-slider";
import { filterHouses, hottestHouses, housePlace, parseFilters, searchHouses, toCard } from "@/lib/houses";
import { getAllHouses, getHouseCities, getHouseCountries } from "@/lib/houses-data";
import { money } from "@/lib/format";
import { getAllStories } from "@/lib/stories";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const query = typeof sp.q === "string" ? sp.q : "";

  const [houses, countries, cities, stories] = await Promise.all([
    getAllHouses(),
    getHouseCountries(),
    getHouseCities(),
    getAllStories(),
  ]);

  const hottest = hottestHouses(houses);
  const hero = hottest[0];
  const list = filterHouses(searchHouses(hottest, query), filters);

  return (
    <>
      <section className="pt-9 sm:pt-14">
        <div className="relative overflow-hidden rounded-sc-lg shadow-[0_24px_60px_rgba(32,30,29,0.2)]">
          <Photo shape="rect" alt="Hottest stay right now" className="absolute inset-0 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(32,30,29,0.86), rgba(32,30,29,0.2) 65%)" }} />
          <div className="relative flex min-h-[360px] flex-col justify-end p-7 sm:min-h-[480px] sm:p-14">
            <span className="mb-4.5 self-start rounded-pill bg-accent px-4.5 py-2.5 text-[12.5px] font-extrabold tracking-[0.08em] text-white uppercase shadow-[0_10px_26px_rgba(236,48,19,0.34)]">
              Hottest this month
            </span>
            <h1 className="m-0 max-w-[22ch] text-[32px] leading-[1.06] font-extrabold tracking-[-0.035em] text-white sm:text-[60px]">
              {hero.name}
            </h1>
            <p className="m-0 mt-3.5 max-w-[52ch] text-[17px] leading-relaxed text-white/94">
              {housePlace(hero)} · {hero.lead}
            </p>
            <div className="mt-6.5 flex flex-wrap gap-3">
              <span className="rounded-pill border border-white/50 bg-white/16 px-5 py-3 text-sm font-bold text-white backdrop-blur-[22px]">
                {hero.visitors} visitors this year
              </span>
              <span className="rounded-pill border border-white/50 bg-white/16 px-5 py-3 text-sm font-bold text-white backdrop-blur-[22px]">
                {hero.rating.toFixed(1)} ★ from {hero.reviews} reviews
              </span>
              <span className="rounded-pill border border-white/50 bg-white/16 px-5 py-3 text-sm font-bold text-white backdrop-blur-[22px]">
                {money(hero.price)} per night
              </span>
            </div>
            <div className="mt-6.5 flex flex-wrap gap-3">
              <PillLink href={`/house/${hero.slug}`} variant="primary" size="lg">
                See this house
              </PillLink>
              <Link
                href="/stories"
                className="inline-flex items-center rounded-pill border border-white/60 bg-white/18 px-7 py-4 text-base font-bold text-white backdrop-blur-[22px] hover:bg-white/30"
              >
                Read guest stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-9 sm:pt-14">
        <BrowseSearchBar countries={countries} cities={cities} />

        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[13px] font-bold tracking-[0.1em] text-accent-deep uppercase">Ranked by visitors and review score</p>
            <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em] sm:text-[34px]">
              {list.length === 1 ? "1 house found" : `${list.length} houses found`}
            </h2>
          </div>
          <p className="m-0 text-sm text-muted">Updated weekly · {hottest.length} houses above 4.7 ★</p>
        </div>

        {list.length === 0 ? (
          <div className="glass mb-5 rounded-sc-lg border border-dashed border-[rgba(32,30,29,0.2)] p-10 text-center" style={{ ["--glass-opacity" as string]: 0.62 }}>
            <h3 className="m-0 mb-2 text-xl font-extrabold tracking-[-0.02em]">No houses match that search</h3>
            <p className="mx-auto mb-5 max-w-[38ch] text-[15px] text-muted">
              Try a city name, a style like &ldquo;villa&rdquo;, or reset and start again.
            </p>
            <Link href="/browse" className="inline-flex rounded-pill bg-accent px-6 py-3.5 text-[15px] font-extrabold text-white hover:bg-accent-dark">
              Reset search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4.5">
            {list.map((h, i) => (
              <HouseCard key={h.id} house={toCard(h)} rank={i + 1} />
            ))}
          </div>
        )}
      </section>

      <section className="pt-9 sm:pt-14">
        <StorySlider stories={stories} startIndex={3} />
      </section>
    </>
  );
}
