"use client";

import { useState } from "react";
import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { IconButton } from "@/components/ui/buttons";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/buttons";
import type { StoryCardData } from "@/lib/stories";

export function StorySlider({
  stories,
  startIndex = 0,
  emptyState,
}: {
  stories: StoryCardData[];
  startIndex?: number;
  emptyState?: { rating: number; reviews: number };
}) {
  const [index, setIndex] = useState(Math.min(startIndex, Math.max(stories.length - 1, 0)));

  if (stories.length === 0) {
    return (
      <div className="glass rounded-sc-lg border border-dashed border-[rgba(32,30,29,0.2)] p-8 sm:p-10" style={{ ["--glass-opacity" as string]: 0.62 }}>
        <h3 className="m-0 mb-2 text-[19px] font-extrabold tracking-tight">No written reviews yet</h3>
        <p className="m-0 mb-5 max-w-[44ch] text-[15.5px] leading-relaxed text-muted">
          {emptyState ? `${emptyState.reviews} guests have rated this house ${emptyState.rating.toFixed(1)} ★, but nobody has left a written story. ` : ""}
          Read what guests said about the rest of the list instead.
        </p>
        <PillLink href="/stories" variant="primary">
          Read guest stories
        </PillLink>
      </div>
    );
  }

  const story = stories[index];
  const multi = stories.length > 1;
  const prev = () => setIndex((i) => (i - 1 + stories.length) % stories.length);
  const next = () => setIndex((i) => (i + 1) % stories.length);

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-6">
        {multi && (
          <IconButton onClick={prev} aria-label="Previous review">
            <ChevronLeftIcon />
          </IconButton>
        )}
        <article
          className="glass flex min-w-0 flex-1 flex-col gap-4.5 rounded-sc-lg border border-white/90 p-6 shadow-[0_18px_48px_rgba(32,30,29,0.12)] sm:p-11"
          style={{ ["--glass-opacity" as string]: 0.72 }}
        >
          <div className="flex flex-wrap items-center gap-3.5">
            <Photo shape="circle" alt={story.name} className="h-13.5 w-13.5 flex-none" />
            <span className="min-w-0">
              <strong className="block text-[16.5px] font-extrabold tracking-tight">{story.name}</strong>
              <span className="text-[13.5px] text-muted">{story.role}</span>
            </span>
            <span className="ml-auto rounded-pill bg-[rgba(236,48,19,0.12)] px-3.5 py-1.5 text-[13px] font-extrabold text-accent-deep">
              {story.rating.toFixed(1)} ★
            </span>
          </div>
          <blockquote className="m-0 max-w-[34ch] text-[19px] font-extrabold tracking-tight text-ink sm:text-[27px]">
            &ldquo;{story.quote}&rdquo;
          </blockquote>
          <p className="m-0 max-w-[56ch] text-base leading-relaxed text-body">{story.detail}</p>
          <p className="m-0 text-[12.5px] font-bold tracking-[0.08em] text-muted uppercase">
            <Link href={`/house/${story.houseSlug}`} className="text-muted hover:text-accent">
              {story.stay}
            </Link>{" "}
            · {story.when}
          </p>
        </article>
        {multi && (
          <IconButton onClick={next} aria-label="Next review">
            <ChevronRightIcon />
          </IconButton>
        )}
      </div>
      {multi && (
        <div className="mt-5.5 flex items-center justify-center gap-2.5">
          {stories.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Review ${i + 1}`}
              className="rounded-full p-0"
              style={{
                width: i === index ? 11 : 9,
                height: i === index ? 11 : 9,
                background: i === index ? "#201e1d" : "rgba(32,30,29,0.2)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
