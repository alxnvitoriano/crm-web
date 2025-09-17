import { seedRBAC, isRBACSeeded } from "../src/db/seeds/rbac-seeds.ts";

async function main() {
  try {
    console.warn("🔍 Verificando se o RBAC já foi populado...");

    const alreadySeeded = await isRBACSeeded();

    if (alreadySeeded) {
      console.warn("✅ RBAC já foi populado anteriormente.");
      return;
    }

    console.warn("🌱 Iniciando seed do RBAC...");

    const result = await seedRBAC();

    console.warn("✅ RBAC populado com sucesso!");
    console.warn(`📊 Estatísticas:`);
    console.warn(`   - Permissões: ${result.permissions}`);
    console.warn(`   - Roles: ${result.roles}`);
    console.warn(`   - Associações: ${result.mappings}`);
  } catch (error) {
    console.error("❌ Erro ao executar seed do RBAC:", error);
    process.exit(1);
  }
}

main();
