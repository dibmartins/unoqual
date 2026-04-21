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
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : 120;
    doc.setFont("helvetica", "bold");
    doc.text("ITENS DE VERIFICAÇÃO E CONFORMIDADE", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Setor', 'Categoria', 'Conformidade', 'Detalhamento / Observações']],
      body: checkEntries.map(e => {
        let detailing = "";
        if (e.metadata && typeof e.metadata === 'object') {
          detailing = Object.entries(e.metadata)
            .filter(([key]) => key !== 'observations')
            .map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').trim();
              let val = value === true ? "Sim" : value === false ? "Não" : String(value);
              if (typeof value === 'string') {
                val = translate(value);
              }
              return `${label}: ${val}`;
            }).join('\n');
        }
        
        const observation = e.observation ? `\nPARECER: ${e.observation}` : "";
        
        return [
          e.department?.name || "Geral",
          translate(e.checklistItemKey).toUpperCase(),
          translate(e.complianceStatus),
          detailing + observation
        ];
      }),
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105] },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        3: { cellWidth: 90 }
      }
    });
  }

  // --- ÁREAS DE ASSINATURA ---
  // @ts-ignore
  const lastTableY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 120;
  let currentY = lastTableY + 35;
  
  const pageHeight = doc.internal.pageSize.getHeight();
  const reservedSpace = 60; // Espaço reservado para assinaturas + rodapé
  
  // Se o espaço atual + assinaturas ultrapassar o limite seguro, move para nova página
  if (currentY + 25 > pageHeight - reservedSpace) {
    doc.addPage();
    currentY = 50; // Começa mais abaixo na nova página para manter respiro do cabeçalho
  }

  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  doc.line(20, currentY, 90, currentY); // Linha Esquerda
  doc.line(120, currentY, 190, currentY); // Linha Direita

  doc.setFontSize(9);
  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  doc.text(inspection.inspectorId === "system-user" ? "Diego Martins" : inspection.inspectorId, 55, currentY + 7, { align: "center" });
  doc.text("Assinatura do Gestor da Unidade", 155, currentY + 7, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("Responsável Técnico / Auditor", 55, currentY + 12, { align: "center" });
  doc.text("Responsável Técnico da Unidade", 155, currentY + 12, { align: "center" });

  // --- RODAPÉ ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160);
    // Linha decorativa no rodapé
    doc.setDrawColor(230);
    doc.line(14, pageHeight - 15, 196, pageHeight - 15);
    
    doc.text(
      `Unoqual - Documento gerado em ${timestamp} - Página ${i} de ${pageCount}`,
      14,
      pageHeight - 10
    );
    doc.text(
      `ID de Autenticidade: ${inspection.id}`,
      210 - 14,
      pageHeight - 10,
      { align: "right" }
    );
  }

  // Abrir em nova aba para preview/impressão
  doc.output('dataurlnewwindow', { filename: `laudo-${inspection.id.substring(0,8)}.pdf` });
}
