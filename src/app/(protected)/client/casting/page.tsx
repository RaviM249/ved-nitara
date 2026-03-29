"use client";

import { useEffect, useState } from "react";
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
import { Plus, MoreVertical, Edit, Trash2, Users, Film, Calendar, X, Star, MapPin, CheckCircle2, XCircle, Eye, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/lib/stubs";
import { LocationSelector } from "@/components/shared/LocationSelector";

type ApplicantStatus = "PENDING" | "SHORTLISTED" | "REJECTED";

export default function CastingCallsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [castingCalls, setCastingCalls] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    title: "", description: "", state: "", city: "", type: "Film", customType: "", lastDate: "",
    roles: [] as string[], customRole: "", tags: [] as string[], tagInput: ""
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [editingCall, setEditingCall] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "OPEN" | "CLOSED">("ALL");

  // Applicant Review state
  const [reviewingCall, setReviewingCall] = useState<any | null>(null);
  const [reviewingApplicants, setReviewingApplicants] = useState<any[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [applicantStatuses, setApplicantStatuses] = useState<Record<string, ApplicantStatus>>({});

  useEffect(() => {
    async function fetchCalls() {
      try {
        const data = await api.getCastingCalls();
        setCastingCalls(data);
      } catch (err) {
        console.error("Failed to fetch casting calls:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCalls();
  }, []);

  useEffect(() => {
    async function fetchApplicants() {
      const applicantIds = reviewingCall?.applications?.map((a: any) => a.talentId) || [];
      if (!applicantIds.length) {
        setReviewingApplicants([]);
        return;
      }
      setIsLoadingApplicants(true);
      try {
        const allArtists = await api.getArtists();
        const applicants = allArtists.filter((a: any) => applicantIds.includes(a.id));
        setReviewingApplicants(applicants);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setIsLoadingApplicants(false);
      }
    }
    fetchApplicants();
  }, [reviewingCall]);

  const setStatus = (artistId: string, status: ApplicantStatus) => {
    setApplicantStatuses(prev => ({ ...prev, [artistId]: status }));
    const label = status === "SHORTLISTED" ? "Shortlisted" : "Rejected";
    toast.success(`Applicant ${label}`);
  };

  const handleEdit = (call: any) => {
    setEditingCall(call);
    const locationParts = call.location ? call.location.split(', ') : ["", ""];
    const city = locationParts[0] || "";
    const state = locationParts[1] || "";
    const standardTypes = ["Film", "OTT Series", "Commercial", "Music Video", "Theatre"];
    const isCustomType = call.type && !standardTypes.includes(call.type);

    setForm({
      title: call.title || "",
      description: call.description || "",
      state,
      city,
      type: isCustomType ? "Others" : (call.type || "Film"),
      customType: isCustomType ? call.type : "",
      lastDate: call.deadline ? new Date(call.deadline).toISOString().split('T')[0] : "",
      roles: call.roles || [],
      customRole: "",
      tags: call.tags || [],
      tagInput: call.tags?.join(", ") || ""
    });
    setSelectedRole("");
    setIsOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
      const res = await api.updateCastingCall(id, { status: newStatus });
      if (res.success) {
        toast.success(`Casting call marked as ${newStatus}`);
        setCastingCalls(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this casting call?")) return;
    try {
      const res = await api.deleteCastingCall(id);
      if (res.success) {
        toast.success("Casting call deleted");
        setCastingCalls(prev => prev.filter(c => c.id !== id));
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const finalType = form.type === "Others" ? form.customType : form.type;
      const finalLocation = form.city && form.state ? `${form.city}, ${form.state}` : "";
      const finalTags = form.tagInput ? form.tagInput.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const submitData = {
          title: form.title,
          description: form.description,
          location: finalLocation,
          type: finalType,
          lastDate: form.lastDate || undefined,
          deadline: form.lastDate || undefined,
          roles: form.roles,
          tags: finalTags,
      };

      let res;
      if (editingCall) {
        res = await api.updateCastingCall(editingCall.id, submitData);
      } else {
        res = await api.postRequirement(submitData);
      }

      if (res.success) {
        toast.success(editingCall ? "Casting call updated!" : "Casting call posted!");
        setIsOpen(false);
        setEditingCall(null);
        setSelectedRole("");
        setForm({ title: "", description: "", state: "", city: "", type: "Film", customType: "", lastDate: "", roles: [], customRole: "", tags: [], tagInput: "" });
        const data = await api.getCastingCalls();
        setCastingCalls(data);
      } else {
        if (res.limitReached) {
          toast.error("Limit Reached", {
            description: res.message,
            action: { label: "Upgrade", onClick: () => window.location.href = "/pricing" }
          });
        } else {
          toast.error(res.error || "Failed to process request");
        }
      }
    } catch (err) {
      toast.error("Failed to process request");
    } finally {
      setIsPosting(false);
    }
  };

  const filteredCalls = castingCalls.filter(call => {
    if (filterStatus === "ALL") return true;
    return call.status === filterStatus;
  });

  return (
    <PageWrapper>
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Casting Calls</h1>
          <p className="text-gray-400 text-sm">Manage your open casting requirements and review applicants.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Status Filter */}
          <div className="inline-flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterStatus === "ALL" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("OPEN")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterStatus === "OPEN" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Open
            </button>
            <button
              onClick={() => setFilterStatus("CLOSED")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterStatus === "CLOSED" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Closed
            </button>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-[#00A8E1] text-white hover:bg-[#0082B4] h-9 px-4 py-2 shadow-[0_0_15px_rgba(0,168,225,0.25)]">
              <Plus className="h-4 w-4 mr-2 pointer-events-none" /> Post Casting Call
            </DialogTrigger>
          <DialogContent className="bg-[#151515] border-white/10 text-white w-[95vw] sm:max-w-[95vw] h-[95vh] overflow-hidden p-0 flex flex-col">
            <DialogHeader className="px-8 py-6 border-b border-white/5 bg-[#1a1a1a] shrink-0">
              <DialogTitle className="text-white text-3xl font-display">
                {editingCall ? "Edit Casting Call" : "New Casting Call"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row flex-1 overflow-hidden">
              
              {/* Left Column: Metadata */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-bold uppercase tracking-wider">Project Title</Label>
                  <Input
                    placeholder="e.g. Lead Actor - Feature Film 'Kavya'"
                    className="bg-black/20 border-white/10 text-white focus-visible:ring-[#00A8E1] h-14 text-lg rounded-xl"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 bg-black/10 p-6 rounded-2xl border border-white/5">
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-bold uppercase tracking-wider">Project Type</Label>
                  <select
                    className="w-full h-11 px-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#00A8E1]"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="Film">Film</option>
                    <option value="OTT Series">OTT Series</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Music Video">Music Video</option>
                    <option value="Theatre">Theatre</option>
                    <option value="Others">Others</option>
                  </select>
                  {form.type === "Others" && (
                    <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                      <Input
                        placeholder="Please specify the type"
                        className="bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-[#00A8E1] h-11 rounded-xl"
                        value={form.customType}
                        onChange={(e) => setForm({ ...form, customType: e.target.value })}
                        required={form.type === "Others"}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <LocationSelector 
                    manualValue={{ state: form.state, city: form.city }} 
                    onManualChange={({ state, city }) => setForm(f => ({ ...f, state, city }))} 
                    className="!gap-6"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-bold uppercase tracking-wider">Required Roles</Label>
                  <div className="bg-black/10 border border-white/5 rounded-2xl p-4 min-h-[140px] flex flex-col gap-4">
                    <div className="flex gap-2">
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="flex-1 h-11 px-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#00A8E1]"
                      >
                        <option value="">Select a role...</option>
                        <option value="Actor">Actor</option>
                        <option value="Model">Model</option>
                        <option value="Dancer">Dancer</option>
                        <option value="Voice Artist">Voice Artist</option>
                        <option value="Writer">Writer</option>
                        <option value="Director">Director</option>
                        <option value="Others">Others (Custom)</option>
                      </select>
                      {selectedRole !== "Others" && selectedRole !== "" && (
                        <Button type="button" className="bg-[#00A8E1] hover:bg-[#0082B4] text-white shrink-0 h-11 rounded-xl" onClick={() => {
                          if (!form.roles.includes(selectedRole)) {
                            setForm(f => ({ ...f, roles: [...f.roles, selectedRole] }));
                          }
                          setSelectedRole("");
                        }}>
                          Add
                        </Button>
                      )}
                    </div>
                    {selectedRole === "Others" && (
                      <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 mt-0!">
                        <Input 
                          placeholder="Enter custom role..." 
                          className="flex-1 bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-[#00A8E1] h-11 rounded-xl"
                          value={form.customRole} 
                          onChange={(e) => setForm({ ...form, customRole: e.target.value })} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (form.customRole && !form.roles.includes(form.customRole)) {
                                setForm(f => ({ ...f, roles: [...f.roles, form.customRole], customRole: "" }));
                              }
                            }
                          }}
                        />
                        <Button type="button" className="bg-[#00A8E1] hover:bg-[#0082B4] text-white shrink-0 h-11 rounded-xl" onClick={() => {
                          if (form.customRole && !form.roles.includes(form.customRole)) {
                            setForm(f => ({ ...f, roles: [...f.roles, form.customRole], customRole: "" }));
                          }
                          setSelectedRole("");
                        }}>
                          Add
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-white/5">
                      {form.roles.length === 0 && <span className="text-gray-500 text-sm py-2">No roles added yet.</span>}
                      {form.roles.map(r => (
                        <Badge key={r} className="bg-[#00A8E1]/10 text-[#00A8E1] border border-[#00A8E1]/30 px-3 py-1.5 text-sm rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 group cursor-pointer transition-colors"
                          onClick={() => setForm(f => ({ ...f, roles: f.roles.filter(x => x !== r) }))}>
                          {r} 
                          <X className="h-3.5 w-3.5 ml-2 text-[#00A8E1]/50 group-hover:text-red-400" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="space-y-3">
                    <Label className="text-gray-300 text-sm font-bold uppercase tracking-wider">Closing Date</Label>
                    <Input
                      type="date"
                      className="bg-black/20 border-white/10 text-white focus-visible:ring-[#00A8E1] h-11 rounded-xl"
                      value={form.lastDate}
                      onChange={(e) => setForm({ ...form, lastDate: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-gray-300 text-sm font-bold uppercase tracking-wider flex items-baseline justify-between">
                      Search Tags
                      <span className="text-[10px] text-gray-500 font-normal lowercase tracking-normal">Comma-separated</span>
                    </Label>
                    <Input
                      placeholder="e.g. female model, actor, audition..."
                      className="bg-black/20 border-white/10 text-white focus-visible:ring-[#00A8E1] h-11 rounded-xl"
                      value={form.tagInput}
                      onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              </div> {/* End Left Column */}

              {/* Right Column: Descriptions & Actions */}
              <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0 bg-[#1a1a1a] border-l border-white/5 p-8 flex flex-col">
                <div className="space-y-3 flex-1 flex flex-col min-h-0">
                  <Label className="text-gray-300 text-sm font-bold uppercase tracking-wider">Project Description</Label>
                  <Textarea
                    placeholder="Describe the project, scope of work, budget expectations, and role requirements in detail..."
                    className="bg-black/20 border-white/10 text-white flex-1 resize-none focus-visible:ring-[#00A8E1] rounded-xl text-base p-4"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10 shrink-0">
                  <Button type="button" variant="outline" className="border-white/20 text-white h-12 px-6 rounded-xl" onClick={() => { setIsOpen(false); setEditingCall(null); setForm({ title: "", description: "", state: "", city: "", type: "Film", customType: "", lastDate: "", roles: [], customRole: "", tags: [], tagInput: "" }); setSelectedRole(""); }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPosting} className="bg-[#00A8E1] text-white hover:bg-[#0082B4] h-12 px-8 rounded-xl font-bold text-md shadow-[0_0_20px_rgba(0,168,225,0.3)] hover:shadow-[0_0_25px_rgba(0,168,225,0.5)] transition-all">
                    {isPosting ? "Processing..." : (editingCall ? "Update Posting" : "Post Casting Call")}
                  </Button>
                </div>
              </div>

            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* ─── Casting Call Cards ─── */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
          </div>
        ) : filteredCalls.length > 0 ? (
          filteredCalls.map((call) => (
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
                      {call.roles?.length > 0 ? call.roles.join(', ') : "Various Roles"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#00A8E1] opacity-80" />
                      Closes {call.deadline ? new Date(call.deadline).toLocaleDateString() : (call.lastDate ? new Date(call.lastDate).toLocaleDateString() : "TBD")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#00A8E1] opacity-80" />
                      {call.applications?.length || 0} Applicant{(call.applications?.length || 0) !== 1 ? 's' : ''}
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
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleToggleStatus(call.id, call.status)}>
                        {call.status === "OPEN" ? (
                          <><XCircle className="h-4 w-4 mr-2" /> Mark as Closed</>
                        ) : (
                          <><CheckCircle2 className="h-4 w-4 mr-2" /> Reopen Call</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleEdit(call)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Posting
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-500 focus:text-red-400" onClick={() => handleDelete(call.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Posting
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-black/40 rounded-2xl border border-dashed border-white/10">
            <Film className="h-12 w-12 mx-auto mb-4 opacity-20 text-gray-400" />
            <h3 className="text-lg font-bold text-white mb-2">No casting calls found</h3>
            <p className="text-gray-400 text-sm mb-6">You haven't posted any casting calls yet.</p>
          </div>
        )}
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
                  {reviewingCall.applications?.length || 0} applicant{(reviewingCall.applications?.length || 0) !== 1 ? 's' : ''} · {reviewingCall.location}
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
                  {(reviewingCall.applications?.length || 0) - Object.keys(applicantStatuses).filter(k => reviewingCall.applications?.some((ap: any) => ap.talentId === k)).length}
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
