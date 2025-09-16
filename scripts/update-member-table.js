const { Client } = require("pg");

// Carregar variáveis de ambiente
require("dotenv").config();

async function updateMemberTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados");

    // Verificar se a coluna role_id já existe
    const columnCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'member' AND column_name = 'role_id';
    `);

    if (columnCheck.rows.length > 0) {
      console.log("✅ Coluna role_id já existe");
      return;
    }

    console.log("🔄 Atualizando estrutura da tabela member...");

    // Adicionar coluna role_id
    await client.query(`
      ALTER TABLE member ADD COLUMN role_id uuid;
    `);
    console.log("✅ Coluna role_id adicionada");

    // Buscar roles existentes para mapear
    const roles = await client.query("SELECT id, name FROM roles");
    console.log(`📋 Encontrados ${roles.rows.length} roles`);

    // Criar um mapa de nome do role para ID
    const roleMap = {};
    roles.rows.forEach((role) => {
      // Mapear nomes de roles comuns
      if (role.name.toLowerCase().includes("owner")) {
        roleMap["owner"] = role.id;
      } else if (role.name.toLowerCase().includes("admin")) {
        roleMap["admin"] = role.id;
      } else if (role.name.toLowerCase().includes("vendedor")) {
        roleMap["member"] = role.id;
      }
    });

    // Usar o primeiro role como padrão se não conseguir mapear
    const defaultRoleId = roles.rows.length > 0 ? roles.rows[0].id : null;

    if (!defaultRoleId) {
      console.log("❌ Nenhum role encontrado. Criando role padrão...");
      // Criar um role padrão
      const defaultRoleResult = await client.query(`
        INSERT INTO roles (id, name, description, is_system_role, created_at, updated_at)
        VALUES (gen_random_uuid(), 'Member', 'Membro padrão', true, NOW(), NOW())
        RETURNING id;
      `);
      roleMap["default"] = defaultRoleResult.rows[0].id;
    }

    // Atualizar registros existentes
    const members = await client.query("SELECT id, role FROM member");
    console.log(`👥 Atualizando ${members.rows.length} membros...`);

    for (const member of members.rows) {
      let roleId = defaultRoleId;

      // Tentar mapear o role existente
      if (member.role) {
        const roleName = member.role.toLowerCase();
        if (roleMap[roleName]) {
          roleId = roleMap[roleName];
        } else if (roleName.includes("owner") && roleMap["owner"]) {
          roleId = roleMap["owner"];
        } else if (roleName.includes("admin") && roleMap["admin"]) {
          roleId = roleMap["admin"];
        } else if (roleName.includes("vendedor") || roleName.includes("member")) {
          roleId = roleMap["member"] || defaultRoleId;
        }
      }

      if (roleId) {
        await client.query(
          `
          UPDATE member SET role_id = $1 WHERE id = $2
        `,
          [roleId, member.id]
        );
      }
    }

    console.log("✅ Membros atualizados");

    // Tornar role_id NOT NULL
    await client.query(`
      ALTER TABLE member ALTER COLUMN role_id SET NOT NULL;
    `);
    console.log("✅ Coluna role_id definida como NOT NULL");

    // Adicionar foreign key
    await client.query(`
      ALTER TABLE member
      ADD CONSTRAINT member_role_id_roles_id_fk
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;
    `);
    console.log("✅ Foreign key adicionada");

    // Adicionar coluna updated_at se não existir
    const updatedAtCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'member' AND column_name = 'updated_at';
    `);

    if (updatedAtCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE member ADD COLUMN updated_at timestamp DEFAULT now();
      `);
      console.log("✅ Coluna updated_at adicionada");
    }

    // Remover coluna role antiga (opcional - manter para backup)
    // await client.query(`ALTER TABLE member DROP COLUMN role;`);
    // console.log("✅ Coluna role antiga removida");

    console.log("🎉 Tabela member atualizada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar tabela member:", error);
  } finally {
    await client.end();
  }
}

updateMemberTable();
