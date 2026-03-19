"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { mockArtists } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, CheckSquare, Eye, Search, SlidersHorizontal, MapPin, Star, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/shared/FilterPanel";
import ArtistCard from "@/components/shared/ArtistCard";
import Link from "next/link";
import SubscriptionGate from "@/components/shared/SubscriptionGate";

export default function ProductionDashboard() {
  const { user } = useAuthStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const stats = [
    { name: "Active Projects / Casting", value: "3", icon: Film },
    { name: "Total Profile Views", value: "24", icon: Eye },
    { name: "Shortlisted Artists", value: "12", icon: Bookmark },
    { name: "Confirmed Bookings", value: "5", icon: CheckSquare },
  ];

  const filteredArtists = mockArtists.filter(artist => {
    if (searchQuery && !artist.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !artist.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !artist.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">
            Production Dashboard
          </h1>
          <p className="text-gray-400 text-sm">Welcome back, {user?.name || "Production Admin"}. Discover top talent for your next project.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
            <Link href="/production/inbox">Inbox</Link>
          </Button>
          <Button asChild className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
            <Link href="/production/casting">
              <span className="mr-2 pb-0.5 text-lg leading-none">+</span> Post Casting Call
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#1f1f1f] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#00A8E1]/10 to-transparent pointer-events-none" />
        <h2 className="text-xl font-bold text-white mb-4">Artist Bank</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Advanced Filter Panel */}
          <FilterPanel 
            title="Advanced Filters" 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Roles</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {["Actor", "Director", "Cinematographer", "Editor", "Writer", "Music Director", "VFX Artist"].map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-white/20 bg-[#141414] text-[#00A8E1] focus:ring-[#00A8E1] focus:ring-offset-0" />
                      <span className="text-sm text-gray-300">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Age Range</h3>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" className="bg-[#141414] border-white/10 h-8 text-white" />
                  <span className="text-gray-500">-</span>
                  <Input type="number" placeholder="Max" className="bg-[#141414] border-white/10 h-8 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Location</h3>
                <Input placeholder="Enter city" className="bg-[#141414] border-white/10 text-white h-9" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Attributes</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-[#141414] text-[#00A8E1] focus:ring-[#00A8E1] focus:ring-offset-0" />
                    <span className="text-sm text-gray-300">Verified Artists Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-[#141414] text-[#00A8E1] focus:ring-[#00A8E1] focus:ring-offset-0" />
                    <span className="text-sm text-gray-300">Has Showreel</span>
                  </label>
                </div>
              </div>
            </div>
          </FilterPanel>

          {/* Artist List */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by name, role, or skills..." 
                  className="pl-9 bg-[#1f1f1f] border-white/10 text-white focus-visible:ring-[#00A8E1] w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="lg:hidden border-white/10 bg-[#1f1f1f] shrink-0"
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 text-gray-300" />
              </Button>
            </div>

            <SubscriptionGate fallbackMessage="Subscribe to Production Pro to browse the full infinite Artist Bank">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3">
                {filteredArtists.length > 0 ? filteredArtists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    actionLabel="View Profile"
                    onActionClick={() => window.location.href=`/production/artists/${artist.id}`}
                  />
                )) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                    <Search className="h-8 w-8 mb-4 opacity-50" />
                    <p>No artists found matching your criteria.</p>
                  </div>
                )}
              </div>
            </SubscriptionGate>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
