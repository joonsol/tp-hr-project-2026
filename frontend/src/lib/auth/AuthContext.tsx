"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMe, login as loginApi, LoginRequest } from "@/lib/api/auth";
import { clearToken, getToken, setToken } from "@/lib/auth/token";
import { Employee } from "@/lib/types/employee";

interface AuthContextValue {
  user: Employee | null;
  loading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(() => !!getToken());

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.addEventListener("tp-hr:unauthorized", logout);
    return () => window.removeEventListener("tp-hr:unauthorized", logout);
  }, [logout]);

  const login = useCallback(async (request: LoginRequest) => {
    const response = await loginApi(request);
    setToken(response.accessToken);
    const me = await getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
