"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/stubs";
import { useAuthStore } from "@/lib/store/authStore";
import { loginSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPlaceholderInput } from "@/components/shared/AnimatedPlaceholderInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
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
    // Only run on mount to prevent interfering with login redirect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<{ field: "email" | "password" | "root", message: string } | null>(null);
  const [isSuspended, setIsSuspended] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      setServerError(null);
      setIsSuspended(false);
      const res = await api.login(values);

      if (res.user) {
        // Remove success toast as requested
        // Store user in Zustand
        login(res.user.role, res.user, res.user.isSubscribed);
        
        if (res.token) {
          localStorage.setItem("auth-token", res.token);
        }

        if (res.user.role === "CLIENT") {
          router.push("/client/dashboard");
        } else if (res.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/talent/dashboard");
        }
      } else {
        if (res.error === "USER_NOT_FOUND") {
          setServerError({ field: "email", message: "User not found" });
          form.setError("email", { message: "Account not found with this email" });
        } else if (res.error === "INVALID_PASSWORD") {
          setServerError({ field: "password", message: "Incorrect password" });
          form.setError("password", { message: "The password you entered is incorrect" });
        } else if (res.error === "ACCOUNT_SUSPENDED") {
          setIsSuspended(true);
        } else {
          toast.error(res.error || "Login failed");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
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

      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00A8E1]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-md bg-[#1f1f1f]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block font-display text-4xl tracking-wider text-[#00A8E1] mb-2 hover-blue-glow">
            VED NITARA
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome! Let&apos;s get started</h1>
        </div>

        <AnimatePresence>
          {isSuspended && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-500 py-3">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle className="font-bold text-sm">Account Suspended</AlertTitle>
                <AlertDescription className="text-[10px] opacity-90 leading-tight">
                  Your account has been suspended for violating platform policies. 
                  Please contact <span className="underline cursor-pointer font-bold">support@vednitara.com</span>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <AnimatedPlaceholderInput 
                      placeholder="name@example.com" 
                      field={field}
                      className={`bg-[#141414] text-white h-12 ${
                        serverError?.field === "email" 
                          ? "!border-red-500 !ring-3 !ring-red-500/50 !shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                          : "border-white/10 focus-visible:ring-[#00A8E1]"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <AnimatedPlaceholderInput 
                      type="password" 
                      placeholder="••••••••" 
                      field={field}
                      className={`bg-[#141414] text-white h-12 ${
                        serverError?.field === "password" 
                          ? "!border-red-500 !ring-3 !ring-red-500/50 !shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                          : "border-white/10 focus-visible:ring-[#00A8E1]"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-[#00A8E1] hover:bg-[#0082B4] text-white h-12 text-base font-bold shadow-[0_0_20px_rgba(0,168,225,0.3)] mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>

            <div className="text-center mt-4">
              <Link href="/forgot-password" className="text-sm font-medium text-[#00A8E1] hover:text-[#0082B4] transition-colors">
                Forgot password?
              </Link>
            </div>
          </form>
        </Form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-white hover:text-[#00A8E1] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
