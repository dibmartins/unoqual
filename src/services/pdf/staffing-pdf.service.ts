import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface StaffingReportData {
  facilityName: string;
  departmentName: string;
  weeklyHours: string;
  census: {
    pcm: number;
    pci: number;
    pcad: number;
    pcsi: number;
    pcit: number;
  };
  calculations: {
    the: number;
    qp: number;
    requiredNurses: number;
    requiredTechs: number;
  };
  currentStaff: {
    nurses: number;
    techs: number;
  };
  gaps: {
    nurseGap: number;
    techGap: number;
  };
}

export function generateStaffingPDF(data: StaffingReportData) {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleDateString("pt-BR");

  // Header
  doc.setFontSize(22);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text("Relatório de Dimensionamento de Enfermagem", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Data de Emissão: ${timestamp}`, 14, 30);
  doc.text("Baseado na Resolução COFEN 543/2017", 14, 35);

  // Localização Info
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Informações da Unidade", 14, 48);

  autoTable(doc, {
    startY: 52,
    head: [['Unidade', 'Setor', 'Jornada Semanal']],
    body: [[
      data.facilityName || "N/A",
      data.departmentName || "N/A",
      `${data.weeklyHours}h`
    ]],
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105] }
  });

  // Censo de Pacientes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.text("Censo Assistencial (Média Diária)", 14, (doc as any).lastAutoTable.finalY + 15);
  autoTable(doc, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['PCM', 'PCI', 'PCAD', 'PCSI', 'PCIt']],
    body: [[
      data.census.pcm,
      data.census.pci,
      data.census.pcad,
      data.census.pcsi,
      data.census.pcit
    ]],
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105] } // slate-600
  });

  // Resultados
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.text("Quadro de Pessoal Necessário", 14, (doc as any).lastAutoTable.finalY + 15);
  autoTable(doc, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Métrica', 'Cálculo']],
    body: [
      ['Total de Horas de Enfermagem (THE)', `${data.calculations.the}h`],
      ['Quadro de Pessoal (QP Total)', data.calculations.qp],
      ['Enfermeiros Necessários', data.calculations.requiredNurses],
      ['Técnicos/Auxiliares Necessários', data.calculations.requiredTechs]
    ],
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105] }
  });

  // Gap Analysis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.text("Análise de Gap (Déficit/Superávit)", 14, (doc as any).lastAutoTable.finalY + 15);
  autoTable(doc, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Categoria', 'Atual', 'Necessário', 'Gap']],
    body: [
      ['Enfermeiros', data.currentStaff.nurses, data.calculations.requiredNurses, data.gaps.nurseGap >= 0 ? `+${data.gaps.nurseGap} (OK)` : `${data.gaps.nurseGap} (DÉFICIT)`],
      ['Técnicos', data.currentStaff.techs, data.calculations.requiredTechs, data.gaps.techGap >= 0 ? `+${data.gaps.techGap} (OK)` : `${data.gaps.techGap} (DÉFICIT)`]
    ],
    theme: 'striped',
    headStyles: { fillColor: data.gaps.nurseGap < 0 || data.gaps.techGap < 0 ? [220, 38, 38] : [5, 150, 105] }
  });

  doc.save(`dimensionamento-${data.facilityName || 'relatorio'}.pdf`);
}
