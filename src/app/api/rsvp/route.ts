import { NextRequest, NextResponse } from "next/server";
import { RSVPStore } from "@/lib/rsvp-store";
import type { SubmissionInput } from "@/lib/rsvp-store";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("attending" in body)) {
    return NextResponse.json({ error: "attending field required" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;

  if (typeof input.attending !== "boolean") {
    return NextResponse.json(
      { error: "attending must be boolean" },
      { status: 400 }
    );
  }

  if (input.attending) {
    if (!Array.isArray(input.people) || input.people.length === 0) {
      return NextResponse.json(
        { error: "people array required when attending" },
        { status: 400 }
      );
    }
    const submitter = (input.people as Record<string, unknown>[]).find(
      (p) => p.is_submitter
    );
    if (!submitter) {
      return NextResponse.json(
        { error: "At least one person must be is_submitter" },
        { status: 400 }
      );
    }
  }

  const data: SubmissionInput = {
    attending: input.attending,
    arrival:
      input.arrival === "friday" || input.arrival === "saturday"
        ? input.arrival
        : null,
    note: typeof input.note === "string" ? input.note : null,
    song: typeof input.song === "string" ? input.song : null,
    people: input.attending
      ? (input.people as { name: string; allergies?: string | null; is_submitter: boolean }[])
      : [],
  };

  try {
    const submission = await RSVPStore.createSubmission(data);
    return NextResponse.json({ id: submission.id }, { status: 201 });
  } catch (err) {
    console.error("RSVP save error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
