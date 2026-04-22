import { Hero } from "@/components/landing/hero";
import { PainPoints } from "@/components/landing/pain-points";
import { Solution } from "@/components/landing/solution";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SocialProof } from "@/components/landing/social-proof";
import { CTAFinal } from "@/components/landing/cta-final";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <LandingHeader />
      
      <main className="flex-1">
        <Hero />
        
        <div id="features">
          <SocialProof />
          <PainPoints />
          <Solution />
        </div>
        
        <div id="how-it-works">
          <HowItWorks />
        </div>
        
        <CTAFinal />
      </main>

      <LandingFooter />
    </div>
  );
}
