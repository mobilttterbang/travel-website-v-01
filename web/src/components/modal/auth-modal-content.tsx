"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PillButton } from "@/components/ui/buttons";
import { useModal } from "@/components/modal/modal-provider";

export function AuthModalContent({ initialMode = "login" }: { initialMode?: "login" | "signup" }) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { closeModal } = useModal();

  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignup) {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Could not create your account.");
          setLoading(false);
          return;
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("That email and password don't match.");
        setLoading(false);
        return;
      }
      closeModal();
      router.push("/home");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="m-0 mb-1.5 text-2xl font-extrabold tracking-tight sm:text-[30px]">
        {isSignup ? "Create your account" : "Welcome back"}
      </h2>
      <p className="m-0 mb-5.5 max-w-[34ch] text-[15px] text-muted">
        {isSignup ? "One account, every house on the list." : "Log in to see your bookings and saved houses."}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {isSignup && (
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Full name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Angga Risky"
              className="w-full rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/90 px-4.5 py-3.5 text-[15px]"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/90 px-4.5 py-3.5 text-[15px]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted uppercase">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-pill border border-[rgba(32,30,29,0.14)] bg-white/90 px-4.5 py-3.5 text-[15px]"
          />
        </label>
        {error && <p className="m-0 text-sm font-semibold text-accent-deep">{error}</p>}
        <PillButton type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
        </PillButton>
        <button
          type="button"
          onClick={() => setMode(isSignup ? "login" : "signup")}
          className="cursor-pointer self-start bg-transparent p-1 text-sm font-semibold text-muted hover:text-accent"
        >
          {isSignup ? "Already a member? Log in" : "No account yet? Sign up"}
        </button>
      </form>
    </div>
  );
}
