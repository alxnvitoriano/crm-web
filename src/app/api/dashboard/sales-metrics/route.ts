import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { clientsTable, salespersonTable, appointmentsTable, member } from "@/db/schema";
import { eq, and, count, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (!organizationId) {
      return NextResponse.json({ error: "ID da organização é obrigatório" }, { status: 400 });
    }

    // Verificar se o usuário pertence à organização
    const userMember = await db.query.member.findFirst({
      where: and(eq(member.userId, session.user.id), eq(member.organizationId, organizationId)),
    });

    if (!userMember) {
      return NextResponse.json({ error: "Acesso negado à organização" }, { status: 403 });
    }

    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    // 1. Quantidade de Leads Recebidos por Vendedor
    const leadsBySalesperson = await db
      .select({
        salespersonId: clientsTable.salespersonId,
        salespersonName: salespersonTable.name,
        count: count(clientsTable.id),
      })
      .from(clientsTable)
      .innerJoin(salespersonTable, eq(clientsTable.salespersonId, salespersonTable.id))
      .where(
        and(
          eq(clientsTable.companyId, organizationId),
          eq(clientsTable.status, "lead"),
          ...(startDate ? [sql`${clientsTable.createAt} >= ${startDate}`] : []),
          ...(endDate ? [sql`${clientsTable.createAt} <= ${endDate}`] : [])
        )
      )
      .groupBy(clientsTable.salespersonId, salespersonTable.name);

    // 2. Conversão de Agendamentos
    const totalClients = await db
      .select({ count: count(clientsTable.id) })
      .from(clientsTable)
      .where(
        and(
          eq(clientsTable.companyId, organizationId),
          ...(startDate ? [sql`${clientsTable.createAt} >= ${startDate}`] : []),
          ...(endDate ? [sql`${clientsTable.createAt} <= ${endDate}`] : [])
        )
      );

    const clientsWithAppointments = await db
      .select({ count: count(clientsTable.id) })
      .from(clientsTable)
      .innerJoin(appointmentsTable, eq(clientsTable.id, appointmentsTable.clientId))
      .where(
        and(
          eq(clientsTable.companyId, organizationId),
          ...(startDate ? [sql`${clientsTable.createAt} >= ${startDate}`] : []),
          ...(endDate ? [sql`${clientsTable.createAt} <= ${endDate}`] : [])
        )
      );

    const appointmentConversion =
      totalClients[0]?.count > 0
        ? (clientsWithAppointments[0]?.count / totalClients[0]?.count) * 100
        : 0;

    // 3. Quantidade de Clientes
    const clientCountResult = await db
      .select({ count: count(clientsTable.id) })
      .from(clientsTable)
      .where(
        and(
          eq(clientsTable.companyId, organizationId),
          eq(clientsTable.status, "cliente"),
          ...(startDate ? [sql`${clientsTable.createAt} >= ${startDate}`] : []),
          ...(endDate ? [sql`${clientsTable.createAt} <= ${endDate}`] : [])
        )
      );
    const clientCount = clientCountResult[0]?.count || 0;

    // TODO: Adicionar as seguintes métricas quando o schema for atualizado:
    // CONVERSÃO DE ATENDIMENTO: (requer status de atendimento)
    // CONVERSÃO DE FECHAMENTO: (requer status de negociação/venda)
    // QUANTIDADE DE COTAS: (requer tabela de cotas)
    // VALOR VENDIDO: (requer valor da cota/venda)
    // TICKET MÉDIO: (requer valor vendido)

    return NextResponse.json({
      leadsReceivedBySalesperson: leadsBySalesperson,
      appointmentConversion,
      clientCount,
    });
  } catch (error) {
    console.error("Erro ao buscar métricas de vendas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao buscar métricas de vendas" },
      { status: 500 }
    );
  }
}
