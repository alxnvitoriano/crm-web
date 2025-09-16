const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function createRBACtables() {
  // Carregar variáveis de ambiente
  require("dotenv").config();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados");

    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, "create-rbac-tables.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Executar SQL
    await client.query(sql);
    console.log("✅ Tabelas RBAC criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas RBAC:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createRBACtables();
