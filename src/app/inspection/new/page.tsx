import { InspectionForm } from "@/components/inspection/inspection-form";
import { getFacilities } from "@/app/actions/inspection";

export default async function NewInspectionPage() {
  const facilities = await getFacilities();
  
  return (
    <main className="min-h-screen bg-slate-50">
      <InspectionForm facilities={facilities} />
    </main>
  );
}
