import { NextRequest, NextResponse } from "next/server";
import { RSVPStore } from "@/lib/rsvp-store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (
    "arrival" in body &&
    body.arrival !== null &&
    body.arrival !== "none" &&
    body.arrival !== "two_nights" &&
    body.arrival !== "one_night"
  ) {
    return NextResponse.json({ error: "Invalid arrival value" }, { status: 400 });
  }

  try {
    await RSVPStore.updateSubmission(id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await RSVPStore.deleteSubmission(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
