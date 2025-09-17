import { NextResponse } from "next/server";
import { db } from "@/db";
import { rolesTable, organization, member } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Tentar uma query simples para testar a conexão
    const roles = await db.select().from(rolesTable).limit(5);
    const organizations = await db.select().from(organization).limit(5);
    const members = await db.select().from(member).limit(5);

    return NextResponse.json({
      status: "Database connection OK",
      data: {
        roles: roles.length,
        organizations: organizations.length,
        members: members.length,
        sample: {
          roles: roles,
          organizations: organizations,
          members: members,
        },
      },
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        status: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
