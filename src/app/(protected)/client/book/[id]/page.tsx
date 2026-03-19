"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { mockArtists } from "@/lib/mockData";
import { bookArtistSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/stubs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowLeft, Star, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import SubscriptionBadge from "@/components/shared/SubscriptionBadge";

export default function BookArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artistId = resolvedParams.id;
  const artist = mockArtists.find(a => a.id === artistId) || mockArtists[0];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof bookArtistSchema>>({
    resolver: zodResolver(bookArtistSchema),
    defaultValues: {
      eventType: "",
      eventDate: "",
      eventCity: "",
      durationHours: 2,
      additionalNotes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bookArtistSchema>) {
    try {
      setIsLoading(true);
      const res = await api.bookArtist(artistId, values);
      if (res.success) {
        toast.success("Booking request sent! The artist will respond shortly.");
        router.push("/client/bookings");
      }
    } catch {
      toast.error("Failed to send booking request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white -ml-3 mb-4">
          <Link href="/client/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Browse
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Artist Preview Card */}
        <div className="space-y-5">
          <Card className="bg-[#1f1f1f] border-white/5 overflow-hidden">
            <div className="aspect-square relative">
              <img src={artist.profilePhoto} alt={artist.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {artist.isVerified && (
                <div className="absolute top-3 right-3">
                  <SubscriptionBadge />
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-display text-white leading-none mb-1">{artist.name}</h2>
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin className="h-3 w-3 mr-1" /> {artist.city}
                </div>
              </div>
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {artist.roles.map(r => (
                  <span key={r} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">{r}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-[#E50914] text-[#E50914]" />
                <span className="font-bold text-white">{artist.rating}</span>
                <span className="text-gray-400">/ 5</span>
              </div>
              {artist.hourlyRate && (
                <div className="text-sm text-gray-400">
                  Starting from <span className="text-white font-bold">₹{artist.hourlyRate.toLocaleString()}</span>/hr
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#E50914]/20">
            <CardHeader><CardTitle className="text-white text-base">How Booking Works</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Send a booking request with event details", "Artist reviews and accepts/declines within 24 hrs", "Confirm payment through the platform", "Event day — enjoy the performance!"].map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="h-5 w-5 rounded-full bg-[#E50914]/20 text-[#E50914] flex items-center justify-center shrink-0 text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white text-xl font-display">Book {artist.name}</CardTitle>
              <p className="text-gray-400 text-sm">Fill in your event details and we'll send a request to the artist.</p>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Event Type</FormLabel>
                          <FormControl>
                            <select
                              className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                              {...field}
                            >
                              <option value="">Select event type</option>
                              <option>Wedding</option>
                              <option>Corporate Event</option>
                              <option>Product Launch</option>
                              <option>Private Party</option>
                              <option>Concert</option>
                              <option>Award Show</option>
                              <option>Other</option>
                            </select>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Event Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eventCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Event City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mumbai"
                              className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="durationHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Duration (Hours)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={12}
                              className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Additional Details & Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your event, stage setup, audience size, any special requirements..."
                            className="bg-[#141414] border-white/10 text-white h-32 focus-visible:ring-[#E50914]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="bg-[#141414] border border-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Estimated Cost</p>
                      <p className="text-2xl font-bold text-white">
                        ₹{((artist.hourlyRate || 15000) * (form.watch("durationHours") || 2)).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Final amount confirmed by artist</p>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#E50914] hover:bg-[#b80710] text-white px-8 shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Send Request
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
