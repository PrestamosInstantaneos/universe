import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { NewCollection } from "@/components/new-collection"
import { PopularGenres } from "@/components/popular-genres"
import { ReleasesSection } from "@/components/releases-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { SiteFooter } from "@/components/site-footer"
import { AudioPlayer } from "@/components/audio-player"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <SiteHeader />
      <HeroSection />
      <NewCollection />
      <PopularGenres />
      <ReleasesSection />
      <ManifestoSection />
      <SiteFooter />
      <AudioPlayer />
    </main>
  )
}
