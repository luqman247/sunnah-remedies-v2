"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Staff sign-in page.
 *
 * Minimal, dignified authentication for internal staff.
 * No public branding or guest-facing language — this is purely operational.
 *
 * @see Phase 4, Chapter 11.5 — Strong authentication for sensitive systems
 */
function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/handbook";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Unable to reach the server. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          aria-describedby={error ? "sign-in-error" : undefined}
          className="w-full px-3 py-2 border border-emerald/15 bg-white text-sm text-emerald placeholder:text-emerald/30 focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-describedby={error ? "sign-in-error" : undefined}
          className="w-full px-3 py-2 border border-emerald/15 bg-white text-sm text-emerald placeholder:text-emerald/30 focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40 transition-colors"
        />
      </div>

      {error && (
        <p
          id="sign-in-error"
          role="alert"
          aria-live="assertive"
          className="font-[family-name:var(--font-utility)] text-xs text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-emerald text-white font-[family-name:var(--font-utility)] text-xs font-medium tracking-wide uppercase hover:bg-emerald/90 focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:ring-offset-2 transition-colors disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[warm-ivory] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <p className="font-[family-name:var(--font-utility)] text-xs font-medium tracking-widest uppercase text-emerald/50 mb-2">
            Sunnah Remedies
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-light text-emerald">
            Staff Access
          </h1>
        </header>

        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>

        <footer className="mt-8 text-center">
          <p className="font-[family-name:var(--font-utility)] text-[10px] text-emerald/30">
            Internal use only. Contact the Head of Systems for access
          </p>
        </footer>
      </div>
    </div>
  );
}
