import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notificationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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
    const userId = session.user.id;

    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.organizationId, organizationId),
          eq(notificationsTable.userId, userId)
        )
      )
      .orderBy(notificationsTable.createdAt);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
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
    const userId = session.user.id;

    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, time } = body;

    if (!title || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newNotification = await db
      .insert(notificationsTable)
      .values({
        organizationId,
        userId,
        title,
        description,
        time,
        unread: true,
      })
      .returning();

    return NextResponse.json(newNotification[0], { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
