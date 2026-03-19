import { ReactNode } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={["CLIENT"]}>
      {children}
    </ProtectedLayout>
  );
}
