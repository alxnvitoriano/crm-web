import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  company?: {
    id: string;
    name: string;
  } | null;
}

interface Session {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    activeOrganizationId?: string;
  };
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const response = await authClient.getSession();
      if (response.data) {
        setSession(response.data as Session);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("Erro ao buscar sessão:", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const refreshSession = useCallback(() => {
    setIsLoading(true);
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    user: session?.user || null,
    isLoading,
    refreshSession,
  };
}
