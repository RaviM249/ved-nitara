"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlayCircle, ShieldCheck, Stars, Users, Film, Camera, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

const ROW1 = [
  { name: "Actor", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Singer", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Dancer", image: "https://images.unsplash.com/photo-1719435546599-19d223fbabc9?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Musician", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Cameraman", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Director", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "VFX Artist", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=250&auto=format&fit=crop" },
];

const ROW2 = [
  { name: "Production House", image: "https://images.unsplash.com/photo-1758906819465-b2fde39d715d?auto=format&fit=crop&q=80&w=400&h=250" },
  { name: "Schools", image: "https://images.unsplash.com/photo-1730106443463-0fb1512c5e60?auto=format&fit=crop&q=80&w=400&h=250" },
  { name: "Private Booking", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Technicians", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Script Writer", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Makeup Artist", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Stylist", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&h=250&auto=format&fit=crop" },
  { name: "Voiceover", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400&h=250&auto=format&fit=crop" },
];

function ReelCard({ name, image }: { name: string; image: string }) {
  return (
    <div className="relative w-72 h-44 rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#00A8E1]/50 transition-colors duration-500">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-4 left-6">
        <h3 className="text-2xl font-bold text-white uppercase tracking-wider font-display drop-shadow-md">
          {name}
        </h3>
      </div>
      <div className="absolute inset-0 bg-[#00A8E1]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const { isLoggedIn, user } = useAuthStore();

  // Dynamic link for "Explore Features"
  const getFeaturesHref = () => {
    if (!isLoggedIn) return "/pricing";
    if (user?.role === "CLIENT") return "/client/dashboard";
    if (user?.role === "TALENT") return "/talent/dashboard";
    return "/pricing";
  };

  // Transform scroll progress (0 to 0.4 of page) to overlay opacity (1 to 0.15)
  // As the user scrolls down, the image becomes significantly clearer/revealed.
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.15]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        {/* Shared Background image & gradient overlay for Hero + Stats */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: "url('https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,w_1920/v1774266196/Gemini_Generated_Image_iokyfxiokyfxioky_pj6xc5_xf4bya.jpg')" }}
        />

        {/* Dynamic Darkening Overlays - reveals background as user scrolls down */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/70 to-[#0F171E]/40" />
          <div className="absolute inset-0 z-0 bg-black/40" />
        </motion.div>

        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden py-12 md:py-20 lg:py-0">

          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto lg:pt-35">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 lg:mb-10 rounded-full bg-white/20 px-7 py-1.5 backdrop-blur-md border border-white/20"
            >
              <span className="text-sm font-semibold text-white tracking-widest uppercase">The Future of Indian Entertainment</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-wider text-white mb-4 lg:mb-6 leading-[1.1] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
            >
              Find the right <span className="text-[#00A8E1] drop-shadow-[0_0_25px_rgba(0,168,225,0.6)]">talent.</span><br />
              Or become one.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-base md:text-lg lg:text-xl text-white max-w-2xl mx-auto mb-10 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Hire professionals for your project or showcase your skills and get hired.
            </motion.p>
          </div>
        </section>

        {/* CAMERA REEL SECTIONS */}
        <section className="py-24 overflow-hidden relative z-10">

          <div className="space-y-8 relative z-10">
            {/* ROW 1: Right to Left */}
            <div className="flex overflow-hidden">
              <motion.div
                animate={{ x: [0, -2184] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex gap-6 whitespace-nowrap"
              >
                {[...ROW1, ...ROW1].map((item, idx) => (
                  <ReelCard key={idx} name={item.name} image={item.image} />
                ))}
              </motion.div>
            </div>

            {/* ROW 2: Left to Right */}
            <div className="flex overflow-hidden">
              <motion.div
                animate={{ x: [-2496, 0] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex gap-6 whitespace-nowrap"
              >
                {[...ROW2, ...ROW2].map((item, idx) => (
                  <ReelCard key={idx} name={item.name} image={item.image} />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Subtle Film Grain/Fade effects for the edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0F171E] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0F171E] to-transparent z-20 pointer-events-none" />
        </section>

        {/* STATS SECTION - Moved below cards and attached to next section */}
        <section className="py-16 bg-black/60 relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <h3 className="font-display text-4xl md:text-5xl text-[#00A8E1] mb-2">$2.8T</h3>
                <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">Global Market</p>
              </div>
              <div className="text-center">
                <h3 className="font-display text-4xl md:text-5xl text-white mb-2">28B+</h3>
                <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">India Market</p>
              </div>
              <div className="text-center">
                <h3 className="font-display text-4xl md:text-5xl text-[#00A8E1] mb-2">10,000+</h3>
                <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">Institutes</p>
              </div>
              <div className="text-center">
                <h3 className="font-display text-4xl md:text-5xl text-white mb-2">20%+</h3>
                <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">OTT CAGR</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - Unified with Stats above */}
        <section className="py-24 bg-black/40 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-4xl md:text-6xl text-white mb-6 leading-tight">
                  THE ULTIMATE <span className="text-[#00A8E1]">ARTIST BANK</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Production houses and casting directors can search through thousands of verified profiles using advanced filters like age, gender, skills, languages, and availability. Finding your perfect cast has never been this seamless.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center text-gray-200 bg-white/5 p-3 rounded-lg border border-white/10"><ShieldCheck className="h-5 w-5 text-[#00A8E1] mr-3" /> Verified Profiles</li>
                  <li className="flex items-center text-gray-200 bg-white/5 p-3 rounded-lg border border-white/10"><Camera className="h-5 w-5 text-[#00A8E1] mr-3" /> Rich Portfolios & Showreels</li>
                  <li className="flex items-center text-gray-200 bg-white/5 p-3 rounded-lg border border-white/10"><PlayCircle className="h-5 w-5 text-[#00A8E1] mr-3" /> Direct In-app Messaging</li>
                </ul>
                <Link href={getFeaturesHref()} tabIndex={-1}>
                  <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12">
                    Explore Features
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[#00A8E1]/20 blur-[100px] rounded-full z-0" />
                <div className="relative z-10 bg-[#0F171E] border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                  <img src="https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,w_800/v1774065749/Gemini_Generated_Image_auzrvaauzrvaauzr_absldm.png" alt="Artist Bank Preview" className="rounded-xl w-full opacity-80" />
                </div>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="mt-16 flex flex-col sm:flex-row gap-6 w-full max-w-3xl mx-auto justify-center">
                <Link href="/register?intent=hire" tabIndex={-1} className="flex-1 group">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#0082B4] rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,168,225,0.2)] h-full">
                    <div className="text-3xl mb-4">🎬</div>
                    <h3 className="text-white font-bold text-2xl mb-2 font-display tracking-wide group-hover:text-[#00A8E1] transition-colors">Hire Talent</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Find actors, creators, and crew for your project</p>
                  </div>
                </Link>

                <Link href="/register?intent=work" tabIndex={-1} className="flex-1 group">
                  <div className="bg-[#00A8E1]/10 backdrop-blur-md border border-[#00A8E1]/30 hover:bg-[#00A8E1]/20 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,168,225,0.4)] h-full">
                    <div className="text-3xl mb-4">✨</div>
                    <h3 className="text-white font-bold text-2xl mb-2 font-display tracking-wide">Get Hired</h3>
                    <p className="text-blue-100/70 text-sm leading-relaxed">Create your profile and start getting opportunities</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>


      </div>


    </div>
  );
}
