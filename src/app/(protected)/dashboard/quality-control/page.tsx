"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  PhoneOff,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { QualityControlModal } from "@/components/quality-control-modal";

interface QualityControl {
  id: string;
  client: string;
  cpf: string;
  contract: string;
  seller: string;
  status: "pending" | "approved" | "rejected" | "in-review";
  checking: "completed" | "pending" | "failed";
  answersCall: boolean;
  hasDoubt: boolean;
  cancelledInCheck: boolean;
  notes: string;
  checkedAt: string;
  checkedBy: string;
  createdAt: string;
}

const mockQualityControls: QualityControl[] = [
  {
    id: "1",
    client: "João Silva",
    cpf: "123.456.789-00",
    contract: "CT001234",
    seller: "Carlos Vendedor",
    status: "approved",
    checking: "completed",
    answersCall: true,
    hasDoubt: false,
    cancelledInCheck: false,
    notes: "Cliente satisfeito com o produto, sem dúvidas sobre o contrato.",
    checkedAt: "2024-01-21",
    checkedBy: "Ana Qualidade",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    client: "Maria Santos",
    cpf: "987.654.321-00",
    contract: "CT001235",
    seller: "Ana Vendedora",
    status: "in-review",
    checking: "pending",
    answersCall: false,
    hasDoubt: true,
    cancelledInCheck: false,
    notes: "Cliente não atende chamadas, tentativas em horários diferentes necessárias.",
    checkedAt: "2024-01-22",
    checkedBy: "Pedro Qualidade",
    createdAt: "2024-01-22",
  },
  {
    id: "3",
    client: "Carlos Oliveira",
    cpf: "456.789.123-00",
    contract: "CT001236",
    seller: "Pedro Vendedor",
    status: "rejected",
    checking: "completed",
    answersCall: true,
    hasDoubt: true,
    cancelledInCheck: true,
    notes: "Cliente cancelou após esclarecimentos sobre as condições do contrato.",
    checkedAt: "2024-01-23",
    checkedBy: "Lucas Qualidade",
    createdAt: "2024-01-23",
  },
  {
    id: "4",
    client: "Ana Costa",
    cpf: "321.654.987-00",
    contract: "CT001237",
    seller: "Lucas Vendedor",
    status: "pending",
    checking: "pending",
    answersCall: true,
    hasDoubt: false,
    cancelledInCheck: false,
    notes: "",
    checkedAt: "",
    checkedBy: "",
    createdAt: "2024-01-24",
  },
];

export default function QualityControlPage() {
  const [qualityControls, setQualityControls] = useState<QualityControl[]>(mockQualityControls);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<QualityControl | null>(null);

  const filteredControls = qualityControls.filter(
    (control) =>
      control.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.cpf.includes(searchTerm) ||
      control.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddControl = () => {
    setSelectedControl(null);
    setIsModalOpen(true);
  };

  const handleEditControl = (control: QualityControl) => {
    setSelectedControl(control);
    setIsModalOpen(true);
  };

  const handleSaveControl = (controlData: Omit<QualityControl, "id" | "createdAt">) => {
    if (selectedControl) {
      // Update existing control
      setQualityControls(
        qualityControls.map((control) =>
          control.id === selectedControl.id ? { ...control, ...controlData } : control
        )
      );
    } else {
      // Add new control
      const newControl: QualityControl = {
        ...controlData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setQualityControls([newControl, ...qualityControls]);
    }
    setIsModalOpen(false);
    setSelectedControl(null);
  };

  const handleDeleteControl = (id: string) => {
    setQualityControls(qualityControls.filter((control) => control.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      "in-review": { label: "Em Análise", variant: "default" as const },
      approved: { label: "Aprovado", variant: "outline" as const },
      rejected: { label: "Rejeitado", variant: "destructive" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getCheckingBadge = (checking: string) => {
    const checkingConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      completed: { label: "Concluída", variant: "default" as const },
      failed: { label: "Falhou", variant: "destructive" as const },
    };
    return checkingConfig[checking as keyof typeof checkingConfig] || checkingConfig.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Qualidade</h1>
          <p className="text-muted-foreground">
            Gerencie a checagem e qualidade das vendas realizadas
          </p>
        </div>
        <Button onClick={handleAddControl} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Controle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Controles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityControls.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {qualityControls.filter((c) => c.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Atendem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {qualityControls.filter((c) => !c.answersCall).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Dúvidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {qualityControls.filter((c) => c.hasDoubt).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {qualityControls.filter((c) => c.cancelledInCheck).length}
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
                placeholder="Buscar por cliente, CPF, contrato ou vendedor..."
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
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Checagem</th>
                  <th className="text-left p-4 font-medium">Indicadores</th>
                  <th className="text-left p-4 font-medium">Vendedor</th>
                  <th className="text-left p-4 font-medium">Verificado por</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredControls.map((control) => {
                  const statusConfig = getStatusBadge(control.status);
                  const checkingConfig = getCheckingBadge(control.checking);
                  return (
                    <tr key={control.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{control.client}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {control.cpf}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{control.contract}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={checkingConfig.variant}>{checkingConfig.label}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {control.answersCall ? (
                            <Phone className="h-4 w-4 text-green-600" title="Atende chamadas" />
                          ) : (
                            <PhoneOff
                              className="h-4 w-4 text-red-600"
                              title="Não atende chamadas"
                            />
                          )}
                          {control.hasDoubt && (
                            <HelpCircle
                              className="h-4 w-4 text-yellow-600"
                              title="Cliente com dúvidas"
                            />
                          )}
                          {control.cancelledInCheck && (
                            <XCircle
                              className="h-4 w-4 text-red-600"
                              title="Cancelado na checagem"
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{control.seller}</div>
                      </td>
                      <td className="p-4">
                        <div>
                          {control.checkedBy ? (
                            <div>
                              <div className="text-sm">{control.checkedBy}</div>
                              <div className="text-xs text-muted-foreground">
                                {control.checkedAt &&
                                  new Date(control.checkedAt).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditControl(control)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditControl(control)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteControl(control.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <QualityControlModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedControl(null);
        }}
        onSubmit={handleSaveControl}
        control={selectedControl}
      />
    </div>
  );
}
