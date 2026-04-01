"use client";

import { useAuthStore } from "@/lib/store/authStore";
import PageWrapper from "@/components/layout/PageWrapper";
import { Eye, Briefcase, Star, MessageSquare, TrendingUp, Sparkles, ArrowUpRight, ChevronRight, MapPin, Clock, IndianRupee, CheckCircle2, Circle, Play, ShieldCheck } from "lucide-react";
import SubscriptionGate from "@/components/shared/SubscriptionGate";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { api } from "@/lib/stubs";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import NotificationFeed from "@/components/shared/NotificationFeed";

const statusConfig: Record<string, { color: string; bg: string }> = {
  CONFIRMED: { color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" },
  PENDING: { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  CANCELLED: { color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
  COMPLETED: { color: "text-sky-400", bg: "bg-sky-500/15 border-sky-500/30" },
};

function AnimatedCounter({ value, duration = 2000 }: { value: number, duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out cubic
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.floor(easeOutCubic * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    if (value > 0) {
      window.requestAnimationFrame(step);
    } else {
      setDisplayValue(0);
    }
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

export default function ArtistDashboard() {
  const { user, isSubscribed } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [recentOpps, setRecentOpps] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  const handleApply = async (id: string) => {
    try {
      const res = await api.applyToJob(id);
      if (res.success) {
        setApplied(prev => ({ ...prev, [id]: true }));
        toast.success("Application submitted successfully!");
      } else {
        if (res.limitReached) {
          toast.error("Limit Reached", {
            description: res.message,
            action: {
              label: "Upgrade",
              onClick: () => window.location.href = "/pricing"
            }
          });
        } else {
          toast.error(res.error || "Failed to submit application.");
        }
      }
    } catch (err) {
      toast.error("An error occurred while applying.");
    }
  };

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, oppsRes, bookingsRes, convRes] = await Promise.all([
          api.getTalentProfile(),
          api.getFacultyRequirements(),
          api.getBookings(),
          api.getConversations()
        ]);

        if (profileRes.profile) setProfile(profileRes.profile);
        setRecentOpps(oppsRes.slice(0, 3));
        setRecentBookings(bookingsRes.filter((b: any) => b.artistId === user?.id).slice(0, 3));
        
        // Populate applied status map
        const appliedMap: Record<string, boolean> = {};
        oppsRes.forEach((opp: any) => {
          if (opp.isApplied) appliedMap[opp.id] = true;
        });
        setApplied(appliedMap);

        // Calculate unread count
        const unread = convRes.filter((c: any) => c.hasUnread).length;
        setUnreadCount(unread);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    fetchData();
  }, [user?.id]);

  const stats = [
    { name: "Profile Views", value: profile?.profileViews || 0, change: "Live", icon: Eye, positive: true, isAnimated: true, link: "/talent/profile" },
    { name: "Total Bookings", value: recentBookings.length, change: "New", icon: Briefcase, positive: true, isAnimated: false, link: "/talent/bookings" },
    { name: "Average Rating", value: "0.0", change: "N/A", icon: Star, positive: true, isAnimated: false, link: "/talent/reviews" },
    { name: "Client Inquiries", value: unreadCount, change: unreadCount > 0 ? "Pending" : "None", icon: MessageSquare, positive: unreadCount > 0, isAnimated: unreadCount > 0, link: "/talent/inbox" },
  ];



  const profileChecklist = [
    { label: "Basic Information", done: !!user },
    { label: "Bio & Experience", done: !!profile?.bio },
    { label: "Skills added", done: !!profile?.skills?.length },
    { label: "Profile Picture", done: !!profile?.imageUrl },
  ];

  const completionPercent = Math.round((profileChecklist.filter(i => i.done).length / profileChecklist.length) * 100);

  return (
    <PageWrapper>
      {/* ─── Hero / Welcome Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1f2b] via-[#0a1520] to-black px-8 py-8 shadow-2xl"
      >
        {/* Glow blobs */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#00A8E1]/20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-[#00A8E1]/10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#00A8E1]/15 border border-[#00A8E1]/30 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-[#00A8E1]" />
              <span className="text-xs font-medium text-[#00A8E1] tracking-wide">Talent Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-white mb-1 tracking-wide">
              Welcome back,{" "}
              <span className="text-[#00A8E1] drop-shadow-[0_0_20px_rgba(0,168,225,0.5)]">
                {user?.name?.split(" ")[0] || "Artist"}
              </span>
            </h1>
            <p className="text-gray-400">Here's what's happening with your profile today.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5 gap-2">
              <Link href="/talent/profile">
                Edit Profile
              </Link>
            </Button>
            <Button asChild className="bg-[#00A8E1] text-white hover:bg-[#0082B4] shadow-[0_0_20px_rgba(0,168,225,0.25)] gap-2">
              <Link href="/talent/jobs">
                <Play className="h-4 w-4" /> Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ─── Verification Warning ─── */}
      {!user?.isVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center gap-4 text-amber-200"
        >
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Account Pending Verification</h4>
            <p className="text-xs text-amber-200/70">Your profile is currently under review by our team. You will still be visible in the talent bank.</p>
          </div>
        </motion.div>
      )}

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 hover:border-[#00A8E1]/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,168,225,0.08)] h-full cursor-pointer"
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm text-gray-400 font-medium">{stat.name}</p>
                  <div className="h-9 w-9 rounded-xl bg-[#00A8E1]/15 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-[#00A8E1]" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.isAnimated ? (
                    <AnimatedCounter value={Number(stat.value)} duration={2000} />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-3 w-3 ${stat.positive ? "text-emerald-400" : "text-amber-400"}`} />
                  <p className={`text-xs font-medium ${stat.positive ? "text-emerald-400" : "text-amber-400"}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>


      {/* ─── Main Content Grid ─── */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Recommended Opportunities */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="h-1 w-5 rounded-full bg-[#00A8E1] inline-block" />
                Recommended Opportunities
              </h2>
              <Link href="/talent/faculty" className="flex items-center gap-1 text-sm text-[#00A8E1] hover:text-[#0082B4] font-medium transition-colors group">
                View all <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentOpps.map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="group relative rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 hover:border-[#00A8E1]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,168,225,0.07)]"
                >
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-white text-base">{opp.roleNeeded || opp.title}</h3>
                        <Badge className="bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30 text-[10px] px-2">
                          {opp.duration || opp.type || "Project"}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{opp.subject || opp.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#00A8E1]/60" />{opp.city || opp.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3 text-[#00A8E1]/60" />
                          {(opp.budgetMin || 0).toLocaleString()} – {(opp.budgetMax || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {applied[opp.id] ? (
                      <Button disabled size="sm" className="shrink-0 bg-green-500/20 text-green-500 font-semibold px-5">
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Applied
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleApply(opp.id)}
                        size="sm"
                        className="shrink-0 bg-white text-black hover:bg-gray-100 font-semibold px-5"
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recent Bookings */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="h-1 w-5 rounded-full bg-[#00A8E1] inline-block" />
                Recent Bookings
              </h2>
              <Link href="/talent/bookings" className="flex items-center gap-1 text-sm text-[#00A8E1] hover:text-[#0082B4] font-medium transition-colors group">
                View all <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentBookings.length > 0 ? recentBookings.map((b) => {
                const cfg = statusConfig[b.status] || statusConfig.PENDING;
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl p-4 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-xl bg-[#00A8E1]/10 flex items-center justify-center shrink-0">
                        <Briefcase className="h-4 w-4 text-[#00A8E1]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{b.eventType}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-3 w-3" />{b.eventDate}
                          <span className="h-1 w-1 rounded-full bg-gray-600 inline-block" />
                          <MapPin className="h-3 w-3" />{b.city}
                        </p>
                      </div>
                    </div>
                    <Badge className={`border text-xs px-2.5 ${cfg.bg} ${cfg.color}`}>
                      {b.status}
                    </Badge>
                  </div>
                );
              }) : (
                <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-black/20">
                  <Briefcase className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recent bookings yet.</p>
                  <p className="text-gray-600 text-xs mt-1">Keep applying to opportunities above!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Profile Completion Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#00A8E1]/20 bg-gradient-to-br from-black/80 to-[#0d1f2b]/80 backdrop-blur-xl p-6">
            <div className="absolute top-0 right-0 h-32 w-32 bg-[#00A8E1]/10 blur-[50px] rounded-full pointer-events-none" />
            <div className="relative">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-[#00A8E1]/20 flex items-center justify-center">
                  <Star className="h-3.5 w-3.5 text-[#00A8E1]" />
                </div>
                Profile Status
              </h3>

              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-gray-400">Completion</span>
                <span className="text-2xl font-bold text-[#00A8E1]">{completionPercent}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00A8E1] to-[#00c9ff] h-1.5 rounded-full shadow-[0_0_8px_rgba(0,168,225,0.7)] transition-all duration-700"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              <ul className="space-y-2.5 mb-6">
                {profileChecklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {item.done
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      : <Circle className="h-4 w-4 text-gray-600 shrink-0" />
                    }
                    <span className={item.done ? "text-gray-300" : "text-gray-500"}>{item.label}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 gap-2">
                <Link href="/talent/profile">
                  Complete Profile <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Upgrade to Pro */}
        </div>
      </div>
    </PageWrapper>
  );
}
