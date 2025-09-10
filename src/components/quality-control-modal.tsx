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

interface QualityControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (control: Omit<QualityControl, "id" | "createdAt">) => void;
  control?: QualityControl | null;
}

export function QualityControlModal({
  isOpen,
  onClose,
  onSubmit,
  control,
}: QualityControlModalProps) {
  const [formData, setFormData] = useState({
    client: "",
    cpf: "",
    contract: "",
    seller: "",
    status: "pending" as const,
    checking: "pending" as const,
    answersCall: false,
    hasDoubt: false,
    cancelledInCheck: false,
    notes: "",
    checkedAt: "",
    checkedBy: "",
  });

  useEffect(() => {
    if (control) {
      setFormData({
        client: control.client,
        cpf: control.cpf,
        contract: control.contract,
        seller: control.seller,
        status: control.status,
        checking: control.checking,
        answersCall: control.answersCall,
        hasDoubt: control.hasDoubt,
        cancelledInCheck: control.cancelledInCheck,
        notes: control.notes,
        checkedAt: control.checkedAt,
        checkedBy: control.checkedBy,
      });
    } else {
      setFormData({
        client: "",
        cpf: "",
        contract: "",
        seller: "",
        status: "pending",
        checking: "pending",
        answersCall: false,
        hasDoubt: false,
        cancelledInCheck: false,
        notes: "",
        checkedAt: "",
        checkedBy: "",
      });
    }
  }, [control, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-fill checkedAt and checkedBy if checking is completed
    const updatedFormData = {
      ...formData,
      checkedAt:
        formData.checking === "completed" && !formData.checkedAt
          ? new Date().toISOString().split("T")[0]
          : formData.checkedAt,
      checkedBy:
        formData.checking === "completed" && !formData.checkedBy
          ? "Usuário Atual"
          : formData.checkedBy,
    };

    onSubmit(updatedFormData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const sellers = [
    "Carlos Vendedor",
    "Ana Vendedora",
    "Pedro Vendedor",
    "Lucas Vendedor",
    "Maria Vendedora",
  ];

  const checkers = [
    "Ana Qualidade",
    "Pedro Qualidade",
    "Lucas Qualidade",
    "Maria Qualidade",
    "Carlos Qualidade",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {control ? "Editar Controle de Qualidade" : "Novo Controle de Qualidade"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Básicos</h3>
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
                <Label htmlFor="seller">Vendedor *</Label>
                <Select
                  value={formData.seller}
                  onValueChange={(value) => handleInputChange("seller", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => (
                      <SelectItem key={seller} value={seller}>
                        {seller}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status e Checagem */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status e Checagem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in-review">Em Análise</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checking">Checagem *</Label>
                <Select
                  value={formData.checking}
                  onValueChange={(value) => handleInputChange("checking", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Indicadores de Qualidade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Indicadores de Qualidade</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="answersCall"
                  checked={formData.answersCall}
                  onCheckedChange={(checked) => handleInputChange("answersCall", checked)}
                />
                <Label htmlFor="answersCall">Cliente atende chamadas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDoubt"
                  checked={formData.hasDoubt}
                  onCheckedChange={(checked) => handleInputChange("hasDoubt", checked)}
                />
                <Label htmlFor="hasDoubt">Cliente com dúvidas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cancelledInCheck"
                  checked={formData.cancelledInCheck}
                  onCheckedChange={(checked) => handleInputChange("cancelledInCheck", checked)}
                />
                <Label htmlFor="cancelledInCheck">Cancelado na checagem</Label>
              </div>
            </div>
          </div>

          {/* Dados da Verificação */}
          {formData.checking === "completed" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados da Verificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkedBy">Verificado por</Label>
                  <Select
                    value={formData.checkedBy}
                    onValueChange={(value) => handleInputChange("checkedBy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione quem verificou" />
                    </SelectTrigger>
                    <SelectContent>
                      {checkers.map((checker) => (
                        <SelectItem key={checker} value={checker}>
                          {checker}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkedAt">Data da verificação</Label>
                  <Input
                    id="checkedAt"
                    type="date"
                    value={formData.checkedAt}
                    onChange={(e) => handleInputChange("checkedAt", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Observações</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas da checagem</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Descreva os detalhes da checagem, dúvidas do cliente, motivos de cancelamento, etc..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{control ? "Atualizar" : "Salvar"} Controle</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
