const { Client } = require("pg");

// Carregar variáveis de ambiente
require("dotenv").config();

async function checkTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados");

    // Verificar tabelas existentes
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("\n📋 Tabelas existentes:");
    result.rows.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    // Verificar estrutura da tabela member se ela existir
    const memberExists = result.rows.some((row) => row.table_name === "member");
    if (memberExists) {
      console.log("\n🔍 Estrutura da tabela member:");
      const memberStructure = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'member' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);

      memberStructure.rows.forEach((col) => {
        console.log(
          `- ${col.column_name}: ${col.data_type} ${col.is_nullable === "YES" ? "(nullable)" : "(not null)"}`
        );
      });
    } else {
      console.log("\n❌ Tabela 'member' não existe!");
    }

    // Verificar tabelas RBAC
    const rbacTables = ["roles", "permissions", "roles_to_permissions"];
    console.log("\n🔐 Status das tabelas RBAC:");
    rbacTables.forEach((table) => {
      const exists = result.rows.some((row) => row.table_name === table);
      console.log(`- ${table}: ${exists ? "✅ Existe" : "❌ Não existe"}`);
    });
  } catch (error) {
    console.error("❌ Erro ao verificar tabelas:", error);
  } finally {
    await client.end();
  }
}

checkTables();
