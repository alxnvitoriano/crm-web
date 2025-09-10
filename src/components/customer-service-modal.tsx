"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: "active" | "inactive" | "prospect";
  lastContact: string;
  proposal?: {
    credit: number;
    term: number;
    installment: number;
    downPayment: number;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  };
}

interface CustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function CustomerServiceModal({ isOpen, onClose, customer }: CustomerServiceModalProps) {
  if (!customer) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", variant: "default" as const },
      inactive: { label: "Inativo", variant: "secondary" as const },
      prospect: { label: "Prospect", variant: "outline" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.prospect;
  };

  const getProposalStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      approved: { label: "Aprovada", variant: "default" as const },
      rejected: { label: "Rejeitada", variant: "destructive" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CPF</label>
                  <p className="font-mono">{customer.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <p>{customer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadge(customer.status).variant}>
                      {getStatusBadge(customer.status).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Último Contato
                  </label>
                  <p>{new Date(customer.lastContact).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposta */}
          {customer.proposal ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Status da Proposta
                  </span>
                  <Badge variant={getProposalStatusBadge(customer.proposal.status).variant}>
                    {getProposalStatusBadge(customer.proposal.status).label}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Crédito</label>
                    <p className="text-lg font-semibold">
                      R$ {customer.proposal.credit.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Prazo</label>
                    <p className="text-lg font-semibold">{customer.proposal.term} meses</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Parcela</label>
                    <p className="text-lg font-semibold">
                      R$ {customer.proposal.installment.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entrada</label>
                    <p className="text-lg font-semibold">
                      R$ {customer.proposal.downPayment.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Data da Proposta
                  </label>
                  <p>{new Date(customer.proposal.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Este cliente ainda não possui proposta.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
