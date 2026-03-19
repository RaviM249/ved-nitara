"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlayCircle, ShieldCheck, Stars, Users, Film, Camera, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background image & gradient overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-black/60" />
        <div className="absolute inset-0 z-0 bg-black/40" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/20"
          >
            <span className="text-sm font-semibold text-white tracking-widest uppercase">The Future of Indian Entertainment</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider text-white mb-6 leading-[0.9]"
          >
            ONE APP. ONE SUBSCRIPTION.<br/>
            <span className="text-[#E50914] drop-shadow-[0_0_20px_rgba(229,9,20,0.8)]">INFINITE OPPORTUNITIES.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 font-medium"
          >
            Connect, collaborate, and create with the largest network of Artists, Entertainment Schools, Production Houses, and Event Organizers in India.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/register" tabIndex={-1}>
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-[#E50914] text-white hover:bg-[#b80710] w-full sm:w-auto shadow-[0_0_30px_rgba(229,9,20,0.4)]">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing" tabIndex={-1}>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/30 text-white hover:bg-white/10 w-full sm:w-auto bg-black/40 backdrop-blur-md">
                View Plans
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 border-y border-white/10 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl text-[#E50914] mb-2">$2.8T</h3>
              <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">Global Market</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl text-white mb-2">28B+</h3>
              <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">India Market</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl text-[#E50914] mb-2">10,000+</h3>
              <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">Institutes</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl text-white mb-2">20%+</h3>
              <p className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">OTT CAGR</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-white mb-4">Who is Ved Nitara for?</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">An ecosystem built to empower every facet of the entertainment industry.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Artists & Talent",
              icon: Stars,
              items: ["Find casting calls & auditions", "Apply for faculty roles in top schools", "Get direct bookings from clients"]
            },
            {
              title: "Schools & Institutes",
              icon: Users,
              items: ["Post requirements for guest faculty", "Discover verified industry experts", "Streamline your hiring process"]
            },
            {
              title: "Production Houses",
              icon: Film,
              items: ["Access India's largest Artist Bank", "Advanced filtering & shortlisting", "Direct messaging and booking"]
            }
          ].map((role, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-[#1f1f1f] border border-white/5 rounded-2xl p-8 hover-red-glow relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-14 w-14 rounded-full bg-[#E50914]/10 flex items-center justify-center mb-6 border border-[#E50914]/20">
                <role.icon className="h-7 w-7 text-[#E50914]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide font-display">{role.title}</h3>
              <ul className="space-y-4">
                {role.items.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-[#E50914] mr-3 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-[#1a1a1a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-6 leading-tight">
                THE ULTIMATE <span className="text-[#E50914]">ARTIST BANK</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Production houses and casting directors can search through thousands of verified profiles using advanced filters like age, gender, skills, languages, and availability. Finding your perfect cast has never been this seamless.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-gray-200 bg-white/5 p-3 rounded-lg border border-white/10"><ShieldCheck className="h-5 w-5 text-[#E50914] mr-3" /> Verified Profiles Only</li>
                <li className="flex items-center text-gray-200 bg-white/5 p-3 rounded-lg border border-white/10"><Camera className="h-5 w-5 text-[#E50914] mr-3" /> Rich Portfolios & Showreels</li>
                <li className="flex items-center text-gray-200 bg-white/5 p-3 rounded-lg border border-white/10"><PlayCircle className="h-5 w-5 text-[#E50914] mr-3" /> Direct In-app Messaging</li>
              </ul>
              <Link href="/pricing" tabIndex={-1}>
                <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12">
                  Explore Features
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#E50914]/20 blur-[100px] rounded-full z-0" />
              <div className="relative z-10 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop" alt="Artist Bank Preview" className="rounded-xl w-full opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-display text-4xl md:text-6xl text-white mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-400 text-lg mb-12">One subscription to unlock all features for your role.</p>
        
        <div className="inline-flex bg-[#1f1f1f] p-1 rounded-xl mb-12 border border-white/10">
          <Button className="bg-[#E50914] text-white rounded-lg hover:bg-[#b80710]">Monthly (₹99)</Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white rounded-lg">Annual (₹999) <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save 16%</span></Button>
        </div>

        <div className="max-w-md mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#E50914] to-red-900 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <div className="bg-[#1f1f1f] border border-white/10 rounded-2xl p-8 relative flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-2">All-Access Pass</h3>
            <div className="flex items-baseline gap-1 mr-4 mb-6">
              <span className="text-5xl font-display text-white tracking-wide">₹99</span>
              <span className="text-gray-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 text-left w-full text-sm">
              <li className="flex"><CheckCircle2 className="h-4 w-4 text-[#E50914] mr-2 shrink-0 mt-0.5" /> Full profile & portfolio</li>
              <li className="flex"><CheckCircle2 className="h-4 w-4 text-[#E50914] mr-2 shrink-0 mt-0.5" /> Apply to unlimited jobs</li>
              <li className="flex"><CheckCircle2 className="h-4 w-4 text-[#E50914] mr-2 shrink-0 mt-0.5" /> Direct messaging</li>
              <li className="flex"><CheckCircle2 className="h-4 w-4 text-[#E50914] mr-2 shrink-0 mt-0.5" /> Verified badge</li>
            </ul>
            <Link href="/pricing" className="w-full" tabIndex={-1}>
              <Button className="w-full bg-[#E50914] text-white hover:bg-[#b80710] h-12 text-lg font-bold">
                Subscribe Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-display text-2xl tracking-wider text-[#E50914] mb-2">VED NITARA</div>
            <p className="text-gray-500 text-sm">Connecting the Indian Entertainment Industry.</p>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          
          <div className="text-center md:text-right text-gray-500 text-xs">
            <p>Mr. Amrendra Kumar</p>
            <p>+91 9122567345</p>
            <p>amrendrakumar8102@gmail.com</p>
            <p className="mt-4">© 2026 Ved Nitara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
