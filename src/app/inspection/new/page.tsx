import { VerificationHub } from "@/components/inspection/hub/verification-hub";
import { getFacilities } from "@/app/actions/inspection";

interface NewInspectionPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewInspectionPage({ searchParams }: NewInspectionPageProps) {
  const facilities = await getFacilities();
  const { id } = await searchParams;
  
  return (
    <main className="min-h-screen bg-slate-50/50">
      <VerificationHub facilities={facilities} initialInspectionId={id} />
    </main>
  );
}
