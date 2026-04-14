"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Loader2, Save, Plus, X, Youtube, Video, Play, CheckCircle2, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/stubs";
import { toast } from "sonner";
import SubscriptionBadge from "@/components/shared/SubscriptionBadge";
import Script from "next/script";
import { LocationSelector } from "@/components/shared/LocationSelector";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

// ... inside ArtistProfilePage ...
// I will need to use react-hook-form for consistency or mock the form object

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function ArtistProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    bio: "",
    age: "",
    gender: "",
    experience: "",
    youtubeUrl: "",
    vimeoUrl: "",
    imageUrl: "",
    availability: [] as string[]
  });


  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.getTalentProfile();
        if (res.profile) {
          setProfile(res.profile);
          setFormData({
            name: user?.name || res.profile.name || "",
            city: res.profile.city || (res.profile.location?.split(',')[0]?.trim()) || "",
            state: res.profile.state || (res.profile.location?.split(',')[1]?.trim()) || "",
            bio: res.profile.bio || "",
            age: res.profile.age?.toString() || "",
            gender: res.profile.gender || "",
            experience: res.profile.experience || "",
            youtubeUrl: res.profile.youtubeUrl || "",
            vimeoUrl: res.profile.vimeoUrl || "",
            imageUrl: res.profile.imageUrl || "",
            availability: res.profile.availability || []
          });

          setSkills(res.profile.skills || []);
          setRoles(res.profile.roles || []);
          setLanguages(res.profile.languages || []);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  console.log("Talent Profile Debug:", { profile, roles, skills, languages });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await api.updateProfile("", {
        ...formData,
        location: formData.city,
        age: formData.age ? parseInt(formData.age) : undefined,
        skills,
        roles,
        languages,
        availability: formData.availability
      });

      if (res.success || res.profile) {
        if (res.profile) setProfile(res.profile);
        updateUser({ name: formData.name });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsEditing(false);
        }, 2000);
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const extractPublicId = (url: string) => {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
      const parts = url.split("/upload/");
      if (parts.length < 2) return null;
      const pathWithoutVersion = parts[1].replace(/^v\d+\//, "");
      const extIndex = pathWithoutVersion.lastIndexOf(".");
      return extIndex !== -1 ? pathWithoutVersion.substring(0, extIndex) : pathWithoutVersion;
    } catch { return null; }
  };

  const handleUploadClick = () => {
    console.log("Cloudinary Config Check:", {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    });
    if (window.cloudinary) {
      if (isWidgetLoading) return;
      setIsWidgetLoading(true);
      setTimeout(() => setIsWidgetLoading(false), 2000);

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder: "ved-nitara/profiles",
          multiple: false,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          cropping: true,
          croppingAspectRatio: 1,
          croppingShowBackButton: true,
          showSkipCropButton: false,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const oldUrl = formData.imageUrl || profile?.imageUrl;
            if (oldUrl) {
              const oldPublicId = extractPublicId(oldUrl);
              if (oldPublicId) {
                api.deleteImage(oldPublicId).catch(console.error);
              }
            }
            
            let finalUrl = result.info.secure_url;
            if (result.info.coordinates?.custom) {
              finalUrl = finalUrl.replace('/upload/', '/upload/c_crop,g_custom/');
            }
            
            setFormData(prev => ({ ...prev, imageUrl: finalUrl }));
            toast.success("Profile picture uploaded!");
          } else if (error && Object.keys(error).length > 0) {
            // Only log if it's a real technical error, not a manual abort
            console.error("Upload error:", error);
            toast.error("Upload failed. Please try again.");
          }
        }
      );
      widget.open();
    }
  };


  const addItem = (item: string, setItem: (s: string) => void, list: string[], setList: (l: string[]) => void) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
      setItem("");
    }
  };

  const removeItem = (itemToRemove: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.filter(s => s !== itemToRemove));
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  const activeProfile = {
    ...profile,
    name: formData.name || profile?.name || user?.name || "Artist",
    profilePhoto: formData.imageUrl || profile?.imageUrl || "/placeholder-avatar.png",
    city: formData.city || profile?.location || "Not set",
    roles: roles,
    languages: languages,
    skills: skills,
    availability: formData.availability || profile?.availability || "Not set",
    isVerified: user?.isVerified || (profile as any)?.user?.isVerified || false

  };


  return (
    <PageWrapper>
      <>
        <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display text-white mb-2">My Profile</h1>
            <p className="text-gray-400 text-sm">Manage your public presence in the Artist Bank.</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-white text-black hover:bg-gray-200">
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="border-white/10 text-white">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Photo & Mini Info */}
          <div className="space-y-6">
            <Card className="bg-[#1f1f1f] border-white/5 overflow-hidden">
              <div className="relative aspect-square">
                <img src={activeProfile.profilePhoto} alt={activeProfile.name} className="w-full h-full object-cover" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Button onClick={handleUploadClick} disabled={isWidgetLoading} variant="outline" className="bg-black/50 border-white/20 text-white backdrop-blur-sm">
                      {isWidgetLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />} 
                      {isWidgetLoading ? "Opening..." : "Change Photo"}
                    </Button>
                  </div>
                )}
                {activeProfile.isVerified && (
                  <div className="absolute bottom-3 right-3">
                    <SubscriptionBadge />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white leading-none mb-2">{activeProfile.name}</h2>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 mr-1" /> {activeProfile.city}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Primary Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {(activeProfile.roles || []).map((r: string) => (
                        <Badge key={r} variant="secondary" className="bg-[#00A8E1]/10 text-[#00A8E1] border-[#00A8E1]/20">
                          {r}
                        </Badge>
                      ))}
                      {(!activeProfile.roles || activeProfile.roles.length === 0) && <span className="text-xs text-gray-600">No roles added</span>}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {(activeProfile.languages || []).map((lang: string) => (
                        <span key={lang} className="text-xs text-gray-300 bg-white/5 px-2 py-1 rounded border border-white/5">
                          {lang}
                        </span>
                      ))}
                      {(!activeProfile.languages || activeProfile.languages.length === 0) && <span className="text-sm text-gray-600">None set</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Full Details Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1f1f1f] border-white/5 shadow-xl">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-white text-lg">General Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400">Display Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <LocationSelector
                          manualValue={{ state: formData.state, city: formData.city }}
                          onManualChange={(vals) => setFormData(prev => ({ ...prev, city: vals.city, state: vals.state }))}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400">Age</Label>
                        <Input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-400">Gender</Label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#00A8E1]"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-400">Experience</Label>
                        <Input
                          placeholder="e.g. 5 Years"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Bio / About Yourself</Label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="bg-[#141414] border-white/10 text-white h-32 focus-visible:ring-[#00A8E1]"
                        placeholder="Share your artistic journey, achievements, and what you're looking for..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Availability</Label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        {['Full-time', 'Part-time', 'Project-based', 'Weekends Only'].map(a => {
                          const isSelected = formData.availability.includes(a);
                          return (
                            <button
                              key={a}
                              onClick={() => {
                                const newAvb = isSelected 
                                  ? formData.availability.filter((item: string) => item !== a)
                                  : [...formData.availability, a];
                                setFormData(prev => ({ ...prev, availability: newAvb }));
                              }}
                              className={`p-2 rounded-lg border text-sm font-medium transition-all text-left ${isSelected ? 'border-[#00A8E1] bg-[#00A8E1]/10 text-white shadow-[0_0_10px_rgba(0,168,225,0.2)]' : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20'}`}
                            >
                              {a}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Age</p>
                        <p className="text-white font-medium">{formData.age || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Gender</p>
                        <p className="text-white font-medium">{formData.gender || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Experience</p>
                        <p className="text-white font-medium">{formData.experience || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Availability</p>
                        <p className="text-white font-medium">{formData.availability.length > 0 ? formData.availability.join(', ') : "—"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Detailed Bio</p>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                        {formData.bio || "No bio added yet."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Roles & Languages Editor */}
            {isEditing && (
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="bg-[#1f1f1f] border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Manage Roles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="e.g. Actor"
                        className="bg-[#141414] border-white/10 text-white"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newRole, setNewRole, roles, setRoles))}
                      />
                      <Button type="button" onClick={() => addItem(newRole, setNewRole, roles, setRoles)} className="bg-white/10 text-white">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(roles || []).map(r => (
                        <Badge key={r} variant="secondary" className="bg-[#141414] border-white/10 text-gray-300 py-1.5 px-3 flex items-center gap-2">
                          {r}
                          <button 
                            type="button" 
                            onClick={() => removeItem(r, roles, setRoles)}
                            className="text-gray-500 hover:text-red-400 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>

                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1f1f1f] border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Manage Languages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="e.g. Hindi"
                        className="bg-[#141414] border-white/10 text-white"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newLanguage, setNewLanguage, languages, setLanguages))}
                      />
                      <Button type="button" onClick={() => addItem(newLanguage, setNewLanguage, languages, setLanguages)} className="bg-white/10 text-white">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(languages || []).map(l => (
                        <Badge key={l} variant="secondary" className="bg-[#141414] border-white/10 text-gray-300 py-1.5 px-3 flex items-center gap-2">
                          {l}
                          <button 
                            type="button" 
                            onClick={() => removeItem(l, languages, setLanguages)}
                            className="text-gray-500 hover:text-red-400 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>

                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="bg-[#1f1f1f] border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a new skill (e.g. Method Acting)"
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newSkill, setNewSkill, skills, setSkills))}
                      />
                      <Button type="button" onClick={() => addItem(newSkill, setNewSkill, skills, setSkills)} className="bg-white/10 text-white">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(skills || []).map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-[#141414] text-gray-300 border-white/10 px-3 py-1.5 flex items-center gap-2">
                          {skill}
                          <button type="button" onClick={() => removeItem(skill, skills, setSkills)} className="text-gray-500 hover:text-red-400">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(activeProfile.skills || []).map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-[#141414] text-gray-300 border-white/10 px-3 py-1.5">
                        {skill}
                      </Badge>
                    ))}
                    {(!activeProfile.skills || activeProfile.skills.length === 0) && <p className="text-gray-500 text-sm">No skills added yet.</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Showreel Section */}
            <Card className="bg-[#1f1f1f] border-white/5">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-white text-lg">Showreel & Portfolio Links</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400 flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" /> YouTube Showreel URL
                      </Label>
                      <Input
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 flex items-center gap-2">
                        <Video className="h-4 w-4 text-[#00adef]" /> Vimeo URL
                      </Label>
                      <Input
                        value={formData.vimeoUrl}
                        onChange={(e) => setFormData({ ...formData, vimeoUrl: e.target.value })}
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                        placeholder="https://vimeo.com/..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {formData.youtubeUrl ? (
                      <div className="aspect-video bg-[#141414] border border-white/10 rounded-xl overflow-hidden group relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                        <div className="flex flex-col items-center gap-3">
                          <Youtube className="h-10 w-10 text-red-500" />
                          <span className="text-xs font-bold text-white tracking-widest uppercase">YouTube Showreel</span>
                          <Button asChild size="sm" variant="outline" className="h-8 border-red-500/20 text-red-400 hover:bg-red-500/10">
                            <a href={formData.youtubeUrl} target="_blank" rel="noreferrer">Watch Now</a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-white/5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-500">
                        <Youtube className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs">No YouTube link</p>
                      </div>
                    )}

                    {formData.vimeoUrl ? (
                      <div className="aspect-video bg-[#141414] border border-white/10 rounded-xl overflow-hidden group relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00adef]/10 to-transparent" />
                        <div className="flex flex-col items-center gap-3">
                          <Video className="h-10 w-10 text-[#00adef]" />
                          <span className="text-xs font-bold text-white tracking-widest uppercase">Vimeo Showcase</span>
                          <Button asChild size="sm" variant="outline" className="h-8 border-[#00adef]/20 text-[#00adef] hover:bg-[#00adef]/10">
                            <a href={formData.vimeoUrl} target="_blank" rel="noreferrer">Open Video</a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-white/5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-500">
                        <Video className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs">No Vimeo link</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="border-white/10 text-white">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        )}


        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="bg-[#1f1f1f] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm mx-4"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-display text-white mb-2">Profile Updated!</h3>
                <p className="text-gray-400">Your changes have been saved successfully and are now live in the Artist Bank.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
      {/* Danger Zone */}
      <div className="mt-12 pt-8 border-t border-red-500/20">
        <h3 className="text-xl font-display text-red-500 mb-2 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" /> Busy or Hired already?
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Disabling your account will hide your profile from the Talent Bank and stop all notifications.
          You can re-enable your account at any time by simply logging back in.
        </p>

        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-medium mb-1">Disable Account</h4>
              <p className="text-xs text-gray-500">Temporarily deactivate your platform presence.</p>
            </div>
            <Button
              variant="outline"
              className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              onClick={() => {
                if (confirm("Are you sure you want to disable your account?\n\n- Your profile will be hidden.\n- You will stop receiving alerts.\n- You can re-enable by logging in again.")) {
                  api.disableAccount(true).then(res => {
                    if (res.success) {
                      toast.success("Account disabled. Logging out...");
                      setTimeout(() => {
                        localStorage.removeItem("auth-token");
                        window.location.href = "/login";
                      }, 2000);
                    } else {
                      toast.error("Failed to disable account");
                    }
                  });
                }
              }}
            >
              Disable My Account
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
