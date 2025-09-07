"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import jwtDecode from "jwt-decode";


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
  loading: boolean; // added
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true); // added

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser({ id: decoded.id, email: decoded.email, name: decoded.name });
      } catch {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // finished loading after check
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<JwtPayload>(token);
    setUser({ id: decoded.id, email: decoded.email, name: decoded.name });
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
