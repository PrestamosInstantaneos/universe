import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-black py-8 font-mono text-[10px] tracking-wider text-foreground/45 pb-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Copyright y Descargo de responsabilidad adaptado */}
        <p className="text-center md:text-left max-w-xl leading-relaxed uppercase">
          © 2026 ALVIAL. Todos los derechos reservados. Licenciamiento de instrumentales y beats sujeto a términos y condiciones de licencia.
        </p>

        {/* Enlaces de políticas */}
        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="hover:text-primary transition-colors uppercase"
          >
            Términos
          </Link>
          <Link
            href="#"
            className="hover:text-primary transition-colors uppercase"
          >
            Privacidad
          </Link>
          <Link
            href="#"
            className="hover:text-primary transition-colors uppercase"
          >
            Ayuda
          </Link>
        </div>
      </div>
    </footer>
  )
}
