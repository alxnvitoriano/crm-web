"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
} from "@/components/ui/table";
import { Member } from "@/db/schema";
import { removeMemberFromOrganization } from "server/member";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MembersTableProps {
  members: Member[];
  organizationId: string;
  onMemberRemoved?: () => void;
}

export default function MembersTable({
  members,
  organizationId,
  onMemberRemoved,
}: MembersTableProps) {
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const router = useRouter();

  const handleRemoveMember = async (userId: string) => {
    setRemovingMemberId(userId);

    try {
      const result = await removeMemberFromOrganization(organizationId, userId);

      if (result.success) {
        toast.success(result.message);
        onMemberRemoved?.();
        // Refresh da página para mostrar as mudanças
        router.refresh();
      } else {
        toast.error(typeof result.error === "string" ? result.error : "Erro desconhecido");
      }
    } catch (error) {
      toast.error("Erro ao remover membro");
      console.error(error);
    } finally {
      setRemovingMemberId(null);
    }
  };
  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Permissão</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.user.name}</TableCell>
            <TableCell>{member.user.email}</TableCell>
            <TableCell>{member.roleId || "N/A"}</TableCell>
            <TableCell className="text-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveMember(member.userId)}
                disabled={removingMemberId === member.userId}
              >
                {removingMemberId === member.userId ? "Removendo..." : "Remove"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
