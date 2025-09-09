"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import jwt_decode, { JwtPayload } from "jwt-decode";  // ✅ correct import

// Define the shape of your JWT payload
interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

// Define your AuthContext state type
interface AuthContextType {
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwt_decode<DecodedToken>(token);
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            setUser(decoded);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
        }
      }
    }
  }, []);

  const login = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      const decoded = jwt_decode<DecodedToken>(token);
      setUser(decoded);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
