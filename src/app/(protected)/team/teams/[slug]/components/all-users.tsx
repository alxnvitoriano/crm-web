"use client";

import { Button } from "@/components/ui/button";
import { usersTable } from "@/db/schema";
import { addMemberToOrganization } from "server/member";
import { toast } from "sonner";
import { useState } from "react";

type User = typeof usersTable.$inferSelect;

interface AllUsersProps {
  users: User[];
  organizationId: string;
  onUserAdded?: () => void;
}

export default function AllUsers({ users, organizationId, onUserAdded }: AllUsersProps) {
  const [addingUserId, setAddingUserId] = useState<string | null>(null);

  const handleAddUser = async (userId: string) => {
    setAddingUserId(userId);

    try {
      const result = await addMemberToOrganization(organizationId, userId, "member");

      if (result.success) {
        toast.success(result.message);
        onUserAdded?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao adicionar usuário");
      console.error(error);
    } finally {
      setAddingUserId(null);
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
              onClick={() => handleAddUser(user.id)}
              disabled={addingUserId === user.id}
              size="sm"
            >
              {addingUserId === user.id ? "Adicionando..." : "Adicionar ao time"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
