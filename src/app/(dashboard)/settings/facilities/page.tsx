import { getFacilities } from "@/app/actions/inspection";
import { SettingsClient } from "./settings-client";

export default async function SettingsFacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <SettingsClient initialFacilities={facilities} />
  );
}
