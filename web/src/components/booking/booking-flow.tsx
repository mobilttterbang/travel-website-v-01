"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Photo } from "@/components/ui/photo";
import { PillButton } from "@/components/ui/buttons";
import { CheckIcon } from "@/components/ui/icons";
import { useModal } from "@/components/modal/modal-provider";
import { ConfirmPaymentModalContent } from "@/components/modal/confirm-payment-modal-content";
import { VA_BANKS, type VaBank } from "@/lib/payment-constants";
import { money, nightsLabel, rangeLabel } from "@/lib/format";

type PayMethod = "card" | "va" | "midtrans";

type StepCircleProps = { n: number; active: boolean; done: boolean };
function StepCircle({ n, active, done }: StepCircleProps) {
  return (
    <span
      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 text-lg font-extrabold shadow-[0_8px_22px_rgba(32,30,29,0.10)]"
      style={{ background: active || done ? "var(--sc-accent)" : "rgba(255,255,255,0.7)", color: active || done ? "#fff" : "#605d5d" }}
    >
      {done ? <CheckIcon size={22} /> : n}
    </span>
  );
}

export function BookingFlow({
  house,
  checkIn,
  nights,
  initialGuest,
}: {
  house: { slug: string; name: string; place: string; price: number };
  checkIn: string;
  nights: number;
  initialGuest: { firstName: string; lastName: string; email: string; phone: string };
}) {
  const router = useRouter();
  const { openModal } = useModal();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [guest, setGuest] = useState(initialGuest);
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [cardName, setCardName] = useState("");
  const [vaBank, setVaBank] = useState<VaBank>("BCA");
  const [vaLoading, setVaLoading] = useState(false);
  const [vaError, setVaError] = useState<string | null>(null);
  const [vaResult, setVaResult] = useState<{ vaNumber: string; vaBank: string; vaExpiry: string } | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const [finalError, setFinalError] = useState<string | null>(null);

  const checkOut = new Date(checkIn + "T00:00:00Z");
  checkOut.setUTCDate(checkOut.getUTCDate() + nights);
  const checkOutIso = checkOut.toISOString().slice(0, 10);
  const sub = house.price * nights;
  const tax = Math.round(sub * 0.1);
  const total = sub + tax;
  const guestComplete = guest.firstName && guest.lastName && guest.email && guest.phone;

  function goStep1() {
    setStep(1);
  }

  function handleContinueFromStep1() {
    if (!guestComplete) return;
    setStep(2);
  }

  const payload = {
    slug: house.slug,
    checkIn,
    nights,
    guests: "2 guests",
    guestFirstName: guest.firstName,
    guestLastName: guest.lastName,
    guestEmail: guest.email,
    guestPhone: guest.phone,
  };

  function openConfirm(channel: "card" | "midtrans") {
    openModal(
      <ConfirmPaymentModalContent
        houseName={house.name}
        place={house.place}
        stayRange={rangeLabel(checkIn, checkOutIso)}
        channel={channel}
        total={total}
        payload={payload}
        onSettled={(result) => {
          if (result.ok) {
            setRef(result.ref);
            setFinalError(null);
            setStep(3);
          } else {
            setFinalError(result.error);
          }
        }}
      />
    );
  }

  async function handleGenerateVa() {
    setVaLoading(true);
    setVaError(null);
    try {
      const res = await fetch("/api/payments/midtrans/va", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, bank: vaBank }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVaError(data.error ?? "Could not generate a virtual account.");
        setVaLoading(false);
        return;
      }
      setVaResult({ vaNumber: data.vaNumber, vaBank: data.vaBank, vaExpiry: data.vaExpiry });
      setRef(data.ref);
      setStep(3);
    } catch {
      setVaError("Something went wrong reaching Midtrans. Try again.");
    } finally {
      setVaLoading(false);
    }
  }

  const payTabs: { key: PayMethod; label: string; note: string }[] = [
    { key: "card", label: "Card", note: "Visa, Mastercard, JCB" },
    { key: "va", label: "Virtual account", note: "BCA, Mandiri, BNI, BRI, Permata" },
    { key: "midtrans", label: "Midtrans", note: "GoPay, QRIS, ShopeePay and more" },
  ];

  return (
    <section className="mx-auto max-w-[900px] pt-9 sm:pt-14">
      <div className="mb-9 flex items-center justify-center gap-0">
        <StepCircle n={1} active={step === 1} done={step > 1} />
        <span className="h-0.5 w-10 flex-none bg-[rgba(32,30,29,0.16)] sm:w-27.5" />
        <StepCircle n={2} active={step === 2} done={step > 2} />
        <span className="h-0.5 w-10 flex-none bg-[rgba(32,30,29,0.16)] sm:w-27.5" />
        <StepCircle n={3} active={step === 3} done={false} />
      </div>

      <h1 className="m-0 text-center text-[30px] leading-[1.1] font-extrabold tracking-[-0.035em] sm:text-[46px]">
        {step === 1 ? "Booking Information" : step === 2 ? "Payment" : "Yay! Completed"}
      </h1>
      <p className="m-0 mt-2.5 text-center text-base text-muted">
        {step === 1 ? "Please fill up the blank fields below" : step === 2 ? "Kindly follow the instructions below" : "Your stay is on the books"}
      </p>

      {step === 1 && (
        <div
          className="glass mt-9 flex flex-wrap gap-6 rounded-sc-lg border border-white/85 p-5 shadow-[0_16px_44px_rgba(32,30,29,0.12)] sm:gap-10 sm:p-8"
          style={{ ["--glass-opacity" as string]: 0.62 }}
        >
          <div className="min-w-0 flex-1 basis-[280px]">
            <div className="overflow-hidden rounded-sc shadow-[0_14px_34px_rgba(32,30,29,0.16)]">
              <Photo shape="rect" alt={house.name} className="aspect-[16/11] w-full" />
            </div>
            <div className="mt-4.5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.02em]">{house.name}</h2>
                <p className="m-0 mt-1 text-sm text-muted">{house.place}</p>
              </div>
              <p className="m-0 text-[15px] text-muted">
                <strong className="text-lg text-ink">{money(total)} USD</strong> per {nightsLabel(nights)}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-4 border-l-0 border-[rgba(32,30,29,0.12)] sm:border-l sm:pl-8">
            {(
              [
                ["First name", "firstName", "text"],
                ["Last name", "lastName", "text"],
                ["Email address", "email", "email"],
                ["Phone number", "phone", "tel"],
              ] as const
            ).map(([label, key, type]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-muted uppercase">{label}</span>
                <input
                  type={type}
                  value={guest[key]}
                  onChange={(e) => setGuest((g) => ({ ...g, [key]: e.target.value }))}
                  className="w-full rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/86 px-4.5 py-3.5 text-[15px]"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div
          className="glass mt-9 flex flex-wrap gap-6 rounded-sc-lg border border-white/85 p-5 shadow-[0_16px_44px_rgba(32,30,29,0.12)] sm:gap-10 sm:p-8"
          style={{ ["--glass-opacity" as string]: 0.62 }}
        >
          <div className="min-w-0 flex-1 basis-[280px]">
            <h2 className="m-0 mb-4.5 text-[19px] font-extrabold tracking-[-0.02em]">Payment method</h2>
            <div className="mb-6 flex flex-col gap-2 text-[15px] text-body">
              <p className="m-0">
                Tax <strong className="text-ink">10%</strong>
              </p>
              <p className="m-0">
                Sub total <strong className="text-ink">{money(sub)} USD</strong>
              </p>
              <p className="m-0 text-lg">
                Total <strong className="text-accent">{money(total)} USD</strong>
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {payTabs.map((m) => {
                const active = payMethod === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPayMethod(m.key)}
                    className="cursor-pointer rounded-sc border px-4.5 py-3.5 text-left"
                    style={{ background: active ? "var(--sc-accent)" : "rgba(255,255,255,0.72)", borderColor: active ? "var(--sc-accent)" : "rgba(32,30,29,0.14)", color: active ? "#fff" : "#201e1d" }}
                  >
                    <strong className="block text-[15.5px] font-extrabold tracking-[-0.01em]">{m.label}</strong>
                    <span className="text-[13.5px]" style={{ color: active ? "rgba(255,255,255,0.82)" : "#605d5d" }}>
                      {m.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-4 border-l-0 border-[rgba(32,30,29,0.12)] sm:border-l sm:pl-8">
            {payMethod === "card" && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-muted uppercase">Name on card</span>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="ANGGA RISKY"
                    className="w-full rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/86 px-4.5 py-3.5 text-[15px]"
                  />
                </label>
                <p className="m-0 text-sm leading-relaxed text-muted">
                  Card number, expiry and CVV are entered on Midtrans&apos; secure checkout in the next step — we never
                  see or store the full number.
                </p>
              </>
            )}

            {payMethod === "va" && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-muted uppercase">Bank</span>
                  <select
                    value={vaBank}
                    onChange={(e) => setVaBank(e.target.value as VaBank)}
                    className="w-full cursor-pointer rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/86 px-4.5 py-3.5 text-[15px]"
                  >
                    {VA_BANKS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </label>
                {vaError && <p className="m-0 text-sm font-semibold text-accent-deep">{vaError}</p>}
                <PillButton variant="dark" className="self-start" onClick={handleGenerateVa} disabled={vaLoading}>
                  {vaLoading ? "Generating…" : "Generate VA number"}
                </PillButton>
                <p className="m-0 text-sm leading-relaxed text-muted">
                  Virtual accounts are matched automatically the moment the transfer clears.
                </p>
              </>
            )}

            {payMethod === "midtrans" && (
              <>
                <div className="rounded-sc border border-[rgba(32,30,29,0.12)] bg-white/82 p-5">
                  <p className="m-0 mb-2.5 flex items-center gap-2.5 text-[15.5px] font-extrabold">
                    <span className="flex h-7.5 w-11 items-center justify-center rounded-[9px] bg-[rgba(32,30,29,0.9)] text-[10px] font-extrabold tracking-[0.06em] text-white">
                      MT
                    </span>
                    Midtrans Snap
                  </p>
                  <p className="m-0 text-[14.5px] leading-relaxed text-body">
                    Opens Midtrans checkout for GoPay, ShopeePay, QRIS, Akulaku or any bank. The booking flips to paid
                    on their callback.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div
          className="glass mt-9 rounded-sc-lg border border-white/85 p-7 text-center shadow-[0_16px_44px_rgba(32,30,29,0.12)] sm:p-13"
          style={{ ["--glass-opacity" as string]: 0.62 }}
        >
          <div className="relative mx-auto mb-7 w-[min(280px,70%)]">
            <div className="overflow-hidden rounded-sc-lg shadow-[0_18px_44px_rgba(32,30,29,0.18)]">
              <Photo shape="rect" alt="Your stay" className="aspect-square w-full" />
            </div>
            <span className="absolute right-[-14px] bottom-[-14px] flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_30px_rgba(236,48,19,0.36)]">
              <CheckIcon size={30} />
            </span>
          </div>
          {ref ? (
            <>
              <p className="mx-auto max-w-[38ch] text-[17px] leading-relaxed text-body">
                {vaResult
                  ? "Transfer the exact total to the virtual account below and we'll confirm automatically once it clears."
                  : "We will email you once the payment is confirmed."}{" "}
                Your booking reference is <strong className="text-ink">{ref}</strong>.
              </p>
              {vaResult && (
                <div className="mx-auto mt-5 max-w-[360px] rounded-sc border border-[rgba(236,48,19,0.26)] bg-white/86 p-4.5 text-left">
                  <p className="m-0 mb-1.5 text-[11.5px] font-bold tracking-[0.08em] text-muted uppercase">{vaResult.vaBank} virtual account</p>
                  <p className="m-0 text-[22px] font-extrabold tracking-[0.04em]">{vaResult.vaNumber}</p>
                  <p className="m-0 mt-1.5 text-[13.5px] text-muted">Transfer the exact total from any {vaResult.vaBank} channel.</p>
                </div>
              )}
            </>
          ) : (
            <p className="mx-auto max-w-[38ch] text-[17px] leading-relaxed text-body">{finalError}</p>
          )}
          <div className="mt-7.5 flex flex-wrap justify-center gap-3">
            <PillButton variant="primary" size="lg" onClick={() => router.push("/home")}>
              Back to Home
            </PillButton>
            <PillButton variant="outline" size="lg" onClick={() => router.push("/profile")}>
              See my bookings
            </PillButton>
          </div>
        </div>
      )}

      {step < 3 && (
        <div className="mt-8.5 flex flex-col items-center gap-3">
          {step === 1 && (
            <PillButton variant="primary" size="lg" className="min-w-[min(320px,100%)]" onClick={handleContinueFromStep1} disabled={!guestComplete}>
              Continue to Book
            </PillButton>
          )}
          {step === 2 && payMethod !== "va" && (
            <PillButton variant="primary" size="lg" className="min-w-[min(320px,100%)]" onClick={() => openConfirm(payMethod as "card" | "midtrans")}>
              {payMethod === "card" ? "Confirm payment" : "Open Midtrans checkout"}
            </PillButton>
          )}
          <PillButton
            variant="glass"
            size="md"
            className="min-w-[min(320px,100%)] !bg-white/60"
            onClick={() => (step === 1 ? router.push(`/house/${house.slug}`) : goStep1())}
          >
            {step === 1 ? "Cancel" : "Back"}
          </PillButton>
        </div>
      )}
    </section>
  );
}
