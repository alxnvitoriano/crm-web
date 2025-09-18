"use client";

import { useState, useEffect } from "react";
import { checkPermissionServer, checkAnyPermissionServer } from "@/actions/permissions";
import type { UserPermissions } from "@/lib/rbac/permissions";

interface UsePermissionsOptions {
  userId: string;
  organizationId: string;
}

interface UsePermissionsReturn {
  permissions: UserPermissions | null;
  loading: boolean;
  error: string | null;
  hasPermission: (permissionSlug: string) => boolean;
  hasAnyPermission: (permissionSlugs: string[]) => boolean;
  canCreate: (resource: string) => boolean;
  canUpdate: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canManage: (resource: string) => boolean;
}

export function usePermissions({
  userId,
  organizationId,
}: UsePermissionsOptions): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Evita loop: se não houver IDs, não altera estados aqui
    if (!userId || !organizationId) return;

    let aborted = false;
    const loadPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar via endpoint REST para evitar hidratação mista
        const res = await fetch(
          `/api/permissions/user?userId=${encodeURIComponent(userId)}&organizationId=${encodeURIComponent(
            organizationId
          )}`,
          { cache: "no-store", credentials: "include" }
        );
        const userPermissions = await res.json();
        if (!aborted) setPermissions(userPermissions);
      } catch (err) {
        console.error("Erro ao carregar permissões:", err);
        if (!aborted) setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    loadPermissions();

    return () => {
      // Evitar setState após unmount
      // e durante mudanças rápidas de org/usuário
      // que poderiam causar loops de atualização
      // devido a race conditions.
      aborted = true;
    };
  }, [userId, organizationId]);

  const checkPermission = (permissionSlug: string): boolean => {
    if (!permissions) return false;
    return permissions.permissions.some((p) => p.slug === permissionSlug);
  };

  const checkAnyPermission = (permissionSlugs: string[]): boolean => {
    if (!permissions) return false;
    return permissionSlugs.some((slug) => checkPermission(slug));
  };

  const canCreate = (resource: string): boolean => {
    return checkPermission(`create:${resource}`);
  };

  const canUpdate = (resource: string): boolean => {
    return checkPermission(`update:${resource}`);
  };

  const canDelete = (resource: string): boolean => {
    return checkPermission(`delete:${resource}`);
  };

  const canManage = (resource: string): boolean => {
    return checkAnyPermission([
      `create:${resource}`,
      `read:${resource}`,
      `update:${resource}`,
      `delete:${resource}`,
    ]);
  };

  return {
    permissions,
    loading,
    error,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    canCreate,
    canUpdate,
    canDelete,
    canManage,
  };
}

// Hook simplificado para verificar uma permissão específica
export function useHasPermission(
  userId: string,
  organizationId: string,
  permissionSlug: string
): { hasPermission: boolean; loading: boolean } {
  const [hasPermissionState, setHasPermissionState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !organizationId || !permissionSlug) {
      setLoading(false);
      return;
    }

    const checkPermission = async () => {
      try {
        setLoading(true);
        const result = await checkPermissionServer(userId, organizationId, permissionSlug);
        setHasPermissionState(result);
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        setHasPermissionState(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [userId, organizationId, permissionSlug]);

  return { hasPermission: hasPermissionState, loading };
}

// Hook para verificar múltiplas permissões
export function useHasAnyPermission(
  userId: string,
  organizationId: string,
  permissionSlugs: string[]
): { hasAnyPermission: boolean; loading: boolean } {
  const [hasAnyPermissionState, setHasAnyPermissionState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !organizationId || permissionSlugs.length === 0) {
      setLoading(false);
      return;
    }

    const checkPermissions = async () => {
      try {
        setLoading(true);
        const result = await checkAnyPermissionServer(userId, organizationId, permissionSlugs);
        setHasAnyPermissionState(result);
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setHasAnyPermissionState(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [userId, organizationId, permissionSlugs.join(",")]);

  return { hasAnyPermission: hasAnyPermissionState, loading };
}
