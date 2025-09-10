"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: "active" | "inactive" | "prospect";
  lastContact: string;
}

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposalData: any) => void;
  customer: Customer | null;
}

export function ProposalModal({ isOpen, onClose, onSubmit, customer }: ProposalModalProps) {
  const [formData, setFormData] = useState({
    credit: 0,
    term: 0,
    installment: 0,
    downPayment: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ credit: 0, term: 0, installment: 0, downPayment: 0 });
  };

  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Proposta para {customer.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="term">Prazo (meses) *</Label>
            <Input
              id="term"
              type="number"
              value={formData.term}
              onChange={(e) => handleInputChange("term", Number(e.target.value))}
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
            <Label htmlFor="downPayment">Entrada (R$) *</Label>
            <Input
              id="downPayment"
              type="number"
              value={formData.downPayment}
              onChange={(e) => handleInputChange("downPayment", Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar Proposta</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
