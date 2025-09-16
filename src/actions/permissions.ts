"use server";

import { hasPermission, hasAnyPermission, getUserPermissions } from "@/lib/rbac/permissions";

export async function checkPermissionServer(
  userId: string,
  organizationId: string,
  permissionSlug: string
): Promise<boolean> {
  try {
    return await hasPermission(userId, organizationId, permissionSlug);
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    return false;
  }
}

export async function checkAnyPermissionServer(
  userId: string,
  organizationId: string,
  permissionSlugs: string[]
): Promise<boolean> {
  try {
    return await hasAnyPermission(userId, organizationId, permissionSlugs);
  } catch (error) {
    console.error("Erro ao verificar permissões:", error);
    return false;
  }
}

export async function getUserPermissionsServer(userId: string, organizationId: string) {
  try {
    return await getUserPermissions(userId, organizationId);
  } catch (error) {
    console.error("Erro ao obter permissões do usuário:", error);
    return null;
  }
}
