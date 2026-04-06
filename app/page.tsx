import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";

import { HeroSection } from "@/src/components/sections/HeroSection";
import { TrustBar } from "@/src/components/sections/TrustBar";
import { HowItWorks } from "@/src/components/sections/HowItWorks";
import { WhatIsPreventiGen } from "@/src/components/sections/WhatIsPreventiGen";
import { PlatformShowcaseSection } from "@/src/components/sections/PlatformShowcaseSection";
import { ForPatientsSection } from "@/src/components/sections/ForPatientsSection";
import { MedicalCredibilitySection } from "@/src/components/sections/MedicalCredibilitySection";
import { FAQSection } from "@/src/components/sections/FAQSection";
import { FinalCTASection } from "@/src/components/sections/FinalCTASection";
import { ContactSection } from "@/src/components/sections/ContactSection";




export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection
         // backgroundImageSrc="/images/hero-clinica.jpg"
           backgroundVideoSrc="/videos/background video.mp4"
        />
        <TrustBar />
        <HowItWorks />
        <WhatIsPreventiGen />
        <PlatformShowcaseSection />
        <ForPatientsSection />
        <MedicalCredibilitySection />
        <FAQSection />
        <FinalCTASection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
