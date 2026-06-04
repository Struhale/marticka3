"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Submission } from "@/lib/rsvp-store";
import type {
  AttendanceSummary,
  PersonWithAllergy,
  AccommodationResult,
  SongEntry,
} from "@/lib/rsvp-aggregations";

interface Props {
  submissions: Submission[];
  attendance: AttendanceSummary;
  allergies: PersonWithAllergy[];
  accommodation: AccommodationResult;
  songs: SongEntry[];
}

export default function AdminDashboardClient({
  submissions,
  attendance,
  allergies,
  accommodation,
  songs,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "attendance" | "allergies" | "accommodation" | "songs"
  >("attendance");

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  async function handleDelete(id: string) {
    if (!confirm("Opravdu smazat tento záznam?")) return;
    await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const TABS = [
    { key: "attendance" as const, label: `Přijdu/Nepřijdu (${submissions.length})` },
    { key: "allergies" as const, label: `Alergie (${allergies.length})` },
    {
      key: "accommodation" as const,
      label: `Ubytování (${accommodation.totalPeople})`,
    },
    { key: "songs" as const, label: `Písničky (${songs.length})` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: "rgba(253,248,240,0.97)", borderColor: "var(--gold)" }}
      >
        <div>
          <span className="font-bold" style={{ color: "var(--dark)" }}>
            Admin
          </span>
          <span className="text-sm ml-2" style={{ color: "#888" }}>
            Marta & Jakub 2026
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1 rounded border"
          style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
        >
          Odhlásit
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Summary counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Přijde" value={attendance.attendingCount} />
          <StatCard label="Nepřijde" value={attendance.notAttendingCount} />
          <StatCard label="Ubytování" value={accommodation.totalPeople} />
          <StatCard label="Celkem lidí" value={attendance.attendingCount + attendance.notAttendingCount} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded text-sm font-medium transition-colors"
              style={
                activeTab === tab.key
                  ? { backgroundColor: "var(--dark)", color: "#fff" }
                  : { backgroundColor: "#fff", color: "var(--gold)", border: "1px solid var(--gold-light)" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "attendance" && (
          <AttendanceTable submissions={submissions} onDelete={handleDelete} />
        )}
        {activeTab === "allergies" && <AllergiesTable allergies={allergies} />}
        {activeTab === "accommodation" && (
          <AccommodationTable accommodation={accommodation} />
        )}
        {activeTab === "songs" && <SongsTable songs={songs} />}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="bg-white rounded-lg border p-4 text-center"
      style={{ borderColor: "var(--gold-light)" }}
    >
      <p className="text-3xl font-bold" style={{ color: "var(--gold)" }}>
        {value}
      </p>
      <p className="text-sm mt-1" style={{ color: "#666" }}>
        {label}
      </p>
    </div>
  );
}

function AttendanceTable({
  submissions,
  onDelete,
}: {
  submissions: Submission[];
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editSong, setEditSong] = useState("");

  function startEdit(s: Submission) {
    setEditingId(s.id);
    setEditNote(s.note ?? "");
    setEditSong(s.song ?? "");
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: editNote || null, song: editSong || null }),
    });
    setEditingId(null);
    router.refresh();
  }

  return (
    <TableShell>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--gold-light)" }}>
          <Th>Jméno</Th>
          <Th>Odpověď</Th>
          <Th>Příjezd</Th>
          <Th>Poznámka</Th>
          <Th>Písnička</Th>
          <Th>Akce</Th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((s) => {
          const isEditing = editingId === s.id;
          return (
            <tr
              key={s.id}
              className="hover:bg-amber-50 transition-colors"
              style={{ borderBottom: "1px solid #f5f0e8" }}
            >
              <Td>
                {s.people.length > 0
                  ? s.people.map((p, i) => (
                      <span key={p.id}>
                        {i > 0 && ", "}
                        <span style={p.is_submitter ? { fontWeight: 600 } : undefined}>
                          {p.name}
                        </span>
                      </span>
                    ))
                  : <span style={{ color: "#888" }}>—</span>}
              </Td>
              <Td>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={
                    s.attending
                      ? { backgroundColor: "#d1fae5", color: "#065f46" }
                      : { backgroundColor: "#fee2e2", color: "#991b1b" }
                  }
                >
                  {s.attending ? "Přijde" : "Nepřijde"}
                </span>
              </Td>
              <Td>
                {s.arrival === "friday"
                  ? "Pátek"
                  : s.arrival === "saturday"
                  ? "Sobota"
                  : "—"}
              </Td>
              <Td>
                {isEditing ? (
                  <input
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    style={{ borderColor: "var(--gold-light)" }}
                  />
                ) : (
                  <span className="text-sm">{s.note || "—"}</span>
                )}
              </Td>
              <Td>
                {isEditing ? (
                  <input
                    value={editSong}
                    onChange={(e) => setEditSong(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    style={{ borderColor: "var(--gold-light)" }}
                  />
                ) : (
                  <span className="text-sm">{s.song || "—"}</span>
                )}
              </Td>
              <Td>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <ActionBtn onClick={() => saveEdit(s.id)} label="Uložit" primary />
                      <ActionBtn onClick={() => setEditingId(null)} label="Zrušit" />
                    </>
                  ) : (
                    <>
                      <ActionBtn onClick={() => startEdit(s)} label="Upravit" />
                      <ActionBtn
                        onClick={() => onDelete(s.id)}
                        label="Smazat"
                        danger
                      />
                    </>
                  )}
                </div>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  );
}

function AllergiesTable({ allergies }: { allergies: PersonWithAllergy[] }) {
  if (allergies.length === 0) {
    return <Empty text="Žádné alergie nebyly nahlášeny." />;
  }
  return (
    <TableShell>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--gold-light)" }}>
          <Th>Jméno</Th>
          <Th>Alergie / intolerance</Th>
        </tr>
      </thead>
      <tbody>
        {allergies.map((a, i) => (
          <tr
            key={i}
            className="hover:bg-amber-50"
            style={{ borderBottom: "1px solid #f5f0e8" }}
          >
            <Td>{a.name}</Td>
            <Td>{a.allergies}</Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function AccommodationTable({ accommodation }: { accommodation: AccommodationResult }) {
  if (accommodation.groups.length === 0) {
    return <Empty text="Nikdo zatím nezvolil ubytování v pátek." />;
  }
  return (
    <div className="space-y-4">
      <TableShell>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--gold-light)" }}>
            <Th>Skupina (vyplňující)</Th>
            <Th>Členové skupiny</Th>
            <Th>Alergie</Th>
          </tr>
        </thead>
        <tbody>
          {accommodation.groups.map((g) => (
            <tr
              key={g.submissionId}
              className="hover:bg-amber-50"
              style={{ borderBottom: "1px solid #f5f0e8" }}
            >
              <Td className="font-medium">{g.submitterName}</Td>
              <Td>{g.people.map((p) => p.name).join(", ")}</Td>
              <Td>
                {g.people
                  .filter((p) => p.allergies)
                  .map((p) => `${p.name}: ${p.allergies}`)
                  .join("; ") || "—"}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </div>
  );
}

function SongsTable({ songs }: { songs: SongEntry[] }) {
  if (songs.length === 0) {
    return <Empty text="Žádné písničky zatím nebyly navrženy." />;
  }
  return (
    <TableShell>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--gold-light)" }}>
          <Th>Navrhl/a</Th>
          <Th>Písnička</Th>
        </tr>
      </thead>
      <tbody>
        {songs.map((s, i) => (
          <tr
            key={i}
            className="hover:bg-amber-50"
            style={{ borderBottom: "1px solid #f5f0e8" }}
          >
            <Td>{s.submitterName}</Td>
            <Td>{s.song}</Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm bg-white rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--gold-light)" }}
      >
        {children}
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
      style={{ color: "var(--gold)" }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 align-top ${className ?? ""}`}>{children}</td>
  );
}

function ActionBtn({
  onClick,
  label,
  primary,
  danger,
}: {
  onClick: () => void;
  label: string;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-2 py-1 rounded"
      style={
        primary
          ? { backgroundColor: "var(--gold)", color: "#fff" }
          : danger
          ? { backgroundColor: "#fee2e2", color: "#991b1b" }
          : { backgroundColor: "#f5f0e8", color: "var(--dark)" }
      }
    >
      {label}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="text-sm py-8 text-center" style={{ color: "#888" }}>
      {text}
    </p>
  );
}
