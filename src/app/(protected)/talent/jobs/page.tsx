"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Film, Calendar, CheckCircle2, MapPin, Building2, ExternalLink, Briefcase } from "lucide-react";
import SubscriptionGate from "@/components/shared/SubscriptionGate";
import { toast } from "sonner";
import { api } from "@/lib/stubs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export default function TalentJobsPage() {
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [castingCalls, setCastingCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);


  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobs = await api.getCastingCalls();
        setCastingCalls(jobs);

        // Populate applied status map
        const appliedMap: Record<string, boolean> = {};
        jobs.forEach((call: any) => {
          if (call.isApplied) appliedMap[call.id] = true;
        });
        setApplied(appliedMap);

      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleApply = async (id: string) => {
    try {
      const res = await api.applyToJob(id);
      if (res.success) {
        setApplied(prev => ({ ...prev, [id]: true }));
        toast.success("Application submitted successfully!");
      } else {
        if (res.limitReached) {
          toast.error("Limit Reached", {
            description: res.message,
            action: {
              label: "Upgrade",
              onClick: () => window.location.href = "/pricing"
            }
          });
        } else {
          toast.error(res.error || "Failed to submit application.");
        }
      }
    } catch (err) {
      toast.error("An error occurred while applying.");
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">
          Opportunities & Casting Calls
        </h1>
        <p className="text-gray-400 text-sm">Find and apply to the latest project opportunities.</p>
      </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin inline-block h-8 w-8 border-4 border-[#00A8E1] border-t-transparent rounded-full mb-4" />
              <p className="text-gray-400">Loading opportunities...</p>
            </div>
          ) : castingCalls.length > 0 ? (
            castingCalls.map((call) => (
              <Card key={call.id} className="bg-[#1f1f1f] border-white/5 hover:border-white/20 transition-all overflow-hidden duration-300">
                <div className={`h-1.5 w-full ${call.status === 'OPEN' ? 'bg-[#00A8E1]' : 'bg-gray-600'}`} />
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-white">{call.title}</h2>
                        <div className="flex gap-2 flex-wrap mt-1 lg:mt-0">
                          <Badge variant="outline" className="border-white/10 text-gray-300 bg-white/5 py-1">
                            {call.type || "Project"}
                          </Badge>
                          <Badge variant="outline" className="py-1 border-green-500/30 text-green-400 bg-green-500/10">
                            {call.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-2">{call.description}</p>

                      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4 text-[#00A8E1]" />
                          {Array.isArray(call.roles) ? call.roles.join(', ') : "Various Roles"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#00A8E1]" />
                          Closes {call.deadline ? new Date(call.deadline).toLocaleDateString() : "TBD"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#00A8E1]" />
                          { call.applicants || 0 } Applicants so far
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 mt-2 lg:pt-0 lg:mt-0 lg:pl-8 min-w-[160px]">
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedJob(call)}
                        className="w-full border-white/10 text-white hover:bg-white/5 font-bold h-10 px-6 rounded-xl"
                      >
                        View Details
                      </Button>
                      
                      {applied[call.id] ? (
                        <Button disabled className="w-full bg-green-500/20 text-green-500 font-bold h-10 px-8 rounded-xl opacity-100 border border-green-500/30">
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Applied
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleApply(call.id)}
                          className="w-full bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold h-10 px-8 rounded-xl shadow-[0_0_15px_rgba(0,168,225,0.2)]"
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 rounded-2xl border border-dashed border-white/10">
              <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No open casting calls found.</p>
            </div>
          )}
        </div>

        {/* Job Details Full-Screen Overlay */}
        <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
          <DialogContent 
            showCloseButton={false}
            className="!fixed !inset-0 !translate-x-0 !translate-y-0 !w-screen !h-screen !max-w-none !rounded-none bg-[#0F171E] border-none text-white overflow-y-auto p-0 flex flex-col focus:outline-none z-[100]"
          >

            {selectedJob && (
              <div className="flex flex-col min-h-screen">
                {/* Fixed Top Navigation Bar */}
                <div className="sticky top-0 z-50 bg-[#0F171E]/80 backdrop-blur-md border-b border-white/5 px-6 h-20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedJob(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                      <CheckCircle2 className="h-6 w-6 rotate-180" /> {/* Using rotate as a back icon surrogate or similar */}
                    </button>
                    <h2 className="text-xl font-bold font-display hidden md:block">Opportunity Details</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    {applied[selectedJob.id] ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Application Submitted
                      </Badge>
                    ) : (
                      <Button 
                        onClick={() => { handleApply(selectedJob.id); setSelectedJob(null); }}
                        className="bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold h-11 px-8 rounded-xl shadow-[0_0_20px_rgba(0,168,225,0.3)]"
                      >
                        Apply Now
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => setSelectedJob(null)} className="h-11 px-4 text-gray-400 hover:text-white hover:bg-white/5">
                      Close
                    </Button>
                  </div>
                </div>

                <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                  <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-12">
                      <header>
                        <div className="flex flex-wrap gap-3 mb-6">
                          <Badge className="bg-[#00A8E1]/20 text-[#00A8E1] hover:bg-[#00A8E1]/30 border-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest">{selectedJob.type || "Film"}</Badge>
                          <Badge variant="outline" className="border-white/10 text-gray-400 px-4 py-1.5 text-xs font-bold">{selectedJob.location || "Remote"}</Badge>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-[1.1] tracking-tight">{selectedJob.title}</h1>
                        <div className="flex flex-wrap gap-8 text-gray-400 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-[#00A8E1]" />
                            </div>
                            <div>
                               <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Location</p>
                               <p className="text-white">{selectedJob.location || "Available Everywhere"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-[#00A8E1]" />
                            </div>
                            <div>
                               <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Deadline</p>
                               <p className="text-white">{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Open Until Filled"}</p>
                            </div>
                          </div>
                        </div>
                      </header>

                      <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
                         <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                           <Briefcase className="h-5 w-5 text-[#00A8E1]" /> Project Description
                         </h3>
                         <div className="prose prose-invert max-w-none">
                           <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                         </div>
                      </section>

                      <section>
                         <h3 className="text-xl font-bold text-white mb-8">Requirements & Roles</h3>
                         <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                               <p className="text-[#00A8E1] font-bold uppercase tracking-widest text-[10px] mb-2">Primary Roles</p>
                               <p className="text-xl text-white font-medium">{Array.isArray(selectedJob.roles) ? selectedJob.roles.join(', ') : "Various Talent Required"}</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                               <p className="text-[#00A8E1] font-bold uppercase tracking-widest text-[10px] mb-2">Compensation</p>
                               <p className="text-xl text-white font-medium">{selectedJob.budget || "Competitive Industry Standard"}</p>
                            </div>
                         </div>
                      </section>
                    </div>

                    {/* Sidebar Content (Right) */}
                    <div className="space-y-8">
                       <div className="sticky top-32 space-y-8">
                          {/* Company Card */}
                          <div className="rounded-3xl bg-[#1f1f1f] border border-white/10 overflow-hidden shadow-2xl">
                             <div className="h-24 bg-gradient-to-r from-blue-600 to-[#00A8E1]" />
                             <div className="px-8 pb-10 -mt-10">
                                <div className="h-20 w-20 rounded-2xl bg-[#1f1f1f] border-4 border-[#1f1f1f] shadow-xl overflow-hidden mb-6 mx-auto">
                                   {selectedJob.client?.clientProfile?.imageUrl ? (
                                     <img src={selectedJob.client.clientProfile.imageUrl} alt="Logo" className="w-full h-full object-cover" />
                                   ) : (
                                     <div className="w-full h-full bg-[#141414] flex items-center justify-center">
                                       <Building2 className="h-8 w-8 text-gray-500" />
                                     </div>
                                   )}
                                </div>
                                <div className="text-center mb-8">
                                   <h4 className="text-xl font-bold text-white mb-1">{selectedJob.client?.clientProfile?.companyName || "Production House"}</h4>
                                   {selectedJob.client?.isPremium ? (
                                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-none uppercase tracking-widest text-[10px]">PREMIUM EMPLOYER</Badge>
                                   ) : selectedJob.client?.isVerified ? (
                                      <Badge variant="secondary" className="bg-[#00A8E1]/10 text-[#00A8E1] border-none uppercase tracking-widest text-[10px]">VERIFIED CLIENT</Badge>
                                   ) : (
                                      <Badge variant="secondary" className="bg-gray-500/10 text-gray-400 border-none uppercase tracking-widest text-[10px]">NEW CLIENT</Badge>
                                   )}
                                </div>
                                <div className="space-y-4">
                                   <p className="text-gray-400 text-sm leading-relaxed text-center">
                                      {selectedJob.client?.clientProfile?.bio || "This production house hasn't added a bio yet, but they are actively looking for talent for their upcoming projects."}
                                   </p>
                                   <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl h-12">
                                      View Company Profile
                                   </Button>
                                </div>
                             </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                             <div className="flex items-center justify-between mb-6">
                                <h5 className="font-bold text-white">Project Activity</h5>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 text-[10px]">LIVE</Badge>
                             </div>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                   <span className="text-gray-500">Applicants</span>
                                   <span className="text-white font-bold">{selectedJob.applicants || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                   <span className="text-gray-500">Posted On</span>
                                   <span className="text-white font-bold">{new Date(selectedJob.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>


    </PageWrapper>
  );
}
