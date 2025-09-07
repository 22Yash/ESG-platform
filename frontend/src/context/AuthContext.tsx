"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import jwt_decode from "jwt-decode";

type UserType = {
  id: string;
  email: string;
  name?: string;
};

type JwtPayload = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: UserType | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to decode token and set user
  const setUserFromToken = useCallback((token: string) => {
    try {
      const decoded = jwt_decode<JwtPayload>(token);
      setUser({ id: decoded.id, email: decoded.email, name: decoded.name });
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUserFromToken(token);
    setLoading(false);
  }, [setUserFromToken]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUserFromToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
