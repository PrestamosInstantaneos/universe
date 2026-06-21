import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { NewCollection } from "@/components/new-collection"
import { PopularGenres } from "@/components/popular-genres"
import { NewsSection } from "@/components/news-section"
import { ReleasesSection } from "@/components/releases-section"
import { WaveformDivider } from "@/components/waveform-divider"
import { SiteFooter } from "@/components/site-footer"
import { AudioPlayer } from "@/components/audio-player"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <SiteHeader />
      <HeroSection />
      <NewCollection />
      <ReleasesSection />
      <WaveformDivider />
      <PopularGenres />
      <NewsSection />
      <SiteFooter />
      <AudioPlayer />
    </main>
  )
}
