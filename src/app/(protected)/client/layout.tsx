import { ReactNode } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function ProductionLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={["PRODUCTION"]}>
      {children}
    </ProtectedLayout>
  );
}
