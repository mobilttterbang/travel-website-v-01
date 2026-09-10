"use client";

import type { ReactNode } from "react";
import { useModal } from "@/components/modal/modal-provider";
import { AuthModalContent } from "@/components/modal/auth-modal-content";
import { PillButton, type PillVariant } from "@/components/ui/buttons";

export function AuthTrigger({
  mode,
  variant,
  size = "md",
  className = "",
  children,
}: {
  mode: "login" | "signup";
  variant: PillVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}) {
  const { openModal } = useModal();
  return (
    <PillButton variant={variant} size={size} className={className} onClick={() => openModal(<AuthModalContent initialMode={mode} />)}>
      {children}
    </PillButton>
  );
}
