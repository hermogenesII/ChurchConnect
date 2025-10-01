import { Header } from '@/components/navigation'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Testimonials } from '@/components/landing/Testimonials'
import { ChurchCTA } from '@/components/landing/ChurchCTA'
import { ImpactStats } from '@/components/landing/ImpactStats'
import { Newsletter } from '@/components/landing/Newsletter'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <Testimonials />
        <ChurchCTA />
        <ImpactStats />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
