"use client";

import { useState, Suspense, useEffect } from "react";
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
import { AnimatedPlaceholderInput } from "@/components/shared/AnimatedPlaceholderInput";
import { LocationSelector } from "@/components/shared/LocationSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const intents = [
  { id: "hire", label: "I want to hire talent", desc: "Post projects and find the right people", icon: Film, color: "#00A8E1" },
  { id: "work", label: "I want to get hired", desc: "Showcase my skills and get work", icon: UserCircle, color: "#10B981" },
] as const;

type IntentType = "hire" | "work" | null;

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIntent = searchParams?.get("intent") as IntentType | null;
  
  const { login, isLoggedIn, user } = useAuthStore();
  
  // Redirect if already logged in (checked on mount)
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "CLIENT") {
        router.replace("/client/dashboard");
      } else if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/talent/dashboard");
      }
    }
    // Only run on mount to prevent interfering with registration redirect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState<number>(initialIntent ? 2 : 1);
  const [selectedIntent, setSelectedIntent] = useState<IntentType>(initialIntent || null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State to track OTP and pending unverified values
  const [otp, setOtp] = useState("");
  const [pendingValues, setPendingValues] = useState<any>(null);

  // State to track which field is focused for placeholder hiding
  const [countryCode, setCountryCode] = useState("+91");

  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      city: "",
      state: "",
    },
  });

  const handleIntentSelect = (intent: IntentType) => {
    setSelectedIntent(intent);
    setStep(2);
  };

  async function onSubmit(values: z.infer<typeof basicInfoSchema>) {
    if (!selectedIntent) return;
    try {
      setIsLoading(true);
      const res = await api.sendOtp({ email: values.email }) as any;
      if (res.success) {
        setPendingValues(values);
        setStep(3);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(res.error || "Failed to send code. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6 || !pendingValues) return;
    
    try {
      setIsLoading(true);
      const intentRoleMapping: Record<string, "TALENT" | "CLIENT"> = {
        "work": "TALENT",
        "hire": "CLIENT"
      };
      const assignedRole = intentRoleMapping[selectedIntent as string];
      const fullPhone = `${countryCode} ${pendingValues.phone}`;
      
      const res = await api.register({ ...pendingValues, phone: fullPhone, role: assignedRole, otp }) as any;

      if (res.user) {
        toast.success(res.message || "Account created successfully!");
        login(assignedRole, res.user, false);
        if (res.token) localStorage.setItem("auth-token", res.token);
        router.push(assignedRole === "CLIENT" ? "/client/onboarding" : "/talent/onboarding");
      } else {
        toast.error(res.error || "Verification failed. Please check the code.");
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
      className="w-full max-w-xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 md:p-8 relative z-10 shadow-2xl overflow-hidden"
    >
      <div className="text-center mb-6 relative z-10">
        <Link href="/" className="inline-block font-display text-4xl tracking-wider text-[#00A8E1] mb-4 hover-blue-glow transition-all">
          VED NITARA
        </Link>
        {/* Decorative background glow moved here or into fragments if needed, but keeping logic clean */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00A8E1]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#10B981]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-center gap-2 mb-2">
           <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === 1 ? 'bg-[#00A8E1] shadow-[0_0_10px_rgba(0,168,225,0.5)]' : 'bg-white/20'}`} />
           <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === 2 ? 'bg-[#00A8E1] shadow-[0_0_10px_rgba(0,168,225,0.5)]' : 'bg-white/20'}`} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {step === 1 ? "Choose your path" : "Create your account"}
        </h1>
        <p className="text-gray-400 mt-2 text-sm font-medium">
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
            className="grid gap-4 relative z-10"
          >
            {intents.map((intent) => (
              <button
                key={intent.id}
                type="button"
                onClick={() => handleIntentSelect(intent.id as IntentType)}
                className="flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00A8E1]/40 hover:bg-white/[0.08] transition-all text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-5 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                   <intent.icon className="h-20 w-20" />
                </div>
                <div className="h-14 w-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:border-[#00A8E1]/30 transition-all shrink-0">
                  <intent.icon className="h-7 w-7 text-gray-400 group-hover:text-[#00A8E1] transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#00A8E1] transition-colors tracking-wide">{intent.label}</h3>
                  <p className="text-sm text-gray-500 font-medium group-hover:text-gray-400 transition-colors">{intent.desc}</p>
                </div>
              </button>
            ))}
          </motion.div>
        ) : step === 2 ? (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10"
          >
            <div className="mb-6 flex items-center justify-between p-3 bg-[#00A8E1]/5 border border-[#00A8E1]/20 rounded-2xl shadow-inner">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">First Name</FormLabel>
                        <FormControl>
                          <AnimatedPlaceholderInput 
                            placeholder="e.g. Rahul"
                            icon={User}
                            field={field}
                            className="bg-black/20 border-white/10 text-white h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Last Name</FormLabel>
                        <FormControl>
                          <AnimatedPlaceholderInput 
                            placeholder="e.g. Sharma"
                            icon={User}
                            field={field}
                            className="bg-black/20 border-white/10 text-white h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 items-center">
                             <div className="w-[85px] shrink-0">
                               <Select 
                                 value={countryCode}
                                 onValueChange={setCountryCode}
                               >
                                  <SelectTrigger className="bg-black/20 border-white/10 text-white text-sm font-bold h-11 rounded-xl focus:ring-1 focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 outline-none transition-all px-3">
                                    <SelectValue placeholder="+91" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                    <SelectItem value="+91">
                                      <span className="flex items-center gap-1.5">
                                        <span>+91</span>
                                        <span className="text-gray-400 text-[10px] font-normal">(IN)</span>
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="+1">
                                      <span className="flex items-center gap-1.5">
                                        <span>+1</span>
                                        <span className="text-gray-400 text-[10px] font-normal">(US)</span>
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="+44">
                                      <span className="flex items-center gap-1.5">
                                        <span>+44</span>
                                        <span className="text-gray-400 text-[10px] font-normal">(UK)</span>
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="+971">
                                      <span className="flex items-center gap-1.5">
                                        <span>+971</span>
                                        <span className="text-gray-400 text-[10px] font-normal">(UAE)</span>
                                      </span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <AnimatedPlaceholderInput 
                                  placeholder="98765 43210"
                                  icon={Phone}
                                  field={field}
                                  className="bg-black/20 border-white/10 text-white h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all w-full" 
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Email Address</FormLabel>
                        <FormControl>
                          <AnimatedPlaceholderInput 
                            type="email"
                            placeholder="rahul@example.com"
                            icon={Mail}
                            field={field}
                            className="bg-black/20 border-white/10 text-white h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <LocationSelector 
                    form={form}
                    className="md:col-span-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Set Password</FormLabel>
                        <FormControl>
                          <AnimatedPlaceholderInput 
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            field={field}
                            className="bg-black/20 border-white/10 text-white h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                          />
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
                          <AnimatedPlaceholderInput 
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            field={field}
                            className="bg-black/20 border-white/10 text-white h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-[#00A8E1] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#0082B4] transition-all hover:shadow-[0_0_30px_rgba(0,168,225,0.4)] relative overflow-hidden group mt-2 overflow-hidden"
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
        ) : step === 3 ? (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 space-y-6 text-center"
          >
            <div className="mx-auto h-20 w-20 bg-[#00A8E1]/10 rounded-full flex items-center justify-center mb-4 border border-[#00A8E1]/20 shadow-[0_0_30px_rgba(0,168,225,0.15)]">
              <Mail className="h-10 w-10 text-[#00A8E1]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Verify Email</h2>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                We've sent a 6-digit verification code to <span className="text-white font-bold">{pendingValues?.email}</span>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6 mt-8 max-w-sm mx-auto">
              <div>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="------"
                  className="bg-black/40 border-white/20 text-white h-16 text-center text-3xl tracking-[1em] rounded-2xl focus-visible:ring-[#00A8E1] transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || otp.length !== 6}
                className="w-full h-14 bg-[#00A8E1] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#0082B4] transition-all disabled:opacity-50 hover:shadow-[0_0_30px_rgba(0,168,225,0.4)] relative overflow-hidden group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      Verify & Continue <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </>
                )}
              </button>

              <div className="flex justify-center gap-6 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-400 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-8 text-center relative z-10">
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
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dqfntq4ld/image/upload/f_auto,q_auto,w_1920/v1774534572/Untitled_3_dcv5sw.jpg')" }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00A8E1]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 z-0" />
      
      <Suspense fallback={<div className="text-white font-display text-xl animate-pulse tracking-widest uppercase">Initializing...</div>}>
        <RegisterContent />
      </Suspense>
    </div>
  );
}
