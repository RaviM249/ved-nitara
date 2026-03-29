"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/stubs";
import { Bell, Check, Clock, ExternalLink, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

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
    setIsMounted(true);
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await api.markNotificationsRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await api.markNotificationsRead(undefined, true);
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenuContent 
      className="w-80 md:w-96 bg-[#141414]/95 backdrop-blur-2xl border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] p-0 overflow-hidden" 
      align="end"
      sideOffset={8}
    >
      <DropdownMenuGroup>
        <DropdownMenuLabel className="p-4 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00A8E1]" />
            <span className="text-sm font-bold text-white tracking-wide">My Alerts</span>
            {unreadCount > 0 && (
              <span className="bg-[#00A8E1] text-white text-[10px] px-2 py-0.5 rounded-full font-black ml-1 scale-90">
                {unreadCount} NEW
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-[10px] text-[#00A8E1] hover:text-[#00C9FF] transition-colors font-bold uppercase tracking-wider"
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      
      <DropdownMenuSeparator className="bg-white/5 m-0" />

      <div className="max-h-[400px] overflow-y-auto w-full custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin text-[#00A8E1]" />
            <span className="text-xs font-medium italic">Syncing alerts...</span>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-white/5">
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`p-4 transition-all relative group hover:bg-white/[0.03] ${
                  !n.isRead ? 'bg-[#00A8E1]/[0.03]' : ''
                }`}
              >
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00A8E1] shadow-[0_0_10px_#00A8E1]" />
                )}
                
                <div className="flex gap-3">
                  <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === 'ANNOUNCEMENT' ? 'bg-purple-500/10 text-purple-400' : 'bg-[#00A8E1]/10 text-[#00A8E1]'
                  }`}>
                    {n.type === 'ANNOUNCEMENT' ? <Info className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] leading-relaxed mb-2 ${n.isRead ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                      {n.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1.5 opacity-60 font-medium">
                        <Clock className="h-3 w-3" /> 
                        {isMounted && new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      
                      <div className="flex items-center gap-3">
                        {!n.isRead && (
                          <button 
                            onClick={(e) => handleMarkRead(n.id, e)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase transition-colors"
                          >
                            Read
                          </button>
                        )}
                        {n.link && (
                          <Link 
                            href={n.link} 
                            className="text-[10px] text-[#00A8E1] hover:text-[#00C9FF] font-bold uppercase flex items-center gap-1 transition-all"
                          >
                            Detail <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-black/5">
            <div className="h-12 w-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-gray-700 opacity-30" />
            </div>
            <p className="text-gray-400 text-sm font-bold mb-1 italic">Silent for now...</p>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              We'll notify you here when important updates arrive.
            </p>
          </div>
        )}
      </div>
      
      {notifications.length > 0 && unreadCount === 0 && (
        <div className="p-3 bg-white/[0.01] text-center border-t border-white/5">
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">All caught up!</span>
        </div>
      )}
    </DropdownMenuContent>
  );
}
