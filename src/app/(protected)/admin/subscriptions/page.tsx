"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Loader2 } from "lucide-react";
import { api } from "@/lib/stubs";

const SearchableTable = ({
  data,
  columns,
  searchKey,
  isLoading = false,
}: {
  data: any[];
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[];
  searchKey: string;
  isLoading?: boolean;
}) => {
  const [search, setSearch] = useState("");
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
      </div>
    );
  }

  const filtered = data.filter(row =>
    String(row[searchKey] || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5 shrink-0">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#141414]">
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="text-gray-300">{String(row[col.key] ?? '—')}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">No records found.</div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-right">Showing {filtered.length} of {data.length} records</p>
    </div>
  );
};

export default function AdminSubscriptionsPage() {
  const [data, setData] = useState<{ payments: any[], bookings: any[], subscriptions: any[] }>({
    payments: [],
    bookings: [],
    subscriptions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [payments, bookings] = await Promise.all([
          api.getPayments(),
          api.getBookings(),
        ]);
        
        // Mock subscriptions based on payments for now
        const subscriptions = payments.map((p: any) => ({
          id: `sub_${p.id}`,
          userName: `User ${p.userId}`,
          role: "TALENT",
          plan: p.plan,
          amount: p.amount,
          status: "ACTIVE",
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        setData({ payments, bookings, subscriptions });
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const bookingColumns = [
    { key: "id", label: "ID", render: (v: string) => <span className="text-gray-500 font-mono text-xs">{v}</span> },
    { key: "eventType", label: "Event", render: (v: string) => <span className="text-white font-medium">{v}</span> },
    { key: "eventDate", label: "Date", render: (v: string) => <span className="text-gray-300">{v}</span> },
    { key: "eventCity", label: "City", render: (v: string) => <span className="text-gray-300">{v}</span> },
    { key: "amount", label: "Amount", render: (v: number) => <span className="text-white font-bold">₹{v?.toLocaleString()}</span> },
    {
      key: "status", label: "Status", render: (v: string) => (
        <Badge className={`text-[10px] hover:opacity-100
          ${v === 'CONFIRMED' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : ''}
          ${v === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20' : ''}
          ${v === 'CANCELLED' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/20' : ''}
          ${v === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/20' : ''}
        `}>
          {v}
        </Badge>
      )
    },
  ];

  const paymentColumns = [
    { key: "id", label: "Txn ID", render: (v: string) => <span className="text-gray-500 font-mono text-xs">{v}</span> },
    { key: "userId", label: "User ID", render: (v: string) => <span className="text-gray-300">{v}</span> },
    { key: "plan", label: "Plan", render: (v: string) => <span className="text-white font-medium">{v}</span> },
    { key: "amount", label: "Amount", render: (v: number) => <span className="text-white font-bold">₹{v?.toLocaleString()}</span> },
    {
      key: "status", label: "Status", render: (v: string) => (
        <Badge className={`text-[10px]
          ${v === 'PAID' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : 'bg-red-500/20 text-red-500 hover:bg-red-500/20'}
        `}>
          {v}
        </Badge>
      )
    },
    { key: "createdAt", label: "Date", render: (v: string) => <span className="text-gray-400">{v ? new Date(v).toLocaleDateString() : '—'}</span> },
  ];

  const subColumns = [
    { key: "id", label: "Sub ID", render: (v: string) => <span className="text-gray-500 font-mono text-xs">{v}</span> },
    { key: "userName", label: "User", render: (v: string) => <span className="text-white font-medium">{v}</span> },
    {
      key: "role", label: "Role", render: (v: string) => (
        <Badge variant="outline" className={`text-[10px] h-5 border-none
          ${v === 'ARTIST' || v === 'TALENT' ? 'bg-[#00A8E1]/10 text-[#00A8E1]' : ''}
          ${v === 'SCHOOL' ? 'bg-blue-500/10 text-blue-400' : ''}
          ${v === 'PRODUCTION' || v === 'CLIENT' ? 'bg-purple-500/10 text-purple-400' : ''}
        `}>
          {v}
        </Badge>
      )
    },
    { key: "plan", label: "Plan", render: (v: string) => <span className="text-white">{v}</span> },
    { key: "amount", label: "Amount", render: (v: number) => <span className="text-white font-bold">₹{v?.toLocaleString()}</span> },
    {
      key: "status", label: "Status", render: (v: string) => (
        <Badge className={`text-[10px]
          ${v === 'ACTIVE' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/20'}
        `}>
          {v}
        </Badge>
      )
    },
    { key: "renewsAt", label: "Renews", render: (v: string) => <span className="text-gray-400">{v ? new Date(v).toLocaleDateString() : '—'}</span> },
  ];

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">Subscriptions, Payments & Bookings</h1>
        <p className="text-gray-400 text-sm">Track all platform transactions and booking activity.</p>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList className="bg-[#1f1f1f] border border-white/10 flex-wrap h-auto">
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white text-gray-400">
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white text-gray-400">
            Payments
          </TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white text-gray-400">
            Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <SearchableTable data={data.subscriptions} columns={subColumns as any} searchKey="userName" isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="payments">
          <SearchableTable data={data.payments} columns={paymentColumns as any} searchKey="plan" isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="bookings">
          <SearchableTable data={data.bookings} columns={bookingColumns as any} searchKey="eventType" isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
