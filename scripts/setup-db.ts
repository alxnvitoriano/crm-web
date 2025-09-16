#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { runSeeds } from "../src/db/seeds";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL não encontrada nas variáveis de ambiente");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function setupDatabase() {
  try {
    // Executar migrações
    await migrate(db, { migrationsFolder: "./drizzle" });

    // Executar seeds
    const seedResult = await runSeeds();
  } catch (error) {
    console.error("❌ Erro ao configurar banco de dados:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupDatabase();
