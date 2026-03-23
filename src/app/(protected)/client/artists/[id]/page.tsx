"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { mockArtists, mockReviews } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Play, MessageSquare, BookmarkPlus, ArrowLeft, ShieldCheck, FileText, FileAudio } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";

export default function ArtistProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artistId = resolvedParams.id;
  const router = useRouter();
  
  const artist = mockArtists.find(a => a.id === artistId);
  const artistReviews = mockReviews.filter(r => r.revieweeId === artistId);

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
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:text-white -ml-3 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Search
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <Card className="bg-[#1f1f1f] border-white/5 overflow-hidden">
            <div className="relative aspect-square">
              <img src={artist.profilePhoto} alt={artist.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {artist.isVerified && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center border border-white/10">
                  <ShieldCheck className="h-4 w-4 text-[#00A8E1] mr-1.5" />
                  <span className="text-xs font-medium text-white">Verified</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-3xl font-display text-white leading-none mb-1">{artist.name}</h1>
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin className="h-3 w-3 mr-1" /> {artist.city}, {artist.state}
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex flex-col gap-3 mb-6">
                <Button className="w-full bg-[#00A8E1] text-white hover:bg-[#0082B4]">
                  <MessageSquare className="h-4 w-4 mr-2" /> Message Artist
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                    <BookmarkPlus className="h-4 w-4 mr-2" /> Shortlist
                  </Button>
                  <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                    <FileText className="h-4 w-4 mr-2" /> View Resume
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Primary Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.roles.map(r => (
                      <Badge key={r} variant="secondary" className="bg-white/10 text-white border-none">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.skills?.map(s => (
                      <span key={s} className="text-xs text-gray-300 bg-[#141414] px-2 py-1 rounded border border-white/5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.languages?.map(lang => (
                      <span key={lang} className="text-xs text-gray-300">
                        {lang}
                      </span>
                    )).reduce((prev, curr) => [prev, <span key={`sep-${curr.key}`} className="text-gray-600 px-1">•</span>, curr] as any)}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center text-white font-bold">
                      <Star className="h-4 w-4 fill-[#00A8E1] text-[#00A8E1] mr-1" />
                      {artist.rating} ({artistReviews.length})
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Media & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                {artist.bio || `${artist.name} is a professional ${artist.roles[0].toLowerCase()} based in ${artist.city}, known for their versatile performances and dedication to the craft. They have collaborated on various independent and commercial projects.`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">Portfolio & Media</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-medium text-white mb-3">Showreels</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="aspect-video bg-[#141414] border border-white/10 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <img src={artist.profilePhoto} alt="Showreel Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity blur-sm scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-[#00A8E1]/90 text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,168,225,0.5)] group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-white drop-shadow-md">
                    <span className="font-medium">Main Acting Showreel 2024</span>
                    <span>2:45</span>
                  </div>
                </div>
                <div className="aspect-video bg-[#141414] border border-white/10 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[#2a2a2a] opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-sm group-hover:bg-[#00A8E1]/80 group-hover:scale-110 transition-all">
                      <Play className="h-5 w-5 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-white">
                    <span className="font-medium">Dramatic Monologue</span>
                    <span>1:15</span>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-medium text-white mb-3">Audio Samples</h3>
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-4 bg-[#141414] border border-white/5 rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/10 text-white shrink-0 hover:bg-[#00A8E1]">
                      <Play className="h-3 w-3 ml-0.5" fill="currentColor" />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">Voiceover Demo - Commercial {i}</p>
                      <img src="https://images.unsplash.com/photo-1614605151528-93666f7f63ee?q=80&w=2670&auto=format&fit=crop" className="h-4 w-full object-cover opacity-50 mt-1 rounded" alt="waveform" />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">0:45</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {artistReviews.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {artistReviews.map((review) => (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-white text-sm">{review.reviewerName}</h4>
                          <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? "fill-[#00A8E1] text-[#00A8E1]" : "text-gray-600"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">This artist doesn't have any reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
