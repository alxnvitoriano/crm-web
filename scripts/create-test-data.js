const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function createTestData() {
  // Carregar variáveis de ambiente
  require("dotenv").config();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados");

    // Criar usuário de teste
    const userId = "user-123";
    const orgId = "org-456";

    // Inserir organização de teste
    await client.query(
      `
      INSERT INTO organization (id, name, slug, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (id) DO NOTHING
    `,
      [orgId, "Empresa Teste", "empresa-teste"]
    );

    console.log("✅ Organização criada");

    // Inserir usuário na tabela users_table
    await client.query(
      `
      INSERT INTO users_table (id, name, email, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `,
      [userId, "Usuário Teste", "teste@empresa.com"]
    );

    console.log("✅ Usuário criado");

    // Inserir membro
    await client.query(
      `
      INSERT INTO member (id, organization_id, user_id, role_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `,
      [`member-${userId}`, orgId, userId, "owner-role-id"]
    );

    console.log("✅ Membro criado");

    // Verificar se há roles no sistema
    const roles = await client.query("SELECT id, name FROM roles LIMIT 5");
    console.log("Roles disponíveis:", roles.rows);

    // Se não há roles, criar um role básico
    if (roles.rows.length === 0) {
      const ownerRoleId = "owner-role-id";
      await client.query(
        `
        INSERT INTO roles (id, name, description, is_system_role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `,
        [ownerRoleId, "Owner", "Proprietário da organização", true]
      );

      console.log("✅ Role Owner criado");
    }

    console.log("✅ Dados de teste criados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar dados de teste:", error);
  } finally {
    await client.end();
  }
}

createTestData();
