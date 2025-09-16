import { seedRBAC, isRBACSeeded } from "./rbac-seeds";

export async function runSeeds() {
  try {
    // Verificar se o RBAC já foi populado
    const rbacSeeded = await isRBACSeeded();

    if (!rbacSeeded) {
      const rbacResult = await seedRBAC();
      return {
        success: true,
        rbacSeeded: true,
        rbacResult,
      };
    }

    return {
      success: true,
      rbacSeeded: false,
    };
  } catch (error) {
    console.error("❌ Erro ao executar seeds:", error);
    throw error;
  }
}

// Executar seeds se este arquivo for chamado diretamente
if (require.main === module) {
  runSeeds()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro ao executar seeds:", error);
      process.exit(1);
    });
}
