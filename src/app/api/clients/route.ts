import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clientsTable, salespersonTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import * as schema from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter a company do usuário através da relação usersToCompanyTable
    const userCompanys = await db.query.usersToCompanyTable.findMany({
      where: eq(schema.usersToCompanyTable.userId, session.user.id),
      with: {
        company: true,
      },
    });

    const userCompany = userCompanys[0];

    if (!userCompany) {
      return NextResponse.json(
        { error: "Usuário não está associado a nenhuma empresa" },
        { status: 400 }
      );
    }

    const companyId = userCompany.companyId;

    // Buscar clientes da organização
    const clients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
        email: clientsTable.email,
        phone: clientsTable.phone,
        status: clientsTable.status,
        companyId: clientsTable.companyId,
        salespersonId: clientsTable.salespersonId,
        createdAt: clientsTable.createAt,
        updatedAt: clientsTable.updateAt,
        salesperson: {
          name: salespersonTable.name,
          email: salespersonTable.email,
        },
      })
      .from(clientsTable)
      .leftJoin(salespersonTable, eq(clientsTable.salespersonId, salespersonTable.id))
      .where(eq(clientsTable.companyId, companyId))
      .orderBy(clientsTable.createAt);

    // Transformar os dados para o formato esperado pelo frontend
    const formattedClients = clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      company: client.salesperson?.name || "Não atribuído",
      status: client.status as "ativo" | "inativo" | "lead" | "cliente",
      avatar: undefined, // Por enquanto sem avatar
      createdAt: client.createdAt ? new Date(client.createdAt) : null,
      updatedAt: client.updatedAt ? new Date(client.updatedAt) : null,
      companyId: client.companyId,
      salespersonId: client.salespersonId,
    }));

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, status } = body;

    if (!name || !email || !status) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, email, status" },
        { status: 400 }
      );
    }

    // Obter a company do usuário através da relação usersToCompanyTable
    const userCompanys = await db.query.usersToCompanyTable.findMany({
      where: eq(schema.usersToCompanyTable.userId, session.user.id),
      with: {
        company: true,
      },
    });

    const userCompany = userCompanys[0];

    if (!userCompany) {
      return NextResponse.json(
        { error: "Usuário não está associado a nenhuma empresa" },
        { status: 400 }
      );
    }

    const companyId = userCompany.companyId;

    // Verificar se já existe um cliente com este email na empresa
    const existingClient = await db
      .select()
      .from(clientsTable)
      .where(and(eq(clientsTable.email, email), eq(clientsTable.companyId, companyId)))
      .limit(1);

    if (existingClient.length > 0) {
      return NextResponse.json(
        { error: "Já existe um cliente com este email nesta empresa" },
        { status: 409 }
      );
    }

    // Buscar ou criar um salesperson da mesma empresa
    let salespersonId;

    // Tentar encontrar um salesperson da mesma empresa
    const existingSalesperson = await db
      .select()
      .from(salespersonTable)
      .where(eq(salespersonTable.companyId, companyId))
      .limit(1);

    if (existingSalesperson.length > 0) {
      salespersonId = existingSalesperson[0].id;
    } else {
      // Criar um salesperson automaticamente para o usuário atual
      const [newSalesperson] = await db
        .insert(salespersonTable)
        .values({
          name: session.user.name,
          email: session.user.email,
          companyId,
        })
        .returning();

      salespersonId = newSalesperson.id;
    }

    // Criar o cliente
    const [newClient] = await db
      .insert(clientsTable)
      .values({
        name,
        email,
        phone: phone || null,
        status,
        companyId,
        salespersonId,
      })
      .returning();

    return NextResponse.json({
      message: "Cliente criado com sucesso",
      client: {
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        status: newClient.status,
        companyId: newClient.companyId,
        salespersonId: newClient.salespersonId,
        createdAt: newClient.createAt,
        updatedAt: newClient.updateAt,
      },
    });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
