"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Eye, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { DocumentUploadModal } from "@/components/document-upload-modal";

interface CustomerDocument {
  id: string;
  customerId: string;
  customerName: string;
  customerCpf: string;
  documents: {
    cpfFront?: string;
    cpfBack?: string;
    rgFront?: string;
    rgBack?: string;
  };
  status: "pending" | "approved" | "rejected" | "incomplete";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

const mockDocuments: CustomerDocument[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "João Silva",
    customerCpf: "123.456.789-00",
    documents: {
      cpfFront: "/cpf-frente.jpg",
      cpfBack: "/cpf-verso.jpg",
      rgFront: "/rg-frente.jpg",
      rgBack: "/rg-verso.jpg",
    },
    status: "approved",
    submittedAt: "2024-01-20",
    reviewedAt: "2024-01-21",
    reviewedBy: "Ana Reviewer",
  },
  {
    id: "2",
    customerId: "2",
    customerName: "Maria Santos",
    customerCpf: "987.654.321-00",
    documents: {
      cpfFront: "/cpf-frente.jpg",
      cpfBack: "/cpf-verso.jpg",
    },
    status: "incomplete",
    submittedAt: "2024-01-22",
    notes: "Faltam documentos do RG",
  },
  {
    id: "3",
    customerId: "3",
    customerName: "Carlos Oliveira",
    customerCpf: "456.789.123-00",
    documents: {
      cpfFront: "/cpf-frente.jpg",
      cpfBack: "/cpf-verso.jpg",
      rgFront: "/rg-frente.jpg",
      rgBack: "/rg-verso.jpg",
    },
    status: "pending",
    submittedAt: "2024-01-23",
  },
  {
    id: "4",
    customerId: "4",
    customerName: "Ana Costa",
    customerCpf: "321.654.987-00",
    documents: {
      cpfFront: "/cpf-frente.jpg",
      cpfBack: "/cpf-verso.jpg",
      rgFront: "/rg-frente.jpg",
    },
    status: "rejected",
    submittedAt: "2024-01-19",
    reviewedAt: "2024-01-20",
    reviewedBy: "Carlos Reviewer",
    notes: "Documento RG ilegível, solicitar nova foto",
  },
];

export default function AnalysisApprovalPage() {
  const [documents, setDocuments] = useState<CustomerDocument[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<CustomerDocument | null>(null);

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.customerCpf.includes(searchTerm)
  );

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setIsUploadModalOpen(true);
  };

  const handleViewDocument = (document: CustomerDocument) => {
    setSelectedDocument(document);
    setIsUploadModalOpen(true);
  };

  const handleSaveDocument = (documentData: any) => {
    if (selectedDocument) {
      // Update existing document
      setDocuments(
        documents.map((doc) =>
          doc.id === selectedDocument.id
            ? { ...doc, ...documentData, status: "pending" as const }
            : doc
        )
      );
    } else {
      // Add new document
      const newDocument: CustomerDocument = {
        id: Date.now().toString(),
        customerId: Date.now().toString(),
        ...documentData,
        status: "pending" as const,
        submittedAt: new Date().toISOString().split("T")[0],
      };
      setDocuments([newDocument, ...documents]);
    }
    setIsUploadModalOpen(false);
    setSelectedDocument(null);
  };

  const handleUpdateStatus = (
    documentId: string,
    status: CustomerDocument["status"],
    notes?: string
  ) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              status,
              reviewedAt: new Date().toISOString().split("T")[0],
              reviewedBy: "Usuário Atual",
              notes,
            }
          : doc
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
      approved: { label: "Aprovado", variant: "default" as const, icon: CheckCircle },
      rejected: { label: "Rejeitado", variant: "destructive" as const, icon: XCircle },
      incomplete: { label: "Incompleto", variant: "outline" as const, icon: FileText },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getDocumentCount = (documents: CustomerDocument["documents"]) => {
    return Object.values(documents).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise/Aprovação</h1>
          <p className="text-muted-foreground">
            Gerencie a análise e aprovação de documentos dos clientes
          </p>
        </div>
        <Button onClick={handleAddDocument} className="gap-2">
          <Upload className="h-4 w-4" />
          Adicionar Ficha Cadastral
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fichas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter((d) => d.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter((d) => d.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {documents.filter((d) => d.status === "rejected").length}
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
                placeholder="Buscar por nome ou CPF..."
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
                  <th className="text-left p-4 font-medium">Documentos</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Data de Envio</th>
                  <th className="text-left p-4 font-medium">Revisado por</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document) => {
                  const statusConfig = getStatusBadge(document.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={document.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{document.customerName}</div>
                      </td>
                      <td className="p-4 font-mono text-sm">{document.customerCpf}</td>
                      <td className="p-4">
                        <div className="text-sm">
                          {getDocumentCount(document.documents)}/4 documentos
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {document.documents.cpfFront && "CPF "}
                          {document.documents.rgFront && "RG"}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusConfig.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(document.submittedAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-4 text-sm">
                        {document.reviewedBy ? (
                          <div>
                            <div>{document.reviewedBy}</div>
                            <div className="text-xs text-muted-foreground">
                              {document.reviewedAt &&
                                new Date(document.reviewedAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(document)}
                            title="Ver documentos"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {document.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(document.id, "approved")}
                                title="Aprovar"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(
                                    document.id,
                                    "rejected",
                                    "Documentos rejeitados"
                                  )
                                }
                                title="Rejeitar"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedDocument(null);
        }}
        onSubmit={handleSaveDocument}
        document={selectedDocument}
      />
    </div>
  );
}
