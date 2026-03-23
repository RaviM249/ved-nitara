import PageWrapper from "@/components/layout/PageWrapper";

export default function PrivacyPage() {
  return (
    <PageWrapper className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 text-gray-300">
        <h1 className="text-4xl md:text-5xl font-display text-white mb-8 tracking-wider">Privacy Policy</h1>
        
        <div className="space-y-6 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your name, email address, portfolio materials, and messages sent within the platform to facilitate industry connections.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Information</h2>
          <p>We use the information we collect to match talent with casting calls, notify you of relevant opportunities, provide customer support, and improve our services.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Sharing</h2>
          <p>Your profile information is shared with verified production houses and clients when you apply for casting calls or showcase your portfolio on our public directories.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        </div>
      </div>
    </PageWrapper>
  );
}
