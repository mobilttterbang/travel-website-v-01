import { Eyebrow } from "@/components/ui/glass";
import { PillLink } from "@/components/ui/buttons";
import { Photo } from "@/components/ui/photo";
import { getAllStories, getStoriesSummary } from "@/lib/stories";

export default async function StoriesPage() {
  const [stories, summary] = await Promise.all([getAllStories(), getStoriesSummary()]);

  return (
    <>
      <section className="pt-9 sm:pt-16">
        <Eyebrow>Stories</Eyebrow>
        <h1 className="m-0 max-w-[24ch] text-[32px] leading-[1.06] font-extrabold tracking-[-0.035em] sm:text-[54px]">
          Guests, after the stay
        </h1>
        <p className="m-0 mt-5 max-w-[52ch] text-[17px] leading-relaxed text-body">
          Every review here is left after checkout by someone who paid for the stay. We publish the middling ones
          too — {summary.count} in total, {summary.avgRating} ★ on average.
        </p>
      </section>

      <section className="pt-8 sm:pt-13">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4.5">
          {stories.map((s) => (
            <article
              key={s.id}
              className="glass flex flex-col gap-3.5 rounded-sc-lg border border-white/80 p-6 shadow-[0_12px_32px_rgba(32,30,29,0.10)]"
              style={{ ["--glass-opacity" as string]: 0.62 }}
            >
              <div className="flex items-center gap-3">
                <Photo shape="circle" alt={s.name} className="h-12.5 w-12.5 flex-none" />
                <span>
                  <strong className="block text-base font-extrabold tracking-[-0.01em]">{s.name}</strong>
                  <span className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[13px] text-muted">
                    <span>{s.role}</span>
                    <span>{s.when}</span>
                  </span>
                </span>
                <span className="ml-auto rounded-pill bg-[rgba(236,48,19,0.12)] px-3 py-1.5 text-[12.5px] font-extrabold text-accent-deep">
                  {s.rating.toFixed(1)} ★
                </span>
              </div>
              <blockquote className="m-0 text-[17px] leading-relaxed text-ink">&ldquo;{s.quote}&rdquo;</blockquote>
              <p className="m-0 text-[15px] leading-relaxed text-body">{s.detail}</p>
              <PillLink href={`/house/${s.houseSlug}`} variant="outline" size="sm" className="mt-auto self-start">
                Stayed at {s.stay}
              </PillLink>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
