"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Search, Loader2, UserCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/stubs";

const VerificationTable = ({ data, isLoading, onVerify }: { data: any[], isLoading: boolean, onVerify: (id: string) => void }) => {
  const [search, setSearch] = useState("");
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
      </div>
    );
  }

  const filtered = data.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search pending verifications..."
          className="pl-9 bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#141414]">
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Signup Date</th>
              <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="bg-[#00A8E1]/10 text-[#00A8E1] border-none text-[10px]">
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                    onClick={() => onVerify(user.id)}
                  >
                    <ShieldCheck className="h-4 w-4" /> Approve Verification
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-500 flex flex-col items-center">
            <UserCheck className="h-10 w-10 mb-3 opacity-20" />
            <p>No pending verification requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminVerificationsPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminUsers();
      setPendingUsers(data.filter((u: any) => !u.isVerified));
    } catch (err) {
      console.error("Failed to fetch pending verifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (userId: string) => {
    try {
      const res = await api.verifyUser(userId, true);
      if (res.success) {
        toast.success("User verified successfully!");
        fetchPending();
      } else {
        toast.error(res.error || "Verification failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-display text-white">Pending Verifications</h1>
        </div>
        <p className="text-gray-400 text-sm">Review and approve new user profiles before they become visible on the platform.</p>
      </div>

      <div className="bg-[#1f1f1f]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <VerificationTable 
          data={pendingUsers} 
          isLoading={isLoading} 
          onVerify={handleVerify} 
        />
      </div>
    </PageWrapper>
  );
}
