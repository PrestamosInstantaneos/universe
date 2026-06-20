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
            className="absolute inset-y-0 right-0 h-full w-full lg:w-[60%] object-cover object-center lg:object-[30%_center] opacity-95 hero-video"
          />
          {/* Capas de degradado para fusionar el video con el fondo negro */}
          {/* En móviles: Degradado vertical para asegurar legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 lg:hidden" />
          
          {/* En pantallas grandes: Degradado horizontal de izquierda a derecha (estilo Beatstars) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-45% to-transparent hidden lg:block" />
        </div>

        {/* Contenedor del contenido alineado con la cabecera de la página */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-8 flex items-center min-h-[380px] sm:min-h-[420px] lg:min-h-[480px]">
          <div className="w-full max-w-2xl py-12 lg:py-16">
            {/* Headline */}
            <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h1 className="w-full text-center lg:text-left font-heading text-lg min-[380px]:text-xl font-black leading-[1.08] tracking-[-0.02em] text-white/50 sm:text-5xl md:text-6xl lg:text-7xl uppercase">
                Encuentra tu hit
              </h1>
              
              <p className="hidden sm:block font-mono text-xs tracking-wide text-foreground/60 max-w-md leading-relaxed">
                Encuentra beats exclusivos, instrumentales listos para grabar y colabora con productores del colectivo FRZN.
              </p>

              {/* Barra de búsqueda interactiva estilo Beatstars */}
              <div className="relative mt-6 w-full max-w-sm mx-auto lg:mx-0">
                <div className="relative flex items-center bg-card/60 border border-border/80 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-full overflow-hidden transition-all shadow-xl backdrop-blur-md p-1.5">
                  <Search className="absolute left-3.5 sm:left-4.5 size-3.5 sm:size-4 text-foreground/45" />
                  <input
                    type="text"
                    placeholder="Explora nuevos sonidos..."
                    className="w-full bg-transparent pl-10 sm:pl-12 pr-22 sm:pr-28 py-3 sm:py-3.5 font-mono text-[10px] sm:text-[11px] tracking-wider text-foreground placeholder-foreground/35 outline-none"
                  />
                  <button className="absolute right-1.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-[9px] sm:text-[10px] tracking-widest font-bold px-4 py-2.5 sm:px-6 sm:py-3 transition-colors">
                    BUSCAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
