import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { translate } from "./translations";

interface ReportData {
  id: string;
  status: string;
  createdAt: Date;
  completedAt?: Date | null;
  facility: {
    name: string;
  };
  inspectorId: string;
  entries: Array<{
    id: string;
    type: string;
    checklistItemKey: string;
    complianceStatus: string;
    observation?: string | null;
    metadata?: any;
    department?: {
      name: string;
    } | null;
  }>;
}

export function generateInspectionPDF(inspection: ReportData) {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleDateString("pt-BR");
  const reportDate = inspection.completedAt 
    ? new Date(inspection.completedAt).toLocaleDateString("pt-BR") 
    : new Date(inspection.createdAt).toLocaleDateString("pt-BR");

  // --- CABEÇALHO ---
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("UNOQUAL", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("GESTÃO DE QUALIDADE E CONFORMIDADE", 14, 28);
  
  doc.setFontSize(16);
  doc.text("LAUDO DE INSPEÇÃO TÉCNICA", 210 - 14, 25, { align: "right" });

  // --- INFORMAÇÕES GERAIS ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMAÇÕES GERAIS", 14, 55);
  
  autoTable(doc, {
    startY: 60,
    head: [['Campo', 'Informação']],
    body: [
      ['Unidade de Saúde', inspection.facility.name],
      ['Responsável Técnico', inspection.inspectorId === "system-user" ? "Diego Martins" : inspection.inspectorId],
      ['Data da Inspeção', reportDate],
      ['Status', translate(inspection.status).toUpperCase()],
      ['ID do Laudo', inspection.id.substring(0, 8).toUpperCase()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 10 }
  });

  // --- ITENS DE DIMENSIONAMENTO ---
  const staffingEntries = inspection.entries.filter(e => e.type === "staffing");
  if (staffingEntries.length > 0) {
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("RESULTADOS DE DIMENSIONAMENTO", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Setor/Unidade', 'Ocupação', 'Status', 'Observação']],
      body: staffingEntries.map(e => [
        e.department?.name || "Unidade (Geral)",
        e.metadata?.professionalClass || "N/A",
        translate(e.complianceStatus),
        e.observation || "-"
      ]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    });
  }

  // --- ITENS DE INSPEÇÃO (CHECKLISTS) ---
  const checkEntries = inspection.entries.filter(e => e.type !== "staffing");
  if (checkEntries.length > 0) {
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("ITENS DE VERIFICAÇÃO E CONFORMIDADE", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Setor', 'Categoria', 'Conformidade', 'Observações/Evidências']],
      body: checkEntries.map(e => [
        e.department?.name || "Geral",
        translate(e.checklistItemKey).toUpperCase(),
        translate(e.complianceStatus),
        e.observation || "-"
      ]),
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105] },
      styles: { fontSize: 9 },
      columnStyles: {
        3: { cellWidth: 80 }
      }
    });
  }

  // --- RODAPÉ ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Unoqual - Documento gerado em ${timestamp} - Página ${i} de ${pageCount}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Autenticidade: ${inspection.id}`,
      210 - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  // Abrir em nova aba para preview/impressão
  doc.output('dataurlnewwindow', { filename: `laudo-${inspection.id.substring(0,8)}.pdf` });
}
