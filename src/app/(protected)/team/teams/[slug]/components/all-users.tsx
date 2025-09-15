"use client";

import { Button } from "@/components/ui/button";
import { usersTable } from "@/db/schema";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type User = typeof usersTable.$inferSelect;

interface AllUsersProps {
  users: User[];
  organizationId: string;
  onUserAdded?: () => void;
}

export default function AllUsers({ users }: AllUsersProps) {
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invitedUsers] = useState<Set<string>>(new Set());

  const handleInviteUser = async (user: User) => {
    setAddingUserId(user.id);
    setIsLoading(true);

    if (users.length === 0) {
      return (
        <div>
          <h2 className="text-2xl font-bold">Usuários Disponíveis</h2>
          <p className="text-muted-foreground">Todos os usuários já estão no time.</p>
        </div>
      );
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold">Usuários Disponíveis</h2>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="texJt-sm text-muted-foreground">{user.email}</div>
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
