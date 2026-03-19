import { ReactNode } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen bg-[#141414]">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 mt-16">
          {children}
        </main>
      </div>
    </ProtectedLayout>
  );
}
