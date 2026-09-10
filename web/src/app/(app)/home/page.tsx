import Link from "next/link";
import { Eyebrow } from "@/components/ui/glass";
import { Photo } from "@/components/ui/photo";
import { PillLink } from "@/components/ui/buttons";
import { HomeSubNav } from "@/components/filters/home-sub-nav";
import { HouseCard } from "@/components/house/house-card";
import { HouseHeroTile } from "@/components/house/house-hero-tile";
import { StorySlider } from "@/components/story/story-slider";
import { filterHouses, isFilterActive, parseFilters, toCard } from "@/lib/houses";
import { getAllHouses, getHouseCities, getHouseCountries } from "@/lib/houses-data";
import { getAllStories } from "@/lib/stories";

const HERO_SLUG = "blue-origin";
const PICKED_SLUGS = ["ocean-land", "stark-house", "vinna-vill", "bobox"];
const BACKYARD_SLUGS = ["tabby-town", "anggana", "seattle-rain", "wodden-pit"];
const HOTEL_SLUGS = ["green-park", "podo-wae", "silver-rain", "cashville"];
const APARTMENT_SLUGS = ["ps-wood", "one-five", "minimal", "stays-home"];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  const [houses, countries, cities, stories] = await Promise.all([
    getAllHouses(),
    getHouseCountries(),
    getHouseCities(),
    getAllStories(),
  ]);

  const results = filterHouses(houses, filters);
  const cardOf = (slug: string) => toCard(houses.find((h) => h.slug === slug)!);

  return (
    <>
      <HomeSubNav countries={countries} cities={cities} />

      <section className="flex flex-wrap items-center gap-7 pt-13 sm:gap-14 sm:pt-22">
        <div className="min-w-0 flex-1 basis-[380px]">
          <Eyebrow>Houses, hotels and apartments</Eyebrow>
          <h1 className="m-0 text-[38px] leading-[1.05] font-extrabold tracking-[-0.035em] sm:text-[66px]">
            Forget Busy Work,
            <br />
            Start Next Vacation
          </h1>
          <p className="m-0 mt-5.5 max-w-[44ch] text-[17px] leading-relaxed text-body">
            We provide what you need to enjoy your holiday with family. Time to make another memorable moments.
          </p>
          <div className="mt-7.5 flex flex-wrap gap-3">
            <PillLink href="/browse" variant="primary" size="lg">
              Show Me Now
            </PillLink>
            <PillLink href="/profile" variant="glass" size="lg">
              My bookings
            </PillLink>
          </div>
          <div className="mt-9 flex flex-wrap gap-3.5">
            {[
              ["80,409", "travelers"],
              ["862", "treasure"],
              ["1,492", "cities"],
            ].map(([n, label]) => (
              <div
                key={label}
                className="glass min-w-[130px] flex-1 rounded-sc border border-white/80 px-4.5 py-4 shadow-[0_10px_28px_rgba(32,30,29,0.08)]"
                style={{ ["--glass-opacity" as string]: 0.62 }}
              >
                <p className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-accent">{n}</p>
                <p className="m-0 mt-1 text-xs font-bold tracking-[0.08em] text-muted uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-w-0 flex-1 basis-[420px]">
          <div className="glass absolute top-11 right-[-14px] bottom-[-18px] left-11 rounded-sc-lg" style={{ ["--glass-opacity" as string]: 0.5 }} />
          <div className="relative overflow-hidden rounded-sc-lg shadow-[0_24px_60px_rgba(32,30,29,0.18)]">
            <Photo shape="rect" alt="The hero house photograph" className="aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      <section className="pt-14 sm:pt-22">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[13px] font-bold tracking-[0.1em] text-accent-deep uppercase">Browse the list</p>
            <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em] sm:text-[34px]">
              {results.length === 1 ? "1 place matches" : `${results.length} places match`}
            </h2>
          </div>
          {isFilterActive(filters) && (
            <Link
              href="/home"
              className="rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/72 px-5.5 py-3 text-sm font-bold text-ink hover:border-accent hover:text-accent"
            >
              Clear filters
            </Link>
          )}
        </div>
        {results.length === 0 ? (
          <div className="glass rounded-sc-lg border border-dashed border-[rgba(32,30,29,0.2)] p-10 text-center" style={{ ["--glass-opacity" as string]: 0.62 }}>
            <h3 className="m-0 mb-2 text-xl font-extrabold tracking-[-0.02em]">Nothing matches those filters</h3>
            <p className="mx-auto mb-5 max-w-[36ch] text-[15px] text-muted">
              Widen the price range or clear a filter to see the rest of the list.
            </p>
            <Link href="/home" className="inline-flex rounded-pill bg-accent px-6 py-3.5 text-[15px] font-extrabold text-white hover:bg-accent-dark">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4.5">
            {results.map((h) => (
              <HouseCard key={h.id} house={toCard(h)} />
            ))}
          </div>
        )}
      </section>

      <section className="pt-14 sm:pt-22">
        <h2 className="m-0 mb-5.5 text-2xl font-extrabold tracking-[-0.03em] sm:text-[34px]">Most Picked</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4.5">
          <HouseHeroTile house={cardOf(HERO_SLUG)} size="hero" />
          {PICKED_SLUGS.map((slug) => (
            <HouseHeroTile key={slug} house={cardOf(slug)} size="tile" />
          ))}
        </div>
      </section>

      <section className="pt-11 sm:pt-16">
        <h2 className="m-0 mb-5 text-[22px] font-extrabold tracking-[-0.03em] sm:text-[30px]">Houses with beauty backyard</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4.5">
          {BACKYARD_SLUGS.map((slug) => (
            <HouseCard key={slug} house={cardOf(slug)} />
          ))}
        </div>
      </section>

      <section className="pt-10 sm:pt-14">
        <h2 className="m-0 mb-5 text-[22px] font-extrabold tracking-[-0.03em] sm:text-[30px]">Hotels with large living room</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4.5">
          {HOTEL_SLUGS.map((slug) => (
            <HouseCard key={slug} house={cardOf(slug)} />
          ))}
        </div>
      </section>

      <section className="pt-10 sm:pt-14">
        <h2 className="m-0 mb-5 text-[22px] font-extrabold tracking-[-0.03em] sm:text-[30px]">Apartments with kitchen set</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4.5">
          {APARTMENT_SLUGS.map((slug) => (
            <HouseCard key={slug} house={cardOf(slug)} />
          ))}
        </div>
      </section>

      <section className="pt-14 sm:pt-22">
        <div className="mb-5.5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[13px] font-bold tracking-[0.1em] text-accent-deep uppercase">Stories</p>
            <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em] sm:text-[34px]">What guests said afterwards</h2>
          </div>
          <Link
            href="/stories"
            className="rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/70 px-5.5 py-3 text-sm font-bold whitespace-nowrap text-ink hover:border-accent hover:text-accent"
          >
            Read all stories
          </Link>
        </div>
        <StorySlider stories={stories} startIndex={2} />
      </section>
    </>
  );
}
