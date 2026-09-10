"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { PillButton, PillLink } from "@/components/ui/buttons";
import { useModal } from "@/components/modal/modal-provider";
import { CancelModalContent } from "@/components/modal/cancel-modal-content";
import { InvoiceModalContent, type InvoiceData } from "@/components/modal/invoice-modal-content";
import { updateProfile } from "@/app/actions/profile";
import { updateBookingDates } from "@/app/actions/bookings";
import { money, nightsBetween, nightsLabel, rangeLabel, toDateInputValue } from "@/lib/format";
import type { BookingRow, ProfileUser } from "@/lib/profile-types";

const STYLE_TAGS = ["Homie", "Minimalism", "Hotel", "Apartment", "Nature-villa"];
const PRICE_BANDS = ["Under $100", "$50 – $200", "$200 – $500", "No limit"];

function statusPillClasses(status: BookingRow["status"]) {
  if (status === "Cancelled") return { background: "rgba(32,30,29,0.08)", color: "#605d5d" };
  if (status === "Completed") return { background: "rgba(32,30,29,0.10)", color: "#201e1d" };
  return { background: "rgba(236,48,19,0.14)", color: "#ae1800" };
}

function tabOf(status: BookingRow["status"]): "Upcoming" | "Completed" | "Cancelled" {
  if (status === "Cancelled") return "Cancelled";
  if (status === "Completed") return "Completed";
  return "Upcoming";
}

export function ProfileView({ user, bookings, cities }: { user: ProfileUser; bookings: BookingRow[]; cities: string[] }) {
  const router = useRouter();
  const { openModal } = useModal();

  const [editingProfile, setEditingProfile] = useState(false);
  const [draft, setDraft] = useState(user);
  const [savedNote, setSavedNote] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [tab, setTab] = useState<"Upcoming" | "Completed" | "Cancelled">("Upcoming");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rowDraft, setRowDraft] = useState({ checkIn: "", checkOut: "", guests: "" });
  const [rowError, setRowError] = useState<string | null>(null);
  const [rowLoading, setRowLoading] = useState(false);

  const visibleBookings = bookings.filter((b) => tabOf(b.status) === tab);
  const stayCount = bookings.filter((b) => b.status === "Completed").length + 10;

  function startEditProfile() {
    setDraft(user);
    setSavedNote("");
    setProfileError(null);
    setEditingProfile(true);
  }

  function toggleListItem(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileError(null);
    const result = await updateProfile(draft);
    setSavingProfile(false);
    if (!result.ok) {
      setProfileError(result.error);
      return;
    }
    setEditingProfile(false);
    setSavedNote("Saved");
    router.refresh();
  }

  function startEditBooking(b: BookingRow) {
    setEditingId(b.id);
    setRowError(null);
    setRowDraft({ checkIn: toDateInputValue(b.checkIn), checkOut: toDateInputValue(b.checkOut), guests: b.guests });
  }

  async function handleSaveBooking(bookingId: string) {
    setRowLoading(true);
    setRowError(null);
    const result = await updateBookingDates({ bookingId, ...rowDraft });
    setRowLoading(false);
    if (!result.ok) {
      setRowError(result.error);
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  function openCancel(b: BookingRow) {
    openModal(<CancelModalContent bookingId={b.id} houseName={b.houseName} dates={rangeLabel(b.checkIn, b.checkOut)} ref={b.ref} />);
  }

  function openInvoice(b: BookingRow) {
    const nights = nightsBetween(b.checkIn, b.checkOut);
    const invoice: InvoiceData = {
      ref: b.ref,
      status: b.status === "AwaitingPayment" ? "Awaiting payment" : b.status,
      issuedAt: b.createdAt,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      nights,
      guests: b.guests,
      guestName: `${b.guestFirstName} ${b.guestLastName}`,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      guestCity: user.city,
      houseName: b.houseName,
      houseKind: b.houseKind,
      nightlyRate: b.housePrice,
      sub: b.amountSub,
      tax: b.amountTax,
      total: b.amountTotal,
      cancelled: b.status === "Cancelled",
      reason: b.cancelReason,
      hostName: b.hostName,
      hostAddress: b.hostAddress,
      hostPhone: b.hostPhone,
      hostEmail: b.hostEmail,
    };
    openModal(<InvoiceModalContent invoice={invoice} />);
  }

  return (
    <>
      <section className="pt-9 sm:pt-16">
        {!editingProfile ? (
          <>
            <div
              className="glass flex flex-wrap items-center gap-6 rounded-sc-lg border border-white/90 p-5 shadow-[0_18px_48px_rgba(32,30,29,0.12)] sm:gap-9 sm:p-8.5"
              style={{ ["--glass-opacity" as string]: 0.74 }}
            >
              <Photo shape="circle" alt="Your portrait" className="h-24 w-24 flex-none shadow-[0_14px_34px_rgba(32,30,29,0.18)] sm:h-33 sm:w-33" />
              <div className="min-w-0 flex-1 basis-[260px]">
                <p className="m-0 mb-2 text-xs font-bold tracking-[0.1em] text-accent-deep uppercase">Member since {user.memberSince}</p>
                <h1 className="m-0 text-[28px] leading-[1.1] font-extrabold tracking-[-0.035em] sm:text-[42px]">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="m-0 mt-2 text-[15px] text-muted">
                  {user.email} · {user.phone} · {user.city}
                </p>
                <p className="m-0 mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-body">{user.bio}</p>
                <div className="mt-4.5 flex flex-wrap gap-2.5">
                  <PillButton variant="primary" size="sm" onClick={startEditProfile}>
                    Edit profile
                  </PillButton>
                  <PillButton variant="outline" size="sm">
                    Payment methods
                  </PillButton>
                  <PillButton variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                    Log out
                  </PillButton>
                </div>
              </div>
              <div className="grid min-w-0 flex-1 basis-[220px] grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-3">
                {[
                  [String(stayCount), "stays"],
                  ["5", "cities"],
                  ["4.9", "guest score"],
                ].map(([n, label]) => (
                  <div key={label} className="rounded-sc border border-white/85 bg-white/60 p-4">
                    <p className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-accent">{n}</p>
                    <p className="m-0 mt-1 text-[11.5px] font-bold tracking-[0.08em] text-muted uppercase">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {[
                ["Preferred style", user.preferredStyles.join(" · ") || "—"],
                ["Preferred locations", user.preferredCities.join(" · ") || "—"],
                ["Nightly budget", user.budgetBand],
              ].map(([label, value]) => (
                <div key={label} className="glass rounded-sc border border-white/80 p-5.5 shadow-[0_10px_28px_rgba(32,30,29,0.08)]" style={{ ["--glass-opacity" as string]: 0.62 }}>
                  <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">{label}</p>
                  <p className="m-0 text-[17px] font-extrabold tracking-[-0.02em]">{value}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="glass rounded-sc-lg border border-white/95 p-5 shadow-[0_20px_52px_rgba(32,30,29,0.16)] sm:p-8.5" style={{ ["--glass-opacity" as string]: 0.8 }}>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Photo shape="circle" alt="Portrait" className="h-19 w-19 flex-none" />
              <div className="min-w-0 flex-1 basis-[200px]">
                <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">Edit profile</h2>
                <p className="m-0 mt-1.5 text-[14.5px] text-muted">Update your details below, then save.</p>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {(
                [
                  ["First name", "firstName"],
                  ["Last name", "lastName"],
                  ["Email address", "email"],
                  ["Phone number", "phone"],
                  ["City", "city"],
                  ["Member since", "memberSince"],
                ] as const
              ).map(([label, key]) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-muted uppercase">{label}</span>
                  <input
                    type="text"
                    value={draft[key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                    className="w-full rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/86 px-4.5 py-3.5 text-[15px]"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-muted uppercase">About you</span>
              <textarea
                rows={3}
                value={draft.bio}
                onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                className="w-full resize-y rounded-sc border border-[rgba(32,30,29,0.14)] bg-white/86 px-4.5 py-3.5 text-[15px] leading-relaxed"
              />
            </label>

            <div className="mt-5.5 border-t border-[rgba(32,30,29,0.12)] pt-5">
              <h3 className="m-0 mb-1 text-[17px] font-extrabold tracking-[-0.02em]">Stay preferences</h3>
              <p className="m-0 mb-3.5 text-sm text-muted">We rank the list against these before anything else.</p>
              <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Style of place</p>
              <div className="mb-4.5 flex flex-wrap gap-2">
                {STYLE_TAGS.map((label) => {
                  const active = draft.preferredStyles.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, preferredStyles: toggleListItem(d.preferredStyles, label) }))}
                      className="cursor-pointer rounded-pill border px-4.5 py-2.5 text-[13.5px] font-bold"
                      style={{ background: active ? "var(--sc-accent)" : "rgba(255,255,255,0.8)", borderColor: active ? "var(--sc-accent)" : "rgba(32,30,29,0.16)", color: active ? "#fff" : "#201e1d" }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Locations you keep booking</p>
              <div className="mb-4.5 flex flex-wrap gap-2">
                {cities.map((label) => {
                  const active = draft.preferredCities.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, preferredCities: toggleListItem(d.preferredCities, label) }))}
                      className="cursor-pointer rounded-pill border px-4.5 py-2.5 text-[13.5px] font-bold"
                      style={{ background: active ? "var(--sc-accent)" : "rgba(255,255,255,0.8)", borderColor: active ? "var(--sc-accent)" : "rgba(32,30,29,0.16)", color: active ? "#fff" : "#201e1d" }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Nightly budget</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_BANDS.map((label) => {
                  const active = draft.budgetBand === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, budgetBand: label }))}
                      className="cursor-pointer rounded-pill border px-4.5 py-2.5 text-[13.5px] font-bold"
                      style={{ background: active ? "var(--sc-accent)" : "rgba(255,255,255,0.8)", borderColor: active ? "var(--sc-accent)" : "rgba(32,30,29,0.16)", color: active ? "#fff" : "#201e1d" }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {profileError && <p className="m-0 mt-4 text-sm font-semibold text-accent-deep">{profileError}</p>}
            <div className="mt-5.5 flex flex-wrap items-center gap-3">
              <PillButton variant="primary" onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? "Saving…" : "Save changes"}
              </PillButton>
              <PillButton variant="outline" onClick={() => setEditingProfile(false)} disabled={savingProfile}>
                Discard
              </PillButton>
              {savedNote && <p className="m-0 text-sm text-muted">{savedNote}</p>}
            </div>
          </div>
        )}
      </section>

      <section className="pt-9 sm:pt-14">
        <div className="mb-5.5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em] sm:text-[32px]">Booking history</h2>
          <div className="glass flex flex-wrap gap-1.5 rounded-pill border border-white/85 p-1.5" style={{ ["--glass-opacity" as string]: 0.62 }}>
            {(["Upcoming", "Completed", "Cancelled"] as const).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setEditingId(null);
                  }}
                  className="cursor-pointer rounded-pill border-0 px-5 py-2.5 text-sm font-bold"
                  style={{ background: active ? "var(--sc-accent)" : "transparent", color: active ? "#fff" : "#605d5d" }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {visibleBookings.map((b) => {
            const isEditing = editingId === b.id;
            const nights = nightsBetween(b.checkIn, b.checkOut);
            const canEdit = tabOf(b.status) === "Upcoming";
            const pill = statusPillClasses(b.status);
            return (
              <article key={b.id} className="glass rounded-sc-lg border border-white/80 p-3.5 shadow-[0_10px_28px_rgba(32,30,29,0.08)]" style={{ ["--glass-opacity" as string]: 0.62 }}>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="w-[96px] flex-none overflow-hidden rounded-sc sm:w-[150px]">
                    <Photo shape="rect" alt={b.houseName} className="aspect-[4/3] w-full" />
                  </div>
                  <div className="min-w-0 flex-1 basis-[200px]">
                    <span className="mb-2 inline-block rounded-pill px-3.5 py-1.5 text-[11.5px] font-extrabold tracking-[0.06em] uppercase" style={pill}>
                      {b.status === "AwaitingPayment" ? "Awaiting payment" : b.status}
                    </span>
                    <h3 className="m-0 text-lg font-extrabold tracking-[-0.02em]">{b.houseName}</h3>
                    <p className="m-0 mt-1 text-sm text-muted">
                      {b.housePlace} · ref {b.ref}
                    </p>
                  </div>

                  {isEditing ? (
                    <div className="grid min-w-0 flex-[2_1_320px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Check in</span>
                        <input
                          type="date"
                          value={rowDraft.checkIn}
                          onChange={(e) => setRowDraft((d) => ({ ...d, checkIn: e.target.value }))}
                          className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/90 px-4 py-2.5 text-sm font-semibold"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">
                          Check out · {rowDraft.checkIn && rowDraft.checkOut ? nightsLabel(nightsBetween(rowDraft.checkIn, rowDraft.checkOut)) : ""}
                        </span>
                        <input
                          type="date"
                          value={rowDraft.checkOut}
                          onChange={(e) => setRowDraft((d) => ({ ...d, checkOut: e.target.value }))}
                          className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/90 px-4 py-2.5 text-sm font-semibold"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Guests</span>
                        <input
                          type="text"
                          value={rowDraft.guests}
                          onChange={(e) => setRowDraft((d) => ({ ...d, guests: e.target.value }))}
                          className="w-full rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/90 px-4 py-2.5 text-sm"
                        />
                      </label>
                      <div className="flex items-end gap-2.5">
                        <PillButton variant="primary" size="sm" className="flex-1" onClick={() => handleSaveBooking(b.id)} disabled={rowLoading}>
                          {rowLoading ? "Saving…" : "Save"}
                        </PillButton>
                        <PillButton variant="outline" size="sm" onClick={() => setEditingId(null)} disabled={rowLoading}>
                          Back
                        </PillButton>
                      </div>
                      {rowError && <p className="col-span-full m-0 text-sm font-semibold text-accent-deep">{rowError}</p>}
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1 basis-[150px]">
                        <p className="m-0 text-[15px] font-bold">{rangeLabel(b.checkIn, b.checkOut)}</p>
                        <p className="m-0 mt-1 text-sm text-muted">
                          {nightsLabel(nights)} · {b.guests}
                        </p>
                      </div>
                      <div className="ml-auto flex flex-wrap items-center gap-2.5">
                        <p className="m-0 mr-2 text-lg font-extrabold tracking-[-0.02em]">{money(b.amountTotal)}</p>
                        {canEdit && (
                          <>
                            <PillButton variant="outline" size="sm" className="whitespace-nowrap" onClick={() => startEditBooking(b)}>
                              Edit
                            </PillButton>
                            <PillButton variant="ghost-danger" size="sm" className="whitespace-nowrap" onClick={() => openCancel(b)}>
                              Cancel booking
                            </PillButton>
                          </>
                        )}
                        <PillButton variant="outline" size="sm" className="whitespace-nowrap" onClick={() => openInvoice(b)}>
                          Invoice
                        </PillButton>
                        <PillLink href={`/house/${b.houseSlug}`} variant="outline" size="sm" className="whitespace-nowrap">
                          {b.status === "Cancelled" ? "Book again" : "View house"}
                        </PillLink>
                      </div>
                    </>
                  )}
                </div>
                {b.status === "Cancelled" && b.cancelReason && <p className="m-0 mt-3 ml-1 text-[13.5px] text-muted">Cancelled — {b.cancelReason}</p>}
              </article>
            );
          })}
        </div>

        {visibleBookings.length === 0 && (
          <div className="glass rounded-sc-lg border border-dashed border-[rgba(32,30,29,0.2)] p-10 text-center" style={{ ["--glass-opacity" as string]: 0.62 }}>
            <h3 className="m-0 mb-2 text-xl font-extrabold tracking-[-0.02em]">Nothing here</h3>
            <p className="mx-auto mb-5.5 max-w-[36ch] text-[15px] text-muted">
              No bookings under this tab yet. When one lands, it shows up here with its receipt.
            </p>
            <Link href="/browse" className="inline-flex rounded-pill bg-accent px-6.5 py-3.5 text-[15px] font-extrabold text-white hover:bg-accent-dark">
              Browse houses
            </Link>
          </div>
        )}
      </section>

      <section className="pt-9 sm:pt-14">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <div className="glass rounded-sc border border-white/80 p-6 shadow-[0_10px_28px_rgba(32,30,29,0.08)]" style={{ ["--glass-opacity" as string]: 0.62 }}>
            <h3 className="m-0 mb-2 text-[17px] font-extrabold tracking-[-0.02em]">Saved houses</h3>
            <p className="m-0 mb-4.5 text-[14.5px] leading-relaxed text-body">Six places kept for later, two of them with dates already pencilled in.</p>
            <PillLink href="/browse" variant="outline" size="sm">
              Open list
            </PillLink>
          </div>
          <div className="glass rounded-sc border border-white/80 p-6 shadow-[0_10px_28px_rgba(32,30,29,0.08)]" style={{ ["--glass-opacity" as string]: 0.62 }}>
            <h3 className="m-0 mb-2 text-[17px] font-extrabold tracking-[-0.02em]">Receipts</h3>
            <p className="m-0 mb-4.5 text-[14.5px] leading-relaxed text-body">Every completed stay keeps its transfer proof and invoice for three years.</p>
            <PillButton variant="outline" size="sm">
              Download all
            </PillButton>
          </div>
          <div className="glass rounded-sc border border-white/80 p-6 shadow-[0_10px_28px_rgba(32,30,29,0.08)]" style={{ ["--glass-opacity" as string]: 0.62 }}>
            <h3 className="m-0 mb-2 text-[17px] font-extrabold tracking-[-0.02em]">Host messages</h3>
            <p className="m-0 mb-4.5 text-[14.5px] leading-relaxed text-body">One unread note from a host about the gate code.</p>
            <PillButton variant="primary" size="sm">
              Read message
            </PillButton>
          </div>
        </div>
      </section>
    </>
  );
}
