"use client";

import { useState } from "react";
import { useSalesStagePermissions } from "@/hooks/use-sales-stage-permissions";
import {
  SalesStageGuard,
  SalesStageButton,
  AccessibleStagesInfo,
} from "@/components/rbac/sales-stage-guard";
import { SALES_STAGES } from "@/lib/rbac/sales-process-permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Exemplo de uso do sistema RBAC para o processo de vendas
export function SalesProcessRBACExample() {
  const [userId] = useState("user-123"); // Em produção, viria do contexto de autenticação
  const [organizationId] = useState("org-456"); // Em produção, viria do contexto de organização

  const {
    canCreateStage,
    canReadStage,
    canUpdateStage,
    canDeleteStage,
    getAccessibleStages,
    loading,
  } = useSalesStagePermissions({
    userId,
    organizationId,
  });

  if (loading) {
    return <div className="p-6">Carregando permissões...</div>;
  }

  const { editable, viewOnly } = getAccessibleStages();

  const stages = [
    {
      key: SALES_STAGES.STAGE_1,
      name: "Primeiro Contato/Lead",
      description: "Captação e primeiro contato com leads",
    },
    {
      key: SALES_STAGES.STAGE_2,
      name: "Qualificação",
      description: "Avaliação e qualificação de leads",
    },
    { key: SALES_STAGES.STAGE_3, name: "Proposta", description: "Elaboração e envio de propostas" },
    {
      key: SALES_STAGES.STAGE_4,
      name: "Negociação",
      description: "Negociação de termos e condições",
    },
    { key: SALES_STAGES.STAGE_5, name: "Fechamento", description: "Fechamento da venda" },
    {
      key: SALES_STAGES.STAGE_6,
      name: "Contrato",
      description: "Assinatura e formalização do contrato",
    },
    {
      key: SALES_STAGES.STAGE_7,
      name: "Pagamento",
      description: "Processamento e controle de pagamentos",
    },
    {
      key: SALES_STAGES.STAGE_8,
      name: "Pós-venda",
      description: "Atendimento e suporte pós-venda",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sistema RBAC - Processo de Vendas</h1>
        <p className="text-muted-foreground">
          Exemplo de uso do sistema de permissões baseado em roles para as etapas do processo de
          vendas.
        </p>
      </div>

      {/* Informações sobre etapas acessíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Permissões</CardTitle>
          <CardDescription>Etapas do processo de vendas que você pode acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <AccessibleStagesInfo userId={userId} organizationId={organizationId} />
        </CardContent>
      </Card>

      {/* Grid de etapas do processo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const isEditable = editable.includes(stage.key);
          const isViewOnly = viewOnly.includes(stage.key);
          const hasAccess = isEditable || isViewOnly;

          return (
            <Card key={stage.key} className={`${!hasAccess ? "opacity-50" : ""}`}>
              <CardHeader>
                <CardTitle className="text-lg">{stage.name}</CardTitle>
                <CardDescription>{stage.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Badge de status */}
                <div className="flex gap-2">
                  {isEditable && <Badge variant="default">Editável</Badge>}
                  {isViewOnly && <Badge variant="secondary">Visualização</Badge>}
                  {!hasAccess && <Badge variant="outline">Sem Acesso</Badge>}
                </div>

                {/* Botões de ação */}
                <div className="space-y-2">
                  <SalesStageGuard
                    userId={userId}
                    organizationId={organizationId}
                    stage={stage.key}
                    action="create"
                    fallback={null}
                  >
                    <SalesStageButton
                      userId={userId}
                      organizationId={organizationId}
                      stage={stage.key}
                      action="create"
                      size="sm"
                      className="w-full"
                    >
                      Criar
                    </SalesStageButton>
                  </SalesStageGuard>

                  <SalesStageGuard
                    userId={userId}
                    organizationId={organizationId}
                    stage={stage.key}
                    action="read"
                    fallback={null}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Visualizar
                    </Button>
                  </SalesStageGuard>

                  <SalesStageGuard
                    userId={userId}
                    organizationId={organizationId}
                    stage={stage.key}
                    action="update"
                    fallback={null}
                  >
                    <SalesStageButton
                      userId={userId}
                      organizationId={organizationId}
                      stage={stage.key}
                      action="update"
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Editar
                    </SalesStageButton>
                  </SalesStageGuard>

                  <SalesStageGuard
                    userId={userId}
                    organizationId={organizationId}
                    stage={stage.key}
                    action="delete"
                    fallback={null}
                  >
                    <SalesStageButton
                      userId={userId}
                      organizationId={organizationId}
                      stage={stage.key}
                      action="delete"
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      Excluir
                    </SalesStageButton>
                  </SalesStageGuard>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Exemplo de uso programático */}
      <Card>
        <CardHeader>
          <CardTitle>Verificação Programática</CardTitle>
          <CardDescription>Exemplo de como verificar permissões programaticamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Pode criar leads (Etapa 1)?</h4>
              <Badge variant={canCreateStage(SALES_STAGES.STAGE_1) ? "default" : "secondary"}>
                {canCreateStage(SALES_STAGES.STAGE_1) ? "Sim" : "Não"}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Pode editar contratos (Etapa 6)?</h4>
              <Badge variant={canUpdateStage(SALES_STAGES.STAGE_6) ? "default" : "secondary"}>
                {canUpdateStage(SALES_STAGES.STAGE_6) ? "Sim" : "Não"}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Pode visualizar pagamentos (Etapa 7)?</h4>
              <Badge variant={canReadStage(SALES_STAGES.STAGE_7) ? "default" : "secondary"}>
                {canReadStage(SALES_STAGES.STAGE_7) ? "Sim" : "Não"}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Pode gerenciar pós-venda (Etapa 8)?</h4>
              <Badge variant={canDeleteStage(SALES_STAGES.STAGE_8) ? "default" : "secondary"}>
                {canDeleteStage(SALES_STAGES.STAGE_8) ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
