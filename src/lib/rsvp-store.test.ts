import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("./supabase", () => ({ supabase: {} }));

import { createRSVPStore, type SubmissionInput } from "./rsvp-store";

function makeMockDb(overrides: Record<string, Record<string, unknown>> = {}) {
  const defaultResolve = { data: null, error: null };

  const buildChain = (tableOverrides: Record<string, unknown> = {}) => {
    const chain: Record<string, unknown> = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(tableOverrides.single ?? defaultResolve),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue(tableOverrides.eq ?? defaultResolve),
      order: vi.fn().mockResolvedValue(tableOverrides.order ?? defaultResolve),
    };
    // insert().select() chain resolves via select mock on next call
    (chain.insert as ReturnType<typeof vi.fn>).mockImplementation(() => chain);
    (chain.select as ReturnType<typeof vi.fn>).mockImplementation(() => chain);
    (chain.update as ReturnType<typeof vi.fn>).mockImplementation(() => chain);
    (chain.delete as ReturnType<typeof vi.fn>).mockImplementation(() => chain);
    return chain;
  };

  return {
    from: vi.fn().mockImplementation((table: string) =>
      buildChain(overrides[table] ?? {})
    ),
  } as unknown as SupabaseClient;
}

const SUBMISSION_ROW = {
  id: "sub-1",
  created_at: "2026-05-31T00:00:00Z",
  attending: true,
  arrival: "two_nights" as const,
  note: null,
  song: null,
};

const PEOPLE_ROWS = [
  {
    id: "p-1",
    submission_id: "sub-1",
    name: "Jan Novák",
    allergies: "laktóza",
    is_submitter: true,
  },
  {
    id: "p-2",
    submission_id: "sub-1",
    name: "Jana Nováková",
    allergies: null,
    is_submitter: false,
  },
];

describe("RSVPStore.createSubmission", () => {
  it("saves a full submission with multiple people", async () => {
    const db = makeMockDb({
      submissions: { single: { data: SUBMISSION_ROW, error: null } },
      people: { eq: { data: PEOPLE_ROWS, error: null } },
    });

    // Override people insert chain to resolve with people rows
    const peopleChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: PEOPLE_ROWS, error: null }),
    };
    const submissionsChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: SUBMISSION_ROW, error: null }),
    };
    (submissionsChain.insert as ReturnType<typeof vi.fn>).mockReturnValue(submissionsChain);
    (submissionsChain.select as ReturnType<typeof vi.fn>).mockReturnValue(submissionsChain);

    const mockDb = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "submissions") return submissionsChain;
        if (table === "people") return peopleChain;
      }),
    } as unknown as SupabaseClient;

    const store = createRSVPStore(mockDb);
    const input: SubmissionInput = {
      attending: true,
      arrival: "two_nights",
      people: [
        { name: "Jan Novák", allergies: "laktóza", is_submitter: true },
        { name: "Jana Nováková", allergies: null, is_submitter: false },
      ],
    };

    const result = await store.createSubmission(input);
    expect(result.id).toBe("sub-1");
    expect(result.people).toHaveLength(2);
    expect(result.people[0].name).toBe("Jan Novák");
  });

  it("saves a not-attending submission without people or arrival", async () => {
    const notAttendingRow = { ...SUBMISSION_ROW, attending: false, arrival: null };
    const submissionsChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: notAttendingRow, error: null }),
    };
    (submissionsChain.insert as ReturnType<typeof vi.fn>).mockReturnValue(submissionsChain);
    (submissionsChain.select as ReturnType<typeof vi.fn>).mockReturnValue(submissionsChain);

    const mockDb = {
      from: vi.fn().mockReturnValue(submissionsChain),
    } as unknown as SupabaseClient;

    const store = createRSVPStore(mockDb);
    const result = await store.createSubmission({ attending: false });

    expect(result.attending).toBe(false);
    expect(result.arrival).toBeNull();
    expect(result.people).toHaveLength(0);
    // people table should NOT be called
    const calls = (mockDb.from as ReturnType<typeof vi.fn>).mock.calls;
    const tablesCalled = calls.map((c: unknown[]) => c[0]);
    expect(tablesCalled).not.toContain("people");
  });

  it("throws when the database returns an error", async () => {
    const submissionsChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
    };
    (submissionsChain.insert as ReturnType<typeof vi.fn>).mockReturnValue(submissionsChain);
    (submissionsChain.select as ReturnType<typeof vi.fn>).mockReturnValue(submissionsChain);

    const mockDb = {
      from: vi.fn().mockReturnValue(submissionsChain),
    } as unknown as SupabaseClient;

    const store = createRSVPStore(mockDb);
    await expect(store.createSubmission({ attending: false })).rejects.toThrow("DB error");
  });
});

describe("RSVPStore.listSubmissions", () => {
  const SUBMISSIONS_WITH_PEOPLE = [
    {
      ...SUBMISSION_ROW,
      people: PEOPLE_ROWS,
    },
    {
      id: "sub-2",
      created_at: "2026-05-30T00:00:00Z",
      attending: false,
      arrival: null,
      note: null,
      song: "Bohemian Rhapsody",
      people: [],
    },
  ];

  it("returns all submissions with nested people", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: SUBMISSIONS_WITH_PEOPLE, error: null }),
    };
    (chain.select as ReturnType<typeof vi.fn>).mockReturnValue(chain);

    const mockDb = { from: vi.fn().mockReturnValue(chain) } as unknown as SupabaseClient;
    const store = createRSVPStore(mockDb);

    const result = await store.listSubmissions();
    expect(result).toHaveLength(2);
    expect(result[0].people).toHaveLength(2);
    expect(result[1].song).toBe("Bohemian Rhapsody");
  });

  it("returns empty array when no submissions", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    (chain.select as ReturnType<typeof vi.fn>).mockReturnValue(chain);

    const mockDb = { from: vi.fn().mockReturnValue(chain) } as unknown as SupabaseClient;
    const store = createRSVPStore(mockDb);

    const result = await store.listSubmissions();
    expect(result).toEqual([]);
  });
});

describe("RSVPStore.updateSubmission", () => {
  it("updates specified fields on the submission", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: eqMock,
    };
    (chain.update as ReturnType<typeof vi.fn>).mockReturnValue(chain);

    const mockDb = { from: vi.fn().mockReturnValue(chain) } as unknown as SupabaseClient;
    const store = createRSVPStore(mockDb);

    await store.updateSubmission("sub-1", { song: "Hey Jude" });

    expect(chain.update).toHaveBeenCalledWith({ song: "Hey Jude" });
    expect(eqMock).toHaveBeenCalledWith("id", "sub-1");
  });

  it("does nothing when no fields provided", async () => {
    const mockDb = { from: vi.fn() } as unknown as SupabaseClient;
    const store = createRSVPStore(mockDb);

    await store.updateSubmission("sub-1", {});
    expect(mockDb.from).not.toHaveBeenCalled();
  });
});

describe("RSVPStore.deleteSubmission", () => {
  it("deletes the submission (people cascade via FK)", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: eqMock,
    };
    (chain.delete as ReturnType<typeof vi.fn>).mockReturnValue(chain);

    const mockDb = { from: vi.fn().mockReturnValue(chain) } as unknown as SupabaseClient;
    const store = createRSVPStore(mockDb);

    await store.deleteSubmission("sub-1");

    expect(mockDb.from).toHaveBeenCalledWith("submissions");
    expect(eqMock).toHaveBeenCalledWith("id", "sub-1");
  });
});
