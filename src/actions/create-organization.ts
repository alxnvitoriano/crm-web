"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { organization, member, rolesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const createOrganization = async (name: string, slug: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  // Gerar ID para a organização
  const orgId = crypto.randomUUID();

  // Criar a organização
  const [org] = await db
    .insert(organization)
    .values({
      id: orgId,
      name,
      slug,
      createdAt: new Date(),
    })
    .returning();

  // Buscar o role "Owner"
  const ownerRole = await db.query.rolesTable.findFirst({
    where: eq(rolesTable.name, "Owner"),
  });

  if (!ownerRole) {
    throw new Error("Role Owner não encontrado");
  }

  // Gerar ID para o membro
  const memberId = crypto.randomUUID();

  // Adicionar o usuário criador como membro com role Owner
  await db.insert(member).values({
    id: memberId,
    organizationId: org.id,
    userId: session.user.id,
    roleId: ownerRole.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return org;
};
