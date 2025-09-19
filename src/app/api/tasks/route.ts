import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

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

    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.organizationId, organizationId))
      .orderBy(tasksTable.createdAt);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const { title, description, dueDate, dueTime, priority, assignedTo, category } = body;

    if (!title || !dueDate || !dueTime || !priority || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTask = await db
      .insert(tasksTable)
      .values({
        organizationId,
        title,
        description,
        dueDate,
        dueTime,
        priority,
        assignedTo,
        category,
        status: "pendente",
      })
      .returning();

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
