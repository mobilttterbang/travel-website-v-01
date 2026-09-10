"use client";

import { PillButton } from "@/components/ui/buttons";
import { useModal } from "@/components/modal/modal-provider";
import { fmtDate, money, nightsLabel } from "@/lib/format";

export type InvoiceData = {
  ref: string;
  status: string;
  issuedAt: string | Date;
  checkIn: string | Date;
  checkOut: string | Date;
  nights: number;
  guests: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCity: string;
  houseName: string;
  houseKind: string;
  nightlyRate: number;
  sub: number;
  tax: number;
  total: number;
  cancelled: boolean;
  reason: string;
  hostName: string;
  hostAddress: string;
  hostPhone: string;
  hostEmail: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="m-0 flex flex-wrap justify-between gap-2">
      {label} <strong className="text-ink">{value}</strong>
    </p>
  );
}

export function InvoiceModalContent({ invoice }: { invoice: InvoiceData }) {
  const { closeModal } = useModal();
  return (
    <div>
      <div className="m-0 mr-10 mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="m-0 mb-1.5 text-xs font-bold tracking-[0.1em] text-accent-deep uppercase">Invoice {invoice.ref}</p>
          <h2 className="m-0 text-[21px] font-extrabold tracking-[-0.03em] sm:text-[28px]">
            {money(invoice.total)} · {invoice.status}
          </h2>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">Issued {fmtDate(invoice.issuedAt)}</p>
        </div>
        <span className="flex items-center gap-2.5 text-base font-extrabold tracking-[-0.02em]">
          <span className="inline-block h-2.5 w-2.5 rounded-[4px] bg-accent" />
          Staycation
        </span>
      </div>

      <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Guest</p>
      <div className="mb-4 flex flex-col gap-1.5 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/74 p-4 text-[14.5px] text-body">
        <Row label="Name" value={invoice.guestName} />
        <Row label="Email" value={invoice.guestEmail} />
        <Row label="Phone" value={invoice.guestPhone} />
        <Row label="City" value={invoice.guestCity || "—"} />
      </div>

      <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Booking</p>
      <div className="mb-4 flex flex-col gap-1.5 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/74 p-4 text-[14.5px] text-body">
        <Row label="Property" value={invoice.houseName} />
        <Row label="Type" value={invoice.houseKind} />
        <Row label="Check in" value={fmtDate(invoice.checkIn)} />
        <Row label="Check out" value={fmtDate(invoice.checkOut)} />
        <Row label="Length" value={nightsLabel(invoice.nights)} />
        <Row label="Guests" value={invoice.guests} />
      </div>

      <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Charges</p>
      <div className="mb-4 flex flex-col gap-1.5 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/74 p-4 text-[14.5px] text-body">
        <Row label="Nightly rate" value={`${money(invoice.nightlyRate)} × ${invoice.nights}`} />
        <Row label="Sub total" value={money(invoice.sub)} />
        <Row label="Tax 10%" value={money(invoice.tax)} />
        <p className="m-0 flex justify-between gap-2 border-t border-[rgba(32,30,29,0.12)] pt-2 text-[17px]">
          Total <strong className="text-accent">{money(invoice.total)} USD</strong>
        </p>
      </div>

      {invoice.cancelled && (
        <p className="m-0 mb-4 rounded-sc border border-[rgba(236,48,19,0.24)] bg-[rgba(236,48,19,0.08)] px-4 py-3.5 text-sm text-accent-deep">
          Cancelled — {invoice.reason}
        </p>
      )}

      <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Property host</p>
      <div className="mb-4 flex flex-col gap-1.5 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/74 p-4 text-[14.5px] leading-snug text-body">
        <p className="m-0">
          <strong className="text-ink">{invoice.hostName}</strong> · host of {invoice.houseName}
        </p>
        <p className="m-0">{invoice.hostAddress}</p>
        <p className="m-0">{invoice.hostPhone}</p>
        <p className="m-0 break-all">{invoice.hostEmail}</p>
      </div>

      <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Staycation support</p>
      <div className="mb-5.5 flex flex-col gap-1.5 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/74 p-4 text-[14.5px] leading-snug text-body">
        <p className="m-0">
          <strong className="text-ink">Rani Prameswari</strong> · guest support lead
        </p>
        <p className="m-0">Staycation, Jl. Kemang Raya 21, Jakarta 12730, Indonesia</p>
        <p className="m-0">021 – 2208 – 1996</p>
        <p className="m-0">support@staycation.id</p>
      </div>

      <PillButton variant="primary" onClick={closeModal}>
        Close
      </PillButton>
    </div>
  );
}
