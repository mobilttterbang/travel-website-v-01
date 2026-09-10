"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Photo } from "@/components/ui/photo";

function useActive(pathname: string) {
  return {
    home: pathname === "/home",
    browse: pathname.startsWith("/browse") || pathname.startsWith("/house"),
    stories: pathname.startsWith("/stories"),
    profile: pathname.startsWith("/profile") || pathname.startsWith("/booking"),
  };
}

export function SiteNav({ firstName }: { firstName: string }) {
  const pathname = usePathname();
  const active = useActive(pathname);

  const linkClass = (isActive: boolean) =>
    `cursor-pointer border-0 bg-none px-0.5 py-1.5 text-[15px] font-semibold hover:text-accent ${
      isActive ? "text-accent" : "text-ink"
    }`;

  return (
    <div className="sticky top-3.5 z-40 px-4 pt-0 sm:px-8 lg:px-14">
      <nav
        className="glass mx-auto flex max-w-[1200px] flex-wrap items-center gap-2.5 rounded-pill border border-white/85 py-2.5 pr-3 pl-5.5 shadow-[0_10px_30px_rgba(32,30,29,0.10)] sm:gap-6"
        style={{ ["--glass-opacity" as string]: 0.72 }}
      >
        <Link href="/home" className="mr-auto flex items-center gap-2.5 text-[19px] font-extrabold tracking-tight text-ink">
          <span className="inline-block h-3 w-3 rounded-[4px] bg-accent" />
          Staycation
        </Link>
        <Link href="/home" className={linkClass(active.home)}>
          Home
        </Link>
        <Link href="/browse" className={linkClass(active.browse)}>
          Browse by
        </Link>
        <Link href="/stories" className={linkClass(active.stories)}>
          Stories
        </Link>
        <Link
          href="/profile"
          className={`flex items-center gap-2.5 rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/60 py-1.5 pr-4 pl-1.5 text-sm font-bold hover:border-accent ${
            active.profile ? "text-accent" : "text-ink"
          }`}
        >
          <Photo shape="circle" alt="You" className="h-7.5 w-7.5 flex-none" />
          {firstName}
        </Link>
      </nav>
    </div>
  );
}
