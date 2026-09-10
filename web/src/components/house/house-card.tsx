import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { Pill } from "@/components/ui/glass";
import { housePlace, type HouseCardData } from "@/lib/houses";
import { money } from "@/lib/format";

export function HouseCard({
  house,
  rank,
}: {
  house: HouseCardData;
  rank?: number;
}) {
  return (
    <Link
      href={`/house/${house.slug}`}
      className="glass block rounded-sc-lg border border-white/80 p-3 text-left shadow-[0_10px_28px_rgba(32,30,29,0.08)] transition-shadow hover:shadow-[0_22px_50px_rgba(32,30,29,0.18)]"
      style={{ ["--glass-opacity" as string]: 0.62 }}
    >
      <div className="relative overflow-hidden rounded-sc">
        <Photo shape="rect" alt={house.name} className="aspect-[16/11] w-full" />
        {rank ? (
          <span className="absolute top-3 left-3 flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[rgba(32,30,29,0.86)] text-sm font-extrabold text-white">
            {rank}
          </span>
        ) : (
          <span className="absolute top-3 left-3">
            <Pill>{house.kind}</Pill>
          </span>
        )}
        <span className="absolute top-3 right-3">
          <Pill tone="accent">{house.rating.toFixed(1)} ★</Pill>
        </span>
        {house.popular && !rank && (
          <span className="absolute right-3 bottom-3">
            <Pill tone="accent">
              Popular <span className="font-medium">Choice</span>
            </Pill>
          </span>
        )}
      </div>
      <h3 className="m-0 mt-3.5 px-1 text-lg font-extrabold tracking-tight text-ink">{house.name}</h3>
      <p className="m-0 mt-0.5 px-1 text-sm text-muted">{housePlace(house)}</p>
      {rank ? (
        <div className="mt-3 flex flex-wrap gap-2 px-1 pb-1.5">
          <Pill tone="ink-soft">{house.visitors} visitors</Pill>
          <Pill tone="ink-soft">{house.reviews} reviews</Pill>
          <span className="rounded-pill bg-[rgba(236,48,19,0.12)] px-3 py-1.5 text-[12.5px] font-extrabold text-accent-deep">
            {money(house.price)}/night
          </span>
        </div>
      ) : (
        <p className="m-0 mt-2.5 mb-1.5 px-1 text-sm font-bold text-ink">
          {money(house.price)} <span className="font-medium text-muted">/ night · {house.bed} bed</span>
        </p>
      )}
    </Link>
  );
}
