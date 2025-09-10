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
import { Checkbox } from "@/components/ui/checkbox";

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

interface NeedsAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assessment: Omit<NeedsAssessment, "id" | "createdAt">) => void;
  assessment?: NeedsAssessment | null;
}

export function NeedsAssessmentModal({
  isOpen,
  onClose,
  onSubmit,
  assessment,
}: NeedsAssessmentModalProps) {
  const [formData, setFormData] = useState({
    client: "",
    cpf: "",
    birthDate: "",
    asset: "",
    assetLocation: "",
    searchTime: 0,
    assetValue: 0,
    desiredInstallment: 0,
    downPayment: "",
    maritalStatus: "",
    profession: "",
    income: 0,
    creditCheck: "",
    previousFinancing: false,
    purchaseReason: "",
    status: "pending" as const,
  });

  useEffect(() => {
    if (assessment) {
      setFormData({
        client: assessment.client,
        cpf: assessment.cpf,
        birthDate: assessment.birthDate,
        asset: assessment.asset,
        assetLocation: assessment.assetLocation,
        searchTime: assessment.searchTime,
        assetValue: assessment.assetValue,
        desiredInstallment: assessment.desiredInstallment,
        downPayment: assessment.downPayment,
        maritalStatus: assessment.maritalStatus,
        profession: assessment.profession,
        income: assessment.income,
        creditCheck: assessment.creditCheck,
        previousFinancing: assessment.previousFinancing,
        purchaseReason: assessment.purchaseReason,
        status: assessment.status,
      });
    } else {
      setFormData({
        client: "",
        cpf: "",
        birthDate: "",
        asset: "",
        assetLocation: "",
        searchTime: 0,
        assetValue: 0,
        desiredInstallment: 0,
        downPayment: "",
        maritalStatus: "",
        profession: "",
        income: 0,
        creditCheck: "",
        previousFinancing: false,
        purchaseReason: "",
        status: "pending",
      });
    }
  }, [assessment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {assessment ? "Editar Levantamento de Necessidade" : "Novo Levantamento de Necessidade"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Estado Civil *</Label>
                <Select
                  value={formData.maritalStatus}
                  onValueChange={(value) => handleInputChange("maritalStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">Profissão *</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange("profession", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">Renda (R$) *</Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleInputChange("income", Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Informações do Bem */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Bem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Tipo do Bem *</Label>
                <Select
                  value={formData.asset}
                  onValueChange={(value) => handleInputChange("asset", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo do bem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Imóvel">Imóvel</SelectItem>
                    <SelectItem value="Veículo">Veículo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetLocation">Local do Bem *</Label>
                <Input
                  id="assetLocation"
                  value={formData.assetLocation}
                  onChange={(e) => handleInputChange("assetLocation", e.target.value)}
                  placeholder="Cidade - Estado"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchTime">Tempo de Busca (meses) *</Label>
                <Input
                  id="searchTime"
                  type="number"
                  value={formData.searchTime}
                  onChange={(e) => handleInputChange("searchTime", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetValue">Valor do Bem (R$) *</Label>
                <Input
                  id="assetValue"
                  type="number"
                  value={formData.assetValue}
                  onChange={(e) => handleInputChange("assetValue", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredInstallment">Parcela Pretendida (R$) *</Label>
                <Input
                  id="desiredInstallment"
                  type="number"
                  value={formData.desiredInstallment}
                  onChange={(e) => handleInputChange("desiredInstallment", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downPayment">Entrada *</Label>
                <Select
                  value={formData.downPayment}
                  onValueChange={(value) => handleInputChange("downPayment", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de entrada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Espécie">Espécie</SelectItem>
                    <SelectItem value="FGTS">FGTS</SelectItem>
                    <SelectItem value="Bem">Bem</SelectItem>
                    <SelectItem value="FGTS + Espécie">FGTS + Espécie</SelectItem>
                    <SelectItem value="FGTS + Bem">FGTS + Bem</SelectItem>
                    <SelectItem value="Espécie + Bem">Espécie + Bem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informações Financeiras */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Financeiras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditCheck">SPC/Serasa *</Label>
                <Select
                  value={formData.creditCheck}
                  onValueChange={(value) => handleInputChange("creditCheck", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Situação no SPC/Serasa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Limpo">Limpo</SelectItem>
                    <SelectItem value="Pendências menores">Pendências menores</SelectItem>
                    <SelectItem value="Pendências maiores">Pendências maiores</SelectItem>
                    <SelectItem value="Negativado">Negativado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="previousFinancing"
                checked={formData.previousFinancing}
                onCheckedChange={(checked) => handleInputChange("previousFinancing", checked)}
              />
              <Label htmlFor="previousFinancing">Já financiou anteriormente</Label>
            </div>
          </div>

          {/* Motivo da Compra */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Motivo da Compra</h3>
            <div className="space-y-2">
              <Label htmlFor="purchaseReason">Detalhe o motivo da compra *</Label>
              <Textarea
                id="purchaseReason"
                value={formData.purchaseReason}
                onChange={(e) => handleInputChange("purchaseReason", e.target.value)}
                placeholder="Descreva detalhadamente o motivo da compra..."
                rows={4}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{assessment ? "Atualizar" : "Salvar"} Levantamento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
