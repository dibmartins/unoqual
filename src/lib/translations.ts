/**
 * Centralized translation utility for Unoqual.
 * Internally, the system uses English for schemas, enums, and constants.
 * The UI is exclusively in Portuguese (PT-BR).
 */

const translations: Record<string, string> = {
  // Common
  'save': 'Salvar',
  'cancel': 'Cancelar',
  'edit': 'Editar',
  'delete': 'Excluir',
  'create': 'Criar',
  'loading': 'Carregando...',
  
  // Compliance Status
  'compliant': 'Conforme',
  'non_compliant': 'Não Conforme',
  'not_applicable': 'Não Aplicável',
  
  // Finding Severity
  'critical': 'Crítico',
  'important': 'Importante',
  'minor': 'Leve',
  'none': 'Nenhum',
  
  // Facility Size
  'small': 'Pequeno',
  'medium': 'Médio',
  'large': 'Grande',

  // Inspection Status
  'draft': 'Rascunho',
  'completed': 'Finalizado',
};

/**
 * Translates a given key to Portuguese.
 * If the key is not found, returns the key itself.
 */
export function translate(key: string | null | undefined): string {
  if (!key) return '';
  return translations[key.toLowerCase()] || key;
}
