"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/buttons";
import { CalendarIcon } from "@/components/ui/icons";
import { useModal } from "@/components/modal/modal-provider";
import { ContactModalContent, LocationModalContent } from "@/components/modal/contact-location-modal-content";
import { addDaysISO, money, rangeLabel, toDateInputValue } from "@/lib/format";

function defaultCheckIn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return toDateInputValue(d);
}

export function BookingSidebar({
  slug,
  houseName,
  price,
  visitors,
  hostName,
  hostPhone,
  hostEmail,
  address,
}: {
  slug: string;
  houseName: string;
  price: number;
  visitors: string;
  hostName: string;
  hostPhone: string;
  hostEmail: string;
  address: string;
}) {
  const router = useRouter();
  const { openModal } = useModal();
  const [nights, setNights] = useState(2);
  const [checkIn, setCheckIn] = useState(defaultCheckIn());

  const checkOut = useMemo(() => addDaysISO(checkIn, nights), [checkIn, nights]);
  const total = price * nights;

  return (
    <aside
      className="glass sticky top-24 min-w-0 flex-1 basis-[300px] rounded-sc-lg border border-white/90 p-6 shadow-[0_18px_48px_rgba(32,30,29,0.14)] sm:p-7"
      style={{ ["--glass-opacity" as string]: 0.74 }}
    >
      <h2 className="m-0 mb-2.5 text-[19px] font-extrabold tracking-[-0.02em]">Start Booking</h2>
      <p className="m-0 mb-5.5 text-[34px] font-extrabold tracking-[-0.03em] text-accent">
        {money(price)} <span className="text-[17px] font-medium text-muted">per night</span>
      </p>

      <p className="m-0 mb-2 text-[13px] font-bold tracking-[0.08em] text-muted uppercase">How long you will stay?</p>
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          aria-label="Fewer nights"
          onClick={() => setNights((n) => Math.max(1, n - 1))}
          className="h-11 w-11 flex-none cursor-pointer rounded-2xl border-0 bg-[rgba(32,30,29,0.08)] text-xl font-extrabold hover:bg-[rgba(236,48,19,0.14)] hover:text-accent-deep"
        >
          –
        </button>
        <span className="flex-1 rounded-2xl border border-[rgba(32,30,29,0.12)] bg-white/70 p-3 text-center text-[15px] font-bold">
          {nights} {nights === 1 ? "night" : "nights"}
        </span>
        <button
          type="button"
          aria-label="More nights"
          onClick={() => setNights((n) => Math.min(30, n + 1))}
          className="h-11 w-11 flex-none cursor-pointer rounded-2xl border-0 bg-accent text-xl font-extrabold text-white hover:bg-accent-dark"
        >
          +
        </button>
      </div>

      <p className="m-0 mb-2 text-[13px] font-bold tracking-[0.08em] text-muted uppercase">Pick your dates</p>
      <div className="mb-3 flex flex-wrap gap-2.5">
        <label className="block min-w-[130px] flex-1">
          <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Check in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-[rgba(32,30,29,0.14)] bg-white/86 px-3.5 py-3 text-[14.5px] font-semibold"
          />
        </label>
        <label className="block min-w-[130px] flex-1">
          <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Check out</span>
          <input
            type="date"
            value={checkOut}
            readOnly
            className="w-full rounded-2xl border border-[rgba(32,30,29,0.14)] bg-white/60 px-3.5 py-3 text-[14.5px] font-semibold text-muted"
          />
        </label>
      </div>
      <p className="m-0 mb-4.5 flex items-center gap-2.5 text-sm font-bold">
        <CalendarIcon className="text-accent" />
        {rangeLabel(checkIn, checkOut)}
      </p>

      <p className="m-0 mb-5.5 text-sm text-body">
        You will pay <strong className="text-ink">{money(total)} USD</strong> for{" "}
        <strong className="text-ink">
          {nights} {nights === 1 ? "night" : "nights"}
        </strong>
      </p>
      <PillButton
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => router.push(`/booking/${slug}?checkIn=${checkIn}&nights=${nights}`)}
      >
        Continue to Book
      </PillButton>
      <div className="mt-3.5 flex flex-wrap gap-2.5">
        <PillButton
          variant="outline"
          className="flex-1 basis-[130px]"
          onClick={() => openModal(<ContactModalContent houseName={houseName} hostName={hostName} hostPhone={hostPhone} hostEmail={hostEmail} />)}
        >
          Contact
        </PillButton>
        <PillButton variant="outline" className="flex-1 basis-[130px]" onClick={() => openModal(<LocationModalContent houseName={houseName} address={address} />)}>
          Location
        </PillButton>
      </div>
      <p className="m-0 mt-4 text-[13.5px] leading-snug text-muted">
        {visitors} guests stayed here this year. Free cancellation up to 7 days before arrival.
      </p>
    </aside>
  );
}
