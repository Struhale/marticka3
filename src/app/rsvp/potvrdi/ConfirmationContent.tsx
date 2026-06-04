"use client";

import { useSearchParams } from "next/navigation";

const ARRIVAL_LABELS: Record<string, string> = {
  friday: "Pátek s ubytováním (od 9. 10. 2026)",
  saturday: "Sobota na obřad (10. 10. 2026)",
};

export default function ConfirmationContent() {
  const params = useSearchParams();
  const attending = params.get("attending") === "true";
  const arrival = params.get("arrival") ?? "";
  const namesParam = params.get("names") ?? "";
  const names = namesParam
    ? namesParam.split(",").map((n) => decodeURIComponent(n))
    : [];

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
            ? "Vaše odpovědi jsme úspešně přijali. Budeme se těšit! V případě jakkýchkoliv změn kontaktujte svědky."
            : "Mrzí nás, že se nemůžete zúčastnit. Děkujeme, že jste nám dali vědět."}
        </p>

        {(names.length > 0 || arrival) && (
          <div
            className="mt-6 pt-6 border-t text-left text-sm space-y-3"
            style={{ borderColor: "var(--gold-light)" }}
          >
            {names.length > 0 && (
              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--dark)" }}>
                  {attending ? "Odpověděli jste za" : "Za koho jste odpověděli"}
                </p>
                <ul className="space-y-1" style={{ color: "#444" }}>
                  {names.map((name) => (
                    <li key={name}>• {name}</li>
                  ))}
                </ul>
              </div>
            )}
            {arrival && ARRIVAL_LABELS[arrival] && (
              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--dark)" }}>
                  Přijedete v
                </p>
                <p style={{ color: "#444" }}>{ARRIVAL_LABELS[arrival]}</p>
              </div>
            )}
          </div>
        )}

        <div
          className="mt-6 pt-6 border-t text-sm"
          style={{ borderColor: "var(--gold-light)", color: "#888" }}
        >
          <p>Marta & Jakub — 10. 10. 2026</p>
        </div>
      </div>
      <a href="/" className="mt-6 text-sm" style={{ color: "var(--gold)" }}>
        ← Zpět na hlavní stránku
      </a>
    </div>
  );
}
