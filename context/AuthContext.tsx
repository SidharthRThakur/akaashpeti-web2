// apps/web/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type AuthContextType = {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Optionally we could call /api/auth/me to validate token; for speed we set user placeholder.
        const userStr = localStorage.getItem("user");
        setUser(userStr ? JSON.parse(userStr) : { token });
      } else {
        // allow auth pages
        if (pathname !== "/auth/login" && pathname !== "/auth/signup" && pathname !== "/") {
          router.replace("/auth/login");
        }
      }
    } catch (err) {
      console.error("AuthContext init error:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  async function login(email: string, password: string) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.error || "Invalid credentials");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    router.replace("/dashboard");
  }

  async function signup(email: string, password: string) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.error || "Signup failed");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    router.replace("/dashboard");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.replace("/auth/login");
  }

  if (loading) {
    return <>{/* Prevent UI flash */}</>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
