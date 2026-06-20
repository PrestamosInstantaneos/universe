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
    </section>
  )
}
