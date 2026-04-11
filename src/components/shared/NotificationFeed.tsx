"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/stubs";
import { Bell, Check, Clock, ExternalLink, Info } from "lucide-react";
import Link from "next/link";

export default function NotificationFeed() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    const res = await api.markNotificationsRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const handleMarkAllRead = async () => {
    const res = await api.markNotificationsRead(undefined, true);
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 text-sm animate-pulse flex items-center justify-center gap-2">
    <Clock className="h-4 w-4 animate-spin" /> Fetching your alerts...
  </div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#00A8E1]" />
          My Alerts
        </h3>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllRead}
            className="text-[10px] text-[#00A8E1] hover:text-[#00C9FF] transition-colors font-medium border-b border-transparent hover:border-[#00A8E1]"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-[450px] overflow-y-auto pr-1 custom-scrollbar space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id}
              className={`p-4 rounded-xl border transition-all relative group overflow-hidden ${
                n.isRead 
                  ? 'bg-black/20 border-white/5' 
                  : 'bg-gradient-to-br from-[#00A8E1]/10 to-transparent border-[#00A8E1]/20 shadow-[0_0_20px_rgba(0,168,225,0.05)]'
              }`}
            >
              {/* Status Glow for Unread */}
              {!n.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A8E1] shadow-[0_0_10px_rgba(0,168,225,0.8)]" />
              )}

              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex gap-3">
                  <div className={`mt-1 h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                    n.type === 'ANNOUNCEMENT' ? 'bg-purple-500/20 text-purple-400' : 'bg-[#00A8E1]/20 text-[#00A8E1]'
                  }`}>
                    {n.type === 'ANNOUNCEMENT' ? <Info className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                  </div>
                  <p className={`text-[13px] leading-relaxed font-medium ${n.isRead ? 'text-gray-400' : 'text-gray-200'}`}>
                    {n.message}
                  </p>
                </div>
                {!n.isRead && (
                  <button 
                    onClick={() => handleMarkRead(n.id)}
                    title="Mark as read"
                    className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00A8E1]/20 hover:text-[#00A8E1] transition-all shrink-0"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-gray-500 pl-9">
                <span className="flex items-center gap-1.5 opacity-60">
                  <Clock className="h-3 w-3" /> {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {n.link && (
                  <Link href={n.link} className="text-[#00A8E1] font-semibold flex items-center gap-1 hover:text-[#00C9FF] transition-all">
                    Action <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-black/10 rounded-2xl border border-dashed border-white/5 flex flex-col items-center">
            <Bell className="h-10 w-10 text-gray-700 mb-4 opacity-20" />
            <p className="text-gray-500 text-xs font-medium">No new alerts or announcements.</p>
            <p className="text-gray-700 text-[10px] mt-1 italic">We'll let you know when something important happens.</p>
          </div>
        )}
      </div>
    </div>
  );
}
