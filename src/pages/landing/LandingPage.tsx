import BenefitsSection from "@/components/landing/BenefitsSection";
import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
            <LandingHeader />
            <main className="flex-1">
                <HeroSection />
                <FeaturesSection />
                <BenefitsSection />
                <CTASection />
            </main>
            <LandingFooter />
        </div>
    )
}
