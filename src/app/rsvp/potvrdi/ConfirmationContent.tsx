"use client";

import { useSearchParams } from "next/navigation";

const ARRIVAL_LABELS: Record<string, string> = {
  two_nights: "Ubytuju se v pátek i sobotu",
  one_night: "Ubytuju se jen v sobotu",
};

export default function ConfirmationContent() {
  const params = useSearchParams();
  const attending = params.get("attending") === "true";
  const arrival = params.get("arrival") ?? "";
  const namesParam = params.get("names") ?? "";
  const song = params.get("song") ?? "";
  const note = params.get("note") ?? "";
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
            ? "Děkujeme, odpovědi jsme úspěšně uložili! Moc se na vás těšíme. Kdyby se u vás cokoliv změnilo, dejte nám prosím vědět."
            : "Mrzí nás, že se nemůžete zúčastnit. Děkujeme, že jste nám dali vědět."}
        </p>

        {(names.length > 0 || arrival || song || note) && (
          <div
            className="mt-6 pt-6 border-t text-left text-sm space-y-3"
            style={{ borderColor: "var(--gold-light)" }}
          >
            {names.length > 0 && (
              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--dark)" }}>
                  {attending ? "Odpověď jste odeslali za" : "Odpověď jste odeslali za"}
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
                  Ubytování
                </p>
                <p style={{ color: "#444" }}>{ARRIVAL_LABELS[arrival]}</p>
              </div>
            )}
            {song && (
              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--dark)" }}>
                  Písničky
                </p>
                <p style={{ color: "#444", whiteSpace: "pre-wrap" }}>{song}</p>
              </div>
            )}
            {note && (
              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--dark)" }}>
                  Vzkaz
                </p>
                <p style={{ color: "#444", whiteSpace: "pre-wrap" }}>{note}</p>
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
