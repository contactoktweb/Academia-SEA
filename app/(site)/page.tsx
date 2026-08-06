import { HeroSection } from "@/components/home/hero-section"
import { PlacementTestSection } from "@/components/home/placement-test-section"
import { WhySection } from "@/components/home/why-section"
import { CoursesTeaser } from "@/components/home/courses-teaser"
import { OnlineSection } from "@/components/home/online-section"
import { CertificationsTeaser } from "@/components/home/certifications-teaser"
import { CtaSection } from "@/components/home/cta-section"
import { client } from "@/sanity/lib/client"
import { HERO_HOME_QUERY, WHY_SECTION_QUERY, COURSES_TEASER_QUERY, CERTIFICATIONS_TEASER_QUERY, CTA_SECTION_QUERY } from "@/sanity/lib/queries"
import { Metadata } from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const [heroData, whyData, coursesData, certsData, ctaData] = await Promise.all([
    client.fetch(HERO_HOME_QUERY),
    client.fetch(WHY_SECTION_QUERY),
    client.fetch(COURSES_TEASER_QUERY),
    client.fetch(CERTIFICATIONS_TEASER_QUERY),
    client.fetch(CTA_SECTION_QUERY),
  ])

  return (
    <>
      <HeroSection data={heroData} />
      <PlacementTestSection />
      <WhySection data={whyData} />
      <CoursesTeaser data={coursesData} />
      <OnlineSection />
      <CertificationsTeaser data={certsData} />
      <CtaSection data={ctaData} />
    </>
  )
}
