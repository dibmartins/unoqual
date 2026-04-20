# Hierarquia de Setores e Unidades

```text
└── Urgência e Emergência (emergency_care)
    ├── Áreas Críticas (Alto Risco) -> critical_areas
    │   └── Sala Vermelha (Emergência) -> resuscitation_room
    └── Áreas Semicríticas (Risco Moderado) -> semi_critical_areas
        ├── Sala Amarela / Observação -> yellow_zone
        ├── Sala de Imobilização Ortopédica -> orthopedic_cast_room
        ├── Sala de Medicação / Hidratação -> medication_room
        ├── Sala de Observação Adulto -> adult_observation_room
        ├── Sala de Observação Pediátrica -> pediatric_observation_room
        ├── Sala de Pequenos Procedimentos (Curativos/Sutura) -> minor_procedure_room
        └── Triagem / Classificação de Risco -> triage

└── Internação (inpatient_care)
    └── Áreas Semicríticas (Risco Moderado) -> semi_critical_areas
        ├── Clínica Cirúrgica Feminina (Enfermaria) -> female_surgical_ward
        ├── Clínica Cirúrgica Masculina (Enfermaria) -> male_surgical_ward
        ├── Clínica Médica Feminina (Enfermaria) -> female_medical_ward
        ├── Clínica Médica Masculina (Enfermaria) -> male_medical_ward
        ├── Clínica Obstétrica -> obstetrics_ward
        └── Pediatria (Enfermaria) -> pediatric_ward

└── Terapia Intensiva (intensive_care)
    └── Áreas Críticas (Alto Risco) -> critical_areas
        ├── UTI Adulto -> adult_icu
        └── UTI Neonatal (UTIN) -> neonatal_icu

└── Serviços Cirúrgicos (surgical_services)
    └── Áreas Críticas (Alto Risco) -> critical_areas
        ├── Centro Cirúrgico (CC) -> operating_room
        └── Recuperação Pós-Anestésica (RPA) -> recovery_room

└── Apoio Diagnóstico (diagnostic_support)
    ├── Áreas Críticas (Alto Risco) -> critical_areas
    │   ├── Anatomia Patológica / Necrotério -> pathology_morgue
    │   ├── Central de Material e Esterilização (CME) -> sterile_processing
    │   └── Laboratório de Análises Clínicas -> clinical_laboratory
    └── Áreas Semicríticas (Risco Moderado) -> semi_critical_areas
        ├── Agência Transfusional -> blood_bank
        ├── Farmácia Central -> pharmacy
        ├── Raio-X -> x_ray_room
        ├── Tomografia Computadorizada -> ct_scan_room
        └── Ultrassonografia -> ultrasound_room

└── Atenção Básica (primary_care)
    └── Áreas Semicríticas (Risco Moderado) -> semi_critical_areas
        ├── Sala de Curativos -> wound_care_room
        └── Sala de Vacina -> vaccination_room

└── Serviços Administrativos (administrative_services)
    └── Áreas Não Críticas (Baixo Risco) -> non_critical_areas
        ├── Diretoria e Gestão -> management_office
        ├── Faturamento e Auditoria de Contas -> billing_department
        ├── Ouvidoria -> ombudsman
        ├── Recepção e Espera -> reception
        ├── Recursos Humanos -> human_resources
        ├── Serviço de Arquivo Médico (SAME) -> medical_records
        └── Tecnologia da Informação (TI) -> it_department

└── Nutrição e Dietética (dietary_services)
    ├── Áreas Críticas (Alto Risco) -> critical_areas
    │   └── Lactário -> formula_room
    └── Áreas Não Críticas (Baixo Risco) -> non_critical_areas
        ├── Cozinha Industrial -> industrial_kitchen
        └── Refeitório -> cafeteria

└── Processamento de Roupas (laundry_services)
    ├── Áreas Críticas (Alto Risco) -> critical_areas
    │   └── Lavanderia Hospitalar -> laundry_room
    └── Áreas Não Críticas (Baixo Risco) -> non_critical_areas
        └── Rouparia -> linen_room

└── Apoio Operacional e Logística (operational_support)
    ├── Áreas Críticas (Alto Risco) -> critical_areas
    │   ├── Abrigo de Resíduos (Lixo Hospitalar) -> waste_management
    │   └── Expurgo -> dirty_utility_room
    ├── Áreas Semicríticas (Risco Moderado) -> semi_critical_areas
    │   └── Corredores -> corridors
    └── Áreas Não Críticas (Baixo Risco) -> non_critical_areas
        ├── Almoxarifado Central -> central_storage
        ├── Garagem -> garage_parking
        ├── Manutenção Predial e Clínica -> maintenance_workshop
        ├── Sala de Repouso da Equipe de Enfermagem -> nursing_rest_room
        ├── Sala de Repouso da Equipe Médica -> medical_rest_room
        ├── Sala de Repouso de Outras Categorias -> general_staff_rest_room
        ├── Sala de Utilidades / DML (Higiene) -> janitorial_room
        └── Vestiário de Funcionários -> staff_locker_room
```