import { db } from "./index"; // ajuste para o caminho do seu db
import * as schema from "./schema";
import { randomUUID } from "crypto";

async function main() {
  // --- 1️⃣ Roles ---
  const roles = [
    { id: randomUUID(), name: "GERENTE_GERAL" },
    { id: randomUUID(), name: "ADMINISTRATIVO" },
    { id: randomUUID(), name: "POS_VENDA" },
    { id: randomUUID(), name: "GERENTE_DE_VENDAS" },
    { id: randomUUID(), name: "VENDEDOR" },
  ];

  await db.insert(schema.rolesTable).values(roles);

  // --- 2️⃣ Stages / Etapas ---
  const stages = [
    { id: randomUUID(), name: "LEAD", order: "1" },
    { id: randomUUID(), name: "LEVANTAMENTO_DE_NECESSIDADE", order: "2" },
    { id: randomUUID(), name: "ATENDIMENTO_NEGOCIACAO", order: "3" },
    { id: randomUUID(), name: "ANALISE_APROVACAO", order: "4" },
    { id: randomUUID(), name: "FECHAMENTO", order: "5" },
    { id: randomUUID(), name: "CONFIRMAR_VENDA", order: "6" },
    { id: randomUUID(), name: "CONTROLE_DE_QUALIDADE", order: "7" },
    { id: randomUUID(), name: "POS_VENDA", order: "8" },
  ];

  await db.insert(schema.stagesTable).values(stages);

  // --- 3️⃣ RoleStagePermissions ---
  const roleStagePermissions = [];

  // GERENTE GERAL: acesso total (editar e visualizar todas as etapas)
  for (const stage of stages) {
    roleStagePermissions.push({
      id: randomUUID(),
      roleId: roles.find((r) => r.name === "GERENTE_GERAL")!.id,
      stageId: stage.id,
      canView: true,
      canEdit: true,
    });
  }

  // ADMINISTRATIVO: etapas 4 a 7 (ANALISE_APROVACAO, FECHAMENTO, CONFIRMAR_VENDA, CONTROLE_DE_QUALIDADE)
  const administrativoStages = stages.slice(3, 7); // index 3 a 6
  for (const stage of administrativoStages) {
    roleStagePermissions.push({
      id: randomUUID(),
      roleId: roles.find((r) => r.name === "ADMINISTRATIVO")!.id,
      stageId: stage.id,
      canView: true,
      canEdit: true,
    });
  }

  // POS_VENDA: apenas etapa 8
  const posVendaStage = stages.find((s) => s.order === "8")!;
  roleStagePermissions.push({
    id: randomUUID(),
    roleId: roles.find((r) => r.name === "POS_VENDA")!.id,
    stageId: posVendaStage.id,
    canView: true,
    canEdit: true,
  });

  // GERENTE DE VENDAS: acesso total para a equipe dele (etapas 1 a 8)
  for (const stage of stages) {
    roleStagePermissions.push({
      id: randomUUID(),
      roleId: roles.find((r) => r.name === "GERENTE_DE_VENDAS")!.id,
      stageId: stage.id,
      canView: true,
      canEdit: true,
    });
  }

  // VENDEDOR: etapas 1 a 4 editáveis, etapas 5 a 7 visíveis
  const vendedorEditStages = stages.slice(0, 4); // 1 a 4
  const vendedorViewStages = stages.slice(4, 7); // 5 a 7
  for (const stage of vendedorEditStages) {
    roleStagePermissions.push({
      id: randomUUID(),
      roleId: roles.find((r) => r.name === "VENDEDOR")!.id,
      stageId: stage.id,
      canView: true,
      canEdit: true,
    });
  }
  for (const stage of vendedorViewStages) {
    roleStagePermissions.push({
      id: randomUUID(),
      roleId: roles.find((r) => r.name === "VENDEDOR")!.id,
      stageId: stage.id,
      canView: true,
      canEdit: false,
    });
  }
  // Etapa 8 (POS_VENDA) também visível
  roleStagePermissions.push({
    id: randomUUID(),
    roleId: roles.find((r) => r.name === "VENDEDOR")!.id,
    stageId: posVendaStage.id,
    canView: true,
    canEdit: false,
  });

  await db.insert(schema.roleStagePermissionsTable).values(roleStagePermissions);

  console.log("✅ Seed de roles, stages e permissions concluído!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());
