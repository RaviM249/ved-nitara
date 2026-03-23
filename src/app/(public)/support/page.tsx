"use client";
import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";

export default function SupportPage() {
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:amrendrakumar8102@gmail.com?subject=${encodeURIComponent(heading)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <PageWrapper className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display text-white mb-4 tracking-wider text-center">Help & Support</h1>
        <p className="text-gray-400 text-center mb-10">We're here to help! Send us a message and we'll get back to you soon.</p>
        
        <Card className="bg-[#141414] border-white/10 shadow-2xl">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject / Heading</label>
                <Input 
                  required
                  placeholder="How can we help you?"
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-[#00A8E1]"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message Details</label>
                <Textarea 
                  required
                  placeholder="Please describe your issue or question in detail..."
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-[#00A8E1] min-h-[200px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-[#00A8E1] hover:bg-[#0082B4] text-white">
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" /> Alternatively, email directly at amrendrakumar8102@gmail.com
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
