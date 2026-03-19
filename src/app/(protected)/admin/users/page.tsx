"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { mockArtists, mockSchools, mockProductionHouses } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ShieldCheck, ShieldX, Search, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Combine all users for admin view
const allUsers = [
  ...mockArtists.map(a => ({ id: a.id, name: a.name, email: `${a.name.toLowerCase().replace(' ', '.')}@vednit.in`, role: 'ARTIST', city: a.city, isVerified: a.isVerified, createdAt: '2025-01-15' })),
  ...mockSchools.map(s => ({ id: s.id, name: s.name, email: `admin@${s.name.toLowerCase().replace(' ', '')}.edu`, role: 'SCHOOL', city: s.city, isVerified: s.isVerified, createdAt: '2025-02-10' })),
  ...mockProductionHouses.map(p => ({ id: p.id, name: p.name, email: `hello@${p.id}.com`, role: 'PRODUCTION', city: p.city, isVerified: p.isVerified, createdAt: '2025-01-28' })),
];

const pendingVerifications = allUsers.filter(u => !u.isVerified);

const DataTable = ({ data, showVerify = false }: { data: typeof allUsers, showVerify?: boolean }) => {
  const [search, setSearch] = useState("");
  const filtered = data.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          className="pl-9 bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#141414]">
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">City</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-white truncate max-w-[140px]">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-[10px] h-5 border-none
                    ${user.role === 'ARTIST' ? 'bg-[#E50914]/10 text-[#E50914]' : ''}
                    ${user.role === 'SCHOOL' ? 'bg-blue-500/10 text-blue-400' : ''}
                    ${user.role === 'PRODUCTION' ? 'bg-purple-500/10 text-purple-400' : ''}
                    ${user.role === 'CLIENT' ? 'bg-green-500/10 text-green-400' : ''}
                  `}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{user.city}</td>
                <td className="px-4 py-3">
                  {user.isVerified ? (
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10 text-[10px]">
                      <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 text-[10px]">
                      Pending
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    {showVerify && !user.isVerified && (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => toast.success(`${user.name} verified!`)}
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" /> Verify
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1f1f1f] border-white/10 text-white">
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => toast.info('View profile clicked')}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-500 focus:text-red-400" onClick={() => toast.error(`${user.name} suspended`)}>
                          <ShieldX className="h-4 w-4 mr-2" /> Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-600 focus:text-red-500" onClick={() => toast.error(`${user.name} deleted`)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">No users found matching your search.</div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-right">Showing {filtered.length} of {data.length} users</p>
    </div>
  );
};

export default function AdminUsersPage() {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">Users & Verifications</h1>
        <p className="text-gray-400 text-sm">Manage platform users and review verification requests.</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-[#1f1f1f] border border-white/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#E50914] data-[state=active]:text-white text-gray-400">
            All Users ({allUsers.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#E50914] data-[state=active]:text-white text-gray-400">
            Pending Verification ({pendingVerifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable data={allUsers} />
        </TabsContent>
        <TabsContent value="pending">
          <DataTable data={pendingVerifications} showVerify />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
