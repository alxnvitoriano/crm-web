"use client";

// Removido imports não utilizados para evitar warnings de linting
import { usePermissions } from "./use-permissions";
import { SALES_STAGES, type SalesStage } from "@/lib/rbac/sales-process-permissions";

interface UseSalesStagePermissionsOptions {
  userId: string;
  organizationId: string;
}

interface UseSalesStagePermissionsReturn {
  loading: boolean;
  error: string | null;
  canCreateStage: (stage: SalesStage) => boolean;
  canUpdateStage: (stage: SalesStage) => boolean;
  canDeleteStage: (stage: SalesStage) => boolean;
  canManageStage: (stage: SalesStage) => boolean;
  hasStagePermission: (
    stage: SalesStage,
    action: "create" | "read" | "update" | "delete"
  ) => boolean;
  getAccessibleStages: () => {
    editable: SalesStage[];
    viewOnly: SalesStage[];
  };
}

export function useSalesStagePermissions({
  userId,
  organizationId,
}: UseSalesStagePermissionsOptions): UseSalesStagePermissionsReturn {
  const { permissions, loading, error } = usePermissions({
    userId,
    organizationId,
  });

  const canCreateStage = (stage: SalesStage): boolean => {
    if (!permissions) return false;
    return permissions.permissions.some((p) => p.slug === `create:${stage}`);
  };

  const canUpdateStage = (stage: SalesStage): boolean => {
    if (!permissions) return false;
    return permissions.permissions.some((p) => p.slug === `update:${stage}`);
  };

  const canDeleteStage = (stage: SalesStage): boolean => {
    if (!permissions) return false;
    return permissions.permissions.some((p) => p.slug === `delete:${stage}`);
  };

  const canManageStage = (stage: SalesStage): boolean => {
    return canCreateStage(stage) && canUpdateStage(stage) && canDeleteStage(stage);
  };

  const hasStagePermission = (
    stage: SalesStage,
    action: "create" | "read" | "update" | "delete"
  ): boolean => {
    if (!permissions) return false;
    return permissions.permissions.some((p) => p.slug === `${action}:${stage}`);
  };

  const getAccessibleStages = () => {
    if (!permissions) return { editable: [], viewOnly: [] };

    const editable: SalesStage[] = [];
    const viewOnly: SalesStage[] = [];

    Object.values(SALES_STAGES).forEach((stage) => {
      const canEdit = canCreateStage(stage) && canUpdateStage(stage);

      if (canEdit) {
        editable.push(stage);
      } else {
        return;
      }
    });

    return { editable, viewOnly };
  };

  return {
    loading,
    error,
    canCreateStage,
    canUpdateStage,
    canDeleteStage,
    canManageStage,
    hasStagePermission,
    getAccessibleStages,
  };
}

// Hook para verificar permissão específica de uma etapa
export function useStagePermission(
  userId: string,
  organizationId: string,
  stage: SalesStage,
  action: "create" | "read" | "update" | "delete"
): { hasPermission: boolean; loading: boolean } {
  const { hasStagePermission, loading } = useSalesStagePermissions({
    userId,
    organizationId,
  });

  return {
    hasPermission: hasStagePermission(stage, action),
    loading,
  };
}

// Hook para obter todas as etapas acessíveis
export function useAccessibleStages(
  userId: string,
  organizationId: string
): { editable: SalesStage[]; viewOnly: SalesStage[]; loading: boolean } {
  const { getAccessibleStages, loading } = useSalesStagePermissions({
    userId,
    organizationId,
  });

  return {
    ...getAccessibleStages(),
    loading,
  };
}
