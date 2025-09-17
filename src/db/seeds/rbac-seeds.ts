import { db } from "../index";
import { rolesTable, permissionsTable, rolesToPermissionsTable } from "../schema";
import { salesProcessPermissions } from "../../lib/rbac/sales-process-permissions";

// Permissões do sistema para CRM
export const systemPermissions = [
  // Clientes
  {
    slug: "create:client",
    resource: "client",
    action: "create",
    description: "Criar novos clientes",
  },
  { slug: "read:client", resource: "client", action: "read", description: "Visualizar clientes" },
  { slug: "update:client", resource: "client", action: "update", description: "Editar clientes" },
  { slug: "delete:client", resource: "client", action: "delete", description: "Excluir clientes" },

  // Vendedores
  {
    slug: "create:salesperson",
    resource: "salesperson",
    action: "create",
    description: "Criar novos vendedores",
  },
  {
    slug: "read:salesperson",
    resource: "salesperson",
    action: "read",
    description: "Visualizar vendedores",
  },
  {
    slug: "update:salesperson",
    resource: "salesperson",
    action: "update",
    description: "Editar vendedores",
  },
  {
    slug: "delete:salesperson",
    resource: "salesperson",
    action: "delete",
    description: "Excluir vendedores",
  },

  // Agendamentos
  {
    slug: "create:appointment",
    resource: "appointment",
    action: "create",
    description: "Criar novos agendamentos",
  },
  {
    slug: "read:appointment",
    resource: "appointment",
    action: "read",
    description: "Visualizar agendamentos",
  },
  {
    slug: "update:appointment",
    resource: "appointment",
    action: "update",
    description: "Editar agendamentos",
  },
  {
    slug: "delete:appointment",
    resource: "appointment",
    action: "delete",
    description: "Excluir agendamentos",
  },

  // Relatórios
  {
    slug: "read:reports",
    resource: "reports",
    action: "read",
    description: "Visualizar relatórios",
  },
  {
    slug: "export:reports",
    resource: "reports",
    action: "export",
    description: "Exportar relatórios",
  },

  // Configurações da empresa
  {
    slug: "read:company",
    resource: "company",
    action: "read",
    description: "Visualizar dados da empresa",
  },
  {
    slug: "update:company",
    resource: "company",
    action: "update",
    description: "Editar dados da empresa",
  },

  // Gestão de usuários
  { slug: "create:user", resource: "user", action: "create", description: "Criar novos usuários" },
  { slug: "read:user", resource: "user", action: "read", description: "Visualizar usuários" },
  { slug: "update:user", resource: "user", action: "update", description: "Editar usuários" },
  { slug: "delete:user", resource: "user", action: "delete", description: "Excluir usuários" },

  // Gestão de roles e permissões
  { slug: "create:role", resource: "role", action: "create", description: "Criar novos roles" },
  { slug: "read:role", resource: "role", action: "read", description: "Visualizar roles" },
  { slug: "update:role", resource: "role", action: "update", description: "Editar roles" },
  { slug: "delete:role", resource: "role", action: "delete", description: "Excluir roles" },

  // Gestão de organizações
  {
    slug: "create:organization",
    resource: "organization",
    action: "create",
    description: "Criar novas organizações",
  },
  {
    slug: "read:organization",
    resource: "organization",
    action: "read",
    description: "Visualizar organizações",
  },
  {
    slug: "update:organization",
    resource: "organization",
    action: "update",
    description: "Editar organizações",
  },
  {
    slug: "delete:organization",
    resource: "organization",
    action: "delete",
    description: "Excluir organizações",
  },

  // Permissões do processo de vendas (8 etapas)
  ...salesProcessPermissions,
];

// Roles do sistema com permissões específicas para as etapas do processo de vendas
export const systemRoles = [
  {
    name: "Gerente Geral",
    description: "Acesso total a todas as funcionalidades e etapas do processo de vendas",
    isSystemRole: true,
    permissions: [
      // Permissões básicas
      "create:client",
      "read:client",
      "update:client",
      "delete:client",
      "create:salesperson",
      "read:salesperson",
      "update:salesperson",
      "delete:salesperson",
      "create:appointment",
      "read:appointment",
      "update:appointment",
      "delete:appointment",
      "read:reports",
      "export:reports",
      "read:company",
      "update:company",
      "create:user",
      "read:user",
      "update:user",
      "delete:user",
      "create:role",
      "read:role",
      "update:role",
      "delete:role",
      "create:organization",
      "read:organization",
      "update:organization",
      "delete:organization",
      "manage:organization",
      "view:all_stages",

      // Todas as etapas do processo de vendas (1-8)
      "create:stage_1",
      "read:stage_1",
      "update:stage_1",
      "delete:stage_1",
      "create:stage_2",
      "read:stage_2",
      "update:stage_2",
      "delete:stage_2",
      "create:stage_3",
      "read:stage_3",
      "update:stage_3",
      "delete:stage_3",
      "create:stage_4",
      "read:stage_4",
      "update:stage_4",
      "delete:stage_4",
      "create:stage_5",
      "read:stage_5",
      "update:stage_5",
      "delete:stage_5",
      "create:stage_6",
      "read:stage_6",
      "update:stage_6",
      "delete:stage_6",
      "create:stage_7",
      "read:stage_7",
      "update:stage_7",
      "delete:stage_7",
      "create:stage_8",
      "read:stage_8",
      "update:stage_8",
      "delete:stage_8",
    ],
  },
  {
    name: "Administrativo",
    description: "Acesso às etapas 4 a 7 do processo de vendas",
    isSystemRole: true,
    permissions: [
      // Permissões básicas
      "read:client",
      "update:client",
      "read:salesperson",
      "read:appointment",
      "update:appointment",
      "read:reports",
      "read:company",

      // Etapas 4 a 7 (Negociação, Fechamento, Contrato, Pagamento)
      "create:stage_4",
      "read:stage_4",
      "update:stage_4",
      "delete:stage_4",
      "create:stage_5",
      "read:stage_5",
      "update:stage_5",
      "delete:stage_5",
      "create:stage_6",
      "read:stage_6",
      "update:stage_6",
      "delete:stage_6",
      "create:stage_7",
      "read:stage_7",
      "update:stage_7",
      "delete:stage_7",
    ],
  },
  {
    name: "Pós-Venda",
    description: "Acesso somente à etapa 8 (Pós-venda) e visualização das outras etapas",
    isSystemRole: true,
    permissions: [
      // Permissões básicas
      "read:client",
      "update:client",
      "read:appointment",
      "update:appointment",
      "read:company",

      // Acesso total à etapa 8 (Pós-venda)
      "create:stage_8",
      "read:stage_8",
      "update:stage_8",
      "delete:stage_8",

      // Apenas visualização das outras etapas
      "read:stage_1",
      "read:stage_2",
      "read:stage_3",
      "read:stage_4",
      "read:stage_5",
      "read:stage_6",
      "read:stage_7",
    ],
  },
  {
    name: "Gerente de Vendas",
    description: "Acesso a vendedores da equipe e todas as etapas do processo (1-8)",
    isSystemRole: true,
    permissions: [
      // Permissões básicas
      "create:client",
      "read:client",
      "update:client",
      "delete:client",
      "read:salesperson",
      "update:salesperson",
      "create:appointment",
      "read:appointment",
      "update:appointment",
      "delete:appointment",
      "read:reports",
      "export:reports",
      "read:company",
      "manage:team",
      "view:all_stages",

      // Todas as etapas do processo de vendas (1-8)
      "create:stage_1",
      "read:stage_1",
      "update:stage_1",
      "delete:stage_1",
      "create:stage_2",
      "read:stage_2",
      "update:stage_2",
      "delete:stage_2",
      "create:stage_3",
      "read:stage_3",
      "update:stage_3",
      "delete:stage_3",
      "create:stage_4",
      "read:stage_4",
      "update:stage_4",
      "delete:stage_4",
      "create:stage_5",
      "read:stage_5",
      "update:stage_5",
      "delete:stage_5",
      "create:stage_6",
      "read:stage_6",
      "update:stage_6",
      "delete:stage_6",
      "create:stage_7",
      "read:stage_7",
      "update:stage_7",
      "delete:stage_7",
      "create:stage_8",
      "read:stage_8",
      "update:stage_8",
      "delete:stage_8",
    ],
  },
  {
    name: "Vendedor",
    description: "Acesso editável às etapas 1-4 e 8, visualização das etapas 5-7",
    isSystemRole: true,
    permissions: [
      // Permissões básicas
      "create:client",
      "read:client",
      "update:client",
      "read:appointment",
      "create:appointment",
      "update:appointment",
      "read:company",

      // Etapas 1-4 e 8 (editável)
      "create:stage_1",
      "read:stage_1",
      "update:stage_1",
      "delete:stage_1",
      "create:stage_2",
      "read:stage_2",
      "update:stage_2",
      "delete:stage_2",
      "create:stage_3",
      "read:stage_3",
      "update:stage_3",
      "delete:stage_3",
      "create:stage_4",
      "read:stage_4",
      "update:stage_4",
      "delete:stage_4",
      "create:stage_8",
      "read:stage_8",
      "update:stage_8",
      "delete:stage_8",

      // Etapas 5-7 (apenas visualização)
      "read:stage_5",
      "read:stage_6",
      "read:stage_7",
    ],
  },
];

export async function seedRBAC() {
  try {
    // Inserir permissões
    const insertedPermissions = await db
      .insert(permissionsTable)
      .values(
        systemPermissions.map((permission) => ({
          ...permission,
          isSystemPermission: true,
        }))
      )
      .returning();

    // Inserir roles
    const insertedRoles = await db
      .insert(rolesTable)
      .values(
        systemRoles.map((role) => ({
          name: role.name,
          description: role.description,
          isSystemRole: role.isSystemRole,
        }))
      )
      .returning();

    // Associar permissões aos roles
    const rolePermissionMappings = [];

    for (const role of systemRoles) {
      const roleRecord = insertedRoles.find((r) => r.name === role.name);
      if (!roleRecord) continue;

      for (const permissionSlug of role.permissions) {
        const permissionRecord = insertedPermissions.find((p) => p.slug === permissionSlug);
        if (!permissionRecord) continue;

        rolePermissionMappings.push({
          roleId: roleRecord.id,
          permissionId: permissionRecord.id,
        });
      }
    }

    if (rolePermissionMappings.length > 0) {
      await db.insert(rolesToPermissionsTable).values(rolePermissionMappings);
    }

    return {
      permissions: insertedPermissions.length,
      roles: insertedRoles.length,
      mappings: rolePermissionMappings.length,
    };
  } catch (error) {
    console.error("❌ Erro ao executar seed do RBAC:", error);
    throw error;
  }
}

// Função para verificar se o RBAC já foi populado
export async function isRBACSeeded() {
  try {
    const permissionCount = await db.select().from(permissionsTable).limit(1);
    const roleCount = await db.select().from(rolesTable).limit(1);
    return permissionCount.length > 0 && roleCount.length > 0;
  } catch {
    return false;
  }
}
