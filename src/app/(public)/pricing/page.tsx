"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const { scrollYProgress } = useScroll();

  // Consistent reveal effect from home page
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.15]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqs = [
    {
      q: "What happens when my subscription expires?",
      a: "Your profile remains active but is hidden from public searches and the Artist Bank. You will lose access to messaging, posting requirements, and direct bookings until you renew."
    },
    {
      q: "Can I change my role later?",
      a: "No, a single account is tied to one primary role. However, if you are a multi-disciplinary Artist, you can list secondary roles such as Actor, Singer, and Writer all in one profile."
    },
    {
      q: "Is there a free trial?",
      a: "Creating an account is free. You can browse the platform with limited visibility. To unlock full profiles, messaging, and booking capabilities, an active subscription is required."
    },
    {
      q: "How does the verification process work?",
      a: "Once you create a profile, our admins review your details, identification, and showreels/website. Upon approval, you receive a Verification Badge which increases trust internally."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes. You can cancel your subscription from your dashboard. You will continue to have access until the end of your billing cycle."
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background - Fixed behind content */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,w_1920/v1774014712/Gemini_Generated_Image_iokyfxiokyfxioky_pj6xc5.png')" }}
      />

      {/* Dynamic Reveal Overlays */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/70 to-[#0F171E]/40" />
        <div className="absolute inset-0 z-0 bg-black/40" />
      </motion.div>

      <PageWrapper className="relative z-10 pt-28 pb-20">
        {/* Simplified Header for laptop view */}
        <div className="text-center max-w-3xl mx-auto mb-12 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl mb-4 tracking-wide drop-shadow-md uppercase"
          >
            CHOOSE YOUR <span className="text-[#00A8E1]">PASS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-200 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
          >
            One simple subscription to unlock every feature, every role, and infinite opportunities across India.
          </motion.p>
        </div>

        {/* Pricing Layout */}
        <div className="flex flex-col items-center gap-10 mb-28">
          {/* Sliding Toggle Pill */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#1f1f1f]/70 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 flex items-center w-80 h-16 overflow-hidden shadow-2xl"
          >
             <motion.div 
               initial={false}
               animate={{ x: billingCycle === "monthly" ? 0 : 144 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="absolute top-1.5 left-1.5 w-[140px] h-13 bg-[#00A8E1] rounded-xl shadow-[0_0_25px_rgba(0,168,225,0.4)] z-0"
             />
             <button 
               onClick={() => setBillingCycle("monthly")}
               className={`relative z-10 flex-1 h-full font-bold text-sm tracking-widest uppercase transition-colors duration-300 ${billingCycle === "monthly" ? "text-white" : "text-gray-400 hover:text-white"}`}
             >
               Monthly
             </button>
             <button 
               onClick={() => setBillingCycle("annual")}
               className={`relative z-10 flex-1 h-full font-bold text-sm tracking-widest uppercase transition-colors duration-300 ${billingCycle === "annual" ? "text-white" : "text-gray-400 hover:text-white"}`}
             >
               Annual
             </button>
          </motion.div>

          {/* All-Access Card */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ type: "spring", bounce: 0.4 }}
             whileHover={{ y: -8, scale: 1.01 }}
             className="max-w-md w-full relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00A8E1] via-blue-600 to-indigo-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 relative flex flex-col items-center overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A8E1]/10 blur-[60px] rounded-full" />
              
              <h3 className="text-2xl font-bold text-white mb-8 tracking-[0.2em] uppercase font-display border-b border-white/10 pb-6 w-full text-center">
                All-Access Pass
              </h3>
              
              <div className="flex items-baseline gap-3 mb-10">
                <span className="text-[#00A8E1] text-3xl font-display">₹</span>
                <span className="text-8xl font-display text-white tracking-wider">
                  {billingCycle === "monthly" ? "99" : "999"}
                </span>
                <span className="text-gray-400 font-bold text-lg tracking-widest">
                  {billingCycle === "monthly" ? "/MO" : "/YR"}
                </span>
              </div>
              
              <ul className="space-y-5 mb-12 text-left w-full">
                {[
                  "Full Profile & Searchable Portfolio",
                  "Apply to Unlimited Casting Calls",
                  "Direct In-app Messaging & Bookings",
                  "Priority in Recruitment Search",
                  "Verified Digital Identity Badge",
                  "Exclusive Member Resources"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-200 text-sm font-semibold">
                    <div className="h-5 w-5 rounded-full bg-[#00A8E1]/20 flex items-center justify-center mr-4 border border-[#00A8E1]/40">
                       <CheckCircle2 className="h-3 w-3 text-[#00A8E1]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href="/register?pass=all-access" className="w-full" tabIndex={-1}>
                <Button className="w-full bg-[#00A8E1] text-white hover:bg-[#0082B4] h-14 text-lg font-bold rounded-2xl relative overflow-hidden group/btn">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    ACTIVATE PASS <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                </Button>
              </Link>

              {billingCycle === "annual" && (
                <div className="mt-4 text-[#00A8E1] font-bold text-xs tracking-widest uppercase animate-pulse">
                  Save 16% With Annual Pass
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* FAQ with cleaner styling */}
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-display text-4xl text-white mb-10 text-center tracking-wide"
          >
            FAQS
          </motion.h2>
          <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-4">
            <Accordion className="w-full space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-none px-4 rounded-xl hover:bg-white/5 transition-colors">
                  <AccordionTrigger className="text-lg font-bold text-gray-200 hover:text-white text-left py-5 hover:no-underline group-data-[state=open]:text-[#00A8E1]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 leading-relaxed text-base pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
