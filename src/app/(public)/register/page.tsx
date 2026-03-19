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
import { Loader2, ArrowRight, UserCircle, Users, Film, Building2 } from "lucide-react";
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

const roles = [
  { id: "ARTIST", label: "Artist / Talent", icon: UserCircle, desc: "For actors, singers, writers, etc." },
  { id: "SCHOOL", label: "Entertainment School", icon: Building2, desc: "For acting & music institutes" },
  { id: "PRODUCTION", label: "Production House", icon: Film, desc: "For studios and casting directors" },
  { id: "CLIENT", label: "Client / Event Organizer", icon: Users, desc: "For organizing and booking events" },
] as const;

type RoleType = "ARTIST" | "SCHOOL" | "PRODUCTION" | "CLIENT" | null;

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams?.get("role") as RoleType | null;
  
  const { login } = useAuthStore();
  const [step, setStep] = useState<number>(initialRole ? 2 : 1);
  const [selectedRole, setSelectedRole] = useState<RoleType>(initialRole || null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setStep(2);
  };

  async function onSubmit(values: z.infer<typeof basicInfoSchema>) {
    if (!selectedRole) return;
    
    try {
      setIsLoading(true);
      const res = await api.register({ ...values, role: selectedRole });

      if (res.success) {
        toast.success(res.message);
        
        // Use Zustand to log the user in
        const mockUser = {
          id: `new_${Date.now()}`,
          name: values.name,
          email: values.email,
          roles: [selectedRole] as any,
        };
        
        // Log them in
        login(selectedRole, mockUser, true);
        
        // Redirect to their dashboard
        router.push(`/${selectedRole.toLowerCase()}/dashboard`);
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl bg-[#1f1f1f] border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block font-display text-4xl tracking-wider text-[#00A8E1] mb-2 hover-blue-glow">
          VED NITARA
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {step === 1 ? "Choose your account type" : "Create your account"}
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Join the largest entertainment network in India.
        </p>
      </div>

      {step === 1 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleSelect(role.id as RoleType)}
              className="flex flex-col items-center justify-center p-6 bg-[#141414] border border-white/10 rounded-xl hover:border-[#00A8E1] hover:bg-white/5 transition-all text-center group"
            >
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#00A8E1]/20 transition-colors">
                <role.icon className="h-6 w-6 text-gray-400 group-hover:text-[#00A8E1] transition-colors" />
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-[#00A8E1] transition-colors">{role.label}</h3>
              <p className="text-xs text-gray-500">{role.desc}</p>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <>
          <div className="mb-6 flex items-center justify-between text-sm bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center text-gray-300">
              <span className="text-gray-500 mr-2">Creating acccount as:</span>
              <span className="font-bold text-white">{roles.find(r => r.id === selectedRole)?.label}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="text-[#00A8E1] hover:text-[#0082B4] font-medium text-xs"
            >
              Change
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name / Org Name</FormLabel>
                      <FormControl>
                        <Input className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input type="email" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Phone</FormLabel>
                      <FormControl>
                        <Input className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">City</FormLabel>
                      <FormControl>
                        <Input className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input type="password" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#00A8E1] hover:bg-[#0082B4] text-white h-12 text-base font-bold shadow-[0_0_20px_rgba(0,168,225,0.3)] mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </>
      )}

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-white hover:text-[#00A8E1] transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] px-4 py-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00A8E1]/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <RegisterContent />
      </Suspense>
    </div>
  );
}
