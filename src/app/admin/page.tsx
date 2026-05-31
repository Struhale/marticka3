import { RSVPStore } from "@/lib/rsvp-store";
import {
  getAttendanceSummary,
  getPeopleWithAllergies,
  getAccommodationGroups,
  getSongEntries,
} from "@/lib/rsvp-aggregations";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const submissions = await RSVPStore.listSubmissions();

  const attendance = getAttendanceSummary(submissions);
  const allergies = getPeopleWithAllergies(submissions);
  const accommodation = getAccommodationGroups(submissions);
  const songs = getSongEntries(submissions);

  return (
    <AdminDashboardClient
      submissions={submissions}
      attendance={attendance}
      allergies={allergies}
      accommodation={accommodation}
      songs={songs}
    />
  );
}
