"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { NeedsAssessmentModal } from "@/components/needs-assessment-modal";

interface NeedsAssessment {
  id: string;
  client: string;
  cpf: string;
  birthDate: string;
  asset: string;
  assetLocation: string;
  searchTime: number;
  assetValue: number;
  desiredInstallment: number;
  downPayment: string;
  maritalStatus: string;
  profession: string;
  income: number;
  creditCheck: string;
  previousFinancing: boolean;
  purchaseReason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function NeedsAssessmentPage() {
  const [assessments, setAssessments] = useState<NeedsAssessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<NeedsAssessment | null>(null);

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.cpf.includes(searchTerm) ||
      assessment.asset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAssessment = (assessmentData: Omit<NeedsAssessment, "id" | "createdAt">) => {
    const newAssessment: NeedsAssessment = {
      ...assessmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAssessments([newAssessment, ...assessments]);
    setIsModalOpen(false);
  };

  const handleEditAssessment = (assessmentData: Omit<NeedsAssessment, "id" | "createdAt">) => {
    if (selectedAssessment) {
      setAssessments(
        assessments.map((assessment) =>
          assessment.id === selectedAssessment.id
            ? { ...assessment, ...assessmentData }
            : assessment
        )
      );
      setSelectedAssessment(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments(assessments.filter((assessment) => assessment.id !== id));
  };

  const openEditModal = (assessment: NeedsAssessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedAssessment(null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      approved: { label: "Aprovado", variant: "default" as const },
      rejected: { label: "Rejeitado", variant: "destructive" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Levantamento de Necessidade</h1>
          <p className="text-muted-foreground">
            Gerencie os levantamentos de necessidade dos clientes
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Levantamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Levantamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter((a) => a.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter((a) => a.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.length > 0
                ? `R$ ${(
                    assessments.reduce((acc, a) => acc + a.assetValue, 0) /
                    assessments.length /
                    1000
                  ).toFixed(0)}k`
                : "R$ 0,00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, CPF ou tipo de bem..."
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
                  <th className="text-left p-4 font-medium">CPF</th>
                  <th className="text-left p-4 font-medium">Bem</th>
                  <th className="text-left p-4 font-medium">Valor do Bem</th>
                  <th className="text-left p-4 font-medium">Parcela Pretendida</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Data</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-6 text-muted-foreground">
                      Nenhum levantamento encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((assessment) => {
                    const statusConfig = getStatusBadge(assessment.status);
                    return (
                      <tr key={assessment.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{assessment.client}</div>
                            <div className="text-sm text-muted-foreground">
                              {assessment.profession}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm">{assessment.cpf}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{assessment.asset}</div>
                            <div className="text-sm text-muted-foreground">
                              {assessment.assetLocation}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          R$ {assessment.assetValue.toLocaleString("pt-BR")}
                        </td>
                        <td className="p-4 font-medium">
                          R$ {assessment.desiredInstallment.toLocaleString("pt-BR")}
                        </td>
                        <td className="p-4">
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(assessment.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(assessment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(assessment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAssessment(assessment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <NeedsAssessmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAssessment(null);
        }}
        onSubmit={selectedAssessment ? handleEditAssessment : handleAddAssessment}
        assessment={selectedAssessment}
      />
    </div>
  );
}
