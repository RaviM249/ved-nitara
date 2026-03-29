"use client";

import { useEffect, useState, use } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Play, MessageSquare, BookmarkPlus, ArrowLeft, ShieldCheck, FileText, FileAudio, ExternalLink, Globe, Instagram, Mail, Layout, Images, Video, Music, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/stubs";

export default function ArtistProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artistId = resolvedParams.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [artist, setArtist] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fire analytics silently
        api.trackProfileView(artistId);
        
        const [artistData, reviewsData] = await Promise.all([
          api.getArtistById(artistId),
          api.getReviews(artistId)
        ]);
        setArtist(artistData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to fetch artist details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [artistId]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (!artist) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-2">Artist Not Found</h2>
          <Button asChild variant="outline" className="text-white border-white/20">
            <Link href="/client/talent-bank">Back to Artist Bank</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* ─── Top Navigation ─── */}
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="text-gray-400 hover:text-white hover:bg-white/5 -ml-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Search
        </Button>
        <div className="flex gap-2">
          <button className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-[#00A8E1] hover:border-[#00A8E1]/40 transition-all">
            <Instagram className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-[#00A8E1] hover:border-[#00A8E1]/40 transition-all">
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ─── Left Column: Profile Card ─── */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl relative"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-square overflow-hidden group">
              <img 
                src={artist.profilePhoto} 
                alt={artist.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-transparent to-transparent opacity-90" />
              
              {/* Floating Verified Badge */}
              {artist.isVerified && (
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl rounded-full px-3 py-1.5 flex items-center border border-white/20 shadow-lg">
                  <ShieldCheck className="h-4 w-4 text-[#00A8E1] mr-1.5" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Verified Artist</span>
                </div>
              )}

              {/* Name Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl font-display text-white leading-tight mb-2 tracking-wide drop-shadow-md">
                  {artist.name}
                </h1>
                <div className="flex items-center text-gray-300 text-sm font-medium">
                  <MapPin className="h-4 w-4 mr-1.5 text-[#00A8E1]" /> {artist.city}, {artist.state}
                </div>
              </div>
            </div>
            
            <div className="p-6 relative">
              {/* Glow background */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-[#00A8E1]/10 blur-[40px] rounded-full pointer-events-none" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-8 relative z-10">
                <button 
                  onClick={() => router.push(`/client/inbox?artistId=${artistId}`)}
                  className="w-full h-11 bg-[#00A8E1] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#0082B4] transition-all hover:shadow-[0_0_20px_rgba(0,168,225,0.4)] group"
                >
                  <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" /> Message Artist
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 h-11 border border-white/10 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all group">
                    <BookmarkPlus className="h-4 w-4 text-[#00A8E1] group-hover:scale-110 transition-transform" /> Shortlist
                  </button>
                  <button className="flex-1 h-11 border border-white/10 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all group">
                    <FileText className="h-4 w-4 text-[#00A8E1] group-hover:scale-110 transition-transform" /> Resume
                  </button>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-6 relative z-10">
                <div>
                  <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-3">Primary Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {(artist.roles || []).map((r: string) => (
                      <span key={r} className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full bg-[#00A8E1]/10 border border-[#00A8E1]/20 text-[#00A8E1] hover:bg-[#00A8E1]/20 transition-colors cursor-default">
                        {r.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-3">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(artist.skills || []).map((s: string) => (
                      <span key={s} className="text-xs font-medium text-gray-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Languages</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                    {artist.languages?.join(" • ")}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Platform Rating</h3>
                  <div className="flex items-center text-white font-black text-sm">
                    <Star className="h-4 w-4 fill-[#00A8E1] text-[#00A8E1] mr-1.5 drop-shadow-[0_0_8px_rgba(0,168,225,0.4)]" />
                    {artist.rating} <span className="text-gray-500 font-medium ml-1.5">({reviews.length})</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Right Column: Content Area ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layout className="h-32 w-32 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="h-1 w-6 rounded-full bg-[#00A8E1]" />
              About Artist
            </h2>
            <p className="text-gray-300 leading-[1.8] text-base font-light">
              {artist.bio || `${artist.name} is a professional ${(artist.roles?.[0] || 'artist').toLowerCase()} based in ${artist.city}, known for their versatile performances and dedication to the craft. They have collaborated on various independent and commercial projects.`}
            </p>
          </motion.div>

          {/* Portfolio & Media Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="h-1 w-6 rounded-full bg-[#00A8E1]" />
                Portfolio & Media
              </h2>
              <div className="flex rounded-full bg-white/5 p-1 border border-white/5">
                <button 
                  onClick={() => setActiveTab('portfolio')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'portfolio' ? 'bg-[#00A8E1] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Work
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'reviews' ? 'bg-[#00A8E1] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Reviews
                </button>
              </div>
            </div>

            {activeTab === 'portfolio' ? (
              <div className="space-y-10">
                {/* Video Showreels */}
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Video className="h-3.5 w-3.5 text-[#00A8E1]" /> Video Showreels
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="aspect-video bg-[#0A0A0A] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-lg">
                      <img src={artist.profilePhoto} alt="Showreel Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-500 blur-[2px] scale-110 group-hover:scale-100" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-[#00A8E1]/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(0,168,225,0.6)] group-hover:scale-110 transition-all duration-300">
                          <Play className="h-6 w-6 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex justify-between items-center text-xs text-white">
                          <span className="font-bold tracking-wide">Main Acting Showreel 2024</span>
                          <span className="bg-black/50 px-2 py-0.5 rounded backdrop-blur-md">2:45</span>
                        </div>
                      </div>
                    </div>
                    <div className="aspect-video bg-[#0A0A0A] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-black" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-white/5 text-white flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:bg-[#00A8E1]/80 group-hover:border-[#00A8E1]/40 group-hover:scale-110 transition-all duration-300 shadow-xl">
                          <Play className="h-6 w-6 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex justify-between items-center text-xs text-white">
                          <span className="font-bold tracking-wide">Dramatic Monologue</span>
                          <span className="bg-black/50 px-2 py-0.5 rounded backdrop-blur-md">1:15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Images */}
                <div>
                   <h3 className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Images className="h-3.5 w-3.5 text-[#00A8E1]" /> Photo Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(artist.portfolioImages || []).map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 group relative cursor-pointer shadow-md">
                         <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Portfolio ${i}`} />
                         <div className="absolute inset-0 bg-[#00A8E1]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audio Samples */}
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Music className="h-3.5 w-3.5 text-[#00A8E1]" /> Voiceover & Audio
                  </h3>
                  <div className="grid gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-[#00A8E1]/10 text-[#00A8E1] flex items-center justify-center shrink-0 border border-[#00A8E1]/20 group-hover:bg-[#00A8E1] group-hover:text-white transition-all shadow-md">
                          <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-bold truncate tracking-wide">Voiceover Demo - Commercial {i}</p>
                          <div className="h-6 w-full mt-1.5 opacity-30 flex items-center gap-0.5 group-hover:opacity-60 transition-opacity">
                             {[...Array(40)].map((_, idx) => (
                               <div key={idx} className="w-[2px] bg-white rounded-full" style={{ height: `${20 + Math.random() * 80}%` }} />
                             ))}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 shrink-0 bg-black/40 px-2 py-1 rounded-md">0:45</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Reviews View */
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  <div className="grid gap-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#00A8E1]/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Star className="h-12 w-12 text-[#00A8E1]" />
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00A8E1] to-[#0082B4] flex items-center justify-center text-white font-bold text-xs shadow-lg">
                               {review.reviewerName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm">{review.reviewerName}</h4>
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? "fill-[#00A8E1] text-[#00A8E1] drop-shadow-[0_0_5px_rgba(0,168,225,0.5)]" : "text-gray-600"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm italic font-light relative z-10">&ldquo;{review.comment}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 grayscale opacity-40">
                     <Star className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                     <p className="text-gray-500 font-medium">This artist doesn't have any reviews yet.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
