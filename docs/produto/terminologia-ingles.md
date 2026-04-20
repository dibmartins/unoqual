# 📘 Terminologia Técnica (Technical Terminology)

Este documento centraliza a terminologia utilizada no código, banco de dados e interface (UI) para garantir consistência entre as equipes de desenvolvimento e produto.

### 🏥 1. Instituição e Hierarquia (Facility & Hierarchy)

| Termo em Português (BR/PT) | Inglês Técnico (Health IT) | Sugestão para Base de Dados (snake_case) |
| :--- | :--- | :--- |
| Organização / Mantenedora | Organization | `organization` |
| Unidade de Saúde / Hospital | Facility / Hospital | `facility` |
| Pronto Atendimento (UPA/PS) | Emergency Department / Urgent Care | `emergency_department` |
| Porte da Unidade | Facility Size | `facility_size` |
| Capacidade Instalada | Bed Capacity | `bed_capacity` |
| Setor / Área Assistencial | Ward / Department / Unit | `ward` ou `department` |
| Leito / Ponto Assistencial | Bed / Point of Care | `bed` |
| Taxa de Ocupação | Occupancy Rate | `occupancy_rate` |

---

### 🏗️ 2. Estrutura Física e Setores (Physical Structure & Wards)

| Termo em Português (BR/PT) | Inglês Técnico (Health IT) | Sugestão para Base de Dados (snake_case) |
| :--- | :--- | :--- |
| Recepção | Front Desk / Reception | `front_desk` |
| Triagem / Classificação de Risco | Triage | `triage` |
| Sala Vermelha (Emergência) | Resuscitation Room / Trauma Room | `resuscitation_room` |
| Sala Amarela | Intermediate Care Room | `intermediate_care_room` |
| Sala de Observação | Observation Unit | `observation_unit` |
| Centro Cirúrgico (CC) | Operating Room (OR) | `operating_room` |
| Centro de Material e Esterilização (CME) | Sterile Processing Dept. (SPD) | `sterile_processing_department` |
| Terapia Intensiva (UTI) | Intensive Care Unit (ICU) | `intensive_care_unit` |
| Expurgo | Dirty Utility Room / Sluice Room | `dirty_utility_room` |
| Almoxarifado / Farmácia | Supply Room / Pharmacy | `supply_room` / `pharmacy` |
| Repouso da Equipe | Staff Break Room / Lounge | `staff_break_room` |

---

### 👥 3. Dimensionamento e Recursos Humanos (Staffing & HR)

| Termo em Português (BR/PT) | Inglês Técnico (Health IT) | Sugestão para Base de Dados (snake_case) |
| :--- | :--- | :--- |
| Dimensionamento de Pessoal | Staffing Calculation / Plan | `staffing_calculation` |
| Quantitativo de Pessoal (QP) | Required Staffing / Headcount | `required_staffing` |
| Responsável Técnico (RT) | Technical Lead / Nursing Director | `technical_lead` |
| Enfermeiro | Registered Nurse (RN) | `registered_nurse` |
| Técnico/Auxiliar de Enfermagem | Licensed Practical Nurse (LPN) | `licensed_practical_nurse` |
| Médico / Plantonista | Physician / On-Call Staff | `physician` / `on_call_staff` |
| Diarista | Day-Shift Staff | `day_shift_staff` |
| Escala de Trabalho | Work Schedule / Shift Roster | `shift_roster` |
| Vínculo Empregatício (CLT, PJ) | Employment Type | `employment_type` |
| Total de Horas de Enfermagem (THE) | Total Nursing Hours | `total_nursing_hours` |

---

### 📋 4. Inspeção, Qualidade e Laudos (Inspection & Reporting)

| Termo em Português (BR/PT) | Inglês Técnico (Health IT) | Sugestão para Base de Dados (snake_case) |
| :--- | :--- | :--- |
| Roteiro de Inspeção | Inspection Checklist | `inspection_checklist` |
| Laudo / Relatório | Audit Report / Inspection Report | `inspection_report` |
| Prontuário | Electronic Health Record (EHR) | `patient_chart` / `ehr` |
| Conformidade / Adequado (A) | Compliant / Adequate | `is_compliant` (boolean) |
| Não Conformidade / Inadequado (I) | Non-Compliant / Finding | `non_compliance` |
| Não se Aplica (NT) | Not Applicable | `not_applicable` |
| Risco / Achado Crítico | Critical Risk / Critical Finding | `critical_finding` |
| Evidência Fotográfica | Photographic Evidence | `evidence_url` |
| Ação Imediata Recomendada | Recommended Immediate Action | `recommended_action` |
| Normas / Resoluções (Cofen, RDC) | Regulations / Compliance Standards | `compliance_standard` |