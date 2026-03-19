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

  return <>{children}</>;
}
