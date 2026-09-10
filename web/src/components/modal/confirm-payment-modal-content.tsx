"use client";

import { useState } from "react";
import { PillButton } from "@/components/ui/buttons";
import { useModal } from "@/components/modal/modal-provider";
import { loadMidtransSnap } from "@/lib/load-midtrans-snap";
import { money } from "@/lib/format";

export function ConfirmPaymentModalContent({
  houseName,
  place,
  stayRange,
  channel,
  total,
  payload,
  onSettled,
}: {
  houseName: string;
  place: string;
  stayRange: string;
  channel: "card" | "midtrans";
  total: number;
  payload: {
    slug: string;
    checkIn: string;
    nights: number;
    guests: string;
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
    guestPhone: string;
  };
  onSettled: (result: { ok: true; ref: string } | { ok: false; error: string }) => void;
}) {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/midtrans/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, channel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not start this payment.");
        setLoading(false);
        return;
      }

      await loadMidtransSnap(data.clientKey, false);
      closeModal();
      window.snap?.pay(data.snapToken, {
        onSuccess: () => onSettled({ ok: true, ref: data.ref }),
        onPending: () => onSettled({ ok: true, ref: data.ref }),
        onError: () => onSettled({ ok: false, error: "The payment failed. Your booking was not confirmed." }),
        onClose: () => onSettled({ ok: false, error: "Checkout closed before payment finished. Your booking stayed pending." }),
      });
    } catch {
      setError("Something went wrong reaching Midtrans. Try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="m-0 mb-2 text-xs font-bold tracking-[0.1em] text-accent-deep uppercase">Confirm booking</p>
      <h2 className="m-0 mb-5 text-[21px] font-extrabold tracking-[-0.03em] sm:text-[28px]">{houseName}</h2>
      <div className="mb-5 flex flex-col gap-2.5 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/72 p-4.5 text-[15px] text-body">
        <p className="m-0 flex justify-between gap-4">
          Dates <strong className="text-ink">{stayRange}</strong>
        </p>
        <p className="m-0 flex justify-between gap-4">
          Place <strong className="text-ink">{place}</strong>
        </p>
        <p className="m-0 flex justify-between gap-4">
          Paying with <strong className="text-ink">{channel === "card" ? "Card" : "Midtrans Snap"}</strong>
        </p>
        <p className="m-0 flex justify-between gap-4 text-lg">
          Total <strong className="text-accent">{money(total)} USD</strong>
        </p>
      </div>
      {error && <p className="m-0 mb-4 text-sm font-semibold text-accent-deep">{error}</p>}
      <p className="m-0 mb-5 text-sm leading-relaxed text-muted">
        Confirming opens Midtrans&apos; secure checkout. Free cancellation up to 7 days before arrival.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <PillButton variant="primary" className="flex-1 basis-[180px]" onClick={handleConfirm} disabled={loading}>
          {loading ? "Starting checkout…" : "Confirm and pay"}
        </PillButton>
        <PillButton variant="outline" onClick={closeModal} disabled={loading}>
          Back
        </PillButton>
      </div>
    </div>
  );
}
