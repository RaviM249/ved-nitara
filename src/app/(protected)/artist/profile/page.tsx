"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { mockArtists } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Loader2, Save, Plus, X } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/stubs";
import { toast } from "sonner";
import SubscriptionBadge from "@/components/shared/SubscriptionBadge";

export default function ArtistProfilePage() {
  const { user } = useAuthStore();
  // In a real app, fetch based on user.id. Here we use 'a1' for demo.
  const profile = mockArtists.find(a => a.id === 'a1') || mockArtists[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    city: profile.city,
    bio: profile.bio || "",
    availability: profile.availability,
  });

  const [skills, setSkills] = useState(profile.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      const res = await api.updateProfile(profile.id, { ...formData, skills });
      if (res.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <PageWrapper>
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
            <Button onClick={handleSave} disabled={isLoading} className="bg-[#E50914] text-white hover:bg-[#b80710]">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Photo & Roles */}
        <div className="space-y-6">
          <Card className="bg-[#1f1f1f] border-white/5 overflow-hidden">
            <div className="relative aspect-square">
              <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Button variant="outline" className="bg-black/50 border-white/20 text-white backdrop-blur-sm">
                    <Camera className="h-4 w-4 mr-2" /> Change Photo
                  </Button>
                </div>
              )}
              {profile.isVerified && (
                <div className="absolute bottom-3 right-3">
                  <SubscriptionBadge />
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white leading-none mb-2">{formData.name}</h2>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-1" /> {formData.city}, {profile.state}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Primary Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map(r => (
                      <Badge key={r} variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages?.map(lang => (
                      <span key={lang} className="text-sm text-gray-300 bg-[#141414] px-2 py-1 rounded border border-white/5">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Display Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">City</Label>
                      <Input 
                        id="city" 
                        value={formData.city} 
                        onChange={(e) => setFormData({...formData, city: e.target.value})} 
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                      className="bg-[#141414] border-white/10 text-white h-32 focus-visible:ring-[#E50914]" 
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {formData.bio || "No bio added yet."}
                </p>
              )}
            </CardContent>
          </Card>

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
                      className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" 
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} className="bg-white/10 text-white hover:bg-white/20">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-[#141414] text-gray-300 border-white/10 px-3 py-1.5 flex items-center gap-2">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-red-400">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-[#141414] text-gray-300 border-white/10 px-3 py-1.5">
                      {skill}
                    </Badge>
                  ))}
                  {skills.length === 0 && <p className="text-gray-500 text-sm">No skills added.</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1f1f1f] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg flex justify-between items-center">
                <span>Showreel & Portfolio</span>
                {isEditing && (
                  <Button variant="outline" size="sm" className="border-[#E50914]/50 text-[#E50914] hover:bg-[#E50914]/10">
                    <Plus className="h-4 w-4 mr-2" /> Add Link
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-[#141414] border border-white/10 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer mb-4">
                <img src="https://images.unsplash.com/photo-1485001254625-f8db89b21a81?q=80&w=2674&auto=format&fit=crop" alt="Showreel Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#E50914]/80 text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(229,9,20,0.5)] group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400">Primary Acting Showreel - 2025</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
