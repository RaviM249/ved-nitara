"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/client") || pathname?.startsWith("/talent") || pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null;
  }

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-display text-3xl tracking-widest text-[#00A8E1] mb-4 block hover:text-white transition-colors">
              VED NITARA
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connecting the Indian Entertainment Industry. One platform for talent, casting, and endless opportunities.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 font-display tracking-wider">Legal</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <Link href="/about" className="hover:text-[#00A8E1] transition-colors">About Us</Link>
              <Link href="/privacy" className="hover:text-[#00A8E1] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#00A8E1] transition-colors">Terms & Conditions</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-bold mb-4 font-display tracking-wider">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/amarsdance.academy/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#00A8E1] hover:bg-[#00A8E1]/10 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/amarsdanceacademy/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#00A8E1] hover:bg-[#00A8E1]/10 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@amarsdanceacademy" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#00A8E1] hover:bg-[#00A8E1]/10 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4 font-display tracking-wider">Support</h4>
            <p className="text-gray-400 text-sm mb-4">Need help? We're here for you.</p>
            <Link href="/support">
              <button className="text-sm font-medium border border-[#00A8E1]/30 bg-[#00A8E1]/10 text-[#00A8E1] px-4 py-2 rounded hover:bg-[#00A8E1] hover:text-white transition-all">
                Help & Support
              </button>
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>© {new Date().getFullYear()} Ved Nitara. All rights reserved.</div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center"><Mail className="h-3 w-3 mr-1" /> amrendrakumar8102@gmail.com</div>
            <div className="flex items-center"><Phone className="h-3 w-3 mr-1" /> +91 9122567345</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
