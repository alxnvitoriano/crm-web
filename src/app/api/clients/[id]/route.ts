import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const clientId = params.id;
    const body = await request.json();
    const { name, email, phone, status } = body;

    if (!name || !email || !status) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, email, status" },
        { status: 400 }
      );
    }

    // Atualizar cliente
    const [updatedClient] = await db
      .update(clientsTable)
      .set({
        name,
        email,
        phone: phone || null,
        status,
      })
      .where(eq(clientsTable.id, clientId))
      .returning();

    if (!updatedClient) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Cliente atualizado com sucesso",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const clientId = params.id;

    // Deletar cliente
    const result = await db
      .delete(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .returning({ id: clientsTable.id });

    if (result.length === 0) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cliente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
