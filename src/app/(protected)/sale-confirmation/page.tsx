"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  FileSignature,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SaleConfirmationModal } from "@/components/sale-confirmation-modal";

interface SaleConfirmation {
  id: string;
  client: string;
  cpf: string;
  contract: string;
  credit: number;
  installment: number;
  seller: string;
  signature: {
    status: "pending" | "signed" | "rejected";
    signedAt?: string;
    signedBy?: string;
  };
  payment: {
    status: "pending" | "paid" | "failed";
    method?: string;
    amount?: number;
    paidAt?: string;
    transactionId?: string;
  };
  documentation: {
    status: "pending" | "sent" | "received" | "complete";
    sentAt?: string;
    receivedAt?: string;
    documents: string[];
  };
  overallStatus: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
}

const mockSaleConfirmations: SaleConfirmation[] = [
  {
    id: "1",
    client: "João Silva",
    cpf: "123.456.789-00",
    contract: "CT001234",
    credit: 350000,
    installment: 2500,
    seller: "Carlos Vendedor",
    signature: {
      status: "signed",
      signedAt: "2024-01-20",
      signedBy: "João Silva",
    },
    payment: {
      status: "paid",
      method: "PIX",
      amount: 35000,
      paidAt: "2024-01-20",
      transactionId: "PIX123456789",
    },
    documentation: {
      status: "complete",
      sentAt: "2024-01-20",
      receivedAt: "2024-01-21",
      documents: ["Contrato Assinado", "Comprovante de Pagamento", "Documentos Pessoais"],
    },
    overallStatus: "completed",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    client: "Maria Santos",
    cpf: "987.654.321-00",
    contract: "CT001235",
    credit: 180000,
    installment: 1200,
    seller: "Ana Vendedora",
    signature: {
      status: "signed",
      signedAt: "2024-01-22",
      signedBy: "Maria Santos",
    },
    payment: {
      status: "pending",
    },
    documentation: {
      status: "pending",
      documents: [],
    },
    overallStatus: "in-progress",
    createdAt: "2024-01-22",
  },
  {
    id: "3",
    client: "Carlos Oliveira",
    cpf: "456.789.123-00",
    contract: "CT001236",
    credit: 500000,
    installment: 3200,
    seller: "Pedro Vendedor",
    signature: {
      status: "pending",
    },
    payment: {
      status: "pending",
    },
    documentation: {
      status: "pending",
      documents: [],
    },
    overallStatus: "pending",
    createdAt: "2024-01-23",
  },
  {
    id: "4",
    client: "Ana Costa",
    cpf: "321.654.987-00",
    contract: "CT001237",
    credit: 120000,
    installment: 800,
    seller: "Lucas Vendedor",
    signature: {
      status: "rejected",
    },
    payment: {
      status: "failed",
    },
    documentation: {
      status: "pending",
      documents: [],
    },
    overallStatus: "cancelled",
    createdAt: "2024-01-19",
  },
];

export default function SaleConfirmationPage() {
  const [confirmations, setConfirmations] = useState<SaleConfirmation[]>(mockSaleConfirmations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfirmation, setSelectedConfirmation] = useState<SaleConfirmation | null>(null);

  const filteredConfirmations = confirmations.filter(
    (confirmation) =>
      confirmation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      confirmation.cpf.includes(searchTerm) ||
      confirmation.contract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewConfirmation = (confirmation: SaleConfirmation) => {
    setSelectedConfirmation(confirmation);
    setIsModalOpen(true);
  };

  const handleUpdateConfirmation = (confirmationData: any) => {
    if (selectedConfirmation) {
      setConfirmations(
        confirmations.map((confirmation) =>
          confirmation.id === selectedConfirmation.id
            ? { ...confirmation, ...confirmationData }
            : confirmation
        )
      );
      setIsModalOpen(false);
      setSelectedConfirmation(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
      "in-progress": { label: "Em Andamento", variant: "default" as const, icon: AlertCircle },
      completed: { label: "Concluído", variant: "outline" as const, icon: CheckCircle },
      cancelled: { label: "Cancelado", variant: "destructive" as const, icon: AlertCircle },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getStepStatus = (confirmation: SaleConfirmation) => {
    let completedSteps = 0;
    if (confirmation.signature.status === "signed") completedSteps++;
    if (confirmation.payment.status === "paid") completedSteps++;
    if (confirmation.documentation.status === "complete") completedSteps++;
    return (completedSteps / 3) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Confirmação de Venda</h1>
          <p className="text-muted-foreground">
            Gerencie assinaturas, pagamentos e documentação das vendas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {confirmations.filter((c) => c.overallStatus === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {confirmations.filter((c) => c.overallStatus === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {confirmations.filter((c) => c.overallStatus === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, CPF ou contrato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Contrato</th>
                  <th className="text-left p-4 font-medium">Progresso</th>
                  <th className="text-left p-4 font-medium">Assinatura</th>
                  <th className="text-left p-4 font-medium">Pagamento</th>
                  <th className="text-left p-4 font-medium">Documentação</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Vendedor</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredConfirmations.map((confirmation) => {
                  const statusConfig = getStatusBadge(confirmation.overallStatus);
                  const StatusIcon = statusConfig.icon;
                  const progress = getStepStatus(confirmation);

                  return (
                    <tr key={confirmation.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{confirmation.client}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {confirmation.cpf}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{confirmation.contract}</div>
                        <div className="text-sm text-muted-foreground">
                          R$ {confirmation.credit.toLocaleString("pt-BR")}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <Progress value={progress} className="w-20" />
                          <div className="text-xs text-muted-foreground">
                            {Math.round(progress)}%
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileSignature
                            className={`h-4 w-4 ${
                              confirmation.signature.status === "signed"
                                ? "text-green-600"
                                : confirmation.signature.status === "rejected"
                                  ? "text-red-600"
                                  : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {confirmation.signature.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CreditCard
                            className={`h-4 w-4 ${
                              confirmation.payment.status === "paid"
                                ? "text-green-600"
                                : confirmation.payment.status === "failed"
                                  ? "text-red-600"
                                  : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm capitalize">{confirmation.payment.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText
                            className={`h-4 w-4 ${
                              confirmation.documentation.status === "complete"
                                ? "text-green-600"
                                : confirmation.documentation.status === "sent" ||
                                    confirmation.documentation.status === "received"
                                  ? "text-blue-600"
                                  : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {confirmation.documentation.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusConfig.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{confirmation.seller}</div>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewConfirmation(confirmation)}
                          title="Gerenciar confirmação"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SaleConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedConfirmation(null);
        }}
        onSubmit={handleUpdateConfirmation}
        confirmation={selectedConfirmation}
      />
    </div>
  );
}
