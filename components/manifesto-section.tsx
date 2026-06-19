export function ManifestoSection() {
  return (
    <section className="relative mt-6 overflow-hidden border-t border-border">
      {/* Graffiti band */}
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-14 md:px-8 md:py-20">
        <div
          className="pointer-events-none absolute inset-x-0 top-6 flex justify-center overflow-hidden"
          aria-hidden="true"
        >
          <span className="graffiti whitespace-nowrap text-[18vw] leading-none md:text-[12vw]">
            FRZN SOUND
          </span>
        </div>

        <div className="relative z-10 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.14em] text-foreground/75">
          <p>
            FRZN NACIÓ EN LA CALLE. NO COMO UNA TENDENCIA, SINO COMO UNA
            RESPUESTA. UN COLECTIVO MULTIGÉNERO PARA LOS QUE HACEN RUIDO.
          </p>
          <p className="mt-4 text-foreground/50">[ PROTOCOL: ALTITUDE SOUND_01 ]</p>
        </div>

        <div className="relative z-10 self-end text-right font-mono text-[11px] tracking-[0.14em] text-foreground/60">
          <p>PARA LOS QUE</p>
          <p>SUBEN, NO PARA</p>
          <p>LA MULTITUD</p>
        </div>
      </div>

      {/* City image with big headline */}
      <div className="relative h-[420px] w-full overflow-hidden md:h-[560px]">
        <img
          src="/images/city-banner.png"
          alt="Horizonte urbano entre la niebla, estética FRZN"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/60" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-10 md:px-8 md:pb-14">
          <h2 className="font-heading text-4xl font-black leading-[0.88] tracking-[-0.03em] text-foreground sm:text-6xl md:text-7xl">
            HECHO PARA EL FRÍO
            <br />
            FORJADO EN SONIDO
            <br />
            CONSTRUIDO PARA DURAR
          </h2>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border/60 pt-5">
            <p className="font-mono text-[10px] tracking-[0.18em] text-foreground/55">
              FRZN SOUND COLLECTIVE · TODOS LOS DERECHOS RESERVADOS
            </p>
            <p className="font-mono text-[10px] tracking-[0.4em] text-foreground/70">
              ████ ██ ████ █ ███
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
