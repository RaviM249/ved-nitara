"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { Film, UserCircle } from "lucide-react";

export default function ModeSelectOnboarding() {
  const { switchMode } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0F171E] pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto p-12 text-center text-white relative">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">What would you like to do first?</h1>
        <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
          Since you want to do both, pick a starting point. Don't worry, you can switch modes at any time from the top menu.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Link href="/client/onboarding" onClick={() => switchMode("CLIENT")} className="group">
            <div className="bg-[#1f1f1f] border border-white/10 hover:border-[#00A8E1] rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,168,225,0.2)]">
              <Film className="w-16 h-16 text-gray-400 group-hover:text-[#00A8E1] transition-colors mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2 group-hover:text-[#00A8E1] transition-colors">Post a job</h2>
              <p className="text-gray-400 text-sm">I want to hire talent for an upcoming project right now.</p>
            </div>
          </Link>

          <Link href="/talent/onboarding" onClick={() => switchMode("TALENT")} className="group">
            <div className="bg-[#1f1f1f] border border-white/10 hover:border-[#00A8E1] rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,168,225,0.2)]">
              <UserCircle className="w-16 h-16 text-gray-400 group-hover:text-[#00A8E1] transition-colors mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2 group-hover:text-[#00A8E1] transition-colors">Build your profile</h2>
              <p className="text-gray-400 text-sm">I want to showcase my skills and start applying to casting calls.</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 font-medium text-sm">
        “You can switch roles anytime”
      </div>
    </div>
  );
}
