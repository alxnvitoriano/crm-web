"use client";

import { ReactNode } from "react";
import { useSalesStagePermissions } from "@/hooks/use-sales-stage-permissions";
import { type SalesStage } from "@/lib/rbac/sales-process-permissions";

interface SalesStageGuardProps {
  userId: string;
  organizationId: string;
  stage: SalesStage;
  action: "create" | "read" | "update" | "delete";
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function SalesStageGuard({
  userId,
  organizationId,
  stage,
  action,
  children,
  fallback = null,
  loading = <div>Carregando...</div>,
}: SalesStageGuardProps) {
  const { hasStagePermission, loading: isLoading } = useSalesStagePermissions({
    userId,
    organizationId,
  });

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!hasStagePermission(stage, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface SalesStageButtonProps extends Omit<SalesStageGuardProps, "children"> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SalesStageButton({
  userId,
  organizationId,
  stage,
  action,
  children,
  fallback = null,
  loading = <div>Carregando...</div>,
  className,
  onClick,
  disabled,
  variant = "default",
  size = "default",
}: SalesStageButtonProps) {
  const { hasStagePermission, loading: isLoading } = useSalesStagePermissions({
    userId,
    organizationId,
  });

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!hasStagePermission(stage, action)) {
    return <>{fallback}</>;
  }

  // Importar Button dinamicamente para evitar problemas de SSR
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Button = require("@/components/ui/button").Button;

  return (
    <Button
      className={className}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size={size}
    >
      {children}
    </Button>
  );
}

// Componente para mostrar informações sobre as etapas acessíveis
interface AccessibleStagesInfoProps {
  userId: string;
  organizationId: string;
}

export function AccessibleStagesInfo({ userId, organizationId }: AccessibleStagesInfoProps) {
  const { editable, viewOnly, loading } = useSalesStagePermissions({
    userId,
    organizationId,
  });

  if (loading) {
    return <div>Carregando permissões...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Etapas Editáveis</h3>
        {editable.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {editable.map((stage) => (
              <li key={stage} className="text-green-600">
                {getStageDisplayName(stage)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhuma etapa editável</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Etapas Apenas Visualização</h3>
        {viewOnly.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {viewOnly.map((stage) => (
              <li key={stage} className="text-blue-600">
                {getStageDisplayName(stage)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhuma etapa em visualização</p>
        )}
      </div>
    </div>
  );
}

// Função auxiliar para obter o nome de exibição da etapa
function getStageDisplayName(stage: SalesStage): string {
  const stageNames: Record<SalesStage, string> = {
    stage_1: "Etapa 1 - Primeiro Contato/Lead",
    stage_2: "Etapa 2 - Qualificação",
    stage_3: "Etapa 3 - Proposta",
    stage_4: "Etapa 4 - Negociação",
    stage_5: "Etapa 5 - Fechamento",
    stage_6: "Etapa 6 - Contrato",
    stage_7: "Etapa 7 - Pagamento",
    stage_8: "Etapa 8 - Pós-venda",
  };

  return stageNames[stage] || stage;
}
