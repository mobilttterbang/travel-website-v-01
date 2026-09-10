import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { housePlace, type HouseCardData } from "@/lib/houses";
import { money } from "@/lib/format";

export function HouseHeroTile({ house, size = "tile" }: { house: HouseCardData; size?: "hero" | "tile" }) {
  const isHero = size === "hero";
  return (
    <Link
      href={`/house/${house.slug}`}
      className={`relative block overflow-hidden rounded-sc-lg shadow-[0_18px_44px_rgba(32,30,29,0.14)] transition-shadow hover:shadow-[0_26px_60px_rgba(32,30,29,0.24)] ${
        isHero ? "row-span-2 min-h-[340px]" : "min-h-[170px]"
      }`}
    >
      <Photo shape="rect" alt={house.name} className="absolute inset-0 h-full w-full" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `linear-gradient(to top, rgba(32,30,29,${isHero ? 0.74 : 0.72}), rgba(32,30,29,0) ${isHero ? "55%" : "60%"})` }}
      />
      <span
        className={`absolute rounded-pill font-extrabold text-white shadow-[0_8px_20px_rgba(236,48,19,0.32)] ${
          isHero ? "top-4 right-4 px-4 py-2.5 text-[13px]" : "top-3.5 right-3.5 px-3.5 py-2 text-[12.5px]"
        }`}
        style={{ background: "var(--sc-accent)" }}
      >
        {money(house.price)} <span className="font-medium">per night</span>
      </span>
      <div className={`absolute text-left ${isHero ? "left-5.5 right-5.5 bottom-5.5" : "left-4.5 right-4.5 bottom-4.5"}`}>
        <h3 className={`m-0 font-extrabold tracking-tight text-white ${isHero ? "text-2xl" : "text-[19px]"}`}>{house.name}</h3>
        <p className={`m-0 mt-1 text-white/90 ${isHero ? "text-sm" : "text-[13px]"}`}>
          {housePlace(house)}
          {isHero ? ` · ${house.rating.toFixed(1)} ★ · ${house.reviews} reviews` : ""}
        </p>
      </div>
    </Link>
  );
}
