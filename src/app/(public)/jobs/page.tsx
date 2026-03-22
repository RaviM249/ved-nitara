"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Film, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

// Mock casting calls mapped from internal data
const mockCastingCalls = [
  {
    id: "cc1",
    title: "Lead Actor - Feature Film 'Kavya'",
    description: "Looking for a versatile lead actor for an emotional family drama. Must have strong dialogue delivery skills and experience in regional cinema.",
    roles: ["Lead Actor", "Supporting Actor"],
    location: "Mumbai",
    lastDate: "2025-04-15",
    type: "Film",
    applicants: 42,
    status: "OPEN",
    createdAt: "2025-03-01",
  },
  {
    id: "cc2",
    title: "Cinematographer - OTT Series 'Dark Streets'",
    description: "Seeking an experienced DP for a gritty crime thriller OTT series spanning 8 episodes.",
    roles: ["Cinematographer", "Camera Assistant"],
    location: "Delhi / Remote",
    lastDate: "2025-04-01",
    type: "OTT Series",
    applicants: 18,
    status: "OPEN",
    createdAt: "2025-03-05",
  },
  {
    id: "cc3",
    title: "Background Dancers - Commercial Ad",
    description: "8 background dancers needed for 2-day commercial shoot. Previous ad experience preferred.",
    roles: ["Background Artist"],
    location: "Hyderabad",
    lastDate: "2025-03-20",
    type: "Commercial",
    applicants: 85,
    status: "OPEN",
    createdAt: "2025-02-20",
  },
];

export default function PublicJobsPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.15]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
      {/* Background - Fixed behind content */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,w_1920/v1774014712/Gemini_Generated_Image_iokyfxiokyfxioky_pj6xc5.png')" }}
      />
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/70 to-[#0F171E]/40" />
        <div className="absolute inset-0 z-0 bg-black/40" />
      </motion.div>

      <PageWrapper className="relative z-10 pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 text-white">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-display mb-3 tracking-wide drop-shadow-md"
              >
                CASTING <span className="text-[#00A8E1]">CALLS</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 text-base md:text-lg max-w-xl"
              >
                Apply to the latest opportunities across Film, Television, and Commercials. Find your next big break today!
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Link href="/register?intent=hire">
                <Button variant="outline" className="border-white/20 text-white bg-black/40 hover:bg-white/10 hidden md:flex">
                  Post a Job Instead
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-6">
            {mockCastingCalls.map((call) => (
              <Card key={call.id} className="bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(0,168,225,0.1)] transition-all overflow-hidden duration-300">
                <div className={`h-1.5 w-full ${call.status === 'OPEN' ? 'bg-[#00A8E1]' : 'bg-gray-600'}`} />
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-white">{call.title}</h2>
                        <div className="flex gap-2 flex-wrap mt-1 lg:mt-0">
                          <Badge variant="outline" className="border-white/10 text-gray-300 bg-white/5 py-1">
                            {call.type}
                          </Badge>
                          <Badge variant="outline" className={`py-1
                            ${call.status === 'OPEN' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-gray-500/30 text-gray-400 bg-gray-500/10'}
                          `}>
                            {call.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-300 text-base leading-relaxed mb-6">{call.description}</p>

                      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4 text-[#00A8E1]" />
                          {call.roles.join(', ')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#00A8E1]" />
                          Closes {new Date(call.lastDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#00A8E1]" />
                          {call.applicants} Applicants so far
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 mt-2 lg:pt-0 lg:mt-0 lg:pl-8">
                      <Link href="/register?intent=work" className="w-full lg:w-auto text-center" tabIndex={-1}>
                        <Button className="w-full lg:w-auto bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold h-12 px-8 rounded-xl group">
                          Apply Now <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
