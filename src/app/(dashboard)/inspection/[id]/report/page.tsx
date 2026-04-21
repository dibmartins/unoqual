import { getInspectionWithEntries } from "@/app/actions/inspection";
import { InspectionReport } from "@/components/inspection/inspection-report";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface InspectionReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function InspectionReportPage({ params }: InspectionReportPageProps) {
  const { id } = await params;
  const inspection = await getInspectionWithEntries(id);

  if (!inspection) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/inspection/${id}`}>
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Visualização de Laudo</h1>
          <p className="text-sm text-slate-500 font-medium">Inspeção ID: {id.substring(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <InspectionReport inspection={inspection} />
    </div>
  );
}
