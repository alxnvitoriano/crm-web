"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

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

interface AssemblyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: Omit<AssemblyResult, "id" | "createdAt">) => void;
  result?: AssemblyResult | null;
}

export function AssemblyResultModal({
  isOpen,
  onClose,
  onSubmit,
  result,
}: AssemblyResultModalProps) {
  const [formData, setFormData] = useState({
    group: "",
    contract: "",
    assemblyDate: "",
    assemblyNumber: 1,
    totalParticipants: 0,
    presentParticipants: 0,
    contemplatedQuotas: [] as string[],
    bidWinners: [] as { quota: string; client: string; bidValue: number }[],
    drawWinners: [] as { quota: string; client: string }[],
    nextAssemblyDate: "",
    observations: "",
    status: "scheduled" as const,
    createdBy: "",
  });

  useEffect(() => {
    if (result) {
      setFormData({
        group: result.group,
        contract: result.contract,
        assemblyDate: result.assemblyDate,
        assemblyNumber: result.assemblyNumber,
        totalParticipants: result.totalParticipants,
        presentParticipants: result.presentParticipants,
        contemplatedQuotas: result.contemplatedQuotas,
        bidWinners: result.bidWinners,
        drawWinners: result.drawWinners,
        nextAssemblyDate: result.nextAssemblyDate,
        observations: result.observations,
        status: result.status as any,
        createdBy: result.createdBy,
      });
    } else {
      setFormData({
        group: "",
        contract: "",
        assemblyDate: "",
        assemblyNumber: 1,
        totalParticipants: 0,
        presentParticipants: 0,
        contemplatedQuotas: [],
        bidWinners: [],
        drawWinners: [],
        nextAssemblyDate: "",
        observations: "",
        status: "scheduled",
        createdBy: "",
      });
    }
  }, [result, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-fill createdBy if not provided
    const updatedFormData = {
      ...formData,
      createdBy: formData.createdBy || "Usuário Atual",
    };

    onSubmit(updatedFormData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const _addContemplatedQuota = () => {
    const newQuota = `Q${String(formData.contemplatedQuotas.length + 1).padStart(3, "0")}`;
    setFormData((prev) => ({
      ...prev,
      contemplatedQuotas: [...prev.contemplatedQuotas, newQuota],
    }));
  };

  const _removeContemplatedQuota = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contemplatedQuotas: prev.contemplatedQuotas.filter((_, i) => i !== index),
    }));
  };

  const addBidWinner = () => {
    setFormData((prev) => ({
      ...prev,
      bidWinners: [...prev.bidWinners, { quota: "", client: "", bidValue: 0 }],
    }));
  };

  const removeBidWinner = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bidWinners: prev.bidWinners.filter((_, i) => i !== index),
    }));
  };

  const updateBidWinner = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      bidWinners: prev.bidWinners.map((winner, i) =>
        i === index ? { ...winner, [field]: value } : winner
      ),
    }));
  };

  const addDrawWinner = () => {
    setFormData((prev) => ({
      ...prev,
      drawWinners: [...prev.drawWinners, { quota: "", client: "" }],
    }));
  };

  const removeDrawWinner = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      drawWinners: prev.drawWinners.filter((_, i) => i !== index),
    }));
  };

  const updateDrawWinner = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      drawWinners: prev.drawWinners.map((winner, i) =>
        i === index ? { ...winner, [field]: value } : winner
      ),
    }));
  };

  const responsibles = [
    "Ana Assembleia",
    "Pedro Assembleia",
    "Lucas Assembleia",
    "Maria Assembleia",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {result ? "Editar Resultado da Assembleia" : "Novo Resultado da Assembleia"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="group">Grupo *</Label>
                <Input
                  id="group"
                  value={formData.group}
                  onChange={(e) => handleInputChange("group", e.target.value)}
                  placeholder="G001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract">Contrato *</Label>
                <Input
                  id="contract"
                  value={formData.contract}
                  onChange={(e) => handleInputChange("contract", e.target.value)}
                  placeholder="CT001234"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assemblyDate">Data da Assembleia *</Label>
                <Input
                  id="assemblyDate"
                  type="date"
                  value={formData.assemblyDate}
                  onChange={(e) => handleInputChange("assemblyDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assemblyNumber">Número da Assembleia *</Label>
                <Input
                  id="assemblyNumber"
                  type="number"
                  min="1"
                  value={formData.assemblyNumber}
                  onChange={(e) => handleInputChange("assemblyNumber", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="completed">Realizada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdBy">Responsável</Label>
                <Select
                  value={formData.createdBy}
                  onValueChange={(value) => handleInputChange("createdBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibles.map((responsible) => (
                      <SelectItem key={responsible} value={responsible}>
                        {responsible}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Participação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Participação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalParticipants">Total de Participantes *</Label>
                <Input
                  id="totalParticipants"
                  type="number"
                  min="0"
                  value={formData.totalParticipants}
                  onChange={(e) => handleInputChange("totalParticipants", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="presentParticipants">Participantes Presentes *</Label>
                <Input
                  id="presentParticipants"
                  type="number"
                  min="0"
                  max={formData.totalParticipants}
                  value={formData.presentParticipants}
                  onChange={(e) => handleInputChange("presentParticipants", Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Contemplados por Lance */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Contemplados por Lance</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBidWinner}
                  className="gap-2 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.bidWinners.map((winner, index) => (
                <div key={index} className="flex items-end gap-4 p-4 border rounded">
                  <div className="flex-1 space-y-2">
                    <Label>Cota</Label>
                    <Input
                      value={winner.quota}
                      onChange={(e) => updateBidWinner(index, "quota", e.target.value)}
                      placeholder="Q005"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Cliente</Label>
                    <Input
                      value={winner.client}
                      onChange={(e) => updateBidWinner(index, "client", e.target.value)}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Valor do Lance (R$)</Label>
                    <Input
                      type="number"
                      value={winner.bidValue}
                      onChange={(e) => updateBidWinner(index, "bidValue", Number(e.target.value))}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBidWinner(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.bidWinners.length === 0 && (
                <p className="text-muted-foreground text-sm">Nenhum contemplado por lance</p>
              )}
            </CardContent>
          </Card>

          {/* Contemplados por Sorteio */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Contemplados por Sorteio</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDrawWinner}
                  className="gap-2 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.drawWinners.map((winner, index) => (
                <div key={index} className="flex items-end gap-4 p-4 border rounded">
                  <div className="flex-1 space-y-2">
                    <Label>Cota</Label>
                    <Input
                      value={winner.quota}
                      onChange={(e) => updateDrawWinner(index, "quota", e.target.value)}
                      placeholder="Q012"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Cliente</Label>
                    <Input
                      value={winner.client}
                      onChange={(e) => updateDrawWinner(index, "client", e.target.value)}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDrawWinner(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.drawWinners.length === 0 && (
                <p className="text-muted-foreground text-sm">Nenhum contemplado por sorteio</p>
              )}
            </CardContent>
          </Card>

          {/* Próxima Assembleia e Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nextAssemblyDate">Próxima Assembleia</Label>
                <Input
                  id="nextAssemblyDate"
                  type="date"
                  value={formData.nextAssemblyDate}
                  onChange={(e) => handleInputChange("nextAssemblyDate", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations">Observações da Assembleia</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                placeholder="Descreva os principais pontos da assembleia, decisões tomadas, problemas encontrados..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{result ? "Atualizar" : "Salvar"} Resultado</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
