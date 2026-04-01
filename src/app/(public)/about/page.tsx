import PageWrapper from "@/components/layout/PageWrapper";
import { Mail, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <PageWrapper className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display text-white mb-8 tracking-wider">About Us</h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
          <p className="text-xl text-[#00A8E1]">
            Ved Nitara is India's premier entertainment networking platform, bridging the gap between extraordinary talent and industry-leading creators.
          </p>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p>Our mission is to democratize opportunities in the Indian film and entertainment sector. Whether you are an aspiring actor from a small town, a seasoned director looking for the perfect cast, or an established production house, Ved Nitara provides the tools you need to connect, collaborate, and create magic.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
            <p>We provide a centralized, authentic, and vetted repository of artists, schools, and production houses. By removing the traditional barriers and gatekeepers, we ensure that true talent is discovered completely based on merit.</p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
              <li>Verified Artist Profiles</li>
              <li>Direct Casting Call Applications</li>
              <li>Faculty Opportunity Boards</li>
              <li>Secure In-App Messaging</li>
            </ul>
          </div>
          
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 mt-12 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Leadership</h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 bg-[#00A8E1]/20 rounded-full flex items-center justify-center shrink-0 border border-[#00A8E1]/30">
                  <span className="text-[#00A8E1] text-3xl font-bold">AK</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mr. Amrendra Kumar</h3>
                  <p className="text-[#00A8E1] text-sm mb-3">Founder</p>
                  <p className="text-sm text-gray-400">Founded on transparency and authenticity, Amrendra's vision is to structure the unorganized entertainment industry using modern technology.</p>
                  <div className="flex gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> +91 9122567345</span>
                    <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> amrendrakumar8102@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0 border border-purple-500/30">
                  <span className="text-purple-400 text-3xl font-bold">RK</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mr. Ravi Kumar</h3>
                  <p className="text-purple-400 text-sm mb-3">Co-Founder & Developer</p>
                  <p className="text-sm text-gray-400">As the architect of Ved Nitara, Ravi is dedicated to engineering a seamless digital ecosystem. His focus is on building high-performance tools that empower the creative community and solve real-world industry challenges.</p>
                  <div className="flex gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> vednitara@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
