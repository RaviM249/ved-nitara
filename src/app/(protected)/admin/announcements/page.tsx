"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Send, Users, History, Loader2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/stubs";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAnnouncementsPage() {
  const [target, setTarget] = useState<string>("BOTH");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      setIsSending(true);
      const res = await api.postAnnouncement(target, message);
      if (res.success) {
        toast.success("Announcement broadcasted successfully!");
        setMessage("");
        fetchAnnouncements(); // Refresh history
      } else {
        toast.error(res.error || "Failed to send announcement.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-[#00A8E1]/10 flex items-center justify-center">
            <Bell className="h-6 w-6 text-[#00A8E1]" />
          </div>
          <h1 className="text-3xl font-display text-white">Platform Announcements</h1>
        </div>
        <p className="text-gray-400 text-sm">Broadcast important messages and updates to all platform users.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Composer Form */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1f1f1f]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sticky top-24"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-[#00A8E1]" />
              New Announcement
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Audience</label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white h-11">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] border-white/10 text-white">
                    <SelectItem value="BOTH">All Users (Talent & Clients)</SelectItem>
                    <SelectItem value="TALENT">Talent Only</SelectItem>
                    <SelectItem value="CLIENT">Clients Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</label>
                <Textarea 
                  placeholder="Type your announcement here..."
                  className="min-h-[150px] bg-black/40 border-white/10 text-white focus-visible:ring-[#00A8E1] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSend}
                disabled={isSending || !message.trim()}
                className="w-full bg-[#00A8E1] hover:bg-[#0082B4] text-white h-11 shadow-[0_0_20px_rgba(0,168,225,0.2)]"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Broadcast Now
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="h-5 w-5 text-gray-400" />
              Recent Announcements
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
              </div>
            ) : announcements.length > 0 ? (
              announcements.map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-2xl border border-white/5 bg-black/40 p-5 hover:border-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className={`text-[10px] border-none px-2 py-0.5
                      ${ann.target === 'BOTH' ? 'bg-purple-500/10 text-purple-400' : ''}
                      ${ann.target === 'TALENT' ? 'bg-[#00A8E1]/10 text-[#00A8E1]' : ''}
                      ${ann.target === 'CLIENT' ? 'bg-amber-500/10 text-amber-500' : ''}
                    `}>
                      Target: {ann.target}
                    </Badge>
                    <span className="text-[10px] text-gray-500">{new Date(ann.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{ann.message}</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-600">
                    <Users className="h-3 w-3" />
                    Sent by: {ann.admin?.name || "System"}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-black/40 rounded-2xl border border-dashed border-white/5">
                <Megaphone className="h-10 w-10 text-gray-700 mx-auto mb-4 opacity-30" />
                <p className="text-gray-500 text-sm">No announcements sent yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
