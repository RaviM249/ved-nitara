"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Film, Calendar, CheckCircle2 } from "lucide-react";
import SubscriptionGate from "@/components/shared/SubscriptionGate";
import { toast } from "sonner";
import { api } from "@/lib/stubs";

export default function TalentJobsPage() {
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [castingCalls, setCastingCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobs = await api.getCastingCalls();
        setCastingCalls(jobs);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleApply = (id: string) => {
    setApplied(prev => ({ ...prev, [id]: true }));
    toast.success("Application submitted successfully!");
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">
          Opportunities & Casting Calls
        </h1>
        <p className="text-gray-400 text-sm">Find and apply to the latest project opportunities.</p>
      </div>

      <SubscriptionGate fallbackMessage="Subscribe to Pro to apply for unlimited casting calls.">
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

                      <p className="text-gray-300 text-base leading-relaxed mb-6">{call.description}</p>

                      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4 text-[#00A8E1]" />
                          {Array.isArray(call.roles) ? call.roles.join(', ') : "Various Roles"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#00A8E1]" />
                          Closes {call.lastDate ? new Date(call.lastDate).toLocaleDateString() : "TBD"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#00A8E1]" />
                          { (call.applicants || 0) + (applied[call.id] ? 1 : 0) } Applicants so far
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 mt-2 lg:pt-0 lg:mt-0 lg:pl-8">
                      {applied[call.id] ? (
                        <Button disabled className="w-full lg:w-auto bg-green-500/20 text-green-500 font-bold h-12 px-8 rounded-xl opacity-100">
                          <CheckCircle2 className="h-5 w-5 mr-2" /> Applied
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleApply(call.id)}
                          className="w-full lg:w-auto bg-[#00A8E1] text-white hover:bg-[#0082B4] font-bold h-12 px-8 rounded-xl"
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
      </SubscriptionGate>
    </PageWrapper>
  );
}
