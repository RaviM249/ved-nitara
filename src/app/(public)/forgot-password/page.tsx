"use client";

import { useState } from "react";
import { api } from "@/lib/stubs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Mail, Lock, KeyRound, ArrowRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPlaceholderInput } from "@/components/shared/AnimatedPlaceholderInput";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      const res = await api.forgotPasswordSendOtp({ email }) as any;
      if (res.success) {
        setStep(2);
        toast.success(res.message || "OTP sent if email exists in our system.");
      } else {
        toast.error(res.error || "Failed to process request.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6 || newPassword.length < 6) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.forgotPasswordReset({ email, otp, newPassword }) as any;
      if (res.success) {
        toast.success("Password reset successfully! You can now log in.");
        router.push("/login");
      } else {
        toast.error(res.error || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dqfntq4ld/image/upload/f_auto,q_auto,w_1920/v1774534572/Untitled_3_dcv5sw.jpg')" }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#00A8E1]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 md:p-8 relative z-10 shadow-2xl overflow-hidden"
      >
        <div className="text-center mb-8 relative z-10">
          <Link href="/" className="inline-block font-display text-4xl tracking-wider text-[#00A8E1] mb-6 hover-blue-glow transition-all">
            VED NITARA
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">
            {step === 1 ? "Enter your email to receive a secure repair code." : "Enter your secure code and new password."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full bg-black/20 border border-white/10 text-white rounded-xl h-12 pl-10 pr-4 focus:ring-1 focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 transition-all focus:outline-none"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="w-full h-12 bg-[#00A8E1] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#0082B4] transition-all disabled:opacity-50 relative overflow-hidden group"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        Send Code <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </>
                  )}
                </button>
                
                <div className="text-center mt-4">
                  <Link href="/login" className="text-gray-400 text-sm font-bold hover:text-white transition-colors flex items-center justify-center gap-1">
                    <ChevronLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-xs font-bold uppercase tracking-wider ml-1 mb-2 block">Secure Code</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-[#00A8E1]" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="w-full bg-black/20 border border-white/10 text-white rounded-xl h-12 pl-10 pr-4 focus:ring-1 focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 transition-all font-mono tracking-widest text-lg focus:outline-none"
                        placeholder="------"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-xs font-bold uppercase tracking-wider ml-1 mb-2 block">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="password"
                        required
                        minLength={6}
                        className="w-full bg-black/20 border border-white/10 text-white rounded-xl h-12 pl-10 pr-4 focus:ring-1 focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 transition-all focus:outline-none"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || otp.length !== 6 || newPassword.length < 6}
                  className="w-full h-12 bg-[#00A8E1] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#0082B4] transition-all disabled:opacity-50 relative overflow-hidden group"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        Reset Password <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
