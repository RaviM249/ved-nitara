"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface SubscriptionGateProps {
  children: ReactNode;
  fallbackMessage?: string;
  hideContent?: boolean; // if true, won't even render the blurred content
}

export default function SubscriptionGate({ 
  children, 
  fallbackMessage = "Subscribe to Unlock 🔒",
  hideContent = false
}: SubscriptionGateProps) {
  const { isSubscribed } = useAuthStore();

  if (isSubscribed) {
    return <>{children}</>;
  }

  if (hideContent) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-[#1f1f1f] rounded-xl border border-white/5">
        <div className="h-12 w-12 rounded-full bg-[#E50914]/20 flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-[#E50914]" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{fallbackMessage}</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">
          You are on a free account. Active subscription is required to view this area.
        </p>
        <Link href="/pricing" tabIndex={-1}>
          <Button className="bg-[#E50914] text-white hover:bg-[#b80710]">
            View Plans
          </Button>
        </Link>
      </div>
    );
  }

  // Blurred overlay approach
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="blur-sm opacity-50 select-none pointer-events-none transition-all duration-300">
        {children}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 z-10">
        <div className="h-16 w-16 rounded-full bg-[#E50914]/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(229,9,20,0.3)] backdrop-blur-md">
          <Lock className="h-8 w-8 text-[#E50914]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 shadow-black drop-shadow-md">{fallbackMessage}</h3>
        <p className="text-gray-200 text-sm mb-6 max-w-md shadow-black drop-shadow-md font-medium">
          Upgrade your account for ₹99/month to access premium features and connect with professionals.
        </p>
        <Link href="/pricing" tabIndex={-1}>
          <Button size="lg" className="bg-[#E50914] text-white hover:bg-[#b80710] shadow-[0_0_20px_rgba(229,9,20,0.4)]">
            Subscribe Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
