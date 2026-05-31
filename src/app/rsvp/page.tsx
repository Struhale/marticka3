"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PersonRow {
  name: string;
  allergies: string;
}

type Arrival = "friday" | "saturday";

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
      if (!res.ok) throw new Error();
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
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "var(--dark)" }}>
        Marta & Jakub
      </h1>
      <p className="text-center mb-8" style={{ color: "var(--gold)" }}>
        10. října 2026 — Potvrzení účasti
      </p>
      <p className="text-center mb-8" style={{ color: "#444" }}>
        Zúčastníte se naší svatby?
      </p>

      {error && <p className="text-center text-red-600 mb-4 text-sm">{error}</p>}

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
  const router = useRouter();
  const [people, setPeople] = useState<PersonRow[]>([{ name: "", allergies: "" }]);
  const [arrival, setArrival] = useState<Arrival | null>(null);
  const [note, setNote] = useState("");
  const [song, setSong] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updatePerson(index: number, field: keyof PersonRow, value: string) {
    setPeople((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function addPerson() {
    setPeople((prev) => [...prev, { name: "", allergies: "" }]);
  }

  function removePerson(index: number) {
    if (index === 0) return; // submitter cannot be removed
    setPeople((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!people[0].name.trim()) {
      setError("Vyplňte prosím své jméno.");
      return;
    }
    if (!arrival) {
      setError("Zvolte prosím termín příjezdu.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      attending: true,
      arrival,
      note: note.trim() || null,
      song: song.trim() || null,
      people: people
        .filter((p) => p.name.trim())
        .map((p, i) => ({
          name: p.name.trim(),
          allergies: p.allergies.trim() || null,
          is_submitter: i === 0,
        })),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      const names = payload.people.map((p) => encodeURIComponent(p.name)).join(",");
      router.push(
        `/rsvp/potvrdi?id=${id}&attending=true&arrival=${arrival}&names=${names}`
      );
    } catch {
      setError("Něco se pokazilo. Zkuste to prosím znovu.");
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <button
        onClick={onBack}
        className="text-sm mb-6 flex items-center gap-1"
        style={{ color: "var(--gold)" }}
      >
        ← Zpět
      </button>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--dark)" }}>
        Přihlašovací formulář
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* People table */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: "var(--dark)" }}>
            Účastníci
          </label>
          <div className="space-y-3">
            {people.map((person, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder={i === 0 ? "Vaše jméno (povinné)" : "Jméno (nepovinné)"}
                    value={person.name}
                    onChange={(e) => updatePerson(i, "name", e.target.value)}
                    required={i === 0}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: "var(--gold-light)" }}
                  />
                  <input
                    type="text"
                    placeholder="Alergie / intolerance (nepovinné)"
                    value={person.allergies}
                    onChange={(e) => updatePerson(i, "allergies", e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: "var(--gold-light)" }}
                  />
                </div>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removePerson(i)}
                    className="mt-1 text-sm text-red-400 hover:text-red-600"
                    aria-label="Odebrat osobu"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addPerson}
            className="mt-3 text-sm underline"
            style={{ color: "var(--gold)" }}
          >
            + Přidat další osobu
          </button>
        </div>

        {/* Arrival */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: "var(--dark)" }}>
            Termín příjezdu
          </label>
          <div className="space-y-2">
            {(
              [
                { value: "friday", label: "Pátek s ubytováním (od 9. 10. 2026)" },
                { value: "saturday", label: "Sobota na obřad (10. 10. 2026)" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer text-sm"
              >
                <input
                  type="radio"
                  name="arrival"
                  value={opt.value}
                  checked={arrival === opt.value}
                  onChange={() => setArrival(opt.value)}
                  style={{ accentColor: "var(--gold)" }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>
            Poznámka pro organizátory (nepovinné)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--gold-light)" }}
          />
        </div>

        {/* Song */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>
            Oblíbená písnička pro DJ (nepovinné)
          </label>
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="i dětská…"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: "var(--gold-light)" }}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--gold)" }}
        >
          {submitting ? "Odesílám..." : "Potvrdit účast →"}
        </button>
      </form>
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
      <a href="/" className="mt-6 text-sm" style={{ color: "var(--gold)" }}>
        ← Zpět na hlavní stránku
      </a>
    </div>
  );
}
