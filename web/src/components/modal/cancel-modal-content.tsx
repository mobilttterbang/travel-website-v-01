"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/buttons";
import { useModal } from "@/components/modal/modal-provider";
import { cancelBookingAction } from "@/app/actions/bookings";

const CANCEL_REASONS = ["Change of plans", "Found another place", "Dates no longer work", "Trip cost too much", "Health or family reason"];

export function CancelModalContent({
  bookingId,
  houseName,
  dates,
  ref,
}: {
  bookingId: string;
  houseName: string;
  dates: string;
  ref: string;
}) {
  const { closeModal } = useModal();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!reason) return;
    setLoading(true);
    setError(null);
    const fullReason = note ? `${reason} · ${note}` : reason;
    const result = await cancelBookingAction({ bookingId, reason: fullReason });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    closeModal();
    router.refresh();
  }

  return (
    <div>
      <p className="m-0 mb-2 text-xs font-bold tracking-[0.1em] text-accent-deep uppercase">Cancel booking</p>
      <h2 className="m-0 mb-1.5 text-[21px] font-extrabold tracking-[-0.03em] sm:text-[28px]">{houseName}</h2>
      <p className="m-0 mb-5 text-[14.5px] text-muted">
        {dates} · ref {ref}
      </p>
      <p className="m-0 mb-2.5 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Reason for cancelling</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {CANCEL_REASONS.map((r) => {
          const active = reason === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className="cursor-pointer rounded-pill border px-4.5 py-2.5 text-[13.5px] font-bold"
              style={{ background: active ? "var(--sc-accent)" : "rgba(255,255,255,0.8)", borderColor: active ? "var(--sc-accent)" : "rgba(32,30,29,0.16)", color: active ? "#fff" : "#201e1d" }}
            >
              {r}
            </button>
          );
        })}
      </div>
      <label className="mb-4.5 block">
        <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Anything to add (optional)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tell the host what happened …"
          className="w-full rounded-pill border border-[rgba(32,30,29,0.16)] bg-white/92 px-4.5 py-3 text-[14.5px]"
        />
      </label>
      <p className="m-0 mb-4.5 text-sm text-muted">{reason ? "Refund follows the house rules above." : "Pick a reason to continue."}</p>
      {error && <p className="m-0 mb-4 text-sm font-semibold text-accent-deep">{error}</p>}
      <div className="flex flex-wrap gap-2.5">
        <PillButton variant="primary" className="flex-1 basis-[180px]" onClick={handleConfirm} disabled={!reason || loading}>
          {loading ? "Cancelling…" : "Confirm cancellation"}
        </PillButton>
        <PillButton variant="outline" onClick={closeModal} disabled={loading}>
          Keep booking
        </PillButton>
      </div>
    </div>
  );
}
