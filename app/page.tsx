import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { WhyChooseUsSection } from "@/components/landing/why-choose-us-section";
import { AboutUsSection } from "@/components/landing/about-us-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FooterSection } from "@/components/landing/footer-section";
import { SectionSwitcherOverlay } from "@/components/landing/section-switcher-overlay";
import { LanguageProvider } from "@/lib/language-context";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
        <SectionSwitcherOverlay />
        <HeroSection />
        <FeaturesSection />
        <UseCasesSection />
        <WhyChooseUsSection />
        <AboutUsSection />
        <ContactSection />
        <FooterSection />
      </main>
    </LanguageProvider>
  );
}
