import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dealsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

// GET /api/deals/[id] - Get a specific deal
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.session as any).activeOrganizationId;

    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const { id } = params;

    const deal = await db.select().from(dealsTable).where(eq(dealsTable.id, id)).limit(1);

    if (!deal.length) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Check if deal belongs to user's organization
    if (deal[0].organizationId !== organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(deal[0]);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/deals/[id] - Update a specific deal
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.session as any).activeOrganizationId;

    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const { id } = params;

    // Check if deal exists and belongs to user's organization
    const existingDeal = await db.select().from(dealsTable).where(eq(dealsTable.id, id)).limit(1);

    if (!existingDeal.length) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    if (existingDeal[0].organizationId !== organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, client, clientAvatar, value, stage, priority, dueDate, description } = body;

    const updatedDeal = await db
      .update(dealsTable)
      .set({
        title,
        client,
        clientAvatar,
        value: value ? parseInt(value) : undefined,
        stage,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        description,
        updatedAt: new Date(),
      })
      .where(eq(dealsTable.id, id))
      .returning();

    return NextResponse.json(updatedDeal[0]);
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/deals/[id] - Delete a specific deal
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.session as any).activeOrganizationId;

    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const { id } = params;

    // Check if deal exists and belongs to user's organization
    const existingDeal = await db.select().from(dealsTable).where(eq(dealsTable.id, id)).limit(1);

    if (!existingDeal.length) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    if (existingDeal[0].organizationId !== organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(dealsTable).where(eq(dealsTable.id, id));

    return NextResponse.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
