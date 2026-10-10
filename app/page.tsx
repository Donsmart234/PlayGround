import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ChainsBar from "@/components/landing/ChainsBar";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import SecuritySection from "@/components/landing/SecuritySection";
import FaqSection from "@/components/landing/FaqSection";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

/**
 * Landing page — 9 sections in order:
 * navbar → hero (dual auth) → chains → features → how-it-works →
 * security → FAQ → final CTA → footer.
 */
export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#FDFBFB]">
      <Navbar />
      <Hero />
      <ChainsBar />
      <FeaturesGrid />
      <HowItWorks />
      <SecuritySection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
