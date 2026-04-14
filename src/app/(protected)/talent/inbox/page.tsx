"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, FileImage, Settings, MessageSquare, Loader2, Lock, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/authStore";
import { api } from "@/lib/stubs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ArtistInboxPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("convId");
  const currentUserId = user?.id || "";
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const fetchConversations = async (autoSelectId?: string) => {
    if (user && !user.isPremium) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getConversations();
      // Ensure specific uniqueness by ID to prevent React errors
      setConversations(prev => {
        const combined = [...data];
        const unique = Array.from(new Map(combined.map(c => [c.id, c])).values());
        return unique.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
      
      if (autoSelectId) {
        const found = data.find((c: any) => c.id === autoSelectId);
        if (found) setActiveConv(found);
      } else if (data.length > 0 && !activeConv) {
        setActiveConv(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (user && !user.isPremium) return;

    fetchConversations(conversationId || undefined);

    // Poll for new conversations/sidebar updates every 5 seconds
    const convInterval = setInterval(() => {
      fetchConversations();
    }, 5000);

    return () => clearInterval(convInterval);
  }, [conversationId]);

  useEffect(() => {
    if (!activeConv || (user && !user.isPremium)) return;

    // Initial fetch
    const fetchMessages = async (showLoading = true) => {
      if (showLoading) setIsMessagesLoading(true);
      try {
        console.log(`[CHAT POLL] Fetching messages for ${activeConv.id}...`);
        const data = await api.getMessages(activeConv.id);
        
        // Update state if we have different messages
        setMessages(data);
        
        // Mark as read
        api.markMessagesRead(activeConv.id);
      } catch (err) {
        console.error("Polling error:", err);
      } finally {
        if (showLoading) setIsMessagesLoading(false);
      }
    };


    fetchMessages(true);

    // Poll for new messages every 3 seconds
    const msgInterval = setInterval(() => {
      fetchMessages(false); // Silent update
    }, 3000);

    // Chrome tab throttling fix: refresh instantly when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMessages(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(msgInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeConv?.id]);



  const handleSend = async () => {
    if (!newMessage.trim() || !activeConv) return;
    
    const res = await api.sendMessage(activeConv.id, newMessage);
    if (res.success) {
      // De-duplicate immediately on send
      setMessages(prev => {
        const exists = prev.some(m => m.id === res.message.id);
        if (exists) return prev;
        return [...prev, res.message];
      });
      setNewMessage("");
      // Update last message in conversations list
      setConversations(prev => prev.map(c => 
        c.id === activeConv.id ? { ...c, lastMessage: res.message } : c
      ));
    }
  };


  if (user && !user.isPremium) {
    return (
      <PageWrapper className="h-[calc(100vh-64px)] overflow-hidden p-0 md:p-4" noPadding>
        <div className="flex flex-col items-center justify-center h-full bg-[#141414] md:bg-[#1f1f1f] md:border border-white/10 md:rounded-xl p-8 text-center mt-16 md:mt-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A8E1]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[100px]" />
          
          <div className="mx-auto h-24 w-24 bg-black/40 border border-[#00A8E1]/20 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(0,168,225,0.1)]">
            <Lock className="h-10 w-10 text-[#00A8E1]" />
          </div>
          <h2 className="text-3xl font-display text-white mb-4 relative z-10 tracking-wide">Premium Feature</h2>
          <p className="text-gray-400 mb-8 max-w-md relative z-10 text-sm leading-relaxed">
            Direct messaging is exclusive to our Premium members. Upgrade your account today to negotiate directly, share attachments, and manage all your conversations in one place.
          </p>
          <Button asChild className="bg-[#00A8E1] hover:bg-[#0082B4] text-white rounded-full px-8 h-12 font-bold shadow-[0_0_20px_rgba(0,168,225,0.4)] transition-all hover:scale-105 relative z-10 group">
            <Link href="/pricing">
              Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  if (isLoading) {
    return (
      <PageWrapper className="h-[calc(100vh-64px)] overflow-hidden p-0 md:p-4" noPadding>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-10 w-10 text-[#00A8E1] animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="h-[calc(100vh-64px)] overflow-hidden p-0 md:p-4" noPadding>
      <div className="flex bg-[#141414] md:bg-[#1f1f1f] h-full md:border border-white/10 md:rounded-xl overflow-hidden mt-16 md:mt-2">
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-white/10 flex flex-col ${activeConv && 'hidden md:flex'}`}>
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Client Inquiries</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search inquiries..." 
                className="pl-9 bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => {
              const lastMsg = conv.lastMessage;
              return (
                <div 
                  key={conv.id}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex items-start gap-3 ${activeConv?.id === conv.id ? 'bg-white/5 border-l-2 border-l-[#00A8E1]' : 'border-l-2 border-l-transparent'}`}
                  onClick={() => setActiveConv(conv)}
                >
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarFallback className="bg-[#2a2a2a] text-white">
                      {conv.partnerName.substring(0,2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-medium text-white text-sm truncate pr-2">{conv.partnerName}</h4>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${lastMsg && !lastMsg.isRead && lastMsg.senderId !== currentUserId ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {lastMsg ? (lastMsg.senderId === currentUserId ? 'You: ' : '') + lastMsg.content : "No messages yet"}
                    </p>
                  </div>
                  {lastMsg && !lastMsg.isRead && lastMsg.senderId !== currentUserId && (
                    <div className="h-2 w-2 rounded-full bg-[#00A8E1] mt-1.5 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        {activeConv ? (
          <div className={`flex-1 flex flex-col ${!activeConv && 'hidden md:flex'}`}>
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 bg-[#1f1f1f]">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden text-gray-400" onClick={() => setActiveConv(null)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </Button>
                <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                  <AvatarFallback className="bg-[#00A8E1]/20 text-[#00A8E1] text-xs font-bold">
                    {activeConv.partnerName.substring(0,2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-white text-sm">{activeConv.partnerName}</h3>
                  <p className="text-xs text-blue-400">{activeConv.partnerRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Settings className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#141414]">
              {isMessagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 text-[#00A8E1] animate-spin" />
                </div>
              ) : messages.map((msg:any) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      isMe 
                        ? 'bg-[#00A8E1] text-white rounded-br-none shadow-[0_2px_10px_rgba(0,168,225,0.2)]' 
                        : 'bg-[#2a2a2a] text-gray-100 rounded-bl-none border border-white/5'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 mx-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              {/* Scroll anchor */}
              <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
            </div>


            <div className="p-4 bg-[#1f1f1f] border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-white shrink-0">
                  <FileImage className="h-5 w-5" />
                </Button>
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-[#141414] border-white/10 text-white focus-visible:ring-[#00A8E1]"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-[#00A8E1] text-white hover:bg-[#0082B4] shrink-0"
                >
                  <Send className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-500 bg-[#141414]">
            <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
