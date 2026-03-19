"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { mockArtists, mockBookings } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MessageSquare, Bookmark, Star, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import ArtistCard from "@/components/shared/ArtistCard";
import FilterPanel from "@/components/shared/FilterPanel";

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { name: "Total Bookings", value: "7", icon: Calendar },
    { name: "Shortlisted Artists", value: "14", icon: Bookmark },
    { name: "Pending Requests", value: "2", icon: MessageSquare },
    { name: "Avg Rating Given", value: "4.6", icon: Star },
  ];

  const filteredArtists = mockArtists.filter(artist => {
    if (searchQuery && 
        !artist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !artist.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const recentBookings = mockBookings.slice(0, 3);

  return (
    <PageWrapper>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">
            Welcome, {user?.name || "Event Organizer"}
          </h1>
          <p className="text-gray-400 text-sm">Find and book artists for your next event.</p>
        </div>
        <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
          <Link href="/client/inbox">View Messages</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#1f1f1f] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          <Link href="/client/bookings" className="text-sm text-[#E50914] hover:text-[#b80710]">View all</Link>
        </div>
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="bg-[#1f1f1f] border border-white/5 rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h4 className="font-bold text-white">{booking.eventType}</h4>
                <p className="text-sm text-gray-400 mt-0.5">{booking.eventDate} · {booking.eventCity}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-semibold text-sm">₹{booking.amount.toLocaleString()}</span>
                <Badge className={`
                  ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : ''}
                  ${booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20' : ''}
                  ${booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/20' : ''}
                  ${booking.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/20' : ''}
                `}>
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Find Artists Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">Find Artists for Your Event</h2>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or role..."
                className="pl-9 bg-[#1f1f1f] border-white/10 text-white focus-visible:ring-[#E50914] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-white/10 bg-[#1f1f1f]"
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 text-gray-300" />
            </Button>
          </div>
        </div>

        <FilterPanel title="Filter Artists" isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Artist Type</h3>
              <div className="space-y-2">
                {["Singer", "Dancer", "Actor", "Comedian", "DJ", "Anchor"].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-[#141414] text-[#E50914] focus:ring-[#E50914] focus:ring-offset-0" />
                    <span className="text-sm text-gray-300">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-3">City</h3>
              <Input placeholder="Enter city" className="bg-[#141414] border-white/10 text-white h-9" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Budget (₹/hour)</h3>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" className="bg-[#141414] border-white/10 h-8 text-white" />
                <span className="text-gray-500">-</span>
                <Input type="number" placeholder="Max" className="bg-[#141414] border-white/10 h-8 text-white" />
              </div>
            </div>
          </div>
        </FilterPanel>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              actionLabel="Book Artist"
              onActionClick={() => window.location.href = `/client/book/${artist.id}`}
            />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
