"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { mockReviews, mockPayments } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, FileText, Download, ShieldCheck, CreditCard, CalendarDays } from "lucide-react";
import Link from "next/link";
import SubscriptionBadge from "@/components/shared/SubscriptionBadge";

export default function ArtistReviewsSubscriptionPage() {
  const { isSubscribed } = useAuthStore();
  
  // Mock data for demo artist 'a1'
  const artistReviews = mockReviews.filter(r => r.artistId === 'a1');
  const artistPayments = mockPayments.filter(p => p.userId === 'a1');

  const avgRating = artistReviews.length > 0 
    ? (artistReviews.reduce((acc, r) => acc + r.rating, 0) / artistReviews.length).toFixed(1)
    : "0.0";

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">Reviews & Subscription</h1>
        <p className="text-gray-400 text-sm">Manage your reputation and billing details.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader className="border-b border-white/10 pb-4 flex flex-row justify-between items-center">
              <CardTitle className="text-white">Client Reviews</CardTitle>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-[#E50914] text-[#E50914]" />
                <span className="text-xl font-bold text-white">{avgRating}</span>
                <span className="text-gray-400 text-sm">({artistReviews.length} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {artistReviews.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {artistReviews.map((review) => (
                    <div key={review.id} className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-white flex items-center gap-2">
                            {review.reviewerName}
                            {review.reviewerRole === "CLIENT" && (
                              <Badge variant="outline" className="text-[10px] h-5 border-blue-500/30 text-blue-400">Client</Badge>
                            )}
                            {review.reviewerRole === "PRODUCTION" && (
                              <Badge variant="outline" className="text-[10px] h-5 border-purple-500/30 text-purple-400">Production</Badge>
                            )}
                          </h4>
                          <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? "fill-[#E50914] text-[#E50914]" : "text-gray-600"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>You don't have any reviews yet.</p>
                  <p className="text-sm mt-1">Complete bookings to receive verified reviews.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Subscription & Billing */}
        <div className="space-y-6">
          <Card className={`border ${isSubscribed ? 'bg-gradient-to-br from-[#1f1f1f] to-[#141414] border-[#E50914]/30' : 'bg-[#1f1f1f] border-white/5'} relative overflow-hidden`}>
            {isSubscribed && (
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-[#E50914]/10 blur-2xl rounded-full pointer-events-none"></div>
            )}
            
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center justify-between">
                <span>Current Plan</span>
                {isSubscribed ? <SubscriptionBadge /> : <Badge variant="outline" className="text-gray-400">Free Tier</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubscribed ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-display text-white mb-1">Artist Pro (Annual)</h3>
                    <p className="text-gray-400 text-sm flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1.5" /> Renews on Oct 15, 2026
                    </p>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-300">
                      <ShieldCheck className="h-4 w-4 text-[#E50914] mr-2" /> Verified Profile
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Star className="h-4 w-4 text-[#E50914] mr-2" /> Priority in Search
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <FileText className="h-4 w-4 text-[#E50914] mr-2" /> Unlimited Applications
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                    Manage Subscription
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <div className="h-16 w-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 mb-4 text-sm">Upgrade to unlock messaging, applications, and verified status.</p>
                    <div className="text-3xl font-display text-white mb-1">₹99<span className="text-sm font-sans text-gray-500">/mo</span></div>
                  </div>
                  <Button asChild className="w-full bg-[#E50914] text-white hover:bg-[#b80710] shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                    <Link href="/pricing">Upgrade to Pro</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              {artistPayments.length > 0 ? (
                <div className="space-y-4">
                  {artistPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-white font-medium">{payment.plan} Plan</p>
                        <p className="text-gray-500 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-300">₹{payment.amount}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No payment history found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
