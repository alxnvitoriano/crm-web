import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { clientsTable, salespersonTable, member, usersTable } from "@/db/schema";
import { eq, and, count, sql, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

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

    const s = alias(salespersonTable, "s");
    const c = alias(clientsTable, "c");

    const ranking = await db
      .select({
        salespersonId: s.id,
        salespersonName: s.name,
        salespersonAvatar: s.avatarImageUrl,
        leadsCount: sql<number>`count(case when ${c.status} = 'lead' then 1 end)`,
        clientsCount: sql<number>`count(case when ${c.status} = 'cliente' then 1 end)`,
      })
      .from(s)
      .leftJoin(c, and(eq(c.salespersonId, s.id), eq(c.companyId, organizationId)))
      .where(
        and(
          eq(s.companyId, organizationId),
          ...(startDate ? [sql`${c.createAt} >= ${startDate}`] : []),
          ...(endDate ? [sql`${c.createAt} <= ${endDate}`] : [])
        )
      )
      .groupBy(s.id, s.name, s.avatarImageUrl)
      .orderBy(desc(count(c.id)));

    return NextResponse.json({
      ranking,
    });
  } catch (error) {
    console.error("Erro ao buscar ranking de vendas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao buscar ranking de vendas" },
      { status: 500 }
    );
  }
}
