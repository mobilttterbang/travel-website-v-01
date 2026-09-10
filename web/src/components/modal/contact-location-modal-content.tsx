"use client";

import { PhoneIcon, MailIcon } from "@/components/ui/icons";
import { PillButton } from "@/components/ui/buttons";
import { Photo } from "@/components/ui/photo";
import { useModal } from "@/components/modal/modal-provider";

export function ContactModalContent({
  houseName,
  hostName,
  hostPhone,
  hostEmail,
}: {
  houseName: string;
  hostName: string;
  hostPhone: string;
  hostEmail: string;
}) {
  const { closeModal } = useModal();
  return (
    <div>
      <p className="m-0 mb-2 text-xs font-bold tracking-[0.1em] text-accent-deep uppercase">Host</p>
      <h2 className="m-0 mb-1.5 text-[21px] font-extrabold tracking-[-0.03em] sm:text-[28px]">{hostName}</h2>
      <p className="m-0 mb-5 text-[14.5px] text-muted">{houseName} · Usually replies within 2 hours</p>
      <div className="mb-5 flex flex-col gap-2.5">
        <p className="m-0 flex items-center gap-3 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/78 px-4.5 py-3.5 text-[15.5px] font-bold">
          <PhoneIcon className="flex-none text-accent" />
          {hostPhone}
        </p>
        <p className="m-0 flex items-center gap-3 rounded-sc border border-[rgba(32,30,29,0.1)] bg-white/78 px-4.5 py-3.5 text-[15.5px] font-bold break-all">
          <MailIcon className="flex-none text-accent" />
          {hostEmail}
        </p>
      </div>
      <PillButton variant="primary" onClick={closeModal}>
        Close
      </PillButton>
    </div>
  );
}

export function LocationModalContent({ houseName, address }: { houseName: string; address: string }) {
  const { closeModal } = useModal();
  return (
    <div>
      <p className="m-0 mb-2 text-xs font-bold tracking-[0.1em] text-accent-deep uppercase">Location</p>
      <h2 className="m-0 mb-4 text-[21px] font-extrabold tracking-[-0.03em] sm:text-[28px]">{houseName}</h2>
      <div className="mb-4.5 overflow-hidden rounded-sc border border-[rgba(32,30,29,0.1)]">
        <Photo shape="rect" alt="Neighbourhood map" className="aspect-[16/10] w-full" />
      </div>
      <p className="m-0 mb-5 text-[15.5px] leading-relaxed text-body">{address}</p>
      <PillButton variant="primary" onClick={closeModal}>
        Close
      </PillButton>
    </div>
  );
}
