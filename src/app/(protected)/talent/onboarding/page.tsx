"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Video, ArrowRight, ArrowLeft, Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export default function TalentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Flow State
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleComplete = () => {
    // Submit data...
    router.push("/talent/dashboard");
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
            {step === 1 && "What's your primary role?"}
            {step === 2 && "Showcase your work"}
            {step === 3 && "Your experience"}
            {step === 4 && "Availability & Location"}
          </h2>
          <p className="text-gray-400">
            {step === 1 && "Select the role that best describes your talent."}
            {step === 2 && "Upload your best photos, showreels, or portfolio links."}
            {step === 3 && "Tell us about your past projects and skills."}
            {step === 4 && "Let clients know when and where you can work."}
          </p>
        </div>

        {/* Form Content */}
        <div className="min-h-[250px]">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {['Actor', 'Singer', 'Dancer', 'Video Editor', 'Photographer', 'Producer', 'Director', 'Writer', 'Stylist', 'Other'].map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); handleNext(); }}
                  className={`p-4 rounded-xl border text-left font-semibold transition-all ${role === r ? 'border-[#00A8E1] bg-[#00A8E1]/10 text-white' : 'border-white/10 bg-[#141414] text-gray-400 hover:text-white hover:border-white/30'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-[#00A8E1]/50 hover:bg-white/5 transition-colors cursor-pointer group">
                 <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-[#00A8E1]" />
                 <h4 className="text-white font-bold mb-1">Upload Headshots</h4>
                 <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
              </div>
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-[#00A8E1]/50 hover:bg-white/5 transition-colors cursor-pointer group">
                 <Video className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-[#00A8E1]" />
                 <h4 className="text-white font-bold mb-1">Add Showreel Link</h4>
                 <p className="text-xs text-gray-500">YouTube or Vimeo URL</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">Years of Experience</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Fresher', '1-3 Years', '3-5 Years', '5+ Years'].map(e => (
                    <button
                      key={e}
                      onClick={() => setExperience(e)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${experience === e ? 'border-[#00A8E1] bg-[#00A8E1]/10 text-white' : 'border-white/10 bg-[#141414] text-gray-400'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block mt-6">Short Bio</label>
                <textarea 
                  className="w-full bg-[#141414] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00A8E1] resize-none h-32"
                  placeholder="I am a passionate creator who loves..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#00A8E1]" /> Availability
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Full-time', 'Part-time', 'Project-based', 'Weekends Only'].map(a => (
                    <button
                      key={a}
                      onClick={() => setAvailability(a)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${availability === a ? 'border-[#00A8E1] bg-[#00A8E1]/10 text-white' : 'border-white/10 bg-[#141414] text-gray-400'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00A8E1]" /> Current City
                </label>
                <Input className="bg-[#141414] border-white/10 text-white h-12 rounded-xl px-4 focus-visible:ring-[#00A8E1]" placeholder="e.g. Mumbai, Delhi, Bangalore" />
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
            <Button onClick={handleNext} disabled={step === 1 && !role} className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 rounded-xl">
              Next Step <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(0,168,225,0.4)]">
              Start Exploring Jobs <CheckCircle2 className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

      </div>
      
      {/* Microcopy */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 font-medium text-sm">
        Your profile helps you get discovered. You can switch roles anytime.
      </div>
    </div>
  );
}
