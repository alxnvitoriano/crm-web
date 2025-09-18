import { NextRequest } from "next/server";
import { db } from "@/db";
import { member, rolesTable, rolesToPermissionsTable, permissionsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const organizationId = searchParams.get("organizationId");

    if (!userId || !organizationId) {
      return new Response(JSON.stringify({ error: "Missing userId or organizationId" }), {
        status: 400,
      });
    }

    const rows = await db
      .select({
        roleId: rolesTable.id,
        roleName: rolesTable.name,
        permissionSlug: permissionsTable.slug,
        permissionId: permissionsTable.id,
      })
      .from(member)
      .innerJoin(rolesTable, eq(member.roleId, rolesTable.id))
      .innerJoin(rolesToPermissionsTable, eq(rolesTable.id, rolesToPermissionsTable.roleId))
      .innerJoin(permissionsTable, eq(rolesToPermissionsTable.permissionId, permissionsTable.id))
      .where(and(eq(member.userId, userId), eq(member.organizationId, organizationId)));

    const role = rows[0] ? { id: rows[0].roleId, name: rows[0].roleName } : null;
    const permissions = rows.map((r) => r.permissionSlug);
    const hasCreateClient = permissions.includes("create:client");

    return new Response(
      JSON.stringify({ userId, organizationId, role, permissions, hasCreateClient }),
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/debug/permissions error", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
