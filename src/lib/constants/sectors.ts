export type SectorOption = {
  value: string;
  label: string;
};

export type SectorGroup = {
  label: string;
  options: SectorOption[];
};

export const SECTOR_GROUPS: SectorGroup[] = [
  {
    label: "Urgência e Emergência",
    options: [
      { value: "resuscitation_room", label: "Sala Vermelha (Emergência)" },
      { value: "yellow_zone", label: "Sala Amarela / Observação" },
      { value: "orthopedic_cast_room", label: "Sala de Imobilização Ortopédica" },
      { value: "medication_room", label: "Sala de Medicação / Hidratação" },
      { value: "adult_observation_room", label: "Sala de Observação Adulto" },
      { value: "pediatric_observation_room", label: "Sala de Observação Pediátrica" },
      { value: "minor_procedure_room", label: "Sala de Pequenos Procedimentos" },
      { value: "triage", label: "Triagem / Classificação de Risco" },
    ],
  },
  {
    label: "Internação",
    options: [
      { value: "female_surgical_ward", label: "Clínica Cirúrgica Feminina" },
      { value: "male_surgical_ward", label: "Clínica Cirúrgica Masculina" },
      { value: "female_medical_ward", label: "Clínica Médica Feminina" },
      { value: "male_medical_ward", label: "Clínica Médica Masculina" },
      { value: "obstetrics_ward", label: "Clínica Obstétrica" },
      { value: "pediatric_ward", label: "Pediatria" },
    ],
  },
  {
    label: "Terapia Intensiva",
    options: [
      { value: "adult_icu", label: "UTI Adulto" },
      { value: "neonatal_icu", label: "UTI Neonatal (UTIN)" },
    ],
  },
  {
    label: "Serviços Cirúrgicos",
    options: [
      { value: "operating_room", label: "Centro Cirúrgico (CC)" },
      { value: "recovery_room", label: "Recuperação Pós-Anestésica (RPA)" },
    ],
  },
  {
    label: "Apoio Diagnóstico",
    options: [
      { value: "pathology_morgue", label: "Anatomia Patológica / Necrotério" },
      { value: "sterile_processing", label: "Central de Material e Esterilização (CME)" },
      { value: "clinical_laboratory", label: "Laboratório de Análises Clínicas" },
      { value: "blood_bank", label: "Agência Transfusional" },
      { value: "pharmacy", label: "Farmácia Central" },
      { value: "x_ray_room", label: "Raio-X" },
      { value: "ct_scan_room", label: "Tomografia Computadorizada" },
      { value: "ultrasound_room", label: "Ultrassonografia" },
    ],
  },
  {
    label: "Atenção Básica",
    options: [
      { value: "wound_care_room", label: "Sala de Curativos" },
      { value: "vaccination_room", label: "Sala de Vacina" },
    ],
  },
  {
    label: "Serviços Administrativos",
    options: [
      { value: "management_office", label: "Diretoria e Gestão" },
      { value: "billing_department", label: "Faturamento e Auditoria" },
      { value: "ombudsman", label: "Ouvidoria" },
      { value: "reception", label: "Recepção e Espera" },
      { value: "human_resources", label: "Recursos Humanos" },
      { value: "medical_records", label: "Serviço de Arquivo Médico (SAME)" },
      { value: "it_department", label: "Tecnologia da Informação (TI)" },
    ],
  },
  {
    label: "Apoio e Operacional",
    options: [
      { value: "formula_room", label: "Lactário" },
      { value: "industrial_kitchen", label: "Cozinha Industrial / Refeitório" },
      { value: "laundry_room", label: "Lavanderia Hospitalar / Rouparia" },
      { value: "waste_management", label: "Abrigo de Resíduos" },
      { value: "dirty_utility_room", label: "Expurgo" },
      { value: "central_storage", label: "Almoxarifado Central" },
      { value: "maintenance_workshop", label: "Manutenção Predial e Clínica" },
    ],
  },
];
