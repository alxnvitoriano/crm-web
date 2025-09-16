import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { invitationId: string } }) {
  const { invitationId } = params;

  try {
    const data = await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });

    return NextResponse.redirect(new URL("/team", request.url));
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.redirect(new URL("/team", request.url));
  }
}
