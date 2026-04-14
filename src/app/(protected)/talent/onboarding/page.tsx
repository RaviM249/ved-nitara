"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Video, ArrowRight, ArrowLeft, Briefcase, Calendar, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/stubs";
import { toast } from "sonner";

export default function TalentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPosting, setIsPosting] = useState(false);

  // Flow State
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null);
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [vimeoUrl, setVimeoUrl] = useState("");

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleComplete = async () => {
    setIsPosting(true);
    try {
      const data = {
        roles: [role],
        experience,
        bio,
        availability,
        location: city,
        imageUrl: profilePicture,
        youtubeUrl,
        vimeoUrl,
      };

      const res = await api.updateProfile("", data); // Passing empty string as the API uses the token's userId
      if (res.success) {
        toast.success("Onboarding complete!");
        router.push("/talent/dashboard");
      } else {
        toast.error(res.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleUploadClick = () => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      if (isWidgetLoading) return;
      setIsWidgetLoading(true);
      setTimeout(() => setIsWidgetLoading(false), 2000);

      (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder: "ved-nitara/profiles",
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

            let finalUrl = result.info.secure_url;
            if (result.info.coordinates?.custom) {
              finalUrl = finalUrl.replace('/upload/', '/upload/c_crop,g_custom/');
            }

            setProfilePicture(finalUrl);
            setCloudinaryPublicId(result.info.public_id);
            toast.success("Profile picture uploaded!");
          } else if (error && Object.keys(error).length > 0) {
            // Only log if it's a real technical error, not a manual abort
            console.error("Upload error:", error);
          }
        }

      ).open();
    } else {
      toast.error("Upload service is initializing. Please wait a moment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F171E] pt-24 pb-12 flex items-center justify-center">
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive"
      />
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
            {step === 2 && "Upload your profile picture and add your showreel links."}
            {step === 3 && "Tell us about your past projects and skills."}
            {step === 4 && "Let clients know when and where you can work."}
          </p>
        </div>

        {/* Form Content */}
        <div className="min-h-[300px]">
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
            <div className="space-y-6">
              {/* Profile Picture Upload */}
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-[#00A8E1]/50 hover:bg-white/5 transition-colors cursor-pointer group relative overflow-hidden"
              >
                {profilePicture ? (
                  <div className="relative aspect-square w-32 mx-auto rounded-full overflow-hidden border-2 border-[#00A8E1]">
                    <img src={profilePicture} alt="Profile Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <>
                    {isWidgetLoading ? <Loader2 className="w-10 h-10 text-[#00A8E1] mx-auto mb-3 animate-spin" /> : <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-[#00A8E1]" />}
                    <h4 className="text-white font-bold mb-1">{isWidgetLoading ? "Opening..." : "Upload Profile Picture"}</h4>
                    <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                  </>
                )}
              </div>

              {/* Showreel Links */}
              <div className="space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#00A8E1]" /> Add Showreel Link
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">YouTube URL (Optional)</label>
                    <Input 
                      className="bg-[#141414] border-white/10 text-white h-11 focus-visible:ring-[#00A8E1]" 
                      placeholder="https://youtube.com/watch?v=..." 
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vimeo URL (Optional)</label>
                    <Input 
                      className="bg-[#141414] border-white/10 text-white h-11 focus-visible:ring-[#00A8E1]" 
                      placeholder="https://vimeo.com/..." 
                      value={vimeoUrl}
                      onChange={(e) => setVimeoUrl(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-500 mt-1 pl-1">
                      Tip: Ensure your Vimeo settings allow embedding for viewing on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">Years of Experience</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Fresher', '1-3 Years', '3-5 Years', '5+ Years'].map(e => (
                    <button
                      key={e}
                      onClick={() => setExperience(e)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${experience === e ? 'border-[#00A8E1] bg-[#00A8E1]/10 text-white' : 'border-white/10 bg-[#141414] text-gray-400 hover:text-white'}`}
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
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                  {['Full-time', 'Part-time', 'Project-based', 'Weekends Only'].map(a => {
                    const isSelected = availability.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => {
                          if (isSelected) {
                            setAvailability(prev => prev.filter(item => item !== a));
                          } else {
                            setAvailability(prev => [...prev, a]);
                          }
                        }}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${isSelected ? 'border-[#00A8E1] bg-[#00A8E1]/10 text-white shadow-[0_0_10px_rgba(0,168,225,0.2)]' : 'border-white/10 bg-[#141414] text-gray-400 hover:text-white hover:border-white/20'}`}
                      >
                        {a}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00A8E1]" /> Current City
                </label>
                <Input 
                  className="bg-[#141414] border-white/10 text-white h-12 rounded-xl px-4 focus-visible:ring-[#00A8E1]" 
                  placeholder="e.g. Mumbai, Delhi, Bangalore" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
          <button 
            type="button"
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
            <Button 
              onClick={handleComplete} 
              disabled={isPosting || !availability || !city}
              className="bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(0,168,225,0.4)]"
            >
              {isPosting ? "Processing..." : "Start Exploring Jobs"} <CheckCircle2 className="w-5 h-5 ml-2" />
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
