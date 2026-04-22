import { OnboardingForm } from "./onboarding-form";
import { LandingHeader } from "@/components/landing/header";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col">
      <LandingHeader />
      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        <OnboardingForm />
      </div>
    </div>
  );
}
