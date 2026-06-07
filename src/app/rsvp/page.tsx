"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PersonRow {
  name: string;
  allergies: string;
}

type Arrival = "none" | "two_nights" | "one_night";

type Step = "choice" | "attending-form" | "not-attending-form";

export default function RSVPPage() {
  const [step, setStep] = useState<Step>("choice");

  if (step === "attending-form") {
    return <AttendingForm onBack={() => setStep("choice")} />;
  }

  if (step === "not-attending-form") {
    return <NotAttendingForm onBack={() => setStep("choice")} />;
  }

  return (
    <PageShell>
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "var(--dark)" }}>
        Marta & Jakub
      </h1>
      <p className="text-center mb-8" style={{ color: "var(--green)" }}>
        10. října 2026 — Potvrzení účasti
      </p>
      <p className="text-center mb-8" style={{ color: "#444" }}>
        Zúčastníte se naší svatby?
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setStep("attending-form")}
          className="px-8 py-4 rounded font-semibold text-lg text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          style={{ backgroundColor: "var(--green)" }}
        >
          Přijdu 🎉
        </button>
        <button
          onClick={() => setStep("not-attending-form")}
          className="px-8 py-4 rounded font-semibold text-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ borderColor: "var(--green)", color: "var(--green)" }}
        >
          Nepřijdu
        </button>
      </div>

      <p className="text-center text-xs mt-8" style={{ color: "#aaa" }}>
        Termín pro potvrzení: 1. července 2026
      </p>
    </PageShell>
  );
}

function NotAttendingForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [submitterName, setSubmitterName] = useState("");
  const [others, setOthers] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addOther() {
    setOthers((prev) => [...prev, ""]);
  }

  function updateOther(index: number, value: string) {
    setOthers((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function removeOther(index: number) {
    setOthers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submitterName.trim()) {
      setError("Vyplňte prosím své jméno.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const allPeople = [
      { name: submitterName.trim(), is_submitter: true },
      ...others
        .filter((n) => n.trim())
        .map((n) => ({ name: n.trim(), is_submitter: false })),
    ];

    const payload = {
      attending: false,
      note: note.trim() || null,
      people: allPeople,
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      const names = allPeople.map((p) => encodeURIComponent(p.name)).join(",");
      const noteParam = note.trim() ? `&note=${encodeURIComponent(note.trim())}` : "";
      router.push(`/rsvp/potvrdi?id=${id}&attending=false&names=${names}${noteParam}`);
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
        style={{ color: "var(--green)" }}
      >
        ← Zpět
      </button>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--dark)" }}>
        Moc nás to mrzí
      </h2>
      <p className="text-sm mb-6" style={{ color: "#666" }}>
        Věříme, že se brzy uvidíme při jiné příležitosti.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submitter name */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>
            Vaše jméno
          </label>
          <input
            type="text"
            placeholder="Jméno"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white"
            style={{ borderColor: "var(--green-light)" }}
          />
        </div>

        {/* Additional people */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>
            Vyplňujete i za někoho dalšího?
          </label>
          <div className="space-y-2">
            {others.map((name, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Jméno"
                  value={name}
                  onChange={(e) => updateOther(i, e.target.value)}
                  className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none bg-white"
                  style={{ borderColor: "var(--green-light)" }}
                />
                <button
                  type="button"
                  onClick={() => removeOther(i)}
                  className="text-sm text-red-400 hover:text-red-600"
                  aria-label="Odebrat osobu"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOther}
            className="mt-2 text-sm underline"
            style={{ color: "var(--green)" }}
          >
            + Přidat další osobu
          </button>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>
            Vzkaz pro Martičku a Kubu (nepovinné)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Napište nám cokoliv..."
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--green-light)" }}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <p className="text-center text-xs" style={{ color: "#aaa" }}>
          Termín pro potvrzení: 1. července 2026
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--green)" }}
        >
          {submitting ? "Odesílám..." : "Potvrdit →"}
        </button>
      </form>
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
    if (index === 0) return;
    setPeople((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!people[0].name.trim()) {
      setError("Vyplňte prosím své jméno.");
      return;
    }
    if (!arrival) {
      setError("Zvolte prosím možnost ubytování.");
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
      const songParam = song.trim() ? `&song=${encodeURIComponent(song.trim())}` : "";
      const noteParam = note.trim() ? `&note=${encodeURIComponent(note.trim())}` : "";
      router.push(
        `/rsvp/potvrdi?id=${id}&attending=true&arrival=${arrival}&names=${names}${songParam}${noteParam}`
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
        style={{ color: "var(--green)" }}
      >
        ← Zpět
      </button>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--dark)" }}>
        Řekněte nám své „ANO"
      </h2>

      <label className="block text-sm mb-3" style={{ color: "var(--dark)" }}>
        Prosíme, nezapomeňte v dotazníku uvést všechny, kteří dorazí s vámi. Po vyplnění svých údajů stačí kliknout na tlačítko „Přidat další osobu" a zadat partnera či děti. Díky tomu budeme mít správný přehled o počtu hostů i případných potravinových alergiích.
      </label>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* People — card per person */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: "var(--dark)" }}>
            Kdo všechno dorazí?
          </label>
          <div className="space-y-4">
            {people.map((person, i) => (
              <div
                key={i}
                className="rounded-lg border p-4 relative"
                style={{ borderColor: "var(--green-light)", backgroundColor: "var(--green-pale)" }}
              >
                <input
                  type="text"
                  placeholder={i === 0 ? "Vaše jméno" : "Jméno"}
                  value={person.name}
                  onChange={(e) => updatePerson(i, "name", e.target.value)}
                  required={i === 0}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white mb-3"
                  style={{ borderColor: "var(--green-light)" }}
                />
                <textarea
                  placeholder="Napište nám, na co máte potravinovou alergii/intoleranci/omezení"
                  value={person.allergies}
                  onChange={(e) => updatePerson(i, "allergies", e.target.value)}
                  rows={2}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none bg-white"
                  style={{ borderColor: "var(--green-light)" }}
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removePerson(i)}
                    className="absolute top-3 right-3 text-sm text-red-400 hover:text-red-600"
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
            style={{ color: "var(--green)" }}
          >
            + Přidat další osobu
          </button>
        </div>

        {/* Arrival */}
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>
            Ubytování na Aréně (pro přespolní)
          </label>
          <p className="text-xs mb-3" style={{ color: "#888" }}>
            Hotel Aréna Brumov-Bylnice — snídaně a parkování zdarma, dopravu na místo konání zajistíme.
          </p>
          <div className="space-y-2">
            {(
              [
                { value: "none", label: "Nevyužiju" },
                { value: "two_nights", label: "Ubytuju se v pátek i sobotu" },
                { value: "one_night", label: "Ubytuju se jen v sobotu" },
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
                  style={{ accentColor: "var(--green)" }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Song */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>
            Napište nám pár Vašich oblíbených písniček, na které si s námi rádi zatančíte a zazpíváte ❤️
          </label>
          <textarea
            value={song}
            onChange={(e) => setSong(e.target.value)}
            rows={3}
            placeholder="Vypsaná fixa – Dezolát, ..."
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--green-light)" }}
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--dark)" }}>
            Pokud nám chcete ještě něco vzkázat nebo upřesnit, napište nám sem:
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--green-light)" }}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <p className="text-center text-xs" style={{ color: "#aaa" }}>
          Termín pro potvrzení: 1. července 2026
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--green)" }}
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
        style={{ borderColor: "var(--green-light)" }}
      >
        {children}
      </div>
      <a href="/" className="mt-6 text-sm" style={{ color: "var(--green)" }}>
        ← Zpět na hlavní stránku
      </a>
    </div>
  );
}
