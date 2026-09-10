import type { CSSProperties, ElementType, ReactNode } from "react";

export function GlassPanel({
  as: Component = "div",
  opacity = 0.62,
  rounded = "lg",
  className = "",
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  opacity?: number;
  rounded?: "sm" | "lg";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const radius = rounded === "sm" ? "rounded-sc" : "rounded-sc-lg";
  return (
    <Component
      className={`glass ${radius} ${className}`}
      style={{ ["--glass-opacity" as string]: opacity, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function Eyebrow({ children, dot = true }: { children: ReactNode; dot?: boolean }) {
  return (
    <p className="m-0 mb-4 flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-accent-deep">
      {dot && <span className="inline-block h-2 w-2 flex-none rounded-[3px] bg-accent" />}
      {children}
    </p>
  );
}

export function Pill({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "dark" | "ink-soft";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-white/86 text-ink",
    accent: "bg-accent text-white",
    dark: "bg-[rgba(32,30,29,0.86)] text-white",
    "ink-soft": "bg-[rgba(32,30,29,0.07)] text-ink",
  };
  return (
    <span className={`rounded-pill px-3.5 py-1.5 text-[12.5px] font-extrabold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
