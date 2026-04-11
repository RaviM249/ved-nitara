"use client";
import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function SupportPage() {
  const { user, isLoggedIn } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setContact(user.profile?.phone || "");
    }
  }, [isLoggedIn, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("IDLE");
    setErrorMessage("");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          contact,
          subject: heading,
          message: body,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("SUCCESS");
        // Clear non-user fields
        setHeading("");
        setBody("");
      } else {
        setStatus("ERROR");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Support submission error:", error);
      setStatus("ERROR");
      setErrorMessage("Failed to send message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "SUCCESS") {
    return (
      <PageWrapper className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-12 shadow-2xl">
            <div className="h-20 w-20 bg-[#00A8E1]/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <CheckCircle2 className="h-10 w-10 text-[#00A8E1]" />
            </div>
            <h1 className="text-3xl font-display text-white mb-4">Message Sent Successfully!</h1>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Thank you for reaching out, {name}. We have received your request and will get back to you shortly at {email}.
            </p>
            <Button 
              onClick={() => setStatus("IDLE")} 
              className="bg-[#00A8E1] hover:bg-[#0082B4] text-white px-8 h-12 rounded-full font-bold"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-white mb-4 tracking-wider">Help & Support</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Have a question or facing an issue? Send us a message and our team will get back to you soon.
          </p>
        </div>
        
        <Card className="bg-[#141414] border-white/10 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
          <CardContent className="p-8 md:p-10">
            {status === "ERROR" && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="shrink-0 h-5 w-5" />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <Input 
                    required
                    placeholder="Your Name"
                    className="bg-black/50 border-white/10 h-12 text-white focus-visible:ring-[#00A8E1] rounded-xl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                  <Input 
                    required
                    type="email"
                    placeholder="name@email.com"
                    className="bg-black/50 border-white/10 h-12 text-white focus-visible:ring-[#00A8E1] rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Contact Number (Optional)</label>
                <Input 
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-black/50 border-white/10 h-12 text-white focus-visible:ring-[#00A8E1] rounded-xl"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Subject / Heading</label>
                <Input 
                  required
                  placeholder="How can we help you?"
                  className="bg-black/50 border-white/10 h-12 text-white focus-visible:ring-[#00A8E1] rounded-xl"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Message Details</label>
                <Textarea 
                  required
                  placeholder="Please describe your issue or question in detail..."
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-[#00A8E1] min-h-[160px] rounded-xl resize-none"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#00A8E1] hover:bg-[#0082B4] text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
              <p className="text-center text-xs text-gray-500 uppercase tracking-widest font-bold">Or email us directly</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="mailto:amrendrakumar8102@gmail.com" className="group flex items-center gap-3 text-sm text-gray-400 hover:text-[#00A8E1] transition-colors">
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00A8E1]/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  amrendrakumar8102@gmail.com
                </a>
                <a href="mailto:vednitara@gmail.com" className="group flex items-center gap-3 text-sm text-gray-400 hover:text-[#00A8E1] transition-colors">
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00A8E1]/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  vednitara@gmail.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
