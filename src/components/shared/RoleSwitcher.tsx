"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SCENARIOS = ["TALENT", "CLIENT", "ADMIN", "GUEST"];

// Mock users for different roles
const mockUser = {
  id: "u1",
  name: "Demo User",
  email: "demo@example.com",
  role: "TALENT",
  isEmailVerified: true,
  status: "ACTIVE",
  roles: ["TALENT"],
};

export default function RoleSwitcher() {
  const { currentMode, activeRole, switchMode, isLoggedIn, login, logout, isSubscribed, setSubscribed } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // ensure component is only rendered on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || process.env.NODE_ENV === "production") return null;

  const handleScenarioChange = (scenario: string) => {
    if (scenario === "GUEST") {
      logout();
      return;
    }
    
    // Log in the user with the corresponding role
    login(scenario as any, mockUser as any, true);
  };

  const getActiveScenario = () => {
    if (!isLoggedIn) return "GUEST";
    if (activeRole === "ADMIN") return "ADMIN";
    return currentMode || activeRole;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-64 rounded-xl border border-white/10 bg-[#1f1f1f] p-4 shadow-2xl backdrop-blur-sm">
          <div className="mb-3 text-sm font-semibold text-white">🎭 Test Scenarios</div>
          <div className="flex flex-col gap-2">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario}
                onClick={() => handleScenarioChange(scenario)}
                className={`rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                  getActiveScenario() === scenario
                    ? "bg-[#00A8E1] text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {scenario === "GUEST" ? "Non-Signed In (Guest)" : scenario}
              </button>
            ))}
          </div>
          
          <div className="mt-4 border-t border-white/10 pt-3">
            <div className="mb-2 text-xs font-semibold text-gray-400">Subscription Status</div>
            <button
              onClick={() => setSubscribed(!isSubscribed)}
              className={`w-full rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isSubscribed 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              Subscription: {isSubscribed ? "ACTIVE" : "EXPIRED"}
            </button>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-[#00A8E1] px-4 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(0,168,225,0.3)] hover:bg-[#0082B4]"
      >
        🎭 Dev Tools
      </Button>
    </div>
  );
}
