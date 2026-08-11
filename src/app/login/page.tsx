"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const supabase = createClient();
    if (!supabase) {
      setError(
        "Supabase is not connected yet. Buying still works via license keys in the vault.",
      );
      return;
    }
    if (mode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else setMessage("Signed in.");
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) setError(err.message);
      else setMessage("Check your email to confirm, or sign in if confirmations are off.");
    }
  }

  return (
    <div className="container-page py-16">
      <div className="panel mx-auto max-w-md p-8">
        <h1 className="display text-4xl">{mode === "login" ? "Sign in" : "Create account"}</h1>
        <p className="mt-3 text-sm text-[#6e6e73]">
          Optional. Purchases already unlock via license key in the{" "}
          <Link href="/vault">vault</Link>.
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-[#0071e3] focus:ring-2"
            />
          </label>
          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
          {message ? <p className="text-sm text-[#1f7a4d]">{message}</p> : null}
          <button type="submit" className="btn btn-primary w-full">
            {mode === "login" ? "Sign in" : "Sign up"}
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
