"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";

type ModalContextValue = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = useCallback((c: ReactNode) => setContent(c), []);
  const closeModal = useCallback(() => setContent(null), []);

  useEffect(() => {
    if (!content) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [content, closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {content && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-10"
          style={{ background: "rgba(32,30,29,0.42)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="glass relative max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-sc-lg border border-white/95 p-6 shadow-[0_30px_80px_rgba(32,30,29,0.34)] sm:p-8.5"
            style={{ ["--glass-opacity" as string]: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-full border border-[rgba(32,30,29,0.12)] bg-white/80 text-muted hover:text-accent"
            >
              <CloseIcon />
            </button>
            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
