"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { Bell, Menu, UserCircle, LogOut, LayoutDashboard, Settings } from "lucide-react";
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
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, activeRole, user, logout } = useAuthStore();
  const pathname = usePathname();

  // Hide navbar on admin routes (they use sidebar instead)
  if (pathname?.startsWith("/admin")) {
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

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href={isLoggedIn ? `${basePath}/dashboard` : "/"} className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wider text-[#00A8E1] hover-blue-glow">
            VED NITARA
          </span>
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 md:flex">
              <Link href={`${basePath}/dashboard`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              {activeRole === "PRODUCTION" && (
                <>
                  <Link href="/production/casting" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Casting Calls
                  </Link>
                  <Link href="/production/inbox" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Messages
                  </Link>
                </>
              )}
              {activeRole === "ARTIST" && (
                <>
                  <Link href="/artist/faculty" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Opportunities
                  </Link>
                  <Link href="/artist/bookings" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Bookings
                  </Link>
                </>
              )}
              {activeRole === "SCHOOL" && (
                <>
                  <Link href="/school/requirements" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Requirements
                  </Link>
                  <Link href="/school/browse-faculty" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Browse Faculty
                  </Link>
                </>
              )}
              {activeRole === "CLIENT" && (
                <>
                  <Link href="/client/bookings" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Bookings
                  </Link>
                  <Link href="/client/inbox" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Messages
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
                        {activeRole}
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
                {activeRole === 'ARTIST' && (
                  <DropdownMenuItem className="p-0">
                    <Link href="/artist/reviews" className="flex w-full items-center px-1.5 py-1 cursor-pointer text-gray-300 focus:text-white focus:bg-white/10">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Reviews & Billing</span>
                    </Link>
                  </DropdownMenuItem>
                )}
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
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
              Log in
            </Link>
            <Link href="/pricing" tabIndex={-1}>
              <Button className="bg-[#00A8E1] hover:bg-[#0082B4] text-white">
                Subscribe
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
