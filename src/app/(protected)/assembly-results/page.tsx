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
  Calendar,
  Users,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { AssemblyResultModal } from "@/components/assembly-result-modal";

interface AssemblyResult {
  id: string;
  group: string;
  contract: string;
  assemblyDate: string;
  assemblyNumber: number;
  totalParticipants: number;
  presentParticipants: number;
  contemplatedQuotas: string[];
  bidWinners: {
    quota: string;
    client: string;
    bidValue: number;
  }[];
  drawWinners: {
    quota: string;
    client: string;
  }[];
  nextAssemblyDate: string;
  observations: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  createdBy: string;
}

const mockAssemblyResults: AssemblyResult[] = [
  {
    id: "1",
    group: "G001",
    contract: "CT001234",
    assemblyDate: "2024-01-15",
    assemblyNumber: 1,
    totalParticipants: 20,
    presentParticipants: 18,
    contemplatedQuotas: ["Q005", "Q012"],
    bidWinners: [
      {
        quota: "Q005",
        client: "João Silva",
        bidValue: 15000,
      },
    ],
    drawWinners: [
      {
        quota: "Q012",
        client: "Maria Santos",
      },
    ],
    nextAssemblyDate: "2024-02-15",
    observations:
      "Assembleia realizada com sucesso. Boa participação dos consorciados. Próxima assembleia agendada.",
    status: "completed",
    createdAt: "2024-01-15",
    createdBy: "Ana Assembleia",
  },
  {
    id: "2",
    group: "G002",
    contract: "CT001235",
    assemblyDate: "2024-01-20",
    assemblyNumber: 1,
    totalParticipants: 15,
    presentParticipants: 12,
    contemplatedQuotas: ["Q003"],
    bidWinners: [],
    drawWinners: [
      {
        quota: "Q003",
        client: "Carlos Oliveira",
      },
    ],
    nextAssemblyDate: "2024-02-20",
    observations:
      "Primeira assembleia do grupo. Contemplação por sorteio. Alguns participantes ausentes.",
    status: "completed",
    createdAt: "2024-01-20",
    createdBy: "Pedro Assembleia",
  },
  {
    id: "3",
    group: "G003",
    contract: "CT001236",
    assemblyDate: "2024-01-25",
    assemblyNumber: 1,
    totalParticipants: 25,
    presentParticipants: 0,
    contemplatedQuotas: [],
    bidWinners: [],
    drawWinners: [],
    nextAssemblyDate: "2024-02-25",
    observations: "",
    status: "scheduled",
    createdAt: "2024-01-23",
    createdBy: "Lucas Assembleia",
  },
  {
    id: "4",
    group: "G004",
    contract: "CT001237",
    assemblyDate: "2024-01-18",
    assemblyNumber: 1,
    totalParticipants: 12,
    presentParticipants: 8,
    contemplatedQuotas: [],
    bidWinners: [],
    drawWinners: [],
    nextAssemblyDate: "",
    observations: "Assembleia cancelada devido à baixa participação. Reagendamento necessário.",
    status: "cancelled",
    createdAt: "2024-01-18",
    createdBy: "Maria Assembleia",
  },
];

export default function AssemblyResultsPage() {
  const [assemblyResults, setAssemblyResults] = useState<AssemblyResult[]>(mockAssemblyResults);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AssemblyResult | null>(null);

  const filteredResults = assemblyResults.filter(
    (result) =>
      result.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.contemplatedQuotas.some((quota) =>
        quota.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleAddResult = () => {
    setSelectedResult(null);
    setIsModalOpen(true);
  };

  const handleEditResult = (result: AssemblyResult) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleSaveResult = (resultData: Omit<AssemblyResult, "id" | "createdAt">) => {
    if (selectedResult) {
      // Update existing result
      setAssemblyResults(
        assemblyResults.map((result) =>
          result.id === selectedResult.id ? { ...result, ...resultData } : result
        )
      );
    } else {
      // Add new result
      const newResult: AssemblyResult = {
        ...resultData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAssemblyResults([newResult, ...assemblyResults]);
    }
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  const handleDeleteResult = (id: string) => {
    setAssemblyResults(assemblyResults.filter((result) => result.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Agendada", variant: "secondary" as const, icon: Calendar },
      completed: { label: "Realizada", variant: "default" as const, icon: Trophy },
      cancelled: { label: "Cancelada", variant: "destructive" as const, icon: AlertTriangle },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
  };

  const totalContemplated = assemblyResults
    .filter((r) => r.status === "completed")
    .reduce((acc, r) => acc + r.contemplatedQuotas.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resultado 1º Assembleia</h1>
          <p className="text-muted-foreground">
            Gerencie os resultados das primeiras assembleias dos grupos
          </p>
        </div>
        <Button onClick={handleAddResult} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Resultado
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assembleias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assemblyResults.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assemblyResults.filter((r) => r.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotas Contempladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalContemplated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Participação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assemblyResults.filter((r) => r.status === "completed").length > 0
                ? Math.round(
                    (assemblyResults
                      .filter((r) => r.status === "completed")
                      .reduce((acc, r) => acc + r.presentParticipants, 0) /
                      assemblyResults
                        .filter((r) => r.status === "completed")
                        .reduce((acc, r) => acc + r.totalParticipants, 0)) *
                      100
                  )
                : 0}
              %
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
                placeholder="Buscar por grupo, contrato ou cota contemplada..."
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
                  <th className="text-left p-4 font-medium">Grupo</th>
                  <th className="text-left p-4 font-medium">Data da Assembleia</th>
                  <th className="text-left p-4 font-medium">Participação</th>
                  <th className="text-left p-4 font-medium">Contemplados</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Próxima Assembleia</th>
                  <th className="text-left p-4 font-medium">Responsável</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => {
                  const statusConfig = getStatusBadge(result.status);
                  const StatusIcon = statusConfig.icon;
                  const participationRate =
                    result.totalParticipants > 0
                      ? Math.round((result.presentParticipants / result.totalParticipants) * 100)
                      : 0;

                  return (
                    <tr key={result.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{result.group}</div>
                          <div className="text-sm text-muted-foreground">{result.contract}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {new Date(result.assemblyDate).toLocaleDateString("pt-BR")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.assemblyNumber}º Assembleia
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {result.presentParticipants}/{result.totalParticipants}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({participationRate}%)
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          {result.contemplatedQuotas.length > 0 ? (
                            <div>
                              <div className="font-medium">
                                {result.contemplatedQuotas.length} cotas
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {result.contemplatedQuotas.slice(0, 2).join(", ")}
                                {result.contemplatedQuotas.length > 2 && "..."}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Nenhuma</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusConfig.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {result.nextAssemblyDate
                            ? new Date(result.nextAssemblyDate).toLocaleDateString("pt-BR")
                            : "-"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{result.createdBy}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditResult(result)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditResult(result)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteResult(result.id)}
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

      <AssemblyResultModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResult(null);
        }}
        onSubmit={handleSaveResult}
        result={selectedResult}
      />
    </div>
  );
}
