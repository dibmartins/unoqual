import { VerificationHub } from "@/components/inspection/hub/verification-hub";
import { getFacilities } from "@/app/actions/inspection";

export default async function NewInspectionPage() {
  const facilities = await getFacilities();
  
  return (
    <main className="min-h-screen bg-slate-50/50">
      <VerificationHub facilities={facilities} />
    </main>
  );
}
