"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldCheck, Search, Loader2, UserCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/stubs";

const VerificationTable = ({ data, isLoading, onVerify }: { data: any[], isLoading: boolean, onVerify: (id: string) => void }) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("CLIENT");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
      </div>
    );
  }

  const filtered = data.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                          u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || 
                       (roleFilter === "CLIENT" && u.role === "CLIENT") || 
                       (roleFilter === "TALENT" && (u.role === "TALENT" || u.role === "ARTIST"));
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <Tabs defaultValue="CLIENT" onValueChange={setRoleFilter} className="w-full md:w-auto">
          <TabsList className="bg-[#141414] border border-white/10 text-white">
            <TabsTrigger value="ALL" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white">All Requests</TabsTrigger>
            <TabsTrigger value="CLIENT" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white">Clients</TabsTrigger>
            <TabsTrigger value="TALENT" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white">Talents</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pending verifications..."
            className="pl-9 bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
                  <div className="flex justify-end gap-2 text-xs">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                      onClick={() => onVerify(user.id)}
                    >
                      <ShieldCheck className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="bg-[#1f1f1f] border border-white/10 text-white sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">{selectedUser?.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <div className="flex gap-4">
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                   <p>{selectedUser?.email}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Role</p>
                   <Badge className="bg-[#00A8E1]/10 text-[#00A8E1] border-none">{selectedUser?.role}</Badge>
                 </div>
              </div>

              {selectedUser?.role === 'CLIENT' && selectedUser?.clientProfile && (
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <h3 className="font-bold text-[#00A8E1]">Client Profile Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Company Name</p>
                      <p>{selectedUser.clientProfile.companyName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                      <p>{selectedUser.clientProfile.location || "N/A"}</p>
                    </div>
                  </div>
                  <div className="bg-[#141414] p-4 rounded-xl border border-white/5 space-y-3">
                    <div>
                      <p className="text-xs text-green-500 uppercase font-bold tracking-widest flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> GST Number</p>
                      <p className="font-mono text-lg">{selectedUser.clientProfile.gstNumber || <span className="text-gray-600">Not Provided</span>}</p>
                    </div>
                    <div className="h-px bg-white/5 w-full"/>
                    <div>
                      <p className="text-xs text-green-500 uppercase font-bold tracking-widest flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> PAN Number</p>
                      <p className="font-mono text-lg">{selectedUser.clientProfile.panNumber || <span className="text-gray-600">Not Provided</span>}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">About Company</p>
                    <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">{selectedUser.clientProfile.bio || "No details provided."}</p>
                  </div>
                </div>
              )}

              {(selectedUser?.role === 'TALENT' || selectedUser?.role === 'ARTIST') && selectedUser?.talentProfile && (
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <h3 className="font-bold text-[#00A8E1]">Talent Profile Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                      <p>{selectedUser.talentProfile.location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Gender</p>
                      <p>{selectedUser.talentProfile.gender || "N/A"}</p>
                    </div>
                  </div>
                   <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Bio</p>
                    <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">{selectedUser.talentProfile.bio || "No details provided."}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t border-white/10">
                 <Button onClick={() => { onVerify(selectedUser.id); setSelectedUser(null); }} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                   <ShieldCheck className="h-4 w-4" /> Approve Verification Now
                 </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
