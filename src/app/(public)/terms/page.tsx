import PageWrapper from "@/components/layout/PageWrapper";

export default function TermsPage() {
  return (
    <PageWrapper className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 text-gray-300">
        <h1 className="text-4xl md:text-5xl font-display text-white mb-8 tracking-wider">Terms & Conditions</h1>
        
        <div className="space-y-6 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Ved Nitara, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. User Accounts</h2>
          <p>You must provide accurate and complete information when registering an account. You are responsible for all activities that occur under your account.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Premium Services</h2>
          <p>Certain features of the platform may require a subscription. Subscriptions are billed on a recurring basis as outlined at the time of purchase.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Content Guidelines</h2>
          <p>Users must only upload portfolios, media, and text that they have the right to distribute. Obscene, illegal, or harassing content will result in immediate account termination.</p>
        </div>
      </div>
    </PageWrapper>
  );
}
