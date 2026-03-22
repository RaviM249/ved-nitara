import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ved Nitara - Indian Entertainment Platform",
  description: "One App. One Subscription. Infinite Opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bebasNeue.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        {children}
        <MobileBottomNav />
        <RoleSwitcher />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
