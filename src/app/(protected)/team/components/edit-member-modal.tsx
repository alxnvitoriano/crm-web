"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Role {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
}

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: string;
    user: { name: string; email: string };
    role: Role;
  } | null;
  organizationId: string;
  onMemberUpdated: () => void;
}

export function EditMemberModal({
  isOpen,
  onClose,
  member,
  organizationId,
  onMemberUpdated,
}: EditMemberModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      setSelectedRoleId(member.role.id);
      fetchRoles();
    }
  }, [isOpen, member]);

  const fetchRoles = async () => {
    if (!organizationId) return;

    try {
      const response = await fetch(`/api/organizations/${organizationId}/roles`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles);
      }
    } catch (error) {
      console.error("Erro ao buscar roles:", error);
    }
  };

  const handleUpdate = async () => {
    if (!member || !selectedRoleId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/organizations/${organizationId}/members/${member.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleId: selectedRoleId }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Membro atualizado com sucesso!",
        });
        onMemberUpdated();
        onClose();
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || "Erro ao atualizar membro",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar membro:", error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">Editar Membro</DialogTitle>
        </DialogHeader>
        {member && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Nome</Label>
                <p className="text-sm text-muted-foreground">{member.user.name}</p>
              </div>
              <div className="flex-1">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">{member.user.email}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="role">Função</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
