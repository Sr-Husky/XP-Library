import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../services/userService";
import type { User } from "../types/user";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  contextLogin: (userData: User, token: string, refresh_token: string) => void;
  contextLogout: () => void;
  contextGetUser: () => User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  })

  // Restaura do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const contextLogin = (userData: User, token: string, refresh: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    queryClient.setQueryData(['user'], userData);
  };

  const contextLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const contextGetUser = () => {
    return queryClient.getQueryData<User>(['user']) || null;
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user?.logado,
    contextLogin,
    contextLogout,
    contextGetUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
