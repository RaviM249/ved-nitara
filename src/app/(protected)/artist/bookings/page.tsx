"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { mockBookings } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, MessageCircle, FileText } from "lucide-react";

export default function ArtistBookingsPage() {
  // Using artist 'a1' for demo purposes
  const artistBookings = mockBookings.filter(b => b.artistId === 'a1');
  
  const upcomingBookings = artistBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const pastBookings = artistBookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="bg-[#1f1f1f] border-white/5 hover:border-white/20 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">{booking.eventType}</h3>
              <Badge className={`
                ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : ''}
                ${booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20' : ''}
                ${booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/20' : ''}
                ${booking.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/20' : ''}
              `}>
                {booking.status}
              </Badge>
            </div>
            
            <p className="text-gray-400 mb-4">{booking.specialRequirements || "Standard performance terms."}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#00A8E1]" />
                {booking.eventDate}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#00A8E1]" />
                {booking.eventCity}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00A8E1]" />
                {booking.durationHours} Hours
              </div>
              <div className="flex items-center gap-2 font-bold text-white">
                ₹{booking.amount.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[150px] justify-center md:pl-6 md:border-l border-white/10 pt-4 md:pt-0 border-t md:border-t-0">
            {booking.status === 'PENDING' && (
              <>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10">Decline</Button>
              </>
            )}
            {(booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') && (
              <>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:text-white hover:bg-white/10">
                  <MessageCircle className="h-4 w-4 mr-2" /> Message Client
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:text-white hover:bg-white/10">
                  <FileText className="h-4 w-4 mr-2" /> View Contract
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">My Bookings</h1>
        <p className="text-gray-400 text-sm">Manage your upcoming and past bookings from clients and production houses.</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Upcoming & Pending requests</h2>
          <div className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <div className="text-center py-12 bg-[#1f1f1f] rounded-xl border border-white/5 text-gray-400">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
                No upcoming bookings found.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Past Bookings</h2>
          <div className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <div className="text-center py-12 bg-[#1f1f1f] rounded-xl border border-white/5 text-gray-400">
                No past bookings.
              </div>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
