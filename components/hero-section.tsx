import { ArrowUpRight, Play, Share2, Radio } from "lucide-react"

const FORMATS = ["DIGITAL", "CD", "VINYL", "CASSETTE"]

export function HeroSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-6 md:px-8">
      <div className="relative overflow-hidden border border-border bg-black">
        <div className="relative min-h-[500px] sm:min-h-[550px] lg:min-h-[620px] flex items-center">
          {/* Video en la derecha con degradado negro de izquierda a derecha */}
          <div className="absolute inset-0 z-0">
            <video
              src="/animationsintro.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-y-0 right-0 h-full w-full lg:w-[60%] object-cover object-center opacity-95"
            />
            {/* Capas de degradado para fusionar el video con el fondo negro */}
            {/* En móviles: Degradado vertical para asegurar legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 lg:hidden" />
            
            {/* En pantallas grandes: Degradado horizontal de izquierda a derecha (estilo Beatstars) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-45% to-transparent hidden lg:block" />
          </div>

          {/* Contenido principal en el lado izquierdo */}
          <div className="relative z-10 w-full max-w-2xl px-6 py-12 md:px-12 lg:py-16">
            {/* Top labels */}
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-foreground/75 mb-6">
              <span>[ RELEASE No. 01 ]</span>
              <span>[ FRZN ]</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-heading text-5xl font-black leading-[0.86] tracking-[-0.03em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
                VOLUMEN
                <br />
                ÁRTICO 01
                <sup className="ml-1 align-super text-sm md:text-base">™</sup>
              </h1>

              {/* Specs */}
              <div className="mt-8 max-w-sm space-y-3 font-mono text-[11px] tracking-[0.12em] text-foreground/80">
                <div className="flex items-center gap-4">
                  <span className="w-16 text-foreground/50">FORMATO</span>
                  <div className="flex flex-wrap gap-3">
                    {FORMATS.map((f, i) => (
                      <span
                        key={f}
                        className={i === 2 ? "text-foreground underline underline-offset-4 font-bold" : ""}
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
                    <span className="text-foreground underline underline-offset-4 font-bold">MULTIGÉNERO</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 flex items-center gap-5">
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
        </div>
      </div>
    </section>
  )
}
