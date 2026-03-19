"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit, Trash2, Users, Film, Calendar } from "lucide-react";
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
    status: "CLOSED",
    createdAt: "2025-02-20",
  },
];

export default function CastingCallsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", type: "Film", lastDate: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Replace with API call - POST /api/v1/production/casting-calls
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setIsOpen(false);
    toast.success("Casting call posted successfully!");
  };

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Casting Calls</h1>
          <p className="text-gray-400 text-sm">Manage your open casting requirements and review applicants.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-[#E50914] text-white hover:bg-[#b80710] h-9 px-4 py-2">
              <Plus className="h-4 w-4 mr-2 pointer-events-none" /> Post Casting Call
          </DialogTrigger>
          <DialogContent className="bg-[#1f1f1f] border-white/10 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-display">New Casting Call</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Title</Label>
                <Input 
                  placeholder="e.g. Lead Actor - Feature Film 'Kavya'"
                  className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Type</Label>
                  <select
                    className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option>Film</option>
                    <option>OTT Series</option>
                    <option>Commercial</option>
                    <option>Music Video</option>
                    <option>Theatre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Location</Label>
                  <Input 
                    placeholder="Mumbai"
                    className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Last Date to Apply</Label>
                <Input 
                  type="date"
                  className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]"
                  value={form.lastDate}
                  onChange={(e) => setForm({ ...form, lastDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Description</Label>
                <Textarea 
                  placeholder="Describe the roles and requirements..."
                  className="bg-[#141414] border-white/10 text-white h-28 focus-visible:ring-[#E50914]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="border-white/20 text-white" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-[#E50914] text-white hover:bg-[#b80710]">
                  {isLoading ? "Posting..." : "Post Casting Call"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {mockCastingCalls.map((call) => (
          <Card key={call.id} className="bg-[#1f1f1f] border-white/5 hover:border-white/20 transition-all overflow-hidden">
            <div className={`h-1 w-full ${call.status === 'OPEN' ? 'bg-gradient-to-r from-green-500 to-transparent' : 'bg-gradient-to-r from-gray-600 to-transparent'}`} />
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <h2 className="text-xl font-bold text-white">{call.title}</h2>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className={`
                        ${call.status === 'OPEN' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-gray-500/30 text-gray-400 bg-gray-500/10'}
                      `}>
                        {call.status}
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">
                        {call.type}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{call.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Film className="h-4 w-4 text-[#E50914] opacity-80" />
                      {call.roles.join(', ')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#E50914] opacity-80" />
                      Closes {new Date(call.lastDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#E50914] opacity-80" />
                      {call.applicants} Applicants
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                  <Button className="bg-[#E50914] text-white hover:bg-[#b80710]">
                    Review Applicants
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-10 w-10 text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none">
                        <MoreVertical className="h-5 w-5 pointer-events-none" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#1f1f1f] border-white/10 text-white">
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" /> Edit Posting
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-500 focus:text-red-400">
                        <Trash2 className="h-4 w-4 mr-2" /> Close Call
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
