"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmationContent() {
  const params = useSearchParams();
  const attending = params.get("attending") === "true";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-sm border p-8 text-center"
        style={{ borderColor: "var(--gold-light)" }}
      >
        <div className="text-5xl mb-4">{attending ? "🎉" : "💌"}</div>
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--dark)" }}>
          {attending ? "Těšíme se na vás!" : "Děkujeme za odpověď"}
        </h1>
        <p style={{ color: "#666" }}>
          {attending
            ? "Vaše přihlášení bylo úspěšně odesláno. Budeme se těšit!"
            : "Mrzí nás, že se nemůžete zúčastnit. Děkujeme, že jste nám dali vědět."}
        </p>

        <div
          className="mt-6 pt-6 border-t text-sm"
          style={{ borderColor: "var(--gold-light)", color: "#888" }}
        >
          <p>Marta & Jakub — 10. 10. 2026</p>
        </div>
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
