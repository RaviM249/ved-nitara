"use client";

import { useAuthStore } from "@/lib/store/authStore";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Briefcase, Star, MessageSquare } from "lucide-react";
import SubscriptionGate from "@/components/shared/SubscriptionGate";
import { mockBookings, mockFacultyRequirements } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArtistDashboard() {
  const { user, isSubscribed } = useAuthStore();
  
  // Stats
  const stats = [
    { name: "Profile Views", value: "2,405", change: "+14%", icon: Eye },
    { name: "Total Bookings", value: "12", change: "+2", icon: Briefcase },
    { name: "Average Rating", value: "4.8", change: "+0.2", icon: Star },
    { name: "Unread Messages", value: "5", change: "New", icon: MessageSquare },
  ];

  // Recent opps
  const recentOpps = mockFacultyRequirements.slice(0, 3);
  
  // Recent bookings/applications
  const recentBookings = mockBookings.filter(b => b.artistId === 'a1').slice(0, 3); // using 'a1' for demo

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2 tracking-wide">
          Welcome back, {user?.name || "Artist"}
        </h1>
        <p className="text-gray-400 text-sm">Here is what's happening with your profile today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#1f1f1f] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-[#E50914]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-xs text-green-500 font-medium">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Opportunities */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recommended Opportunities</h2>
              <Link href="/artist/faculty" className="text-sm text-[#E50914] hover:text-[#b80710] font-medium">
                View all
              </Link>
            </div>
            
            <SubscriptionGate fallbackMessage="Subscribe to view Faculty Opportunities">
              <div className="space-y-4">
                {recentOpps.map((opp) => (
                  <Card key={opp.id} className="bg-[#1f1f1f] border-white/5 hover:border-white/20 transition-colors">
                    <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-white">{opp.roleNeeded}</h3>
                          <Badge variant="outline" className="border-[#E50914]/30 text-[#E50914] bg-[#E50914]/10">
                            {opp.duration}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{opp.subject} • {opp.city}</p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-white/5 text-gray-300">₹{opp.budgetMin} - ₹{opp.budgetMax}</Badge>
                        </div>
                      </div>
                      <Button className="w-full md:w-auto bg-white text-black hover:bg-gray-200" size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </SubscriptionGate>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Applications & Bookings</h2>
              <Link href="/artist/bookings" className="text-sm text-[#E50914] hover:text-[#b80710] font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? recentBookings.map((b) => (
                <div key={b.id} className="bg-[#1f1f1f] border border-white/5 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{b.eventType}</h4>
                    <p className="text-sm text-gray-400">{b.eventDate} • {b.eventCity}</p>
                  </div>
                  <Badge className={`
                    ${b.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : ''}
                    ${b.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20' : ''}
                    ${b.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/20' : ''}
                    ${b.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/20' : ''}
                  `}>
                    {b.status}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-8 bg-[#1f1f1f] border border-white/5 rounded-lg text-gray-400 text-sm">
                  You have no recent bookings. Keep applying!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Profile Completion & Subs */}
        <div className="space-y-6">
          <Card className="bg-[#141414] border-[#E50914]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Star className="h-24 w-24 text-[#E50914]" />
            </div>
            <CardHeader>
              <CardTitle className="text-white text-lg">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-300">Completion</span>
                <span className="text-[#E50914] font-bold">85%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                <div className="bg-[#E50914] h-2 rounded-full shadow-[0_0_10px_#E50914]" style={{ width: '85%' }}></div>
              </div>
              
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-center text-gray-300">
                  <span className="h-4 w-4 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mr-3 text-[10px] fill-current">✓</span>
                  Basic Information
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="h-4 w-4 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mr-3 text-[10px] fill-current">✓</span>
                  Showreel Upload
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center mr-3 text-[10px]"></span>
                  Connect Instagram
                </li>
              </ul>

              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5" asChild>
                <Link href="/artist/profile">Complete Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {!isSubscribed && (
            <div className="bg-gradient-to-br from-[#1f1f1f] to-[#141414] border border-[#E50914]/30 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-[#E50914]/20 blur-2xl rounded-full pointer-events-none"></div>
              <h3 className="font-bold text-white text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-gray-400 text-sm mb-4">Unlock faculty opportunities, unlimited applications, and direct messaging.</p>
              <Button asChild className="w-full bg-[#E50914] text-white hover:bg-[#b80710] shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
