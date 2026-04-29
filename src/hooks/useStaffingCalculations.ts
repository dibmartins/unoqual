import { useMemo } from "react";

export const KM_MAP = {
  "20": 0.4235,
  "30": 0.2823,
  "36": 0.2353,
  "40": 0.2118,
  "44": 0.1925,
};

export interface StaffingInputData {
  pcm?: number;
  pci?: number;
  pcad?: number;
  pcsi?: number;
  pcit?: number;
  weeklyHours?: string;
  currentNurses?: number;
  currentTechs?: number;
}

export function useStaffingCalculations(input: StaffingInputData) {
  const calculations = useMemo(() => {
    const { pcm = 0, pci = 0, pcad = 0, pcsi = 0, pcit = 0, weeklyHours = "36" } = input;

    // THE = [(PCM*4)+(PCI*6)+(PCAD*10)+(PCSI*10)+(PCIt*18)]
    const the = (pcm * 4) + (pci * 6) + (pcad * 10) + (pcsi * 10) + (pcit * 18);

    const km = KM_MAP[weeklyHours as keyof typeof KM_MAP] || 0.2353;
    const qp = Math.ceil(the * km);

    // Proporcionalidade
    const nurseRatio = (pcit > 0 || pcsi > 0) ? 0.52 : 0.33;
    const requiredNurses = Math.ceil(qp * nurseRatio);
    const requiredTechs = qp - requiredNurses;

    return { the, qp, requiredNurses, requiredTechs };
  }, [input.pcm, input.pci, input.pcad, input.pcsi, input.pcit, input.weeklyHours]);

  const nurseGap = (input.currentNurses || 0) - calculations.requiredNurses;
  const techGap = (input.currentTechs || 0) - calculations.requiredTechs;

  return {
    ...calculations,
    nurseGap,
    techGap,
  };
}
