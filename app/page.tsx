import { HeroSection } from "@/components/home/hero-section"
import { WhySection } from "@/components/home/why-section"
import { CoursesTeaser } from "@/components/home/courses-teaser"
import { CertificationsTeaser } from "@/components/home/certifications-teaser"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <CoursesTeaser />
      <CertificationsTeaser />
      <CtaSection />
    </>
  )
}
