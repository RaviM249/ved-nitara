"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Stars, Users, Film } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      role: "Artist / Talent",
      icon: Stars,
      monthly: 99,
      annual: 999,
      features: [
        "Verified Profile Badge",
        "Unlimited Showreel Uploads",
        "Apply to Faculty Roles",
        "Direct Messaging with Clients",
        "Profile Analytics & Views",
        "Priority in Artist Bank Search"
      ]
    },
    {
      role: "Entertainment School",
      icon: Users,
      monthly: 99,
      annual: 999,
      features: [
        "Verified Institution Badge",
        "Post Unlimited Requirements",
        "Access to Verified Faculty",
        "Direct Messaging with Artists",
        "Unlimited Shortlists",
        "School Branded Page"
      ]
    },
    {
      role: "Production House",
      icon: Film,
      monthly: 99,
      annual: 999,
      features: [
        "Verified Production Badge",
        "Full Access to Artist Bank",
        "Advanced Search Filters",
        "Post Casting Calls",
        "Direct Messaging with Talent",
        "Unlimited Shortlists per Project"
      ]
    },
    {
      role: "Client / Organizer",
      icon: ShieldCheck,
      monthly: 99,
      annual: 999,
      features: [
        "Verified Client Badge",
        "Send Direct Booking Requests",
        "Access to Artist Bank",
        "Direct Messaging",
        "Leave Verified Reviews",
        "Secure Payment Escrow Access"
      ]
    }
  ];

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
    <PageWrapper className="pt-24 pb-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-display text-5xl md:text-6xl text-white mb-6">Simple, Transparent Pricing</h1>
        <p className="text-gray-400 text-lg mb-10">One subscription unlocks infinite opportunities tailored for your role.</p>
        
        {/* Toggle */}
        <div className="inline-flex bg-[#1f1f1f] p-1.5 rounded-xl border border-white/10 relative">
          <div className="absolute -top-3 -right-6 rotate-12">
            <span className="bg-green-500 text-black font-bold text-xs px-2 py-1 rounded-full shadow-lg">Save 16%</span>
          </div>
          <Button 
            variant={!isAnnual ? "default" : "ghost"} 
            className={`rounded-lg px-6 ${!isAnnual ? 'bg-[#00A8E1] text-white hover:bg-[#0082B4]' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </Button>
          <Button 
            variant={isAnnual ? "default" : "ghost"} 
            className={`rounded-lg px-6 ${isAnnual ? 'bg-[#00A8E1] text-white hover:bg-[#0082B4]' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setIsAnnual(true)}
          >
            Annual
          </Button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {plans.map((plan, idx) => (
          <motion.div 
            key={plan.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#141414] border border-white/10 rounded-2xl p-6 relative group hover:border-[#00A8E1]/50 hover-blue-glow transition-all duration-300 flex flex-col h-full"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00A8E1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="h-12 w-12 rounded-full bg-[#1f1f1f] flex items-center justify-center mb-6">
              <plan.icon className="h-6 w-6 text-white" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{plan.role}</h3>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-sm text-gray-400">₹</span>
              <span className="text-4xl font-display text-white tracking-wide">
                {isAnnual ? plan.annual : plan.monthly}
              </span>
              <span className="text-gray-400 text-sm">/{isAnnual ? 'yr' : 'mo'}</span>
            </div>

            <div className="flex-1">
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-[#00A8E1] mr-3 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href={`/register?role=${plan.role.split(" ")[0].toUpperCase()}`} tabIndex={-1} className="mt-auto">
              <Button className="w-full bg-[#00A8E1] text-white hover:bg-[#0082B4]">
                Subscribe Now
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl text-white mb-8 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-white/10">
              <AccordionTrigger className="text-lg font-medium text-white hover:text-[#00A8E1] text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 leading-relaxed text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageWrapper>
  );
}
