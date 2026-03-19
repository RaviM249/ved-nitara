import { ReactNode } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function SchoolLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={["SCHOOL"]}>
      {children}
    </ProtectedLayout>
  );
}
