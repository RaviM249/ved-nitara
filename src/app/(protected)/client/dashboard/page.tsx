"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, CheckSquare, Eye, Search, SlidersHorizontal, MapPin, Star, Bookmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/shared/FilterPanel";
import ArtistCard from "@/components/shared/ArtistCard";
import Link from "next/link";
import SubscriptionGate from "@/components/shared/SubscriptionGate";
import { api } from "@/lib/stubs";
import NotificationFeed from "@/components/shared/NotificationFeed";

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced Filters State
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [locationStr, setLocationStr] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasShowreel, setHasShowreel] = useState(false);

  useEffect(() => {
    async function fetchArtists() {
      try {
        setIsLoading(true);
        const data = await api.getArtists({
          role: selectedRoles.join(","),
          city: locationStr || searchQuery,
          availability: selectedAvailability.join(","),
        });
        setArtists(data);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArtists();
  }, [selectedRoles, locationStr, searchQuery, selectedAvailability]);

  const stats = [
    { name: "Active Projects / Casting", value: "3", icon: Film },
    { name: "Total Profile Views", value: "24", icon: Eye },
    { name: "Shortlisted Artists", value: "12", icon: Bookmark },
    { name: "Confirmed Bookings", value: "5", icon: CheckSquare },
  ];

  const filteredArtists = artists; // Already filtered by API or keeping simple for now

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">
            Client Dashboard
          </h1>
          <p className="text-gray-400 text-sm">Welcome back, {user?.name || "Client Admin"}. Discover top talent for your next project.</p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-black/60 backdrop-blur-xl border-white/10 hover:border-[#00A8E1]/20 transition-all">
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

      <div className="w-full">
        <div className="w-full">
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl p-6 mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#00A8E1]/10 to-transparent pointer-events-none blur-xl" />
            <h2 className="text-xl font-bold text-white mb-4">Artist Bank</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Advanced Filter Panel */}
              <FilterPanel 
                title="Advanced Filters" 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
              >
                <div className="space-y-6">
                  {/* ... Filter content ... (omitted for brevity but kept in file) */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Roles</h3>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {["Actor", "Director", "Cinematographer", "Editor", "Writer", "Music Director", "VFX Artist"].map((role) => {
                          const isSelected = selectedRoles.includes(role);
                          return (
                            <button
                              key={role}
                              onClick={() => {
                                if (isSelected) setSelectedRoles(prev => prev.filter(r => r !== role));
                                else setSelectedRoles(prev => [...prev, role]);
                              }}
                              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 border ${
                                isSelected 
                                  ? 'bg-[#00A8E1]/20 border-[#00A8E1] text-[#00A8E1] shadow-[0_0_10px_rgba(0,168,225,0.2)]' 
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {role}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Age Range</h3>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Input 
                            type="number" 
                            placeholder="Min Age" 
                            value={minAge}
                            onChange={(e) => setMinAge(e.target.value)}
                            className="bg-[#141414] border-white/10 h-10 text-white focus-visible:ring-[#00A8E1] pl-4 transition-all" 
                          />
                        </div>
                        <span className="text-gray-500 font-light">-</span>
                        <div className="relative flex-1">
                          <Input 
                            type="number" 
                            placeholder="Max Age" 
                            value={maxAge}
                            onChange={(e) => setMaxAge(e.target.value)}
                            className="bg-[#141414] border-white/10 h-10 text-white focus-visible:ring-[#00A8E1] pl-4 transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Location</h3>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="Enter city or state" 
                          value={locationStr}
                          onChange={(e) => setLocationStr(e.target.value)}
                          className="bg-[#141414] border-white/10 text-white h-10 pl-9 focus-visible:ring-[#00A8E1] transition-all" 
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Availability</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Full-time', 'Part-time', 'Project-based', 'Weekends Only'].map((avail) => {
                          const isSelected = selectedAvailability.includes(avail);
                          return (
                            <button
                              key={avail}
                              onClick={() => {
                                if (isSelected) setSelectedAvailability(prev => prev.filter(a => a !== avail));
                                else setSelectedAvailability(prev => [...prev, avail]);
                              }}
                              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 border ${
                                isSelected 
                                  ? 'bg-[#00A8E1]/20 border-[#00A8E1] text-[#00A8E1] shadow-[0_0_10px_rgba(0,168,225,0.2)]' 
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {avail}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Attributes</h3>
                      <div className="space-y-3">
                        <button 
                          onClick={() => setVerifiedOnly(!verifiedOnly)}
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#141414] hover:bg-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`h-4 w-4 ${verifiedOnly ? 'text-[#00A8E1]' : 'text-gray-500 group-hover:text-gray-400'} transition-colors`} />
                            <span className={`text-sm ${verifiedOnly ? 'text-white' : 'text-gray-400'} transition-colors`}>Verified Artists Only</span>
                          </div>
                          <div className={`w-8 h-4 rounded-full transition-all duration-300 relative ${verifiedOnly ? 'bg-[#00A8E1]' : 'bg-white/10'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${verifiedOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </button>

                        <button 
                          onClick={() => setHasShowreel(!hasShowreel)}
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#141414] hover:bg-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <Film className={`h-4 w-4 ${hasShowreel ? 'text-[#00A8E1]' : 'text-gray-500 group-hover:text-gray-400'} transition-colors`} />
                            <span className={`text-sm ${hasShowreel ? 'text-white' : 'text-gray-400'} transition-colors`}>Has Showreel</span>
                          </div>
                          <div className={`w-8 h-4 rounded-full transition-all duration-300 relative ${hasShowreel ? 'bg-[#00A8E1]' : 'bg-white/10'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${hasShowreel ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </button>
                      </div>
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
                      className="pl-9 bg-black/60 backdrop-blur-xl border-white/10 text-white focus-visible:ring-[#00A8E1] w-full"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtists.length > 0 ? filteredArtists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      basePath="/client"
                    />
                  )) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                      <Search className="h-8 w-8 mb-4 opacity-50" />
                      <p>No artists found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
