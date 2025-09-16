import { db } from "@/db";
import { rolesTable, permissionsTable, rolesToPermissionsTable, member } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type Permission = {
  id: string;
  slug: string;
  resource: string;
  action: string;
  description: string | null;
  isSystemPermission: boolean;
};

export type Role = {
  id: string;
  name: string;
  description: string | null;
  organizationId: string | null;
  isSystemRole: boolean;
  permissions: Permission[];
};

export type UserPermissions = {
  userId: string;
  organizationId: string;
  role: Role;
  permissions: Permission[];
};

/**
 * Verifica se um usuário tem uma permissão específica em uma organização
 */
export async function hasPermission(
  userId: string,
  organizationId: string,
  permissionSlug: string
): Promise<boolean> {
  try {
    const result = await db
      .select({
        permissionSlug: permissionsTable.slug,
      })
      .from(member)
      .innerJoin(rolesTable, eq(member.roleId, rolesTable.id))
      .innerJoin(rolesToPermissionsTable, eq(rolesTable.id, rolesToPermissionsTable.roleId))
      .innerJoin(permissionsTable, eq(rolesToPermissionsTable.permissionId, permissionsTable.id))
      .where(
        and(
          eq(member.userId, userId),
          eq(member.organizationId, organizationId),
          eq(permissionsTable.slug, permissionSlug)
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    return false;
  }
}

/**
 * Verifica se um usuário tem qualquer uma das permissões especificadas
 */
export async function hasAnyPermission(
  userId: string,
  organizationId: string,
  permissionSlugs: string[]
): Promise<boolean> {
  try {
    const result = await db
      .select({
        permissionSlug: permissionsTable.slug,
      })
      .from(member)
      .innerJoin(rolesTable, eq(member.roleId, rolesTable.id))
      .innerJoin(rolesToPermissionsTable, eq(rolesTable.id, rolesToPermissionsTable.roleId))
      .innerJoin(permissionsTable, eq(rolesToPermissionsTable.permissionId, permissionsTable.id))
      .where(
        and(
          eq(member.userId, userId),
          eq(member.organizationId, organizationId)
          // Usar IN para verificar múltiplas permissões
          // Note: Drizzle não tem suporte direto para IN com array, então vamos fazer diferente
        )
      );

    const userPermissions = result.map((r) => r.permissionSlug);
    return permissionSlugs.some((slug) => userPermissions.includes(slug));
  } catch (error) {
    console.error("Erro ao verificar permissões:", error);
    return false;
  }
}

/**
 * Obtém todas as permissões de um usuário em uma organização
 */
export async function getUserPermissions(
  userId: string,
  organizationId: string
): Promise<UserPermissions | null> {
  try {
    const result = await db
      .select({
        userId: member.userId,
        organizationId: member.organizationId,
        roleId: rolesTable.id,
        roleName: rolesTable.name,
        roleDescription: rolesTable.description,
        isSystemRole: rolesTable.isSystemRole,
        permissionId: permissionsTable.id,
        permissionSlug: permissionsTable.slug,
        permissionResource: permissionsTable.resource,
        permissionAction: permissionsTable.action,
        permissionDescription: permissionsTable.description,
        isSystemPermission: permissionsTable.isSystemPermission,
      })
      .from(member)
      .innerJoin(rolesTable, eq(member.roleId, rolesTable.id))
      .innerJoin(rolesToPermissionsTable, eq(rolesTable.id, rolesToPermissionsTable.roleId))
      .innerJoin(permissionsTable, eq(rolesToPermissionsTable.permissionId, permissionsTable.id))
      .where(and(eq(member.userId, userId), eq(member.organizationId, organizationId)));

    if (result.length === 0) {
      return null;
    }

    const firstRow = result[0];
    const permissions: Permission[] = result.map((row) => ({
      id: row.permissionId,
      slug: row.permissionSlug,
      resource: row.permissionResource,
      action: row.permissionAction,
      description: row.permissionDescription,
      isSystemPermission: row.isSystemPermission,
    }));

    const role: Role = {
      id: firstRow.roleId,
      name: firstRow.roleName,
      description: firstRow.roleDescription,
      organizationId: null, // Roles do sistema não têm organizationId
      isSystemRole: firstRow.isSystemRole,
      permissions,
    };

    return {
      userId: firstRow.userId,
      organizationId: firstRow.organizationId,
      role,
      permissions,
    };
  } catch (error) {
    console.error("Erro ao obter permissões do usuário:", error);
    return null;
  }
}

/**
 * Obtém todos os roles de uma organização
 */
export async function getOrganizationRoles(organizationId: string): Promise<Role[]> {
  try {
    const result = await db
      .select({
        roleId: rolesTable.id,
        roleName: rolesTable.name,
        roleDescription: rolesTable.description,
        isSystemRole: rolesTable.isSystemRole,
        permissionId: permissionsTable.id,
        permissionSlug: permissionsTable.slug,
        permissionResource: permissionsTable.resource,
        permissionAction: permissionsTable.action,
        permissionDescription: permissionsTable.description,
        isSystemPermission: permissionsTable.isSystemPermission,
      })
      .from(rolesTable)
      .leftJoin(rolesToPermissionsTable, eq(rolesTable.id, rolesToPermissionsTable.roleId))
      .leftJoin(permissionsTable, eq(rolesToPermissionsTable.permissionId, permissionsTable.id))
      .where(
        and(
          eq(rolesTable.organizationId, organizationId),
          eq(rolesTable.isSystemRole, true) // Incluir roles do sistema
        )
      );

    // Agrupar por role
    const roleMap = new Map<string, Role>();

    for (const row of result) {
      if (!roleMap.has(row.roleId)) {
        roleMap.set(row.roleId, {
          id: row.roleId,
          name: row.roleName,
          description: row.roleDescription,
          organizationId,
          isSystemRole: row.isSystemRole,
          permissions: [],
        });
      }

      if (
        row.permissionId &&
        row.permissionSlug &&
        row.permissionResource &&
        row.permissionAction
      ) {
        const role = roleMap.get(row.roleId)!;
        role.permissions.push({
          id: row.permissionId,
          slug: row.permissionSlug,
          resource: row.permissionResource,
          action: row.permissionAction,
          description: row.permissionDescription,
          isSystemPermission: row.isSystemPermission ?? false,
        });
      }
    }

    return Array.from(roleMap.values());
  } catch (error) {
    console.error("Erro ao obter roles da organização:", error);
    return [];
  }
}

/**
 * Cria um novo role personalizado
 */
export async function createCustomRole(
  name: string,
  description: string | null,
  organizationId: string,
  permissionIds: string[]
): Promise<Role | null> {
  try {
    // Criar o role
    const [newRole] = await db
      .insert(rolesTable)
      .values({
        name,
        description,
        organizationId,
        isSystemRole: false,
      })
      .returning();

    // Associar permissões
    if (permissionIds.length > 0) {
      await db.insert(rolesToPermissionsTable).values(
        permissionIds.map((permissionId) => ({
          roleId: newRole.id,
          permissionId,
        }))
      );
    }

    // Buscar o role completo com permissões
    const roleWithPermissions = await getRoleById(newRole.id);
    return roleWithPermissions;
  } catch (error) {
    console.error("Erro ao criar role personalizado:", error);
    return null;
  }
}

/**
 * Obtém um role por ID
 */
export async function getRoleById(roleId: string): Promise<Role | null> {
  try {
    const result = await db
      .select({
        roleId: rolesTable.id,
        roleName: rolesTable.name,
        roleDescription: rolesTable.description,
        organizationId: rolesTable.organizationId,
        isSystemRole: rolesTable.isSystemRole,
        permissionId: permissionsTable.id,
        permissionSlug: permissionsTable.slug,
        permissionResource: permissionsTable.resource,
        permissionAction: permissionsTable.action,
        permissionDescription: permissionsTable.description,
        isSystemPermission: permissionsTable.isSystemPermission,
      })
      .from(rolesTable)
      .leftJoin(rolesToPermissionsTable, eq(rolesTable.id, rolesToPermissionsTable.roleId))
      .leftJoin(permissionsTable, eq(rolesToPermissionsTable.permissionId, permissionsTable.id))
      .where(eq(rolesTable.id, roleId));

    if (result.length === 0) {
      return null;
    }

    const firstRow = result[0];
    const permissions: Permission[] = result
      .filter(
        (row) =>
          row.permissionId && row.permissionSlug && row.permissionResource && row.permissionAction
      )
      .map((row) => ({
        id: row.permissionId!,
        slug: row.permissionSlug!,
        resource: row.permissionResource!,
        action: row.permissionAction!,
        description: row.permissionDescription,
        isSystemPermission: row.isSystemPermission ?? false,
      }));

    return {
      id: firstRow.roleId,
      name: firstRow.roleName,
      description: firstRow.roleDescription,
      organizationId: firstRow.organizationId,
      isSystemRole: firstRow.isSystemRole,
      permissions,
    };
  } catch (error) {
    console.error("Erro ao obter role por ID:", error);
    return null;
  }
}
