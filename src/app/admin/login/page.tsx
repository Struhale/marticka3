"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Chyba přihlášení");
        setLoading(false);
        return;
      }
      router.push(from);
    } catch {
      setError("Něco se pokazilo. Zkuste to znovu.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-sm border p-8"
        style={{ borderColor: "var(--gold-light)" }}
      >
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--dark)" }}>
          Admin přihlášení
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>
              Heslo
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: "var(--gold-light)" }}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--gold)" }}
          >
            {loading ? "Přihlašuji..." : "Přihlásit se"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
