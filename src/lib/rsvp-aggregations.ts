import type { Submission, Person } from "./rsvp-store";

export interface AttendanceSummary {
  attending: Submission[];
  notAttending: Submission[];
  attendingCount: number;
  notAttendingCount: number;
}

export interface PersonWithAllergy {
  name: string;
  allergies: string;
  submissionId: string;
}

export interface AccommodationResult {
  groups: Array<{
    submissionId: string;
    submitterName: string;
    arrival: "two_nights" | "one_night";
    people: Person[];
  }>;
  totalPeople: number;
  twoNightsCount: number;
  oneNightCount: number;
}

export interface SongEntry {
  submitterName: string;
  song: string;
}

export function getAttendanceSummary(
  submissions: Submission[]
): AttendanceSummary {
  const attending = submissions.filter((s) => s.attending);
  const notAttending = submissions.filter((s) => !s.attending);
  return {
    attending,
    notAttending,
    attendingCount: attending.reduce((sum, s) => sum + Math.max(1, s.people.length), 0),
    notAttendingCount: notAttending.reduce((sum, s) => sum + Math.max(1, s.people.length), 0),
  };
}

export function getPeopleWithAllergies(
  submissions: Submission[]
): PersonWithAllergy[] {
  const result: PersonWithAllergy[] = [];
  for (const submission of submissions) {
    for (const person of submission.people) {
      if (person.allergies && person.allergies.trim() !== "") {
        result.push({
          name: person.name,
          allergies: person.allergies,
          submissionId: submission.id,
        });
      }
    }
  }
  return result;
}

export function getAccommodationGroups(
  submissions: Submission[]
): AccommodationResult {
  const accommodationGroups = submissions.filter(
    (s) => s.attending && (s.arrival === "two_nights" || s.arrival === "one_night")
  );
  const groups = accommodationGroups.map((s) => ({
    submissionId: s.id,
    submitterName: s.people.find((p) => p.is_submitter)?.name ?? "Neznámý",
    arrival: s.arrival as "two_nights" | "one_night",
    people: s.people,
  }));
  const totalPeople = groups.reduce((sum, g) => sum + g.people.length, 0);
  const twoNightsCount = groups
    .filter((g) => g.arrival === "two_nights")
    .reduce((sum, g) => sum + g.people.length, 0);
  const oneNightCount = groups
    .filter((g) => g.arrival === "one_night")
    .reduce((sum, g) => sum + g.people.length, 0);
  return { groups, totalPeople, twoNightsCount, oneNightCount };
}

export function getSongEntries(submissions: Submission[]): SongEntry[] {
  return submissions
    .filter((s) => s.song && s.song.trim() !== "")
    .map((s) => ({
      submitterName: s.people.find((p) => p.is_submitter)?.name ?? "Neznámý",
      song: s.song!,
    }));
}
