"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { Bell, Menu, UserCircle, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, currentMode, activeRole, user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide navbar on admin routes (they use sidebar instead)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Get base path based on mode
  const basePath = currentMode === "CLIENT" ? "/client" : "/talent";
  if (!mounted) {
    return (
      <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,h_80/v1773993626/Untitled_1_1_vzfdvr.png"
              alt="Ved Nitara"
              className="h-10 w-auto"
            />
            <span className="font-display text-xl md:text-2xl tracking-widest text-blue-50 font-bold ml-2 select-none">
              VED NITARA
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6">
              <span className="font-display text-xl tracking-wider text-white">Pricing</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,h_80/v1773993626/Untitled_1_1_vzfdvr.png"
            alt="Ved Nitara"
            className="h-10 w-auto"
          />
          <span className="font-display text-xl md:text-2xl tracking-widest text-blue-50 font-bold ml-2 select-none">
            VED NITARA
          </span>
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-4 md:flex">
              <Link href={`${basePath}/dashboard`} className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                Dashboard
              </Link>
              {currentMode === "CLIENT" && (
                <>
                  <Link href="/client/casting" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                    Casting Calls
                  </Link>
                  <Link href="/client/inbox" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                    Messages
                  </Link>
                </>
              )}
              {currentMode === "TALENT" && (
                <>
                  <Link href="/talent/jobs" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                    Opportunities
                  </Link>
                  <Link href="/talent/bookings" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                    Bookings
                  </Link>
                </>
              )}
            </div>

            <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-white/5">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[#00A8E1] shadow-[0_0_8px_#00A8E1]"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                <div className="relative">
                  <UserCircle className="h-8 w-8 text-white/90" />
                  {useAuthStore.getState().isSubscribed && (
                    <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#141414] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 bg-[#141414]/95 backdrop-blur-2xl border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] p-2" 
                align="end"
                sideOffset={8}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal px-2 py-3">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white tracking-wide">{user?.name}</p>
                        {useAuthStore.getState().isSubscribed ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                            PRO TIER
                          </span>
                        ) : (
                          <span className="bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                            FREE TIER
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate opacity-80">
                        {user?.email}
                      </p>
                      <div className="mt-2 w-fit rounded-lg bg-[#00A8E1]/10 px-2 py-0.5 text-[9px] font-black text-[#00A8E1] uppercase tracking-[0.1em] border border-[#00A8E1]/20">
                        {currentMode} MODE
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10 mx--2 mb-1" />
                <DropdownMenuItem className="p-0 rounded-lg overflow-hidden my-0.5">
                  <Link href={`${basePath}/profile`} className="flex w-full items-center px-2 py-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium text-sm group">
                    <UserCircle className="mr-3 h-4 w-4 text-[#00A8E1] group-hover:scale-110 transition-transform" />
                    <span>Manage Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0 rounded-lg overflow-hidden my-0.5">
                  <Link href={`${basePath}/dashboard`} className="flex w-full items-center px-2 py-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium text-sm group">
                    <LayoutDashboard className="mr-3 h-4 w-4 text-[#00A8E1] group-hover:scale-110 transition-transform" />
                    <span>My Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {currentMode === 'TALENT' && (
                  <DropdownMenuItem className="p-0 rounded-lg overflow-hidden my-0.5">
                    <Link href="/talent/reviews" className="flex w-full items-center px-2 py-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium text-sm group">
                      <Settings className="mr-3 h-4 w-4 text-[#00A8E1] group-hover:scale-110 transition-transform" />
                      <span>Reviews & Billing</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                

                <DropdownMenuSeparator className="bg-white/10 mx--2 mt-1" />
                <DropdownMenuItem onClick={logout} className="rounded-lg mt-1 cursor-pointer text-red-500 font-bold focus:text-red-400 focus:bg-red-500/10 transition-all group">
                  <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden text-gray-300">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/talent-bank" className="group flex items-center gap-1 font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                Find Talent <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
              <Link href="/jobs" className="group flex items-center gap-1 font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                Find Jobs <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
              <Link href="/pricing" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-8">
              <Link href="/login" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] px-3 py-2 rounded-md hover:bg-white/5 transition-all">
                Log in / Signup
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
