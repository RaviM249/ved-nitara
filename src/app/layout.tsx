import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  title: "Ved Nitara - Build Your Career in Entertainment",
  description: "One App. One Subscription. Infinite Opportunities in the Indian Entertainment Industry.",
  icons: {
    icon: "https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,h_80/v1773993626/Untitled_1_1_vzfdvr.png",
  },
  openGraph: {
    title: "Ved Nitara - Build Your Career in Entertainment",
    description: "One App. One Subscription. Infinite Opportunities in the Indian Entertainment Industry.",
    url: "https://vednitara.com",
    siteName: "Ved Nitara",
    images: [
      {
        url: "https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,w_1200/v1773993626/Untitled_1_1_vzfdvr.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ved Nitara - Build Your Career in Entertainment",
    description: "One App. One Subscription. Infinite Opportunities in the Indian Entertainment Industry.",
    images: ["https://res.cloudinary.com/entermock/image/upload/f_auto,q_auto,w_1200/v1773993626/Untitled_1_1_vzfdvr.png"],
  },
};

import AuthProvider from "@/components/providers/AuthProvider";

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
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <MobileBottomNav />
          <RoleSwitcher />
          <Toaster theme="dark" position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
