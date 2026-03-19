"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterPanel from "@/components/shared/FilterPanel";
import SubscriptionGate from "@/components/shared/SubscriptionGate";
import { mockFacultyRequirements } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Search, MapPin, IndianRupee, Clock, Briefcase } from "lucide-react";

export default function FacultyOpportunitiesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOpps = mockFacultyRequirements.filter(opp => {
    if (searchQuery && !opp.roleNeeded.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !opp.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Added simplified mock filtering
    return opp.isActive;
  });

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Panel */}
        <FilterPanel 
          title="Filter Opportunities" 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Duration</h3>
              <div className="space-y-2">
                {["Short-term", "Long-term", "Project-based"].map((duration) => (
                  <label key={duration} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-[#141414] text-[#E50914] focus:ring-[#E50914] focus:ring-offset-0" />
                    <span className="text-sm text-gray-300">{duration}</span>
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
              <h3 className="text-sm font-medium text-white mb-3">Budget Range (₹)</h3>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" className="bg-[#141414] border-white/10 h-8" />
                <span className="text-gray-500">-</span>
                <Input type="number" placeholder="Max" className="bg-[#141414] border-white/10 h-8" />
              </div>
            </div>
          </div>
        </FilterPanel>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-display text-white mb-2">Faculty Opportunities</h1>
              <p className="text-gray-400 text-sm">Discover and apply for teaching roles at top entertainment schools.</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search roles or subjects..." 
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

          <SubscriptionGate fallbackMessage="Subscribe to view all opportunities and apply">
            <div className="space-y-4">
              {filteredOpps.length > 0 ? filteredOpps.map((opp) => (
                <Card key={opp.id} className="bg-[#1f1f1f] border-white/5 overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1">
                  <div className="p-1 w-full bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent"></div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-white">{opp.roleNeeded}</h2>
                          <Badge variant="outline" className="border-[#E50914]/30 text-[#E50914] bg-[#E50914]/10">
                            {opp.duration}
                          </Badge>
                          <span className="text-xs text-gray-500">Posted 2 days ago</span>
                        </div>
                        
                        <div className="text-lg text-gray-300 mb-4">{opp.subject}</div>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-400 mb-6">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 opacity-70" />
                            {opp.city}
                          </div>
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-2 opacity-70" />
                            ₹{opp.budgetMin.toLocaleString()} - ₹{opp.budgetMax.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 opacity-70" />
                            Starts {new Date(opp.startDate || opp.postedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 opacity-70" />
                            {opp.schoolId === 's1' ? 'National School of Drama' : 'Whistling Woods'}
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <h4 className="text-sm font-semibold text-white">Requirements:</h4>
                          <ul className="grid sm:grid-cols-2 gap-2">
                            {(opp.requirements || []).map((req, i) => (
                              <li key={i} className="flex items-start text-sm text-gray-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#E50914] mt-2 mr-2 shrink-0"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-2">{opp.description}</p>
                      </div>
                      
                      <div className="flex flex-col gap-3 min-w-[140px] border-t border-white/10 md:border-t-0 md:border-l md:border-white/10 pt-4 md:pt-0 md:pl-6 justify-center">
                        <Button className="w-full bg-[#E50914] text-white hover:bg-[#b80710]">
                          Apply Now
                        </Button>
                        <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:text-white hover:bg-white/10">
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 bg-[#1f1f1f] rounded-xl border border-white/5">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No opportunities found</h3>
                  <p className="text-gray-400 text-sm">Try adjusting your filters or search query.</p>
                  <Button variant="outline" className="mt-6 border-white/10 text-white" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </SubscriptionGate>
        </div>
      </div>
    </PageWrapper>
  );
}
