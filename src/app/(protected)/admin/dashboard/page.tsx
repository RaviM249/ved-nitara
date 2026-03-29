"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Film, CreditCard, TrendingUp, UserCheck, BarChart3, Loader2 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";
import { api } from "@/lib/stubs";

const revenueData = [
  { month: "Oct", revenue: 125000, subscriptions: 42 },
  { month: "Nov", revenue: 148000, subscriptions: 58 },
  { month: "Dec", revenue: 210000, subscriptions: 74 },
  { month: "Jan", revenue: 183000, subscriptions: 91 },
  { month: "Feb", revenue: 240000, subscriptions: 110 },
  { month: "Mar", revenue: 289000, subscriptions: 132 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-sm shadow-xl">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'revenue' ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [artists, bookings, payments] = await Promise.all([
          api.getArtists(),
          api.getBookings(),
          api.getPayments(),
        ]);
        
        setStats({
          artistCount: artists.length,
          verifiedArtists: artists.filter((a: any) => a.isVerified).length,
          bookingCount: bookings.length,
          totalRevenue: payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
          clientCount: 24, // Fallback for now
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  const roleData = [
    { role: "Artists", count: stats.artistCount, color: "#00A8E1" },
    { role: "Schools", count: 0, color: "#3b82f6" },
    { role: "Production", count: 0, color: "#8b5cf6" },
    { role: "Clients", count: stats.clientCount, color: "#10b981" },
  ];

  const kpis = [
    { name: "Total Users", value: (stats.artistCount + stats.clientCount).toString(), icon: Users, trend: "+12%", up: true },
    { name: "Active Subscriptions", value: "132", icon: UserCheck, trend: "+18%", up: true },
    { name: "Total Revenue", value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: CreditCard, trend: "+22%", up: true },
    { name: "Total Bookings", value: stats.bookingCount.toString(), icon: BarChart3, trend: "+8%", up: true },
    { name: "Verified Artists", value: stats.verifiedArtists.toString(), icon: TrendingUp, trend: "+5", up: true },
    { name: "Pending Verifications", value: "7", icon: Film, trend: "-3", up: false },
  ];

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">Platform Overview</h1>
        <p className="text-gray-400 text-sm">Real-time metrics and platform health dashboard.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i} className="bg-[#1f1f1f] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{kpi.name}</CardTitle>
              <kpi.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-display text-white mb-1">{kpi.value}</div>
              <p className={`text-xs font-medium ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                {kpi.trend} this month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-8 mb-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-3 bg-[#1f1f1f] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Revenue & Subscriptions (6 Months)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A8E1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00A8E1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#00A8E1" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-[#1f1f1f] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Users by Role</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={roleData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="role" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Users" fill="#00A8E1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscriptions Chart */}
      <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Subscription Growth</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="subscriptions" name="New Subscriptions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PageWrapper>
  );
}
