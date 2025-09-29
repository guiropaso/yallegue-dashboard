import { Header } from "@/components/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { BenefitsSection } from "@/components/sections/BenefitsSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { ServicePillarsSection } from "@/components/sections/ServicePillarsSection"
import { ProviderBenefitsSection } from "@/components/sections/ProviderBenefitsSection"
import { SecuritySection } from "@/components/sections/SecuritySection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <ServicePillarsSection />
      <ProviderBenefitsSection />
      <SecuritySection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
