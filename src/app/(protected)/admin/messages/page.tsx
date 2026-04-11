"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, Megaphone, Flag, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/stubs";

export default function AdminMessagesPage() {
  const [announcement, setAnnouncement] = useState({ title: "", message: "", target: "all" });
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const data = await api.getConversations();
        // Flatten conversations into individual messages for monitoring
        const flattened = data.flatMap((c: any) => (c.messages || []).map((m: any) => ({
          ...m,
          senderName: c.partnerName,
        })));
        setMessages(flattened);
      } catch (err) {
        console.error("Failed to fetch messages for monitor:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(m =>
    (m.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.senderId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendAnnouncement = async () => {
    if (!announcement.message.trim()) return;
    setIsSending(true);
    // TODO: Replace with API call - POST /api/v1/admin/announcements
    await new Promise(r => setTimeout(r, 1200));
    setIsSending(false);
    toast.success("Announcement sent to all users!");
    setAnnouncement({ title: "", message: "", target: "all" });
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-white mb-2">Messages & Announcements</h1>
        <p className="text-gray-400 text-sm">Monitor platform messages and send bulk announcements.</p>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="bg-[#1f1f1f] border border-white/10">
          <TabsTrigger value="monitor" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white text-gray-400">
            Message Monitor
          </TabsTrigger>
          <TabsTrigger value="announce" className="data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white text-gray-400">
            Bulk Announcements
          </TabsTrigger>
        </TabsList>

        {/* Message Monitor Tab */}
        <TabsContent value="monitor">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages by content or user ID..."
              className="pl-9 bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#141414]">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Time</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{msg.senderId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{msg.receiverId}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[250px]">
                      <p className="text-gray-300 truncate">{msg.content}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                      {new Date(msg.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] ${msg.isRead ? 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/20' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/20'}`}>
                        {msg.isRead ? 'Read' : 'Unread'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white" onClick={() => toast.info('Message viewed')}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-400" onClick={() => toast.error('Message flagged for review')}>
                          <Flag className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMessages.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-sm">No messages found.</div>
            )}
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announce">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-[#1f1f1f] border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-[#00A8E1]" />
                  Send Platform Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-gray-300">Target Audience</Label>
                  <select
                    className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#00A8E1]"
                    value={announcement.target}
                    onChange={(e) => setAnnouncement({ ...announcement, target: e.target.value })}
                  >
                    <option value="all">All Users</option>
                    <option value="artist">Artists Only</option>
                    <option value="school">Schools Only</option>
                    <option value="production">Production Houses Only</option>
                    <option value="client">Clients Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Subject</Label>
                  <Input
                    placeholder="e.g. Important Platform Update"
                    className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                    value={announcement.title}
                    onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Message</Label>
                  <Textarea
                    placeholder="Write your announcement here..."
                    className="bg-[#141414] border-white/10 text-white h-40 focus-visible:ring-[#00A8E1]"
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSendAnnouncement}
                  disabled={isSending || !announcement.message.trim()}
                  className="w-full bg-[#00A8E1] text-white hover:bg-[#0082B4]"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? "Sending..." : "Send Announcement"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1f1f1f] border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-base">Past Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Mar 15, 2025", title: "New Feature: Video Call Integration", target: "all", sent: 312 },
                    { date: "Mar 10, 2025", title: "Reminder: Complete Your Profile", target: "artist", sent: 128 },
                    { date: "Feb 28, 2025", title: "Platform Maintenance Scheduled", target: "all", sent: 312 },
                  ].map((ann, i) => (
                    <div key={i} className="pb-4 border-b border-white/5 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-white font-medium text-sm">{ann.title}</h4>
                        <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400 ml-2 shrink-0">
                          {ann.target}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{ann.date} · Sent to {ann.sent} users</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
