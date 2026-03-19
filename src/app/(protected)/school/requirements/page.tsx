"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { mockFacultyRequirements } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Users, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SchoolRequirementsPage() {
  const schoolId = 's1';
  const requirements = mockFacultyRequirements.filter(r => r.schoolId === schoolId);

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Requirements Management</h1>
          <p className="text-gray-400 text-sm">Manage your open postings and review applicants.</p>
        </div>
        <Button asChild className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
          <Link href="/school/requirements/new">
            <Plus className="h-4 w-4 mr-2" /> Post New
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {requirements.length > 0 ? requirements.map((req) => (
          <Card key={req.id} className="bg-[#1f1f1f] border-white/5 hover:border-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{req.roleNeeded}</h3>
                    <Badge variant="outline" className={`
                      ${req.isActive ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-red-500/30 text-red-500 bg-red-500/10'}
                    `}>
                      {req.isActive ? 'OPEN' : 'CLOSED'}
                    </Badge>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-4">{req.subject}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 opacity-70 text-[#00A8E1]" />
                      {req.duration}
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-gray-300 mr-1 opacity-70">₹</span>
                      {req.budgetMin.toLocaleString()} - {req.budgetMax.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1.5 opacity-70 text-[#00A8E1]" />
                      24 Applicants
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 md:pl-6 md:border-l border-white/10 pt-4 md:pt-0 border-t md:border-t-0">
                  <div className="flex-1 md:flex-none">
                    <Button className="w-full bg-[#00A8E1] text-white hover:bg-[#0082B4]">
                      Review Applicants
                    </Button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-10 w-10 text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none">
                        <MoreVertical className="h-5 w-5 pointer-events-none" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#1f1f1f] border-white/10 text-white">
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" /> Edit Posting
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-500 focus:text-red-400">
                        <Trash2 className="h-4 w-4 mr-2" /> Close Requirement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 bg-[#1f1f1f] rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-2">No Requirements Found</h3>
            <p className="text-gray-400 text-sm mb-6">You haven't posted any faculty requirements yet.</p>
            <Button asChild className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
              <Link href="/school/requirements/new">Post your first requirement</Link>
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
