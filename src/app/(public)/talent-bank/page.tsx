"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { mockArtists } from "@/lib/mockData";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/shared/FilterPanel";
import ArtistCard from "@/components/shared/ArtistCard";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PublicTalentBank() {
  const [mounted, setMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollYProgress } = useScroll();

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.15]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredArtists = mockArtists.filter(artist => {
    if (searchQuery && !artist.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !artist.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !artist.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
      {/* Background - Fixed behind content */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,w_1920/v1774014712/Gemini_Generated_Image_iokyfxiokyfxioky_pj6xc5.png')" }}
      />
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/70 to-[#0F171E]/40" />
        <div className="absolute inset-0 z-0 bg-black/40" />
      </motion.div>

      <PageWrapper className="relative z-10 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 text-white">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-display mb-3 tracking-wide drop-shadow-md"
              >
                TALENT <span className="text-[#00A8E1]">BANK</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 text-base md:text-lg max-w-xl"
              >
                Discover and hire from thousands of verified profiles securely on Ved Nitara. Login to chat directly and book.
              </motion.p>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-2xl text-white border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              {/* Filter Panel */}
              <FilterPanel 
                title="Filters" 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Roles</h3>
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
                    <h3 className="text-sm font-medium mb-3">Location</h3>
                    <Input placeholder="Enter city" className="bg-[#141414] border-white/10 text-white h-9" />
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
                      className="pl-9 bg-[#141414]/50 border-white/10 focus-visible:ring-[#00A8E1] w-full"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
                  {filteredArtists.length > 0 ? filteredArtists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      profileUrl={`/register?intent=hire`}
                    />
                  )) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                      <Search className="h-10 w-10 mb-4 opacity-50" />
                      <p>No artists found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
