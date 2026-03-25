"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/stubs";
import { useAuthStore } from "@/lib/store/authStore";
import { basicInfoSchema } from "@/lib/validations";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, ArrowRight, UserCircle, Users, Film, Building2, Mail, Phone, MapPin, Lock, User, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const intents = [
  { id: "hire", label: "I want to hire talent", desc: "Post projects and find the right people", icon: Film, color: "#00A8E1" },
  { id: "work", label: "I want to get hired", desc: "Showcase my skills and get work", icon: UserCircle, color: "#10B981" },
] as const;

type IntentType = "hire" | "work" | null;

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIntent = searchParams?.get("intent") as IntentType | null;
  
  const { login } = useAuthStore();
  const [step, setStep] = useState<number>(initialIntent ? 2 : 1);
  const [selectedIntent, setSelectedIntent] = useState<IntentType>(initialIntent || null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State to track which field is focused for placeholder hiding
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+91");

  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      city: "",
    },
  });

  const getPlaceholder = (fieldName: string, defaultText: string) => {
    return focusedField === fieldName ? "" : defaultText;
  };

  const handleIntentSelect = (intent: IntentType) => {
    setSelectedIntent(intent);
    setStep(2);
  };

  async function onSubmit(values: z.infer<typeof basicInfoSchema>) {
    if (!selectedIntent) return;
    
    try {
      setIsLoading(true);
      
      const intentRoleMapping: Record<string, "TALENT" | "CLIENT"> = {
        "work": "TALENT",
        "hire": "CLIENT"
      };
      const assignedRole = intentRoleMapping[selectedIntent];
      
      // Combine country code with phone
      const fullPhone = `${countryCode} ${values.phone}`;
      const res = await api.register({ ...values, phone: fullPhone, role: assignedRole }) as any;

      if (res.user) {
        toast.success(res.message || "Account created successfully!");
        
        // Store user in Zustand (it's persisted now!)
        login(assignedRole, res.user, false); // New users start unsubscribed
        
        // Save token to localStorage for subsequent API calls
        if (res.token) {
          localStorage.setItem("auth-token", res.token);
        }
        
        // Redirect to onboarding
        if (assignedRole === "CLIENT") {
          router.push("/client/onboarding");
        } else {
          router.push("/talent/onboarding");
        }
      } else {
        toast.error(res.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 relative z-10 shadow-2xl overflow-hidden"
    >
      <div className="text-center mb-10 relative z-10">
        <Link href="/" className="inline-block font-display text-4xl tracking-wider text-[#00A8E1] mb-6 hover-blue-glow transition-all">
          VED NITARA
        </Link>
        {/* Decorative background glow moved here or into fragments if needed, but keeping logic clean */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00A8E1]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#10B981]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-center gap-2 mb-2">
           <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === 1 ? 'bg-[#00A8E1] shadow-[0_0_10px_rgba(0,168,225,0.5)]' : 'bg-white/20'}`} />
           <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === 2 ? 'bg-[#00A8E1] shadow-[0_0_10px_rgba(0,168,225,0.5)]' : 'bg-white/20'}`} />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {step === 1 ? "Choose your path" : "Create your account"}
        </h1>
        <p className="text-gray-400 mt-3 text-sm font-medium">
          {step === 1 ? "Select how you'd like to use the platform." : "Join the premium entertainment network based in India."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid gap-5 relative z-10"
          >
            {intents.map((intent) => (
              <button
                key={intent.id}
                type="button"
                onClick={() => handleIntentSelect(intent.id as IntentType)}
                className="flex items-center p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00A8E1]/40 hover:bg-white/[0.08] transition-all text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                   <intent.icon className="h-24 w-24" />
                </div>
                <div className="h-16 w-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mr-8 group-hover:scale-110 group-hover:border-[#00A8E1]/30 transition-all shrink-0">
                  <intent.icon className="h-8 w-8 text-gray-400 group-hover:text-[#00A8E1] transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#00A8E1] transition-colors tracking-wide">{intent.label}</h3>
                  <p className="text-sm text-gray-500 font-medium group-hover:text-gray-400 transition-colors">{intent.desc}</p>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10"
          >
            <div className="mb-8 flex items-center justify-between p-4 bg-[#00A8E1]/5 border border-[#00A8E1]/20 rounded-2xl shadow-inner">
               <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-full bg-[#00A8E1]/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-[#00A8E1]" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Purpose</span>
                    <span className="text-xs font-bold text-white">{selectedIntent === 'hire' ? 'Hiring Talent' : 'Finding Work'}</span>
                 </div>
               </div>
               <button 
                type="button" 
                onClick={() => setStep(1)}
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 text-[#00A8E1] hover:bg-[#00A8E1]/10 transition-all"
              >
                Change
              </button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00A8E1] transition-colors" />
                            <Input 
                              className="bg-black/20 border-white/10 text-white pl-11 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                              placeholder={getPlaceholder("name", "e.g. Rahul Sharma")}
                              onFocus={() => setFocusedField("name")}
                              {...field}
                              onBlur={(e) => {
                                field.onBlur();
                                setFocusedField(null);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00A8E1] transition-colors" />
                            <Input 
                              type="email" 
                              className="bg-black/20 border-white/10 text-white pl-11 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                              placeholder={getPlaceholder("email", "rahul@example.com")}
                              onFocus={() => setFocusedField("email")}
                              {...field}
                              onBlur={(e) => {
                                field.onBlur();
                                setFocusedField(null);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                             <div className="relative">
                               <select 
                                 value={countryCode}
                                 onChange={(e) => setCountryCode(e.target.value)}
                                 className="bg-black/20 border border-white/10 text-white text-xs font-bold px-3 h-12 rounded-xl focus:ring-1 focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 outline-none transition-all appearance-none cursor-pointer pr-8"
                               >
                                  <option value="+91">+91 (IN)</option>
                                  <option value="+1">+1 (US)</option>
                                  <option value="+44">+44 (UK)</option>
                                  <option value="+971">+971 (UAE)</option>
                               </select>
                               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                               </div>
                             </div>
                             <div className="relative group flex-1">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00A8E1] transition-colors" />
                                <Input 
                                  className="bg-black/20 border-white/10 text-white pl-11 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all w-full" 
                                  placeholder={getPlaceholder("phone", "98765 43210")}
                                  onFocus={() => setFocusedField("phone")}
                                  {...field}
                                  onBlur={(e) => {
                                    field.onBlur();
                                    setFocusedField(null);
                                  }}
                                />
                             </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Location / City</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00A8E1] transition-colors" />
                            <Input 
                              className="bg-black/20 border-white/10 text-white pl-11 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                              placeholder={getPlaceholder("city", "Mumbai, MH")}
                              onFocus={() => setFocusedField("city")}
                              {...field}
                              onBlur={(e) => {
                                field.onBlur();
                                setFocusedField(null);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Set Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00A8E1] transition-colors" />
                            <Input 
                              type="password" 
                              className="bg-black/20 border-white/10 text-white pl-11 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                              placeholder={getPlaceholder("password", "••••••••")}
                              onFocus={() => setFocusedField("password")}
                              {...field}
                              onBlur={(e) => {
                                field.onBlur();
                                setFocusedField(null);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00A8E1] transition-colors" />
                            <Input 
                              type="password" 
                              className="bg-black/20 border-white/10 text-white pl-11 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                              placeholder={getPlaceholder("confirmPassword", "••••••••")}
                              onFocus={() => setFocusedField("confirmPassword")}
                              {...field}
                              onBlur={(e) => {
                                field.onBlur();
                                setFocusedField(null);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-[#00A8E1] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#0082B4] transition-all hover:shadow-[0_0_30px_rgba(0,168,225,0.4)] relative overflow-hidden group mt-4 overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Securing your account...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </>
                  )}
                </button>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 text-center relative z-10">
        <p className="text-gray-400 text-sm font-medium">
          Already a member?{" "}
          <Link href="/login" className="text-white hover:text-[#00A8E1] font-bold underline underline-offset-4 decoration-[#00A8E1]/30 hover:decoration-[#00A8E1] transition-all">
            Login to your account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F171E] px-4 py-20 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00A8E1]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
      
      <Suspense fallback={<div className="text-white font-display text-xl animate-pulse tracking-widest uppercase">Initializing...</div>}>
        <RegisterContent />
      </Suspense>
    </div>
  );
}
