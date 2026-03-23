"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Mail, User, PenSquare, Save, X, Loader2, Globe } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/stubs";
import { toast } from "sonner";

export default function ClientProfilePage() {
  const { user } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock client data since its not fully in the user object
  const [formData, setFormData] = useState({
    companyName: user?.name || "Ved Nitara Client",
    email: user?.email || "client@example.com",
    city: "Mumbai",
    state: "Maharashtra",
    website: "https://vednitara.com",
    bio: "We are a leading production house looking for fresh talent for our upcoming projects. Specializing in high-end commercials and feature films.",
    contactPerson: user?.name || "Client Representative",
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Client Profile</h1>
          <p className="text-gray-400 text-sm">Manage your company details and how talent sees you.</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
            <PenSquare className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="border-white/10 text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Info */}
        <div className="space-y-6">
          <Card className="bg-[#1f1f1f]/60 backdrop-blur-xl border-white/5 overflow-hidden">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#00A8E1] to-blue-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,168,225,0.3)]">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{formData.companyName}</h2>
              <Badge variant="secondary" className="bg-[#00A8E1]/10 text-[#00A8E1] border-none mb-4 uppercase tracking-widest text-[10px]">
                Verified CLIENT
              </Badge>
              
              <div className="w-full space-y-3 mt-4 text-left border-t border-white/5 pt-6">
                <div className="flex items-center text-gray-400 text-sm">
                  <User className="h-4 w-4 mr-3 text-[#00A8E1]" />
                  <span>{formData.contactPerson}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Mail className="h-4 w-4 mr-3 text-[#00A8E1]" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-3 text-[#00A8E1]" />
                  <span>{formData.city}, {formData.state}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Globe className="h-4 w-4 mr-3 text-[#00A8E1]" />
                  <span>{formData.website.replace('https://', '')}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Detailed Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1f1f1f]/60 backdrop-blur-xl border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">Company Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={formData.companyName} 
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="text-gray-300">Primary Contact</Label>
                      <Input 
                        id="contactPerson" 
                        value={formData.contactPerson} 
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} 
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">City</Label>
                      <Input 
                        id="city" 
                        value={formData.city} 
                        onChange={(e) => setFormData({...formData, city: e.target.value})} 
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-gray-300">Website URL</Label>
                      <Input 
                        id="website" 
                        value={formData.website} 
                        onChange={(e) => setFormData({...formData, website: e.target.value})} 
                        className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-300">About Company / Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                      className="bg-[#141414] border-white/10 text-white h-40 focus-visible:ring-[#00A8E1] resize-none" 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#00A8E1] uppercase tracking-widest mb-2 opacity-70">About Us</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {formData.bio}
                    </p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-[#00A8E1] uppercase tracking-widest mb-2 opacity-70">Platform Status</h4>
                      <p className="text-white font-medium">Active Employer</p>
                      <p className="text-xs text-gray-500 mt-1 shadow-inner">Member since 2025</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#00A8E1] uppercase tracking-widest mb-2 opacity-70">Hiring Needs</h4>
                      <p className="text-white font-medium">Actors, Models, Technicians</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Section */}
          <Card className="bg-[#1f1f1f]/60 backdrop-blur-xl border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">My Active Casting Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#141414] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-[#00A8E1]/30 transition-all">
                  <div>
                    <h5 className="text-white font-bold group-hover:text-[#00A8E1] transition-colors">Male Lead for TV Commercial</h5>
                    <p className="text-xs text-gray-400 mt-1 truncate">Mumbai • Fixed Budget • Deadline: 25th March</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10">Manage</Button>
                </div>
                <div className="flex items-center justify-center p-8 border border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-500 text-sm italic">No other active casting calls found.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
