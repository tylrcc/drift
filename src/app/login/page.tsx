"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) router.replace("/account");
      })
      .catch(() => undefined);
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (mode === "signup" && !accepted) {
      setError("Accept the Terms, Risk disclosure, and no-refund policy to create an account.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Auth failed");
      setMessage(mode === "login" ? "Signed in." : "Account created.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-16">
      <div className="panel mx-auto max-w-md p-8">
        <h1 className="display text-4xl">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-3 text-sm text-[#6e6e73]">
          Accounts unlock your vault, order history, and one-click checkout. Buying still requires
          accepting that all sales are final.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-[#0071e3] focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-[#0071e3] focus:ring-2"
            />
          </label>
          {mode === "signup" ? (
            <label className="flex items-start gap-3 text-sm text-[#6e6e73]">
              <input
                type="checkbox"
                className="mt-1"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span>
                I am at least 18, I understand trading can wipe my capital, and I accept the{" "}
                <Link href="/legal/terms" className="text-[#0071e3]">
                  Terms
                </Link>
                ,{" "}
                <Link href="/legal/risk" className="text-[#0071e3]">
                  Risk disclosure
                </Link>
                , and{" "}
                <Link href="/legal/refunds" className="text-[#0071e3]">
                  no-refund policy
                </Link>
                .
              </span>
            </label>
          ) : null}
          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
          {message ? <p className="text-sm text-[#1f7a4d]">{message}</p> : null}
          <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-50">
            {loading ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          type="button"
          className="mt-4 text-sm text-[#0071e3]"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
