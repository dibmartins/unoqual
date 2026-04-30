import type { LucideIcon } from "lucide-react";
import {
  Thermometer,
  Activity,
  Stethoscope,
  Syringe,
  Layers,
  Droplets,
  Zap,
  HeartPulse,
  Ambulance,
  Search,
  Wind,
  FileCheck,
  Bug,
  Flame,
  Handshake,
  UserCheck,
  Globe,
  FileText,
  ShieldCheck,
  Utensils,
  Monitor,
  Settings,
  GraduationCap,
  BarChart3,
  Home,
  Lightbulb,
  Trash2,
  ShieldAlert,
  LayoutPanelLeft,
} from "lucide-react";

export type InspectionQuestion = {
  id: string;
  label: string;
  icon: LucideIcon;
};

/** Perguntas do checklist de Equipamentos */
export const EQUIPMENT_QUESTIONS: InspectionQuestion[] = [
  { id: "termometro", label: "Termômetro clínico em boas condições?", icon: Thermometer },
  { id: "esfignomanometro", label: "Esfignomanômetro (aparelho de pressão) calibrado?", icon: Activity },
  { id: "estetoscopio", label: "Estetoscópio funcional e higienizado?", icon: Stethoscope },
  { id: "glicosimetro", label: "Glicosímetro com tiras na validade e controle?", icon: Droplets },
  { id: "oximetro", label: "Oxímetro de pulso funcional?", icon: Activity },
  { id: "suporteSoro", label: "Suportes de soro em quantidade suficiente e estáveis?", icon: Syringe },
  { id: "escadaDoisDegraus", label: "Escadas de 2 degraus com antiderrapante?", icon: Layers },
  { id: "monitorMultiparametrico", label: "Monitor multiparamétrico com cabos e sensores?", icon: HeartPulse },
  { id: "bombaInfusora", label: "Bombas infusoras com baterias carregadas?", icon: Droplets },
  { id: "desfibrilador", label: "Desfibrilador/Cardioversor com carga e pás?", icon: Zap },
  { id: "carroParada", label: "Carro de parada lacrado e com checklist em dia?", icon: Ambulance },
  { id: "laringoscopio", label: "Laringoscópio com lâminas e pilhas funcionais?", icon: Search },
  { id: "ambu", label: "Ambu (Reanimador manual) completo e limpo?", icon: Wind },
];

/** Perguntas do checklist de Documentação */
export const DOCUMENT_QUESTIONS: InspectionQuestion[] = [
  { id: "alvaraSanitario", label: "Possui alvará sanitário vigente?", icon: FileCheck },
  { id: "controleVetores", label: "Garante ações eficazes e contínuas de controle de vetores e pragas urbanas (dedetização)?", icon: Bug },
  { id: "licencaBombeiros", label: "Possui licença do Corpo de Bombeiros (CBMERJ) vigente?", icon: Flame },
  { id: "contratosTerceirizados", label: "Contratos e alvarás das empresas terceirizadas estão atualizados?", icon: Handshake },
  { id: "responsavelTecnico", label: "Possui responsável técnico (RT) e substituto para medicina, enfermagem e fisio?", icon: UserCheck },
  { id: "cnesAtualizado", label: "O Cadastro Nacional de Estabelecimentos de Saúde (CNES) está atualizado?", icon: Globe },
];

/** Perguntas do checklist de Processos */
export const PROCESS_QUESTIONS: InspectionQuestion[] = [
  { id: "popsAtualizados", label: "Existem normas, procedimentos e rotinas técnicas (POPs) escritas e atualizadas?", icon: FileText },
  { id: "medicamentosControlados", label: "Guarda de medicamentos controlados em local fechado e seguro?", icon: ShieldCheck },
  { id: "proibicaoAlimentos", label: "Respeitada a proibição de alimentos nos postos de saúde?", icon: Utensils },
  { id: "classificacaoRisco", label: "É realizada a classificação de risco (Manchester)?", icon: Stethoscope },
  { id: "controleDieta", label: "Existe controle de dieta por nutricionista?", icon: Utensils },
  { id: "escalaVisivel", label: "A escala de serviço está afixada em local visível?", icon: FileText },
  { id: "controleTemperatura", label: "Existe registro de controle diário de temperatura?", icon: Thermometer },
  { id: "sistemaDigital", label: "Possui sistema digital integrado?", icon: Monitor },
  { id: "manutencaoEquipamentos", label: "Mantém registro de manutenção preventiva/corretiva de equipamentos?", icon: Settings },
  { id: "energiaEmergencia", label: "Possui sistema de energia elétrica de emergência?", icon: Zap },
  { id: "capacitacaoProfissional", label: "Mantém registro de capacitações permanentes dos profissionais?", icon: GraduationCap },
  { id: "indicadoresLegais", label: "Calcula e mantém o registro dos indicadores previstos em lei?", icon: BarChart3 },
];

/** Perguntas do checklist de Infraestrutura */
export const INFRA_QUESTIONS: InspectionQuestion[] = [
  { id: "areaMinima", label: "Possui área mínima de 12m² por leito?", icon: Home },
  { id: "identificacaoVisual", label: "Possui identificação visual em local visível?", icon: LayoutPanelLeft },
  { id: "trincasRachaduras", label: "Apresenta trincas ou rachaduras?", icon: ShieldAlert },
  { id: "infiltracoes", label: "Apresenta infiltrações/umidade?", icon: Droplets },
  { id: "pisoApropriado", label: "Piso apropriado para área hospitalar?", icon: LayoutPanelLeft },
  { id: "iluminacaoAdequada", label: "Iluminação adequada no ambiente?", icon: Lightbulb },
  { id: "lixeiraPedal", label: "Lixeira com acionamento por pedal?", icon: Trash2 },
];
