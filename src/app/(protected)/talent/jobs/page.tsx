"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Film, Calendar, CheckCircle2 } from "lucide-react";
import SubscriptionGate from "@/components/shared/SubscriptionGate";
import { toast } from "sonner";

// Mock casting calls
const mockCastingCalls = [
  {
    id: "cc1",
    title: "Lead Actor - Feature Film 'Kavya'",
    description: "Looking for a versatile lead actor for an emotional family drama. Must have strong dialogue delivery skills and experience in regional cinema.",
    roles: ["Lead Actor", "Supporting Actor"],
    location: "Mumbai",
    lastDate: "2025-04-15",
    type: "Film",
    applicants: 42,
    status: "OPEN",
    createdAt: "2025-03-01",
  },
  {
    id: "cc2",
    title: "Cinematographer - OTT Series 'Dark Streets'",
    description: "Seeking an experienced DP for a gritty crime thriller OTT series spanning 8 episodes.",
    roles: ["Cinematographer", "Camera Assistant"],
    location: "Delhi / Remote",
    lastDate: "2025-04-01",
    type: "OTT Series",
    applicants: 18,
    status: "OPEN",
    createdAt: "2025-03-05",
  },
  {
    id: "cc3",
    title: "Background Dancers - Commercial Ad",
    description: "8 background dancers needed for 2-day commercial shoot. Previous ad experience preferred.",
    roles: ["Background Artist"],
    location: "Hyderabad",
    lastDate: "2025-03-20",
    type: "Commercial",
    applicants: 85,
    status: "OPEN",
    createdAt: "2025-02-20",
  },
];

export default function TalentJobsPage() {
  const [applied, setApplied] = useState<Record<string, boolean>>({});

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
          {mockCastingCalls.map((call) => (
            <Card key={call.id} className="bg-[#1f1f1f] border-white/5 hover:border-white/20 transition-all overflow-hidden duration-300">
              <div className={`h-1.5 w-full ${call.status === 'OPEN' ? 'bg-[#00A8E1]' : 'bg-gray-600'}`} />
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl font-bold text-white">{call.title}</h2>
                      <div className="flex gap-2 flex-wrap mt-1 lg:mt-0">
                        <Badge variant="outline" className="border-white/10 text-gray-300 bg-white/5 py-1">
                          {call.type}
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
                        {call.roles.join(', ')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#00A8E1]" />
                        Closes {new Date(call.lastDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#00A8E1]" />
                        {call.applicants + (applied[call.id] ? 1 : 0)} Applicants so far
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
          ))}
        </div>
      </SubscriptionGate>
    </PageWrapper>
  );
}
