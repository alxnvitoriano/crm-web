"use client";

import { Button } from "@/components/ui/button";
import { usersTable } from "@/db/schema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail } from "lucide-react";
import { resendInvitationEmail, deleteInvitation } from "server/resend-invitation";

type User = typeof usersTable.$inferSelect;

interface AllUsersProps {
  users: User[];
  organizationId: string;
  onUserAdded?: () => void;
}

export default function AllUsers({ users, organizationId, onUserAdded }: AllUsersProps) {
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);
  const router = useRouter();

  const handleInviteUser = async (user: User) => {
    setAddingUserId(user.id);
    setIsLoading(true);

    try {
      console.log("🔍 Tentando convidar usuário:", {
        email: user.email,
        role: "member",
        organizationId: organizationId,
      });

      const { data, error } = await authClient.organization.inviteMember({
        email: user.email,
        role: "member",
        organizationId: organizationId,
      });

      console.log("🔍 Resposta da API:", { data, error });

      if (error) {
        // Tratar erro específico de convite já existente
        if (
          error.message?.includes("already invitation") ||
          error.message?.includes("already invited")
        ) {
          toast.error("Este usuário já possui um convite pendente");
          setInvitedUsers((prev) => new Set([...prev, user.id]));
        } else {
          // Melhorar exibição do erro
          const errorMessage =
            error.message ||
            error.error ||
            (typeof error === "string" ? error : "Erro desconhecido");
          toast.error(`Falha ao convidar membro: ${errorMessage}`);
        }
        console.error("❌ Erro detalhado:", error);
        return;
      }

      toast.success("Convite enviado ao membro.");
      setInvitedUsers((prev) => new Set([...prev, user.id]));
      onUserAdded?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao convidar membro ao time.");
    } finally {
      setAddingUserId(null);
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async (user: User) => {
    setResendingEmail(user.email);

    try {
      // Primeiro, tentar reenviar o email
      const result = await resendInvitationEmail("invitation-id-placeholder");

      if (result.success) {
        toast.success("Email reenviado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao reenviar email");
      }
    } catch (error) {
      console.error("Erro ao reenviar convite:", error);
      toast.error("Erro ao reenviar convite");
    } finally {
      setResendingEmail(null);
    }
  };

  if (users.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Usuários Disponíveis</h2>
        <p className="text-muted-foreground">Todos os usuários já estão no time.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Usuários Disponíveis</h2>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <Button
              onClick={() => handleInviteUser(user)}
              disabled={addingUserId === user.id || isLoading || invitedUsers.has(user.id)}
              size="sm"
              variant={invitedUsers.has(user.id) ? "secondary" : "default"}
            >
              {addingUserId === user.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : invitedUsers.has(user.id) ? (
                "Convite Enviado"
              ) : (
                "Convide ao time"
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
