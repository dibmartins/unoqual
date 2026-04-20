import { StaffingForm } from "@/components/staffing/staffing-form";
import { getFacilities } from "@/app/actions/inspection";

export default async function NewStaffingPage() {
  const facilities = await getFacilities();
  
  return (
    <main className="min-h-screen bg-slate-50">
      <StaffingForm facilities={facilities} />
    </main>
  );
}
