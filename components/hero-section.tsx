import { ArrowUpRight, Search } from "lucide-react"

const FORMATS = ["DIGITAL", "CD", "VINYL", "CASSETTE"]

export function HeroSection() {
  return (
    <section className="w-full pb-6">
      <div className="relative overflow-hidden border-y border-border bg-black">
        {/* Video en la derecha con degradado negro de izquierda a derecha */}
        <div className="absolute inset-0 z-0">
          <video
            src="/animationsintro.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-y-0 -right-8 h-full w-full lg:w-[62%] object-cover object-center scale-105 origin-right opacity-95"
          />
          {/* Capas de degradado para fusionar el video con el fondo negro */}
          {/* En móviles: Degradado vertical para asegurar legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 lg:hidden" />
          
          {/* En pantallas grandes: Degradado horizontal de izquierda a derecha (estilo Beatstars) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-45% to-transparent hidden lg:block" />
        </div>

        {/* Contenedor del contenido alineado con la cabecera de la página */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 flex items-center min-h-[420px] sm:min-h-[460px] lg:min-h-[520px]">
          <div className="w-full max-w-2xl py-12 lg:py-16">
            {/* Top labels */}
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-foreground/75 mb-6">
              <span>[ RELEASE No. 01 ]</span>
              <span>[ FRZN SOUND COLLECTIVE ]</span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="font-heading text-4xl font-black leading-[0.95] tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl uppercase">
                Tu próximo hit
                <br />
                comienza aquí
              </h1>
              
              <p className="font-mono text-xs tracking-wider text-foreground/60 max-w-md leading-relaxed uppercase">
                Encuentra beats exclusivos, instrumentales listos para grabar y colabora con productores del colectivo FRZN.
              </p>

              {/* Barra de búsqueda interactiva estilo Beatstars */}
              <div className="relative mt-8 max-w-xl">
                <div className="relative flex items-center bg-card/60 border border-border/80 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-full overflow-hidden transition-all shadow-xl backdrop-blur-md p-1.5">
                  <Search className="absolute left-4.5 size-4 text-foreground/45" />
                  <input
                    type="text"
                    placeholder="Explora nuevos sonidos: Trap, Drill, R&B, etc..."
                    className="w-full bg-transparent pl-12 pr-28 py-3.5 font-mono text-[11px] tracking-wider text-foreground placeholder-foreground/35 outline-none"
                  />
                  <button className="absolute right-1.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-[10px] tracking-widest font-bold px-6 py-3 transition-colors">
                    BUSCAR
                  </button>
                </div>
              </div>

              {/* Tags populares */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-[10px] tracking-wider text-foreground/50">
                <span className="uppercase">Populares:</span>
                {["#TRAP", "#DRILL", "#AFROBEATS", "#R&B"].map((tag) => (
                  <a
                    key={tag}
                    href="#"
                    className="text-foreground/75 hover:text-primary transition-colors border border-border bg-card/20 px-2.5 py-1 rounded"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
