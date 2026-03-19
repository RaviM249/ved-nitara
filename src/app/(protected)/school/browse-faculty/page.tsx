"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterPanel from "@/components/shared/FilterPanel";
import ArtistCard from "@/components/shared/ArtistCard";
import { mockArtists } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search } from "lucide-react";

export default function BrowseFacultyPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const faculty = mockArtists.filter(artist => {
    // Basic search simulation
    if (searchQuery && !artist.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !artist.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Panel */}
        <FilterPanel 
          title="Filter Faculty" 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Expertise</h3>
              <div className="space-y-2">
                {["Acting", "Direction", "Cinematography", "Screenwriting"].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-[#141414] text-[#E50914] focus:ring-[#E50914] focus:ring-offset-0" />
                    <span className="text-sm text-gray-300">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-3">Location</h3>
              <select className="w-full bg-[#141414] border border-white/10 rounded-md h-10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]">
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-3">Verified Status</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-[#141414] text-[#E50914] focus:ring-[#E50914] focus:ring-offset-0" />
                <span className="text-sm text-gray-300">Verified Faculty Only</span>
              </label>
            </div>
          </div>
        </FilterPanel>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-display text-white mb-2">Browse Faculty</h1>
              <p className="text-gray-400 text-sm">Discover experienced artists for guest lectures and workshops.</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by name or discipline..." 
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {faculty.length > 0 ? faculty.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                actionLabel="Shortlist / Contact"
                onActionClick={() => console.log('Shortlist', artist.id)}
              />
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#1f1f1f] rounded-xl border border-white/5">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No faculty found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search query.</p>
                <Button variant="outline" className="mt-6 border-white/10 text-white" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
