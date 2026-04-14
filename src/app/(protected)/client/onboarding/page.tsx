"use client";

import { useState, useEffect } from "react";
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
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);

  // Tax State
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");

  // Flow State
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.getClientProfile();
        if (res?.profile) {
          if (res.profile.companyName) setCompanyName(res.profile.companyName);
          if (res.profile.imageUrl) setProfilePicture(res.profile.imageUrl);
          if (res.profile.location) setLocation(res.profile.location);
          else if (res.profile.city) setLocation(res.profile.city);
          if (res.profile.bio) setDescription(res.profile.bio);
          if (res.profile.gstNumber) setGstNumber(res.profile.gstNumber);
          if (res.profile.panNumber) setPanNumber(res.profile.panNumber);
        }
      } catch (err) {
        console.error("Failed to load existing profile data", err);
      }
    }
    loadProfile();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      if (!companyName) {
        toast.error("Please enter your company or brand name.");
        return;
      }
      try {
        setIsSubmitting(true);
        const res = await api.updateClientProfile({ companyName, imageUrl: profilePicture });
        if (res.error) {
          toast.error(res.error);
          return;
        }
      } catch (err) {
        console.error("Failed to update profile:", err);
        toast.error("An unexpected error occurred.");
        return;
      } finally {
        setIsSubmitting(false);
      }
    }
    setStep(s => s + 1);
  };
  const handlePrev = () => setStep(s => s - 1);

  const handleComplete = async () => {
    if (!gstNumber && !panNumber) {
      toast.error("Please provide either a GST Number or PAN Number.");
      return;
    }

    if (gstNumber) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(gstNumber)) {
        toast.error("Invalid GST Number format.");
        return;
      }
    }

    if (panNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(panNumber)) {
        toast.error("Invalid PAN Number format.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const res = await api.updateClientProfile({ 
        location, 
        bio: description,
        gstNumber: gstNumber || null,
        panNumber: panNumber || null
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }
      
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
      if (isWidgetLoading) return;
      setIsWidgetLoading(true);
      setTimeout(() => setIsWidgetLoading(false), 2000);

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
            
            let finalUrl = result.info.secure_url;
            if (result.info.coordinates?.custom) {
              finalUrl = finalUrl.replace('/upload/', '/upload/c_crop,g_custom/');
            }
            
            setProfilePicture(finalUrl);
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
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="mb-8">
          <p className="text-[#00A8E1] text-sm font-bold tracking-widest uppercase mb-2">Step {step} of 3</p>
          <h2 className="text-3xl font-display text-white mb-2">
            {step === 1 && "Setup your Profile"}
            {step === 2 && "Location & Details"}
            {step === 3 && "Tax Information"}
          </h2>
          <p className="text-gray-400">
            {step === 1 && "Help talent recognize you with a name and logo."}
            {step === 2 && "Add your company location and a brief description."}
            {step === 3 && "Please provide either your GST Number or PAN Number to verify your business."}
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
                        {isWidgetLoading ? <Loader2 className="w-8 h-8 text-[#00A8E1] animate-spin" /> : <Camera className="w-8 h-8 text-gray-400 group-hover:text-[#00A8E1] transition-colors" />}
                      </div>
                      <h4 className="text-white font-bold mb-1">{isWidgetLoading ? "Opening..." : "Upload Company Logo"}</h4>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Recommended: Square PNG/JPG</p>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-3 italic text-center">* You can update this later in dashboard settings.</p>
              </div>
            </div>
          )}

          {step === 2 && (
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
                  className="w-full bg-[#141414] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00A8E1] resize-none h-64"
                  placeholder="Briefly describe your company, brand, or projects..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">GST Number <span className="text-gray-500 font-normal ml-2">(Optional if PAN is provided)</span></label>
                <Input 
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className="bg-[#141414] border-white/10 text-white h-12 rounded-xl px-4 focus-visible:ring-[#00A8E1] font-mono tracking-widest text-lg" 
                  placeholder="e.g. 29ABCDE1234F2Z5" 
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-white/10 flex-1" />
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">OR</div>
                <div className="h-px bg-white/10 flex-1" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">PAN Number <span className="text-gray-500 font-normal ml-2">(Optional if GST is provided)</span></label>
                <Input 
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="bg-[#141414] border-white/10 text-white h-12 rounded-xl px-4 focus-visible:ring-[#00A8E1] font-mono tracking-widest text-lg" 
                  placeholder="e.g. ABCDE1234F" 
                  autoComplete="off"
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
          
          {step < 3 ? (
            <Button onClick={handleNext} disabled={isSubmitting} className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 rounded-xl min-w-[140px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isSubmitting || (!gstNumber && !panNumber)} className="bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(0,168,225,0.4)]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Complete Profile Setup <SendHorizontal className="w-5 h-5 ml-2" /></>}
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
