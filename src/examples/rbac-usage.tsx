"use client";

import {
  PermissionGuard,
  PermissionButton,
  PermissionInfo,
} from "@/components/rbac/permission-guard";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Exemplo de uso do sistema RBAC
export function RBACUsageExample() {
  // Dados do usuário (normalmente viriam do contexto de autenticação)
  const userId = "user-123";
  const organizationId = "org-456";

  const { permissions, loading, canCreate, canRead, canUpdate, canDelete } = usePermissions({
    userId,
    organizationId,
  });

  if (loading) {
    return <div>Carregando permissões...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Sistema RBAC - Exemplo de Uso</h1>

      {/* Informações do usuário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <PermissionInfo userId={userId} organizationId={organizationId} />
        </CardContent>
      </Card>

      {/* Exemplo de proteção de conteúdo */}
      <Card>
        <CardHeader>
          <CardTitle>Proteção de Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conteúdo protegido por permissão específica */}
          <PermissionGuard
            userId={userId}
            organizationId={organizationId}
            permission="create:client"
          >
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              ✅ Você pode criar clientes
            </div>
          </PermissionGuard>

          {/* Conteúdo protegido por múltiplas permissões (qualquer uma) */}
          <PermissionGuard
            userId={userId}
            organizationId={organizationId}
            permissions={["read:reports", "export:reports"]}
            requireAll={false}
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              ✅ Você pode visualizar ou exportar relatórios
            </div>
          </PermissionGuard>

          {/* Conteúdo protegido por múltiplas permissões (todas) */}
          <PermissionGuard
            userId={userId}
            organizationId={organizationId}
            permissions={["create:user", "update:user", "delete:user"]}
            requireAll={true}
          >
            <div className="p-4 bg-purple-50 border border-purple-200 rounded">
              ✅ Você tem permissão completa para gerenciar usuários
            </div>
          </PermissionGuard>

          {/* Fallback personalizado */}
          <PermissionGuard
            userId={userId}
            organizationId={organizationId}
            permission="delete:organization"
            fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                ❌ Você não pode excluir organizações
              </div>
            }
          >
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              ✅ Você pode excluir organizações
            </div>
          </PermissionGuard>
        </CardContent>
      </Card>

      {/* Exemplo de botões condicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Botões Condicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-x-2">
          <PermissionButton
            userId={userId}
            organizationId={organizationId}
            permission="create:client"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Criar Cliente
          </PermissionButton>

          <PermissionButton
            userId={userId}
            organizationId={organizationId}
            permission="update:client"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Editar Cliente
          </PermissionButton>

          <PermissionButton
            userId={userId}
            organizationId={organizationId}
            permission="delete:client"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Excluir Cliente
          </PermissionButton>
        </CardContent>
      </Card>

      {/* Exemplo de verificação programática */}
      <Card>
        <CardHeader>
          <CardTitle>Verificação Programática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <span>Pode criar clientes:</span>
            <span className={canCreate("client") ? "text-green-600" : "text-red-600"}>
              {canCreate("client") ? "✅ Sim" : "❌ Não"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Pode ler relatórios:</span>
            <span className={canRead("reports") ? "text-green-600" : "text-red-600"}>
              {canRead("reports") ? "✅ Sim" : "❌ Não"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Pode atualizar usuários:</span>
            <span className={canUpdate("user") ? "text-green-600" : "text-red-600"}>
              {canUpdate("user") ? "✅ Sim" : "❌ Não"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Pode excluir organizações:</span>
            <span className={canDelete("organization") ? "text-green-600" : "text-red-600"}>
              {canDelete("organization") ? "✅ Sim" : "❌ Não"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Exemplo de lista de permissões */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          {permissions && (
            <div className="space-y-2">
              <h4 className="font-medium">Role: {permissions.role.name}</h4>
              <p className="text-sm text-gray-600">{permissions.role.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {permissions.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{permission.slug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
