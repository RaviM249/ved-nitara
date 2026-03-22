"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { Bell, Menu, UserCircle, LogOut, LayoutDashboard, Settings, ChevronDown, Repeat } from "lucide-react";
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
  const { isLoggedIn, currentMode, activeRole, user, logout, switchMode } = useAuthStore();
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

  const handleModeSwitch = () => {
    const newMode = currentMode === "TALENT" ? "CLIENT" : "TALENT";
    switchMode(newMode);
    router.push(`/${newMode.toLowerCase()}/dashboard`);
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/entermock/image/upload/v1773993626/Untitled_1_1_vzfdvr.png"
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
        <Link href={isLoggedIn ? `${basePath}/dashboard` : "/"} className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/entermock/image/upload/v1773993626/Untitled_1_1_vzfdvr.png"
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
                <UserCircle className="h-8 w-8 text-gray-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
                      <p className="text-xs leading-none text-gray-400">
                        {user?.email}
                      </p>
                      <div className="mt-1 w-fit rounded-full bg-[#00A8E1]/20 px-2 py-0.5 text-[10px] font-medium text-[#00A8E1] uppercase">
                        {currentMode} MODE
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="p-0">
                  <Link href={`${basePath}/profile`} className="flex w-full items-center px-1.5 py-1 cursor-pointer text-gray-300 focus:text-white focus:bg-white/10">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href={`${basePath}/dashboard`} className="flex w-full items-center px-1.5 py-1 cursor-pointer text-gray-300 focus:text-white focus:bg-white/10">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {currentMode === 'TALENT' && (
                  <DropdownMenuItem className="p-0">
                    <Link href="/talent/reviews" className="flex w-full items-center px-1.5 py-1 cursor-pointer text-gray-300 focus:text-white focus:bg-white/10">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Reviews & Billing</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {/* Global Mode Toggle */}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="p-0">
                  <button 
                    onClick={handleModeSwitch}
                    className="flex w-full items-center px-1.5 py-1.5 cursor-pointer font-bold text-[#00A8E1] hover:text-[#0082B4] focus:text-[#0082B4] focus:bg-white/10 transition-colors"
                  >
                    <Repeat className="mr-2 h-4 w-4" />
                    <span>Switch to {currentMode === "TALENT" ? "Hiring" : "Talent"} Mode</span>
                  </button>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-400 focus:bg-red-500/10">
                  <LogOut className="mr-2 h-4 w-4" />
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
              <Link href="/about" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] transition-all">
                Resources
              </Link>
            </div>

            <div className="flex items-center gap-8">
              <Link href="/login" className="font-display text-xl tracking-wider text-white hover:text-[#00A8E1] px-3 py-2 rounded-md hover:bg-white/5 transition-all">
                Log in
              </Link>
              <Link href="/register">
                <Button className="bg-[#00A8E1] hover:bg-[#0082B4] text-white px-6 font-bold">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
