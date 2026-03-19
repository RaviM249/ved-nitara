"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { LayoutDashboard, Mail, Search, CalendarHeart, User2, Settings } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn, activeRole } = useAuthStore();

  // Hide bottom nav on admin routes, desktop, or public routes (if not logged in)
  if (pathname?.startsWith("/admin") || !isLoggedIn || pathname === "/" || pathname === "/login" || pathname === "/pricing" || pathname === "/register") {
    return null;
  }

  // Get base path based on role
  const getBasePath = () => {
    switch(activeRole) {
      case "ARTIST": return "/artist";
      case "SCHOOL": return "/school";
      case "PRODUCTION": return "/production";
      case "CLIENT": return "/client";
      default: return "";
    }
  };

  const basePath = getBasePath();

  // Define tab navigation based on role. (Max 5 tabs)
  let tabs: { name: string; href: string; icon: any }[] = [];
  if (activeRole === "ARTIST") {
    tabs = [
      { name: "Home", href: `${basePath}/dashboard`, icon: LayoutDashboard },
      { name: "Faculty", href: `${basePath}/faculty`, icon: Search },
      { name: "Bookings", href: `${basePath}/bookings`, icon: CalendarHeart },
      { name: "Inbox", href: `${basePath}/inbox`, icon: Mail },
      { name: "Profile", href: `${basePath}/profile`, icon: User2 }
    ];
  } else if (activeRole === "SCHOOL") {
    tabs = [
      { name: "Home", href: `${basePath}/dashboard`, icon: LayoutDashboard },
      { name: "Browse", href: `${basePath}/browse-faculty`, icon: Search },
      { name: "Reqs", href: `${basePath}/requirements`, icon: Settings },
      { name: "Inbox", href: `${basePath}/inbox`, icon: Mail },
      { name: "Profile", href: `${basePath}/profile`, icon: User2 }
    ];
  } else if (activeRole === "PRODUCTION") {
    tabs = [
      { name: "Home", href: `${basePath}/dashboard`, icon: LayoutDashboard },
      { name: "Bank", href: `${basePath}/artist-bank`, icon: Search },
      { name: "Shortlist", href: `${basePath}/shortlist`, icon: CalendarHeart },
      { name: "Inbox", href: `${basePath}/inbox`, icon: Mail },
      { name: "Profile", href: `${basePath}/profile`, icon: User2 }
    ];
  } else if (activeRole === "CLIENT") {
    tabs = [
      { name: "Home", href: `${basePath}/dashboard`, icon: LayoutDashboard },
      { name: "Find", href: `${basePath}/find-artists`, icon: Search },
      { name: "Bookings", href: `${basePath}/bookings`, icon: CalendarHeart },
      { name: "Inbox", href: `${basePath}/inbox`, icon: Mail },
      { name: "Profile", href: `${basePath}/profile`, icon: User2 }
    ];
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-40 w-full h-16 border-t border-white/10 bg-[#141414] safe-area-bottom">
      <div className="grid h-full w-full mx-auto" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center pt-2 pb-1 ${
                isActive ? "text-[#00A8E1]" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <tab.icon className={`h-6 w-6 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(0,168,225,0.5)]" : ""}`} />
              <span className="text-[10px] font-medium leading-none">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
