"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Briefcase, Calendar, MapPin, Search, SendHorizontal, Loader2, Camera, Building2 } from "lucide-react";

import { api } from "@/lib/stubs";
import { toast } from "sonner";

export default function ClientOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile State
  const [companyName, setCompanyName] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null);

  // Flow State
  const [need, setNeed] = useState("");
  const [timeline, setTimeline] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleNext = async () => {
    if (step === 1) {
      if (!companyName) {
        toast.error("Please enter your company or brand name.");
        return;
      }
      try {
        setIsSubmitting(true);
        await api.updateClientProfile({ companyName, imageUrl: profilePicture });
      } catch (err) {
        console.error("Failed to update profile:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
    setStep(s => s + 1);
  };
  const handlePrev = () => setStep(s => s - 1);

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      // Save the final details to the profile
      await api.updateClientProfile({ 
        location, 
        bio: description,
        // Also could save 'need' and 'timeline' if the schema supported it, 
        // but for now let's focus on what's definitely in the profile.
      });
      
      toast.success("Onboarding complete!");
      router.push("/client/dashboard");
    } catch (err) {
      toast.error("Failed to save final details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadClick = () => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder: "ved-nitara/client-logos",
          multiple: false,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "png", "jpeg"],
          maxFileSize: 10000000, // 10MB
          cropping: true,
          croppingAspectRatio: 1,
          croppingShowBackButton: true,
          showSkipCropButton: false,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            if (cloudinaryPublicId) {
              api.deleteImage(cloudinaryPublicId).catch(console.error);
            }
            setProfilePicture(result.info.secure_url);
            setCloudinaryPublicId(result.info.public_id);
            toast.success("Logo uploaded!");
          } else if (error) {
            console.error("Upload error:", error);
          }
        }
      ).open();
    } else {
      toast.error("Upload service is initializing. Please wait a moment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F171E] pt-24 pb-12 flex items-center justify-center px-4">
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive"
      />
      <div className="max-w-xl w-full mx-auto p-8 rounded-3xl bg-[#1f1f1f] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
          <div 
            className="h-full bg-[#00A8E1] transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="mb-8">
          <p className="text-[#00A8E1] text-sm font-bold tracking-widest uppercase mb-2">Step {step} of 5</p>
          <h2 className="text-3xl font-display text-white mb-2">
            {step === 1 && "Setup your Profile"}
            {step === 2 && "What do you need?"}
            {step === 3 && "Estimated Budget"}
            {step === 4 && "Project Timeline"}
            {step === 5 && "Location & Details"}
          </h2>
          <p className="text-gray-400">
            {step === 1 && "Help talent recognize you with a name and logo."}
            {step === 2 && "Start by telling us what kind of talent you're looking for."}
            {step === 3 && "Give candidates an idea of the compensation."}
            {step === 4 && "When do you need the talent to start?"}
            {step === 5 && "Add your company location and a brief description."}
          </p>
        </div>

        {/* Form Content */}
        <div className="min-h-[250px]">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Company or Brand Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-[#141414] border-white/10 text-white h-14 rounded-xl pl-12 focus-visible:ring-[#00A8E1]" 
                    placeholder="e.g. Dharma Productions, Your Studio..." 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Company Logo / Profile Photo</label>
                <div 
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-[#00A8E1]/50 hover:bg-white/[0.02] transition-all cursor-pointer group relative overflow-hidden bg-[#141414]"
                >
                  {profilePicture ? (
                    <div className="relative aspect-square w-32 mx-auto rounded-3xl overflow-hidden border-2 border-[#00A8E1] shadow-[0_0_20px_rgba(0,168,225,0.2)]">
                      <img src={profilePicture} alt="Logo Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Camera className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#00A8E1]/10 transition-all border border-white/5 group-hover:border-[#00A8E1]/20">
                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-[#00A8E1] transition-colors" />
                      </div>
                      <h4 className="text-white font-bold mb-1">Upload Company Logo</h4>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Recommended: Square PNG/JPG</p>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-3 italic text-center">* You can update this later in dashboard settings.</p>
              </div>
            </div>
          )}

          {step === 2 && (
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

          {step === 3 && (
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

          {step === 4 && (
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

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00A8E1]" /> Company Office / Base City
                </label>
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#141414] border-white/10 text-white h-12 rounded-xl px-4 focus-visible:ring-[#00A8E1]" 
                  placeholder="e.g. Mumbai, Delhi, or Remote" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block mt-6">About Company</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00A8E1] resize-none h-24"
                  placeholder="Briefly describe your company, brand, or projects..."
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
          
          {step < 5 ? (
            <Button onClick={handleNext} disabled={isSubmitting || (step === 2 && !need)} className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 rounded-xl min-w-[140px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(0,168,225,0.4)]">
              Complete Profile Setup <SendHorizontal className="w-5 h-5 ml-2" />
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
