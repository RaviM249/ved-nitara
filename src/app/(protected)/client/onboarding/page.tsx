"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Briefcase, Calendar, MapPin, Search, SendHorizontal } from "lucide-react";

export default function ClientOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Flow State
  const [need, setNeed] = useState("");
  const [timeline, setTimeline] = useState("");

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleComplete = () => {
    // Submit data...
    router.push("/client/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0F171E] pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto p-8 rounded-3xl bg-[#1f1f1f] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
          <div 
            className="h-full bg-[#00A8E1] transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="mb-8">
          <p className="text-[#00A8E1] text-sm font-bold tracking-widest uppercase mb-2">Step {step} of 4</p>
          <h2 className="text-3xl font-display text-white mb-2">
            {step === 1 && "What do you need?"}
            {step === 2 && "Estimated Budget"}
            {step === 3 && "Project Timeline"}
            {step === 4 && "Location & Details"}
          </h2>
          <p className="text-gray-400">
            {step === 1 && "Start by telling us what kind of talent you're looking for."}
            {step === 2 && "Give candidates an idea of the compensation."}
            {step === 3 && "When do you need the talent to start?"}
            {step === 4 && "Add any location constraints or final job details."}
          </p>
        </div>

        {/* Form Content */}
        <div className="min-h-[250px]">
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input 
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="bg-[#141414] border-white/10 text-white h-14 rounded-xl pl-12 focus-visible:ring-[#00A8E1] text-lg" 
                  placeholder="e.g. Lead Actor, Senior Video Editor..." 
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {['Cinematographer', 'Makeup Artist', 'Background Actor', 'Voiceover Artist', 'Screenwriter'].map(suggest => (
                  <button 
                    key={suggest}
                    onClick={() => setNeed(suggest)}
                    className="px-4 py-2 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white hover:border-white/30 bg-white/5 transition-colors"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Minimum (₹)</label>
                    <Input type="number" className="bg-[#141414] border-white/10 h-14 rounded-xl text-white text-xl" placeholder="5000" />
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Maximum (₹)</label>
                    <Input type="number" className="bg-[#141414] border-white/10 h-14 rounded-xl text-white text-xl" placeholder="25000" />
                 </div>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-gray-500 text-sm font-semibold">OR</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              <button className="w-full p-4 border border-white/10 rounded-xl text-gray-300 font-semibold hover:bg-white/5 transition-colors text-center">
                Unpaid / Collaboration Project
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-3">
              {['Immediately (Next 24-48 hours)', 'Within a week', 'In 2-4 weeks', 'More than a month away'].map(t => (
                <button
                  key={t}
                  onClick={() => { setTimeline(t); handleNext(); }}
                  className={`p-5 rounded-xl border text-left font-semibold transition-all ${timeline === t ? 'border-[#00A8E1] bg-[#00A8E1]/10 text-white' : 'border-white/10 bg-[#141414] text-gray-400 hover:text-white hover:border-white/30'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00A8E1]" /> Location (Optional)
                </label>
                <Input className="bg-[#141414] border-white/10 text-white h-12 rounded-xl px-4 focus-visible:ring-[#00A8E1]" placeholder="e.g. Mumbai, or Remote" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block mt-6">Project Description</label>
                <textarea 
                  className="w-full bg-[#141414] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00A8E1] resize-none h-24"
                  placeholder="Briefly describe the project and what the talent will be doing..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
          <button 
            onClick={handlePrev}
            className={`text-sm font-bold flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white transition-colors'}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 4 ? (
            <Button onClick={handleNext} disabled={step === 1 && !need} className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 rounded-xl">
              Next Step <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(0,168,225,0.4)]">
              Post Requirement <SendHorizontal className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 font-medium text-sm">
        No commitments—explore freely. 
      </div>
    </div>
  );
}
