"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { mockArtists } from "@/lib/mockData";
import { Search, SlidersHorizontal, MapPin, ShieldCheck, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/shared/FilterPanel";
import ArtistCard from "@/components/shared/ArtistCard";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PublicTalentBank() {
  const [mounted, setMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Filters State
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [locationStr, setLocationStr] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasShowreel, setHasShowreel] = useState(false);

  const { scrollYProgress } = useScroll();

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.15]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredArtists = mockArtists.filter(artist => {
    // Keyword search
    if (searchQuery && !artist.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !artist.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !artist.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Role filtering
    if (selectedRoles.length > 0 && !artist.roles.some(r => selectedRoles.includes(r))) {
      return false;
    }

    // Location filtering
    if (locationStr && !artist.city.toLowerCase().includes(locationStr.toLowerCase()) && !artist.state.toLowerCase().includes(locationStr.toLowerCase())) {
      return false;
    }

    // Attributes filtering
    if (verifiedOnly && !artist.isVerified) {
      return false;
    }
    if (hasShowreel && !artist.showreelUrl) {
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
