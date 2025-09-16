"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Crown,
  Shield,
  TrendingUp,
  UserCheck,
  Headphones,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface InvitationData {
  email: string;
  organizationName: string;
  roleName: string;
  roleDescription?: string;
  inviterName: string;
  expiresAt: string;
}

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  const token = params.token as string;

  // Mapeamento de ícones para roles
  const roleIconMap = {
    Crown,
    Shield,
    TrendingUp,
    UserCheck,
    Headphones,
    Users,
  };

  useEffect(() => {
    // Por enquanto, vamos simular buscar dados do convite
    // TODO: Criar endpoint para validar token e retornar dados do convite
    const mockInvitationData: InvitationData = {
      email: "usuario@exemplo.com",
      organizationName: "Minha Empresa",
      roleName: "Vendedor",
      roleDescription: "Responsável por vendas e atendimento ao cliente",
      inviterName: "João Silva",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setInvitationData(mockInvitationData);
    setLoading(false);
  }, [token]);

  const handleAcceptInvite = async () => {
    setAccepting(true);

    try {
      const response = await fetch(`/api/invite/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccepted(true);
        toast.success(data.message);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Falha ao aceitar convite");
        toast.error(errorData.error || "Falha ao aceitar convite");
      }
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
      setError("Erro interno do servidor");
      toast.error("Erro interno do servidor");
    } finally {
      setAccepting(false);
    }
  };

  const getRoleIcon = (roleName: string) => {
    const iconMap: Record<string, any> = {
      Owner: Crown,
      Admin: Shield,
      "Gerente de Vendas": TrendingUp,
      Vendedor: UserCheck,
      Administrativo: Shield,
      "Pós-Venda": Headphones,
    };
    return iconMap[roleName] || Users;
  };

  const getRoleColor = (roleName: string): string => {
    const colorMap: Record<string, string> = {
      Owner: "bg-red-500",
      Admin: "bg-blue-500",
      "Gerente de Vendas": "bg-purple-500",
      Vendedor: "bg-orange-500",
      Administrativo: "bg-green-500",
      "Pós-Venda": "bg-teal-500",
    };
    return colorMap[roleName] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando convite...</p>
        </div>
      </div>
    );
  }

  if (error && !accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Convite Inválido</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/authentication")}>Ir para Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">Convite Aceito!</CardTitle>
            <CardDescription>
              Você foi adicionado à organização com sucesso. Redirecionando...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Convite Não Encontrado</CardTitle>
            <CardDescription>Este convite pode ter expirado ou sido cancelado.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const RoleIcon = getRoleIcon(invitationData.roleName);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Convite para Organização</CardTitle>
          <CardDescription>Você foi convidado para participar da organização</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações da Organização */}
          <div className="text-center">
            <h3 className="text-lg font-semibold">{invitationData.organizationName}</h3>
            <p className="text-sm text-gray-600">Convidado por {invitationData.inviterName}</p>
          </div>

          {/* Informações do Cargo */}
          <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-full ${getRoleColor(invitationData.roleName)}`}>
              <RoleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h4 className="font-semibold">{invitationData.roleName}</h4>
              {invitationData.roleDescription && (
                <p className="text-sm text-gray-600">{invitationData.roleDescription}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Este convite foi enviado para: <strong>{invitationData.email}</strong>
            </p>
          </div>

          {/* Botão de Aceitar */}
          <Button onClick={handleAcceptInvite} disabled={accepting} className="w-full" size="lg">
            {accepting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Aceitando Convite...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Aceitar Convite
              </>
            )}
          </Button>

          {/* Informações adicionais */}
          <div className="text-center text-xs text-gray-500">
            <p>
              Este convite expira em{" "}
              {new Date(invitationData.expiresAt).toLocaleDateString("pt-BR")}
            </p>
            <p>Certifique-se de estar logado com o email correto</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
