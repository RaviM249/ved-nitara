"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, ShieldX, Search, MoreVertical, Trash2, Loader2, UserCheck, ShieldAlert } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "@/lib/stubs";
import { useAuthStore } from "@/lib/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const DataTable = ({ 
  data, 
  isLoading = false,
  onSuspend,
  onDelete
}: { 
  data: any[], 
  isLoading?: boolean,
  onSuspend: (userId: string, currentStatus: boolean) => void,
  onDelete: (userId: string) => void
}) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const { user: currentUser } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
      </div>
    );
  }

  const filtered = data.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                          u.email?.toLowerCase().includes(search.toLowerCase()) ||
                          u.role?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || 
                       (roleFilter === "CLIENT" && u.role === "CLIENT") || 
                       (roleFilter === "TALENT" && (u.role === "TALENT" || u.role === "ARTIST"));
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <Tabs defaultValue="ALL" onValueChange={setRoleFilter} className="w-full md:w-auto">
          <TabsList className="bg-[#141414] border border-white/10 text-white">
            <TabsTrigger value="ALL" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white">All Users</TabsTrigger>
            <TabsTrigger value="CLIENT" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white">Clients</TabsTrigger>
            <TabsTrigger value="TALENT" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white">Talents</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
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
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((user) => (
              <tr 
                key={user.id} 
                className={`transition-colors border-b border-white/5 
                  ${user.isSuspended ? 'bg-red-500/[0.03] hover:bg-red-500/[0.06]' : 'hover:bg-white/5'}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${user.isSuspended ? 'bg-red-500/20 text-red-500' : 'bg-[#2a2a2a] text-white'}`}>
                      {user.name?.slice(0, 2).toUpperCase() || "UN"}
                    </div>
                    <span className={`font-medium truncate max-w-[140px] ${user.isSuspended ? 'text-red-200/50' : 'text-white'}`}>
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-[10px] h-5 border-none
                    ${user.role === 'ARTIST' || user.role === 'TALENT' ? 'bg-[#00A8E1]/10 text-[#00A8E1]' : ''}
                    ${user.role === 'CLIENT' ? 'bg-purple-500/10 text-purple-400' : ''}
                  `}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <Badge className={user.isVerified ? "bg-green-500/10 text-green-500 border-none" : "bg-gray-500/10 text-gray-500 border-none"}>
                      {user.isVerified ? "Verified" : "Pending"}
                    </Badge>
                    {user.isSuspended && (
                      <Badge className="bg-red-500 text-white border-none flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                        <ShieldAlert className="h-3 w-3" />
                        Suspended
                      </Badge>
                    )}
                    {user.isDisabled && (
                      <Badge className="bg-amber-500/20 text-amber-500 border-none">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2 text-xs">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-9 px-3 gap-2 border-white/10 transition-all active:scale-95
                        ${user.isSuspended 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'}`}
                      onClick={() => onSuspend(user.id, user.isSuspended)}
                      disabled={user.id === currentUser?.id}
                    >
                      {user.isSuspended ? (
                        <>
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>Unsuspend</span>
                        </>
                      ) : (
                        <>
                          <ShieldX className="h-3.5 w-3.5" />
                          <span>Suspend</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0 border-white/10 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                      onClick={() => onDelete(user.id)}
                      title="Delete Permanently"
                      disabled={user.id === currentUser?.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successAction, setSuccessAction] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (userId: string, currentStatus: boolean) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot suspend your own account!");
      return;
    }

    // Optimistic Update
    const newStatus = !currentStatus;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: newStatus } : u));
    
    setSuccessAction(currentStatus ? "User Unsuspended" : "User Suspended");
    setTimeout(() => setSuccessAction(null), 2000);

    const res = await api.suspendUser(userId, newStatus);
    if (!res.success) {
      toast.error(res.error || "Action failed");
      // Rollback
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: currentStatus } : u));
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot delete your own account!");
      return;
    }
    if (!confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) return;
    
    // Optimistic Update
    const previousUsers = [...users];
    setUsers(prev => prev.filter(u => u.id !== userId));
    
    setSuccessAction("User Deleted");
    setTimeout(() => setSuccessAction(null), 2000);

    const res = await api.deleteUser(userId);
    if (!res.success) {
      toast.error(res.error || "Deletion failed");
      setUsers(previousUsers); // Rollback
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">User Management</h1>
        <p className="text-gray-400 text-sm">View and manage all platform users (Talent & Clients).</p>
      </div>

      <div className="bg-[#1f1f1f]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative">
        <DataTable 
          data={users} 
          isLoading={isLoading} 
          onSuspend={handleSuspend}
          onDelete={handleDelete}
        />
        
        <AnimatePresence>
          {successAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#00A8E1] text-white px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,168,225,0.4)] font-display"
            >
              <div className="bg-white/20 rounded-full p-1">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold tracking-wide">{successAction}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
