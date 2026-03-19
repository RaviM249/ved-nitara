"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { mockFacultyRequirements, mockArtists } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function SchoolDashboard() {
  const { user } = useAuthStore();
  
  // Using school 's1' for demo purposes
  const schoolId = 's1';
  const requirements = mockFacultyRequirements.filter(r => r.schoolId === schoolId);
  
  const stats = [
    { name: "Active Requirements", value: requirements.filter(r => r.status === 'OPEN').length, icon: FileText },
    { name: "Total Applicants", value: "24", icon: Users },
    { name: "Shortlisted Faculty", value: "8", icon: CheckSquare },
    { name: "Profile Views", value: "156", icon: Eye },
  ];

  const recentRequirements = requirements.slice(0, 3);
  
  // Recommend some top faculty (verified artists with teaching interest)
  const recommendedFaculty = mockArtists.filter(a => a.isVerified).slice(0, 4);

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">
            Welcome, {user?.name || "School Admin"}
          </h1>
          <p className="text-gray-400 text-sm">Manage your institution's profile and guest faculty requirements.</p>
        </div>
        <Button asChild className="bg-[#E50914] text-white hover:bg-[#b80710]">
          <Link href="/school/requirements/new">
            <span className="text-lg mr-2 leading-none pb-0.5">+</span> Post Requirement
          </Link>
        </Button>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Your Recent Requirements</h2>
              <Link href="/school/requirements" className="text-sm text-[#E50914] hover:text-[#b80710] font-medium">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentRequirements.length > 0 ? recentRequirements.map((req) => (
                <Card key={req.id} className="bg-[#1f1f1f] border-white/5 overflow-hidden">
                  <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-lg">{req.roleNeeded}</h3>
                        <Badge variant="outline" className={`
                          ${req.status === 'OPEN' ? 'border-green-500/30 text-green-500 bg-green-500/10' : ''}
                          ${req.status === 'CLOSED' ? 'border-red-500/30 text-red-500 bg-red-500/10' : ''}
                        `}>
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{req.subject} • {req.duration}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
                      <div className="text-center px-4 border-r border-white/10">
                        <div className="text-xl font-bold text-white">12</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Applicants</div>
                      </div>
                      <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 ml-auto">
                        View Submissions
                      </Button>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-12 bg-[#1f1f1f] rounded-xl border border-white/5 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  No requirements posted yet.
                  <div className="mt-4">
                    <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
                      <Link href="/school/requirements/new">Post your first requirement</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="bg-[#141414] border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white text-lg">Top Faculty Matches</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {recommendedFaculty.map((artist) => (
                  <div key={artist.id} className="p-4 flex items-center gap-3 hover:bg-white/5 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-[#E50914]">
                    <img src={artist.profilePhoto} alt={artist.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{artist.name}</h4>
                      <p className="text-xs text-gray-400 truncate">{artist.roles.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/5">
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white" asChild>
                  <Link href="/school/browse-faculty">Browse all faculty</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
