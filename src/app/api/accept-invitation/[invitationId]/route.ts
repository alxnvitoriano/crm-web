import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { invitationId: string } }) {
  const { invitationId } = params;
  const data = await auth.api.acceptInvitation({
    body: {
      invitationId: "invitation-id",
    },
  });

  console.log(data);
}
