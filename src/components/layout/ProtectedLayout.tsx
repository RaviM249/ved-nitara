"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isLoggedIn, activeRole } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for hydration
    if (!isLoggedIn) {
      router.push(`/login?redirect=${pathname}`);
    } else if (allowedRoles && activeRole && !allowedRoles.includes(activeRole)) {
      // Wrong role, redirect to their own dashboard
      router.push(`/${activeRole.toLowerCase()}/dashboard`);
    } else {
      setIsChecking(false);
    }
  }, [isLoggedIn, activeRole, router, pathname, allowedRoles]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#141414]">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A8E1]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-x-hidden">
      {/* Subtle Grid Texture */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#00A8E1]/10 blur-[130px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
