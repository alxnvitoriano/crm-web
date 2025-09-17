import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { organization, member, rolesTable } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 });
    }

    // Verificar se o slug já existe
    const existingOrganization = await db.query.organization.findFirst({
      where: eq(organization.slug, slug),
    });

    if (existingOrganization) {
      return NextResponse.json({ error: "Slug já está em uso" }, { status: 409 });
    }

    // 1. Criar a organização
    const organizationId = createId();
    const newOrganization = await db
      .insert(organization)
      .values({
        id: organizationId,
        name,
        slug,
        createdAt: new Date(),
      })
      .returning();

    // 2. Buscar ou criar o role "Gerente Geral" (role padrão para criadores de organização)
    let ownerRole = await db.query.rolesTable.findFirst({
      where: eq(rolesTable.name, "Gerente Geral"),
    });

    // Se não encontrar o role, criar um role básico de owner
    if (!ownerRole) {
      console.log("Criando role Gerente Geral automaticamente...");
      const createdRole = await db
        .insert(rolesTable)
        .values({
          name: "Gerente Geral",
          description: "Acesso total a todas as funcionalidades da organização",
          isSystemRole: true,
          organizationId: null, // Role global
        })
        .returning();

      ownerRole = createdRole[0];
    }

    // 3. Adicionar o usuário criador como membro da organização
    await db.insert(member).values({
      id: createId(),
      organizationId: organizationId,
      userId: session.user.id,
      roleId: ownerRole.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Definir a nova organização como ativa
    try {
      await auth.api.organization.setActive({
        organizationId: organizationId,
        headers: await headers(),
      });
    } catch (error) {
      console.warn("Erro ao definir organização ativa:", error);
    }

    return NextResponse.json({
      organization: newOrganization[0],
      message: "Organização criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar organização:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
