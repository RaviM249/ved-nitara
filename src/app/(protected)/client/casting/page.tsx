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
import { Plus, MoreVertical, Edit, Trash2, Users, Film, Calendar, X, Star, MapPin, CheckCircle2, XCircle, Eye, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { mockArtists } from "@/lib/mockData";
import Link from "next/link";

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
    status: "OPEN",
    createdAt: "2025-03-01",
    // IDs of artists who "applied" – pulled from mock artists
    applicantIds: ["a1", "a3", "a5", "a7", "a9"],
  },
  {
    id: "cc2",
    title: "Cinematographer - OTT Series 'Dark Streets'",
    description: "Seeking an experienced DP for a gritty crime thriller OTT series spanning 8 episodes.",
    roles: ["Cinematographer", "Camera Assistant"],
    location: "Delhi / Remote",
    lastDate: "2025-04-01",
    type: "OTT Series",
    status: "OPEN",
    createdAt: "2025-03-05",
    applicantIds: ["a2", "a4", "a6"],
  },
  {
    id: "cc3",
    title: "Background Dancers - Commercial Ad",
    description: "8 background dancers needed for 2-day commercial shoot. Previous ad experience preferred.",
    roles: ["Background Artist"],
    location: "Hyderabad",
    lastDate: "2025-03-20",
    type: "Commercial",
    status: "CLOSED",
    createdAt: "2025-02-20",
    applicantIds: ["a8", "a10", "a12", "a1", "a5"],
  },
];

type ApplicantStatus = "PENDING" | "SHORTLISTED" | "REJECTED";

export default function CastingCallsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", type: "Film", lastDate: "" });

  // Applicant Review state
  const [reviewingCall, setReviewingCall] = useState<typeof mockCastingCalls[0] | null>(null);
  const [applicantStatuses, setApplicantStatuses] = useState<Record<string, ApplicantStatus>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setIsOpen(false);
    toast.success("Casting call posted successfully!");
  };

  const setStatus = (artistId: string, status: ApplicantStatus) => {
    setApplicantStatuses(prev => ({ ...prev, [artistId]: status }));
    const label = status === "SHORTLISTED" ? "Shortlisted" : "Rejected";
    toast.success(`Applicant ${label}`);
  };

  // For the current reviewing call, get artist objects
  const reviewingApplicants = reviewingCall
    ? reviewingCall.applicantIds.map(id => mockArtists.find(a => a.id === id)).filter(Boolean)
    : [];

  return (
    <PageWrapper>
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Casting Calls</h1>
          <p className="text-gray-400 text-sm">Manage your open casting requirements and review applicants.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-[#00A8E1] text-white hover:bg-[#0082B4] h-9 px-4 py-2 shadow-[0_0_15px_rgba(0,168,225,0.25)]">
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
                  className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Type</Label>
                  <select
                    className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#00A8E1]"
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
                    className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
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
                  className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                  value={form.lastDate}
                  onChange={(e) => setForm({ ...form, lastDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  placeholder="Describe the roles and requirements..."
                  className="bg-[#141414] border-white/10 text-white h-28 focus-visible:ring-[#00A8E1]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="border-white/20 text-white" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-[#00A8E1] text-white hover:bg-[#0082B4]">
                  {isLoading ? "Posting..." : "Post Casting Call"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── Casting Call Cards ─── */}
      <div className="grid gap-6">
        {mockCastingCalls.map((call) => (
          <Card key={call.id} className="bg-black/60 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all overflow-hidden">
            <div className={`h-1 w-full ${call.status === 'OPEN' ? 'bg-gradient-to-r from-green-500 to-transparent' : 'bg-gradient-to-r from-gray-600 to-transparent'}`} />
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <h2 className="text-xl font-bold text-white">{call.title}</h2>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className={`${call.status === 'OPEN' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-gray-500/30 text-gray-400 bg-gray-500/10'}`}>
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
                      <Film className="h-4 w-4 text-[#00A8E1] opacity-80" />
                      {call.roles.join(', ')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#00A8E1] opacity-80" />
                      Closes {new Date(call.lastDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#00A8E1] opacity-80" />
                      {call.applicantIds.length} Applicant{call.applicantIds.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                  <Button
                    className="bg-[#00A8E1] text-white hover:bg-[#0082B4] shadow-[0_0_15px_rgba(0,168,225,0.2)] gap-2"
                    onClick={() => setReviewingCall(call)}
                  >
                    <Eye className="h-4 w-4" />
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

      {/* ─── Applicant Review Slide-over Panel ─── */}
      {reviewingCall && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setReviewingCall(null)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-[#0d1520] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/10 shrink-0">
              <div>
                <p className="text-xs text-[#00A8E1] font-semibold uppercase tracking-widest mb-1">Casting Call</p>
                <h2 className="text-xl font-bold text-white leading-tight">{reviewingCall.title}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {reviewingCall.applicantIds.length} applicant{reviewingCall.applicantIds.length !== 1 ? 's' : ''} · {reviewingCall.location}
                </p>
              </div>
              <button
                onClick={() => setReviewingCall(null)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 mt-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Summary strip */}
            <div className="flex gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02] shrink-0 text-sm">
              <span className="text-gray-400">
                <span className="text-emerald-400 font-semibold">
                  {Object.values(applicantStatuses).filter(s => s === "SHORTLISTED").length}
                </span> Shortlisted
              </span>
              <span className="text-gray-400">
                <span className="text-red-400 font-semibold">
                  {Object.values(applicantStatuses).filter(s => s === "REJECTED").length}
                </span> Rejected
              </span>
              <span className="text-gray-400">
                <span className="text-gray-200 font-semibold">
                  {reviewingCall.applicantIds.length - Object.keys(applicantStatuses).filter(k => reviewingCall.applicantIds.includes(k)).length}
                </span> Pending
              </span>
            </div>

            {/* Applicant List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {reviewingApplicants.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No applicants yet.</p>
                </div>
              )}

              {reviewingApplicants.map((artist) => {
                if (!artist) return null;
                const status = applicantStatuses[artist.id] ?? "PENDING";

                return (
                  <div
                    key={artist.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      status === "SHORTLISTED" ? "border-emerald-500/30 bg-emerald-500/5" :
                      status === "REJECTED"    ? "border-red-500/20 bg-red-500/5 opacity-60" :
                      "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <img
                        src={artist.profilePhoto}
                        alt={artist.name}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 border border-white/10"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h3 className="font-bold text-white text-base">{artist.name}</h3>
                          {artist.isVerified && (
                            <ShieldCheck className="h-4 w-4 text-[#00A8E1] shrink-0" />
                          )}
                          {status === "SHORTLISTED" && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                              Shortlisted
                            </Badge>
                          )}
                          {status === "REJECTED" && (
                            <Badge className="bg-red-500/15 text-red-400 border border-red-500/20 text-[10px]">
                              Rejected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-1.5">
                          {artist.roles.join(" · ")}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#00A8E1]/60" />
                            {artist.city}, {artist.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400" />
                            {artist.rating} ({artist.reviewCount} reviews)
                          </span>
                          <span>{artist.experience}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action row */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                      <Link
                        href={`/client/artists/${artist.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border border-[#00A8E1]/30 text-[#00A8E1] bg-transparent hover:bg-[#00A8E1]/10 hover:border-[#00A8E1]/60 hover:shadow-[0_0_12px_rgba(0,168,225,0.2)] transition-all duration-200"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View Profile
                      </Link>

                      <div className="flex gap-2 ml-auto">
                        <button
                          disabled={status === "REJECTED"}
                          onClick={() => setStatus(artist.id, "REJECTED")}
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                            ${status === "REJECTED"
                              ? "bg-red-500/20 border-red-500/40 text-red-400"
                              : "bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                            }`}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                        <button
                          disabled={status === "SHORTLISTED"}
                          onClick={() => setStatus(artist.id, "SHORTLISTED")}
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                            ${status === "SHORTLISTED"
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                              : "bg-transparent border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/60 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Shortlist
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
