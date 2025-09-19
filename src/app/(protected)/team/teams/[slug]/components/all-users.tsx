"use client";

import { Button } from "@/components/ui/button";
import { usersTable } from "@/db/schema";
import { useState, useEffect } from "react";
import {
  Loader2,
  Check,
  UserPlus,
  Crown,
  Shield,
  TrendingUp,
  UserCheck,
  Headphones,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type User = typeof usersTable.$inferSelect;

interface Role {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  color: string;
  icon: string;
}

interface AllUsersProps {
  users: User[];
  organizationId: string;
  onUserAdded?: () => void;
}

// Mapeamento de ícones para roles
const roleIconMap = {
  Crown,
  Shield,
  TrendingUp,
  UserCheck,
  Headphones,
  Users,
};

export default function AllUsers({ users, organizationId }: AllUsersProps) {
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Carregar roles disponíveis
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`/api/organizations/${organizationId}/roles`);
        if (response.ok) {
          const data = await response.json();
          setRoles(data.roles || []);
        } else {
          console.error("Erro ao carregar roles");
        }
      } catch (error) {
        console.error("Erro ao carregar roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (organizationId) {
      fetchRoles();
    }
  }, [organizationId]);

  const handleInviteUser = async (user: User) => {
    if (!selectedRoleId) {
      toast.error("Selecione um cargo para o convite");
      return;
    }

    setAddingUserId(user.id);
    setIsLoading(true);

    try {
      const response = await fetch("/api/invite/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          organizationId,
          roleId: selectedRoleId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInvitedUsers((prev) => {
          const next = new Set(prev);
          next.add(user.id);
          return next;
        });

        const selectedRole = roles.find((role) => role.id === selectedRoleId);
        toast.success(`Convite enviado para ${user.email} como ${selectedRole?.name || "Membro"}`);

        // Fechar modal e resetar estado
        setIsInviteDialogOpen(false);
        setSelectedUser(null);
        setSelectedRoleId("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Falha ao enviar convite");
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      toast.error("Falha ao enviar convite");
    } finally {
      setIsLoading(false);
      setAddingUserId(null);
    }
  };

  const openInviteDialog = (user: User) => {
    setSelectedUser(user);
    setIsInviteDialogOpen(true);
  };
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
            <Dialog
              open={isInviteDialogOpen && selectedUser?.id === user.id}
              onOpenChange={setIsInviteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => openInviteDialog(user)}
                  disabled={addingUserId === user.id || isLoading || invitedUsers.has(user.id)}
                  size="sm"
                  variant={invitedUsers.has(user.id) ? "secondary" : "default"}
                >
                  {addingUserId === user.id ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                    </span>
                  ) : invitedUsers.has(user.id) ? (
                    <span className="inline-flex items-center gap-2">
                      <Check className="size-4" />
                      <span>Convite enviado</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <UserPlus className="size-4" />
                      <span>Convidar</span>
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Convidar Usuário</DialogTitle>
                  <DialogDescription>
                    Convidar {selectedUser?.name} para a organização com um cargo específico.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Selecionar Cargo</Label>
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um cargo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingRoles ? (
                          <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            Carregando cargos...
                          </div>
                        ) : roles.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            Nenhum cargo disponível
                          </div>
                        ) : (
                          roles.map((role) => {
                            const IconComponent =
                              roleIconMap[role.icon as keyof typeof roleIconMap] || Users;
                            return (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex items-center gap-2 w-full">
                                  <div className={`p-1 rounded-full ${role.color} flex-shrink-0`}>
                                    <IconComponent className="size-3 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{role.name}</div>
                                    {role.description && (
                                      <div className="text-xs text-muted-foreground truncate">
                                        {role.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsInviteDialogOpen(false);
                      setSelectedUser(null);
                      setSelectedRoleId("");
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => selectedUser && handleInviteUser(selectedUser)}
                    disabled={!selectedRoleId || addingUserId === user.id || isLoading}
                  >
                    {addingUserId === user.id ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <UserPlus className="size-4" />
                        Enviar Convite
                      </span>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
