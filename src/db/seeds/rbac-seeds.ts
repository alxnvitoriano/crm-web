import { db } from "../index";
import { rolesTable, permissionsTable, rolesToPermissionsTable } from "../schema";

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
];

// Roles do sistema
export const systemRoles = [
  {
    name: "Owner",
    description: "Proprietário da organização com acesso total",
    isSystemRole: true,
    permissions: [
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
    ],
  },
  {
    name: "Admin",
    description: "Administrador com acesso total exceto gestão de organizações",
    isSystemRole: true,
    permissions: [
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
    ],
  },
  {
    name: "Gerente de Vendas",
    description: "Gerente de vendas com acesso a equipe e relatórios",
    isSystemRole: true,
    permissions: [
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
    ],
  },
  {
    name: "Vendedor",
    description: "Vendedor com acesso limitado aos próprios clientes e agendamentos",
    isSystemRole: true,
    permissions: [
      "create:client",
      "read:client",
      "update:client",
      "read:appointment",
      "create:appointment",
      "update:appointment",
      "read:company",
    ],
  },
  {
    name: "Administrativo",
    description: "Funcionário administrativo com acesso a dados e relatórios",
    isSystemRole: true,
    permissions: [
      "read:client",
      "update:client",
      "read:salesperson",
      "read:appointment",
      "update:appointment",
      "read:reports",
      "read:company",
    ],
  },
  {
    name: "Pós-Venda",
    description: "Equipe de pós-venda com acesso limitado",
    isSystemRole: true,
    permissions: [
      "read:client",
      "update:client",
      "read:appointment",
      "update:appointment",
      "read:company",
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
