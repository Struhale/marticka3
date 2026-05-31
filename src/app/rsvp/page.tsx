"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "choice" | "attending-form";

export default function RSVPPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choice");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNotAttending() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attending: false }),
      });
      if (!res.ok) throw new Error("Chyba při odesílání");
      const { id } = await res.json();
      router.push(`/rsvp/potvrdi?id=${id}&attending=false`);
    } catch {
      setError("Něco se pokazilo. Zkuste to prosím znovu.");
      setSubmitting(false);
    }
  }

  if (step === "attending-form") {
    return <AttendingForm onBack={() => setStep("choice")} />;
  }

  return (
    <PageShell>
      <h1
        className="text-3xl font-bold text-center mb-2"
        style={{ color: "var(--dark)" }}
      >
        Marta & Jakub
      </h1>
      <p className="text-center mb-8" style={{ color: "var(--gold)" }}>
        10. října 2026 — Potvrzení účasti
      </p>

      <p className="text-center mb-8" style={{ color: "#444" }}>
        Zúčastníte se naší svatby?
      </p>

      {error && (
        <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setStep("attending-form")}
          disabled={submitting}
          className="px-8 py-4 rounded font-semibold text-lg text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--gold)" }}
        >
          Přijdu 🎉
        </button>
        <button
          onClick={handleNotAttending}
          disabled={submitting}
          className="px-8 py-4 rounded font-semibold text-lg border-2 transition-opacity disabled:opacity-50"
          style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
        >
          {submitting ? "Odesílám..." : "Nepřijdu"}
        </button>
      </div>

      <p className="text-center text-xs mt-8" style={{ color: "#aaa" }}>
        Termín pro potvrzení: 1. července 2026
      </p>
    </PageShell>
  );
}

function AttendingForm({ onBack }: { onBack: () => void }) {
  return (
    <PageShell>
      <button
        onClick={onBack}
        className="text-sm mb-6 flex items-center gap-1"
        style={{ color: "var(--gold)" }}
      >
        ← Zpět
      </button>
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--dark)" }}
      >
        Vyplňte údaje
      </h2>
      <p className="text-sm mb-4" style={{ color: "#666" }}>
        Formulář pro přihlášení bude brzy k dispozici.
      </p>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-sm border p-8"
        style={{ borderColor: "var(--gold-light)" }}
      >
        {children}
      </div>
      <a
        href="/"
        className="mt-6 text-sm"
        style={{ color: "var(--gold)" }}
      >
        ← Zpět na hlavní stránku
      </a>
    </div>
  );
}
