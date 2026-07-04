"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function MemberSignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal/practitioner";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("member-credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("We could not verify those credentials. Please try again");
        setLoading(false);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Unable to reach the server. Please try again shortly");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="measure" style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--s4)" }}>
        <label htmlFor="member-email" className="type-micro">
          Email
        </label>
        <input
          id="member-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          aria-describedby={error ? "member-sign-in-error" : undefined}
          className="type-body"
          style={{
            display: "block",
            width: "100%",
            marginTop: "var(--s1)",
            padding: "var(--s2)",
            border: "1px solid var(--rule)",
            background: "var(--paper)",
          }}
        />
      </div>

      <div style={{ marginBottom: "var(--s4)" }}>
        <label htmlFor="member-password" className="type-micro">
          Password
        </label>
        <input
          id="member-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-describedby={error ? "member-sign-in-error" : undefined}
          className="type-body"
          style={{
            display: "block",
            width: "100%",
            marginTop: "var(--s1)",
            padding: "var(--s2)",
            border: "1px solid var(--rule)",
            background: "var(--paper)",
          }}
        />
      </div>

      {error && (
        <p id="member-sign-in-error" role="alert" className="type-small" style={{ color: "var(--deep-green)" }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="solid-action">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function MemberSignInFormWrapper() {
  return (
    <Suspense fallback={null}>
      <MemberSignInForm />
    </Suspense>
  );
}
