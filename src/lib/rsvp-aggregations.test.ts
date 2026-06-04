import { describe, it, expect } from "vitest";
import {
  getAttendanceSummary,
  getPeopleWithAllergies,
  getAccommodationGroups,
  getSongEntries,
} from "./rsvp-aggregations";
import type { Submission } from "./rsvp-store";

function makeSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: "sub-1",
    created_at: "2026-05-31T00:00:00Z",
    attending: true,
    arrival: "saturday",
    note: null,
    song: null,
    people: [],
    ...overrides,
  };
}

function makePerson(
  name: string,
  allergies: string | null = null,
  isSubmitter = false
) {
  return {
    id: `p-${name}`,
    submission_id: "sub-1",
    name,
    allergies,
    is_submitter: isSubmitter,
  };
}

describe("getAttendanceSummary", () => {
  it("counts attending and not attending correctly", () => {
    const submissions = [
      makeSubmission({ id: "1", attending: true }),
      makeSubmission({ id: "2", attending: true }),
      makeSubmission({ id: "3", attending: false }),
    ];
    const result = getAttendanceSummary(submissions);
    expect(result.attendingCount).toBe(2);
    expect(result.notAttendingCount).toBe(1);
    expect(result.attending).toHaveLength(2);
    expect(result.notAttending).toHaveLength(1);
  });

  it("handles empty submissions", () => {
    const result = getAttendanceSummary([]);
    expect(result.attendingCount).toBe(0);
    expect(result.notAttendingCount).toBe(0);
  });

  it("counts people within each submission, not just submissions", () => {
    const submissions = [
      makeSubmission({
        id: "1",
        attending: true,
        people: [makePerson("Jan", null, true), makePerson("Jana"), makePerson("Jiří")],
      }),
      makeSubmission({
        id: "2",
        attending: false,
        people: [makePerson("Petr", null, true), makePerson("Petra")],
      }),
    ];
    const result = getAttendanceSummary(submissions);
    expect(result.attendingCount).toBe(3);
    expect(result.notAttendingCount).toBe(2);
  });

  it("counts legacy submissions with no people as 1 person each", () => {
    const submissions = [
      makeSubmission({ id: "1", attending: true, people: [] }),
      makeSubmission({ id: "2", attending: false, people: [] }),
    ];
    const result = getAttendanceSummary(submissions);
    expect(result.attendingCount).toBe(1);
    expect(result.notAttendingCount).toBe(1);
  });
});

describe("getPeopleWithAllergies", () => {
  it("returns only people with non-empty allergies", () => {
    const submissions = [
      makeSubmission({
        people: [
          makePerson("Jan", "laktóza", true),
          makePerson("Jana", null, false),
          makePerson("Petr", "", false),
        ],
      }),
      makeSubmission({
        id: "sub-2",
        people: [makePerson("Anna", "ořechy", true)],
      }),
    ];
    const result = getPeopleWithAllergies(submissions);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.name)).toEqual(["Jan", "Anna"]);
  });

  it("returns empty array when no one has allergies", () => {
    const submissions = [
      makeSubmission({ people: [makePerson("Jan", null, true)] }),
    ];
    expect(getPeopleWithAllergies(submissions)).toHaveLength(0);
  });
});

describe("getAccommodationGroups", () => {
  it("includes only friday-arrival attending groups", () => {
    const submissions = [
      makeSubmission({
        id: "fri",
        attending: true,
        arrival: "friday",
        people: [makePerson("Jan", null, true), makePerson("Jana")],
      }),
      makeSubmission({
        id: "sat",
        attending: true,
        arrival: "saturday",
        people: [makePerson("Petr", null, true)],
      }),
      makeSubmission({ id: "no", attending: false, arrival: null }),
    ];
    const { groups, totalPeople } = getAccommodationGroups(submissions);
    expect(groups).toHaveLength(1);
    expect(groups[0].submissionId).toBe("fri");
    expect(totalPeople).toBe(2);
  });

  it("expands all group members into the people list", () => {
    const submissions = [
      makeSubmission({
        attending: true,
        arrival: "friday",
        people: [
          makePerson("Submitter", null, true),
          makePerson("Guest1"),
          makePerson("Guest2"),
        ],
      }),
    ];
    const { groups, totalPeople } = getAccommodationGroups(submissions);
    expect(totalPeople).toBe(3);
    expect(groups[0].people).toHaveLength(3);
    expect(groups[0].submitterName).toBe("Submitter");
  });

  it("returns zero totalPeople when no friday arrivals", () => {
    const submissions = [
      makeSubmission({ attending: true, arrival: "saturday" }),
    ];
    const { groups, totalPeople } = getAccommodationGroups(submissions);
    expect(groups).toHaveLength(0);
    expect(totalPeople).toBe(0);
  });
});

describe("getSongEntries", () => {
  it("returns songs from submissions that have them", () => {
    const submissions = [
      makeSubmission({
        song: "Hey Jude",
        people: [makePerson("Jan", null, true)],
      }),
      makeSubmission({ id: "sub-2", song: null }),
      makeSubmission({ id: "sub-3", song: "" }),
      makeSubmission({
        id: "sub-4",
        song: "Bohemian Rhapsody",
        people: [makePerson("Petr", null, true)],
      }),
    ];
    const result = getSongEntries(submissions);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ submitterName: "Jan", song: "Hey Jude" });
    expect(result[1]).toEqual({ submitterName: "Petr", song: "Bohemian Rhapsody" });
  });

  it("returns empty array when no songs", () => {
    const submissions = [makeSubmission({ song: null })];
    expect(getSongEntries(submissions)).toHaveLength(0);
  });
});
