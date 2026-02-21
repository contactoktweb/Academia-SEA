import { HeroSection } from "@/components/home/hero-section"
import { WhySection } from "@/components/home/why-section"
import { CoursesTeaser } from "@/components/home/courses-teaser"
import { CertificationsTeaser } from "@/components/home/certifications-teaser"
import { NewsletterSection } from "@/components/home/newsletter-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <CoursesTeaser />
      <CertificationsTeaser />
      <NewsletterSection />
    </>
  )
}
