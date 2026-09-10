import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/ui/photo";
import { Pill } from "@/components/ui/glass";
import { BookingSidebar } from "@/components/house/booking-sidebar";
import { StorySlider } from "@/components/story/story-slider";
import { getHouseBySlug } from "@/lib/houses-data";
import { getStoriesForHouse } from "@/lib/stories";
import { housePlace } from "@/lib/houses";

const RULES = [
  "Check-in from 14:00, check-out by 11:00 — earlier arrivals can leave bags with the host.",
  "Two nights minimum. Free cancellation up to 7 days before arrival, half refund up to 48 hours.",
  "No parties or events. Quiet between 22:00 and 07:00, which the neighbours will hold you to.",
  "Pets welcome on the ground floor by arrangement; children of any age are fine.",
];

const TREASURE = [
  { name: "Green Lake", kind: "Nature", popular: false },
  { name: "Dog Clubs", kind: "Pool", popular: false },
  { name: "Labour and Wait", kind: "Shopping", popular: true },
  { name: "Snorkeling", kind: "Beach", popular: false },
];

export default async function HouseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const house = await getHouseBySlug(slug);
  if (!house) notFound();

  const stories = await getStoriesForHouse(house.id);
  const specs = [
    { n: house.bed, label: "bedroom" },
    { n: house.living, label: "living room" },
    { n: house.bath, label: "bathroom" },
    { n: house.dining, label: "dining room" },
    { n: house.wifi, label: "mbp/s wifi" },
    { n: house.bed + 2, label: "unit ready" },
    { n: Math.max(1, house.bath - 1), label: "refrigerator" },
    { n: house.tv, label: "television" },
  ];

  return (
    <>
      <section className="pt-9 sm:pt-14">
        <div className="mb-6.5 flex flex-wrap items-baseline justify-between gap-4">
          <p className="m-0 flex gap-2.5 text-sm text-muted">
            <Link href="/home" className="text-muted hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <Link href="/browse" className="text-muted hover:text-accent">
              Browse
            </Link>
            <span>/</span>
            <span className="font-bold text-ink">House Details</span>
          </p>
          <div className="text-right">
            <h1 className="m-0 text-[30px] leading-[1.08] font-extrabold tracking-[-0.035em] sm:text-[46px]">{house.name}</h1>
            <p className="m-0 mt-1.5 text-[15px] text-muted">
              {housePlace(house)} · {house.rating.toFixed(1)} ★ · {house.reviews} reviews
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="min-w-0 flex-[2_1_420px] overflow-hidden rounded-sc-lg shadow-[0_20px_50px_rgba(32,30,29,0.16)]">
            <Photo shape="rect" alt="Exterior photograph" className="aspect-[4/3.4] min-h-[320px] w-full" />
          </div>
          <div className="flex min-w-0 flex-1 basis-[260px] flex-col gap-4">
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-sc-lg shadow-[0_16px_40px_rgba(32,30,29,0.14)]">
              <Photo shape="rect" alt="Living room" className="h-full min-h-[150px] w-full" />
            </div>
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-sc-lg shadow-[0_16px_40px_rgba(32,30,29,0.14)]">
              <Photo shape="rect" alt="Bedroom" className="h-full min-h-[150px] w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-start gap-7 pt-9 sm:pt-14">
        <div className="min-w-0 flex-[1.4_1_380px]">
          <div className="mb-5.5 flex flex-wrap gap-2.5">
            {house.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
          <h2 className="m-0 mb-4 text-[22px] font-extrabold tracking-[-0.02em]">About the place</h2>
          {house.description.map((para, i) => (
            <p key={i} className="m-0 mb-3.5 text-base leading-relaxed text-body">
              {para}
            </p>
          ))}

          <h2 className="m-0 mt-7.5 mb-4 text-[22px] font-extrabold tracking-[-0.02em]">Specification</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
            {specs.map((s) => (
              <div
                key={s.label}
                className="glass flex items-center gap-3 rounded-sc border border-white/80 p-3.5"
                style={{ ["--glass-opacity" as string]: 0.62 }}
              >
                <span className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-[13px] bg-[rgba(236,48,19,0.12)] text-[15px] font-extrabold text-accent-deep">
                  {s.n}
                </span>
                <span className="text-sm font-semibold">{s.label}</span>
              </div>
            ))}
          </div>

          <h2 className="m-0 mt-7.5 mb-4 text-[22px] font-extrabold tracking-[-0.02em]">House rules</h2>
          <div className="flex flex-col gap-2.5">
            {RULES.map((rule) => (
              <p key={rule} className="m-0 flex items-start gap-3 text-[15.5px] leading-relaxed text-body">
                <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-[3px] bg-accent" />
                {rule}
              </p>
            ))}
          </div>
        </div>

        <BookingSidebar
          slug={house.slug}
          houseName={house.name}
          price={house.price}
          visitors={house.visitors}
          hostName={house.host.name}
          hostPhone={house.host.phone}
          hostEmail={house.host.email}
          address={house.host.address}
        />
      </section>

      <section className="pt-11 sm:pt-18">
        <h2 className="m-0 mb-5 text-[22px] font-extrabold tracking-[-0.03em] sm:text-[30px]">Treasure to Choose</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4.5">
          {TREASURE.map((t) => (
            <div key={t.name} className="glass rounded-sc-lg border border-white/80 p-3 shadow-[0_10px_28px_rgba(32,30,29,0.08)]" style={{ ["--glass-opacity" as string]: 0.62 }}>
              <div className="relative overflow-hidden rounded-sc">
                <Photo shape="rect" alt={t.name} className="aspect-[4/3] w-full" />
                {t.popular && (
                  <span className="absolute top-3 right-3">
                    <Pill tone="accent">
                      Popular <span className="font-medium">Choice</span>
                    </Pill>
                  </span>
                )}
              </div>
              <h3 className="m-0 mt-3.5 px-1 text-lg font-extrabold tracking-[-0.02em]">{t.name}</h3>
              <p className="m-0 mt-0.5 mb-1.5 px-1 text-sm text-muted">{t.kind}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-11 sm:pt-18">
        <h2 className="m-0 mb-5 text-[22px] font-extrabold tracking-[-0.03em] sm:text-[30px]">What guests said about {house.name}</h2>
        <StorySlider stories={stories} emptyState={{ rating: house.rating, reviews: house.reviews }} />
      </section>
    </>
  );
}
