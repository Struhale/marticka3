import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as defaultSupabase } from "./supabase";

export type Arrival = "none" | "two_nights" | "one_night";

export interface PersonInput {
  name: string;
  allergies?: string | null;
  is_submitter: boolean;
}

export interface SubmissionInput {
  attending: boolean;
  arrival?: Arrival | null;
  note?: string | null;
  song?: string | null;
  people?: PersonInput[];
}

export interface Person {
  id: string;
  submission_id: string;
  name: string;
  allergies: string | null;
  is_submitter: boolean;
}

export interface Submission {
  id: string;
  created_at: string;
  attending: boolean;
  arrival: Arrival | null;
  note: string | null;
  song: string | null;
  people: Person[];
}

export function createRSVPStore(db: SupabaseClient = defaultSupabase) {
  return {
    async createSubmission(data: SubmissionInput): Promise<Submission> {
      const { data: row, error } = await db
        .from("submissions")
        .insert({
          attending: data.attending,
          arrival: data.arrival ?? null,
          note: data.note ?? null,
          song: data.song ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      const people: Person[] = [];

      if (data.people && data.people.length > 0) {
        const { data: peopleRows, error: peopleError } = await db
          .from("people")
          .insert(
            data.people.map((p) => ({
              submission_id: row.id,
              name: p.name,
              allergies: p.allergies ?? null,
              is_submitter: p.is_submitter,
            }))
          )
          .select();

        if (peopleError) throw peopleError;
        people.push(...(peopleRows ?? []));
      }

      return { ...row, people };
    },

    async listSubmissions(): Promise<Submission[]> {
      const { data, error } = await db
        .from("submissions")
        .select("*, people(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Submission[];
    },

    async updateSubmission(
      id: string,
      data: Partial<Omit<SubmissionInput, "people">>
    ): Promise<void> {
      const fields: Record<string, unknown> = {};
      if (data.attending !== undefined) fields.attending = data.attending;
      if (data.arrival !== undefined) fields.arrival = data.arrival;
      if (data.note !== undefined) fields.note = data.note;
      if (data.song !== undefined) fields.song = data.song;

      if (Object.keys(fields).length === 0) return;

      const { error } = await db
        .from("submissions")
        .update(fields)
        .eq("id", id);

      if (error) throw error;
    },

    async deleteSubmission(id: string): Promise<void> {
      const { error } = await db
        .from("submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
  };
}

export const RSVPStore = createRSVPStore();
