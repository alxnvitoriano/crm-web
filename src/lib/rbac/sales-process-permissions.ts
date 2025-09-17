// Permissões específicas para as etapas do processo de vendas
export const SALES_STAGES = {
  STAGE_1: "stage_1", // Primeiro contato/Lead
  STAGE_2: "stage_2", // Qualificação
  STAGE_3: "stage_3", // Proposta
  STAGE_4: "stage_4", // Negociação
  STAGE_5: "stage_5", // Fechamento
  STAGE_6: "stage_6", // Contrato
  STAGE_7: "stage_7", // Pagamento
  STAGE_8: "stage_8", // Pós-venda
} as const;

export type SalesStage = (typeof SALES_STAGES)[keyof typeof SALES_STAGES];

// Permissões específicas para cada etapa do processo de vendas
export const salesProcessPermissions = [
  // Etapa 1 - Primeiro contato/Lead
  {
    slug: "create:stage_1",
    resource: "stage_1",
    action: "create",
    description: "Criar leads e primeiro contato",
  },
  {
    slug: "read:stage_1",
    resource: "stage_1",
    action: "read",
    description: "Visualizar leads e primeiro contato",
  },
  {
    slug: "update:stage_1",
    resource: "stage_1",
    action: "update",
    description: "Editar leads e primeiro contato",
  },
  {
    slug: "delete:stage_1",
    resource: "stage_1",
    action: "delete",
    description: "Excluir leads e primeiro contato",
  },

  // Etapa 2 - Qualificação
  {
    slug: "create:stage_2",
    resource: "stage_2",
    action: "create",
    description: "Criar qualificação de leads",
  },
  {
    slug: "read:stage_2",
    resource: "stage_2",
    action: "read",
    description: "Visualizar qualificação de leads",
  },
  {
    slug: "update:stage_2",
    resource: "stage_2",
    action: "update",
    description: "Editar qualificação de leads",
  },
  {
    slug: "delete:stage_2",
    resource: "stage_2",
    action: "delete",
    description: "Excluir qualificação de leads",
  },

  // Etapa 3 - Proposta
  {
    slug: "create:stage_3",
    resource: "stage_3",
    action: "create",
    description: "Criar propostas comerciais",
  },
  {
    slug: "read:stage_3",
    resource: "stage_3",
    action: "read",
    description: "Visualizar propostas comerciais",
  },
  {
    slug: "update:stage_3",
    resource: "stage_3",
    action: "update",
    description: "Editar propostas comerciais",
  },
  {
    slug: "delete:stage_3",
    resource: "stage_3",
    action: "delete",
    description: "Excluir propostas comerciais",
  },

  // Etapa 4 - Negociação
  {
    slug: "create:stage_4",
    resource: "stage_4",
    action: "create",
    description: "Criar negociações",
  },
  {
    slug: "read:stage_4",
    resource: "stage_4",
    action: "read",
    description: "Visualizar negociações",
  },
  {
    slug: "update:stage_4",
    resource: "stage_4",
    action: "update",
    description: "Editar negociações",
  },
  {
    slug: "delete:stage_4",
    resource: "stage_4",
    action: "delete",
    description: "Excluir negociações",
  },

  // Etapa 5 - Fechamento
  {
    slug: "create:stage_5",
    resource: "stage_5",
    action: "create",
    description: "Criar fechamentos de vendas",
  },
  {
    slug: "read:stage_5",
    resource: "stage_5",
    action: "read",
    description: "Visualizar fechamentos de vendas",
  },
  {
    slug: "update:stage_5",
    resource: "stage_5",
    action: "update",
    description: "Editar fechamentos de vendas",
  },
  {
    slug: "delete:stage_5",
    resource: "stage_5",
    action: "delete",
    description: "Excluir fechamentos de vendas",
  },

  // Etapa 6 - Contrato
  {
    slug: "create:stage_6",
    resource: "stage_6",
    action: "create",
    description: "Criar contratos",
  },
  {
    slug: "read:stage_6",
    resource: "stage_6",
    action: "read",
    description: "Visualizar contratos",
  },
  {
    slug: "update:stage_6",
    resource: "stage_6",
    action: "update",
    description: "Editar contratos",
  },
  {
    slug: "delete:stage_6",
    resource: "stage_6",
    action: "delete",
    description: "Excluir contratos",
  },

  // Etapa 7 - Pagamento
  {
    slug: "create:stage_7",
    resource: "stage_7",
    action: "create",
    description: "Criar registros de pagamento",
  },
  {
    slug: "read:stage_7",
    resource: "stage_7",
    action: "read",
    description: "Visualizar registros de pagamento",
  },
  {
    slug: "update:stage_7",
    resource: "stage_7",
    action: "update",
    description: "Editar registros de pagamento",
  },
  {
    slug: "delete:stage_7",
    resource: "stage_7",
    action: "delete",
    description: "Excluir registros de pagamento",
  },

  // Etapa 8 - Pós-venda
  {
    slug: "create:stage_8",
    resource: "stage_8",
    action: "create",
    description: "Criar registros de pós-venda",
  },
  {
    slug: "read:stage_8",
    resource: "stage_8",
    action: "read",
    description: "Visualizar registros de pós-venda",
  },
  {
    slug: "update:stage_8",
    resource: "stage_8",
    action: "update",
    description: "Editar registros de pós-venda",
  },
  {
    slug: "delete:stage_8",
    resource: "stage_8",
    action: "delete",
    description: "Excluir registros de pós-venda",
  },

  // Permissões especiais
  {
    slug: "manage:team",
    resource: "team",
    action: "manage",
    description: "Gerenciar equipe de vendas",
  },
  {
    slug: "view:all_stages",
    resource: "all_stages",
    action: "view",
    description: "Visualizar todas as etapas do processo",
  },
  {
    slug: "manage:organization",
    resource: "organization",
    action: "manage",
    description: "Gerenciar organização",
  },
] as const;

// Função para obter permissões de uma etapa específica
export function getStagePermissions(
  stage: SalesStage,
  action: "create" | "read" | "update" | "delete"
) {
  return salesProcessPermissions.filter((p) => p.resource === stage && p.action === action);
}

// Função para obter todas as permissões de uma etapa
export function getAllStagePermissions(stage: SalesStage) {
  return salesProcessPermissions.filter((p) => p.resource === stage);
}

// Função para verificar se uma permissão é de uma etapa específica
export function isStagePermission(permissionSlug: string, stage: SalesStage) {
  return permissionSlug.startsWith(`${stage}:`) || permissionSlug.includes(stage);
}
