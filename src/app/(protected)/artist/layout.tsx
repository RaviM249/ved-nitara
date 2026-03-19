import { ReactNode } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function ArtistLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={["ARTIST"]}>
      {children}
    </ProtectedLayout>
  );
}
