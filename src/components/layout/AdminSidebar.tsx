"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { LayoutDashboard, Users, UserCheck, CreditCard, CalendarDays, MessageSquare, Bell, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Verifications", href: "/admin/verifications", icon: UserCheck },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Announcements", href: "/admin/announcements", icon: Bell },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/10 bg-[#141414] md:flex">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <span className="font-display text-2xl tracking-wider text-[#E50914] red-glow">
          VED NITARA <span className="text-sm text-gray-400">ADMIN</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#E50914]/10 text-[#E50914]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <link.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-[#E50914]" : "text-gray-500 group-hover:text-gray-300"}`} />
                  {link.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center font-bold text-white">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div>
            <p className="text-sm font-medium leading-none text-white">{user?.name || "Admin User"}</p>
            <p className="text-xs text-gray-400 mt-1">Super Admin</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-400 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
