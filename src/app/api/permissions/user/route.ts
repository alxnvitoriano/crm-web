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
        userId: member.userId,
        organizationId: member.organizationId,
        roleId: rolesTable.id,
        roleName: rolesTable.name,
        roleDescription: rolesTable.description,
        isSystemRole: rolesTable.isSystemRole,
        permissionId: permissionsTable.id,
        permissionSlug: permissionsTable.slug,
        permissionResource: permissionsTable.resource,
        permissionAction: permissionsTable.action,
        permissionDescription: permissionsTable.description,
        isSystemPermission: permissionsTable.isSystemPermission,
      })
      .from(member)
      .innerJoin(rolesTable, eq(member.roleId, rolesTable.id))
      .innerJoin(rolesToPermissionsTable, eq(rolesTable.id, rolesToPermissionsTable.roleId))
      .innerJoin(permissionsTable, eq(rolesToPermissionsTable.permissionId, permissionsTable.id))
      .where(and(eq(member.userId, userId), eq(member.organizationId, organizationId)));

    if (rows.length === 0) {
      return new Response(JSON.stringify(null), { status: 200 });
    }

    const permissions = rows.map((row) => ({
      id: row.permissionId,
      slug: row.permissionSlug,
      resource: row.permissionResource,
      action: row.permissionAction,
      description: row.permissionDescription,
      isSystemPermission: row.isSystemPermission,
    }));

    const role = {
      id: rows[0].roleId,
      name: rows[0].roleName,
      description: rows[0].roleDescription,
      organizationId: null,
      isSystemRole: rows[0].isSystemRole,
      permissions,
    };

    return new Response(
      JSON.stringify({
        userId: rows[0].userId,
        organizationId: rows[0].organizationId,
        role,
        permissions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/permissions/user error", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
