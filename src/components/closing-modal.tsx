"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Closing {
  id: string;
  client: string;
  cpf: string;
  administrator: string;
  quotas: number;
  tableCommission: string;
  contract: string;
  group: string;
  quota: string;
  credit: number;
  installment: number;
  assemblyDay: number;
  dueDay: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  seller: string;
}

interface ClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (closing: Omit<Closing, "id" | "createdAt">) => void;
  closing?: Closing | null;
}

export function ClosingModal({ isOpen, onClose, onSubmit, closing }: ClosingModalProps) {
  const [formData, setFormData] = useState({
    client: "",
    cpf: "",
    administrator: "",
    quotas: 1,
    tableCommission: "",
    contract: "",
    group: "",
    quota: "",
    credit: 0,
    installment: 0,
    assemblyDay: 1,
    dueDay: 1,
    status: "active" as const,
    seller: "",
  });

  useEffect(() => {
    if (closing) {
      setFormData({
        client: closing.client,
        cpf: closing.cpf,
        administrator: closing.administrator,
        quotas: closing.quotas,
        tableCommission: closing.tableCommission,
        contract: closing.contract,
        group: closing.group,
        quota: closing.quota,
        credit: closing.credit,
        installment: closing.installment,
        assemblyDay: closing.assemblyDay,
        dueDay: closing.dueDay,
        status: closing.status as any,
        seller: closing.seller,
      });
    } else {
      setFormData({
        client: "",
        cpf: "",
        administrator: "",
        quotas: 1,
        tableCommission: "",
        contract: "",
        group: "",
        quota: "",
        credit: 0,
        installment: 0,
        assemblyDay: 1,
        dueDay: 1,
        status: "active",
        seller: "",
      });
    }
  }, [closing, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const administrators = [
    "Administradora ABC",
    "Administradora XYZ",
    "Administradora DEF",
    "Administradora GHI",
    "Administradora JKL",
  ];

  const tableCommissions = [
    "Tabela A - 3%",
    "Tabela B - 2.5%",
    "Tabela C - 4%",
    "Tabela D - 3.5%",
    "Tabela E - 2%",
  ];

  const sellers = [
    "Carlos Vendedor",
    "Ana Vendedora",
    "Pedro Vendedor",
    "Lucas Vendedor",
    "Maria Vendedora",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{closing ? "Editar Fechamento" : "Novo Fechamento"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Cliente</h3>
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
            </div>
          </div>

          {/* Dados do Contrato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="administrator">Administradora *</Label>
                <Select
                  value={formData.administrator}
                  onValueChange={(value) => handleInputChange("administrator", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a administradora" />
                  </SelectTrigger>
                  <SelectContent>
                    {administrators.map((admin) => (
                      <SelectItem key={admin} value={admin}>
                        {admin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quotas">Quantidade de Cotas (1-20) *</Label>
                <Input
                  id="quotas"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.quotas}
                  onChange={(e) => handleInputChange("quotas", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableCommission">Tabela/Comissão *</Label>
                <Select
                  value={formData.tableCommission}
                  onValueChange={(value) => handleInputChange("tableCommission", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tabela de comissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {tableCommissions.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="quota">Cota *</Label>
                <Input
                  id="quota"
                  value={formData.quota}
                  onChange={(e) => handleInputChange("quota", e.target.value)}
                  placeholder="Q005"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dados Financeiros */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Financeiros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credit">Crédito (R$) *</Label>
                <Input
                  id="credit"
                  type="number"
                  value={formData.credit}
                  onChange={(e) => handleInputChange("credit", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installment">Parcela (R$) *</Label>
                <Input
                  id="installment"
                  type="number"
                  value={formData.installment}
                  onChange={(e) => handleInputChange("installment", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assemblyDay">Dia da Assembleia *</Label>
                <Input
                  id="assemblyDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.assemblyDay}
                  onChange={(e) => handleInputChange("assemblyDay", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDay">Dia do Vencimento *</Label>
                <Input
                  id="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dueDay}
                  onChange={(e) => handleInputChange("dueDay", Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Dados Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{closing ? "Atualizar" : "Salvar"} Fechamento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
