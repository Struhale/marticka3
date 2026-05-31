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
    people: Person[];
  }>;
  totalPeople: number;
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
    attendingCount: attending.length,
    notAttendingCount: notAttending.length,
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
  const fridayGroups = submissions.filter(
    (s) => s.attending && s.arrival === "friday"
  );
  const groups = fridayGroups.map((s) => ({
    submissionId: s.id,
    submitterName: s.people.find((p) => p.is_submitter)?.name ?? "Neznámý",
    people: s.people,
  }));
  const totalPeople = groups.reduce((sum, g) => sum + g.people.length, 0);
  return { groups, totalPeople };
}

export function getSongEntries(submissions: Submission[]): SongEntry[] {
  return submissions
    .filter((s) => s.song && s.song.trim() !== "")
    .map((s) => ({
      submitterName: s.people.find((p) => p.is_submitter)?.name ?? "Neznámý",
      song: s.song!,
    }));
}
