import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { NewCollection } from "@/components/new-collection"
import { ManifestoSection } from "@/components/manifesto-section"
import { SiteFooter } from "@/components/site-footer"
import { AudioPlayer } from "@/components/audio-player"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <SiteHeader />
      <HeroSection />
      <NewCollection />
      <ManifestoSection />
      <SiteFooter />
      <AudioPlayer />
    </main>
  )
}
