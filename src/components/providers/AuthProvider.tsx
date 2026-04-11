"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { api } from "@/lib/stubs";
import { Loader2 } from "lucide-react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout, isLoggedIn } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("auth-token");
      
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.user) {
          login(res.user.role, res.user, res.user.isSubscribed);
        } else {
          // Token might be invalid or expired
          localStorage.removeItem("auth-token");
          logout();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsInitializing(false);
      }
    }

    initAuth();
  }, [login, logout]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0F171E] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
          <div className="absolute inset-0 bg-[#00A8E1]/20 blur-xl rounded-full" />
        </div>
        <p className="text-gray-400 font-display tracking-widest text-xs uppercase animate-pulse">
          Authenticating Session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
