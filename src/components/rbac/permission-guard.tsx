"use client";

import { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

interface PermissionGuardProps {
  userId: string;
  organizationId: string;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // Se true, requer todas as permissões; se false, requer qualquer uma
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  userId,
  organizationId,
  permission,
  permissions,
  requireAll = false,
  fallback,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, loading, error } = usePermissions({
    userId,
    organizationId,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>Erro ao verificar permissões: {error}</AlertDescription>
      </Alert>
    );
  }

  let hasRequiredPermission = false;

  if (permission) {
    hasRequiredPermission = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasRequiredPermission = permissions.every((p) => hasPermission(p));
    } else {
      hasRequiredPermission = hasAnyPermission(permissions);
    }
  } else {
    // Se não especificou permissões, sempre permite
    hasRequiredPermission = true;
  }

  if (!hasRequiredPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert>
        <ShieldX className="h-4 w-4" />
        <AlertDescription>Você não tem permissão para acessar este recurso.</AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

// Componente específico para botões
interface PermissionButtonProps extends PermissionGuardProps {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function PermissionButton({
  userId,
  organizationId,
  permission,
  permissions,
  requireAll = false,
  fallback,
  className,
  disabled,
  onClick,
  children,
}: PermissionButtonProps) {
  const { hasPermission, hasAnyPermission, loading } = usePermissions({
    userId,
    organizationId,
  });

  if (loading) {
    return (
      <button className={`${className} opacity-50 cursor-not-allowed`} disabled>
        {children}
      </button>
    );
  }

  let hasRequiredPermission = false;

  if (permission) {
    hasRequiredPermission = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasRequiredPermission = permissions.every((p) => hasPermission(p));
    } else {
      hasRequiredPermission = hasAnyPermission(permissions);
    }
  } else {
    hasRequiredPermission = true;
  }

  if (!hasRequiredPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return null; // Não renderiza o botão se não tem permissão
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

// Componente para mostrar informações de permissão
interface PermissionInfoProps {
  userId: string;
  organizationId: string;
  className?: string;
}

export function PermissionInfo({ userId, organizationId, className }: PermissionInfoProps) {
  const { permissions, loading, error } = usePermissions({
    userId,
    organizationId,
  });

  if (loading) {
    return <div className={className}>Carregando permissões...</div>;
  }

  if (error) {
    return <div className={className}>Erro ao carregar permissões: {error}</div>;
  }

  if (!permissions) {
    return <div className={className}>Nenhuma permissão encontrada</div>;
  }

  return (
    <div className={className}>
      <h3 className="font-semibold">Role: {permissions.role.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{permissions.role.description}</p>
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Permissões:</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {permissions.permissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{permission.slug}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
