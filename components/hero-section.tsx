import { ArrowUpRight, Play, Share2, Radio } from "lucide-react"

const FORMATS = ["DIGITAL", "CD", "VINYL", "CASSETTE"]

export function HeroSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-6 md:px-8">
      <div className="relative overflow-hidden border border-border bg-card/30">
        {/* Background image */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: content + main image */}
          <div className="relative min-h-[440px] overflow-hidden sm:min-h-[520px] lg:min-h-[600px]">
            <video
              src="/animationsintro.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 size-full object-cover object-top opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />

            {/* Top labels */}
            <div className="relative z-10 flex items-center gap-4 px-5 pt-5 font-mono text-[10px] tracking-[0.2em] text-foreground/70 md:px-7">
              <span>[ RELEASE No. 01 ]</span>
              <span className="hidden sm:inline">[ FRZN ]</span>
            </div>

            {/* Headline */}
            <div className="relative z-10 mt-6 px-5 md:mt-10 md:px-7">
              <h1 className="font-heading text-5xl font-black leading-[0.86] tracking-[-0.03em] text-foreground sm:text-6xl md:text-7xl">
                VOLUMEN
                <br />
                ÁRTICO 01
                <sup className="ml-1 align-super text-base">™</sup>
              </h1>

              {/* Specs */}
              <div className="mt-7 max-w-sm space-y-3 font-mono text-[11px] tracking-[0.12em] text-foreground/80">
                <div className="flex items-center gap-4">
                  <span className="w-16 text-foreground/50">FORMATO</span>
                  <div className="flex flex-wrap gap-3">
                    {FORMATS.map((f, i) => (
                      <span
                        key={f}
                        className={i === 2 ? "text-foreground underline underline-offset-4" : ""}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-16 text-foreground/50">GÉNERO</span>
                  <div className="flex flex-wrap gap-3">
                    <span>URBANO</span>
                    <span className="text-foreground underline underline-offset-4">MULTIGÉNERO</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex items-center gap-4 pb-7">
                <button
                  aria-label="Reproducir release"
                  className="hexagon flex size-16 shrink-0 items-center justify-center bg-primary text-primary-foreground transition-transform hover:scale-105 md:size-20"
                >
                  <ArrowUpRight className="size-6 md:size-7" />
                </button>
                <div className="font-mono text-[11px] tracking-[0.14em] text-foreground/80">
                  <p className="text-foreground/55">ESCUCHAR / COMPRAR</p>
                  <p className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    $9.99
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: thumbnails + meta */}
          <div className="relative flex flex-col justify-between gap-4 border-t border-border bg-card/20 p-5 lg:border-l lg:border-t-0 md:p-7">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden border border-border bg-card">
                <img
                  src="/images/hero-thumb-1.png"
                  alt="Vista alternativa del artista de FRZN"
                  className="size-full object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden border border-border bg-card">
                <img
                  src="/images/hero-thumb-2.png"
                  alt="Vista posterior del artista de FRZN"
                  className="size-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-foreground/70">
              <span className="text-foreground">01</span>
              <span className="mx-3 h-px flex-1 bg-border" />
              <span>07</span>
            </div>

            <div className="flex items-center gap-2">
              {[Play, Share2, Radio].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-8 items-center justify-center border border-border bg-card/50 text-foreground/70 transition-colors hover:bg-card hover:text-foreground"
                  aria-label="Red social"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
