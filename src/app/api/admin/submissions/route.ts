import { NextResponse } from "next/server";
import { RSVPStore } from "@/lib/rsvp-store";

export async function GET() {
  try {
    const submissions = await RSVPStore.listSubmissions();
    return NextResponse.json(submissions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
