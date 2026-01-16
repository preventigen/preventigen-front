import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";

import { HeroSection } from "@/src/components/sections/HeroSection";
import { TrustBar } from "@/src/components/sections/TrustBar";
import { HowItWorks } from "@/src/components/sections/HowItWorks";
import { WhatIsPreventiGen } from "@/src/components/sections/WhatIsPreventiGen";
import { ECAMMSection } from "@/src/components/sections/ECAMMSection";
import { DigitalTwinSection } from "@/src/components/sections/DigitalTwinSection";
import { AIDataSection } from "@/src/components/sections/AIDataSection";
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
        <ECAMMSection />
        <DigitalTwinSection />
        <AIDataSection />
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
