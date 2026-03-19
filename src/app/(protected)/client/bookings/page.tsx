"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { mockBookings } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, MessageCircle, Star } from "lucide-react";
import ReviewModal from "@/components/shared/ReviewModal";
import { useState } from "react";

export default function ClientBookingsPage() {
  const [reviewArtistId, setReviewArtistId] = useState<string | null>(null);
  const bookings = mockBookings;

  const upcoming = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const past = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">My Bookings</h1>
        <p className="text-gray-400 text-sm">Manage your event bookings and leave reviews for completed shows.</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Upcoming Events</h2>
          <div className="space-y-4">
            {upcoming.length > 0 ? upcoming.map(booking => (
              <Card key={booking.id} className="bg-[#1f1f1f] border-white/5 hover:border-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{booking.eventType}</h3>
                        <Badge className={`
                          ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : ''}
                          ${booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20' : ''}
                        `}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400 mt-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-[#E50914] opacity-80" />
                          {booking.eventDate}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-[#E50914] opacity-80" />
                          {booking.eventCity}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#E50914] opacity-80" />
                          {booking.durationHours} Hours
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <p className="text-2xl font-bold text-white">₹{booking.amount.toLocaleString()}</p>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 w-full md:w-auto">
                        <MessageCircle className="h-4 w-4 mr-2" /> Message Artist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-12 bg-[#1f1f1f] rounded-xl border border-white/5 text-gray-400">
                No upcoming events.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Past Events</h2>
          <div className="space-y-4">
            {past.length > 0 ? past.map(booking => (
              <Card key={booking.id} className="bg-[#1f1f1f] border-white/5">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{booking.eventType}</h3>
                        <Badge className={`
                          ${booking.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/20' : ''}
                          ${booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/20' : ''}
                        `}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400 mt-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 opacity-50" />
                          {booking.eventDate}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 opacity-50" />
                          {booking.eventCity}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <p className="text-xl font-bold text-gray-400">₹{booking.amount.toLocaleString()}</p>
                      {booking.status === 'COMPLETED' && (
                        <Button 
                          variant="outline" 
                          className="border-[#E50914]/30 text-[#E50914] hover:bg-[#E50914]/10"
                          onClick={() => setReviewArtistId(booking.artistId)}
                        >
                          <Star className="h-4 w-4 mr-2" /> Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-12 bg-[#1f1f1f] rounded-xl border border-white/5 text-gray-400">
                No past events.
              </div>
            )}
          </div>
        </section>
      </div>

      {reviewArtistId && (
        <ReviewModal
          artistId={reviewArtistId}
          isOpen={!!reviewArtistId}
          onClose={() => setReviewArtistId(null)}
        />
      )}
    </PageWrapper>
  );
}
