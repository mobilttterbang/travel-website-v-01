import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type PillVariant = "primary" | "glass" | "outline" | "dark" | "ghost-danger" | "danger-active";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<PillVariant, string> = {
  primary:
    "border-0 text-white bg-accent shadow-[0_10px_26px_rgba(236,48,19,0.28)] hover:bg-accent-dark",
  glass:
    "glass text-ink hover:text-accent [--glass-opacity:0.62]",
  outline:
    "border border-[rgba(32,30,29,0.14)] bg-white/72 text-ink hover:text-accent hover:border-accent",
  dark: "border-0 text-white bg-[rgba(32,30,29,0.9)] hover:bg-accent",
  "ghost-danger":
    "border border-[rgba(236,48,19,0.3)] bg-[rgba(236,48,19,0.10)] text-accent-deep hover:bg-accent hover:text-white",
  "danger-active": "border-0 text-white bg-accent hover:bg-accent-dark",
};

const sizes = {
  sm: "px-4 py-2.5 text-[13.5px]",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

export function PillButton({
  variant = "outline",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  variant?: PillVariant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function PillLink({
  href,
  variant = "outline",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: PillVariant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}

export function IconButton({
  className = "",
  children,
  ...rest
}: { className?: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full border border-[rgba(32,30,29,0.14)] bg-white/78 text-ink shadow-[0_8px_22px_rgba(32,30,29,0.10)] backdrop-blur-[22px] transition-colors hover:border-accent hover:bg-accent hover:text-white ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
