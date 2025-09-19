import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dealsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

// GET /api/deals - List all deals for the current organization
export async function GET(request: NextRequest) {
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

    const deals = await db
      .select()
      .from(dealsTable)
      .where(eq(dealsTable.organizationId, organizationId))
      .orderBy(dealsTable.createdAt);

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/deals - Create a new deal
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, client, clientAvatar, value, stage, priority, dueDate, description } = body;

    if (!title || !client || !value || !stage || !priority || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newDeal = await db
      .insert(dealsTable)
      .values({
        organizationId,
        title,
        client,
        clientAvatar,
        value: parseInt(value),
        stage,
        priority,
        dueDate: new Date(dueDate),
        description,
      })
      .returning();

    return NextResponse.json(newDeal[0], { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
