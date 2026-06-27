"use client"

import Link from "next/link"
import { useCart } from "./cart-context"

export function SiteFooter() {
  const { instagramUrl, youtubeUrl, soundcloudUrl, telegramUrl } = useCart()

  // Solo mostrar redes sociales si al menos una está configurada
  const hasSocials = instagramUrl || youtubeUrl || soundcloudUrl || telegramUrl

  return (
    <footer className="w-full border-t border-white/5 bg-black py-12 pb-36 font-mono text-[10px] tracking-wider text-foreground/45">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-8">
          
          {/* Seccion Contactar al compositor ALVIAL */}
          <div className="text-center md:text-left space-y-2 max-w-sm">
            <span className="text-primary font-bold text-[9px] tracking-[0.2em] uppercase block">
              [ COMPOSITOR Y SOPORTE ]
            </span>
            <h4 className="font-heading text-sm font-black text-foreground uppercase tracking-wider">
              Contactar al compositor (ALVIAL)
            </h4>
            <p className="text-[9px] text-foreground/50 uppercase leading-relaxed">
              ¿Tienes dudas sobre licencias o necesitas cambios a medida? Escríbele directo en Telegram.
            </p>
            {telegramUrl ? (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/10 border border-primary/20 hover:bg-primary hover:text-black font-mono text-[9px] font-bold text-primary uppercase transition-all cursor-pointer"
              >
                <svg className="size-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" x2="11" y1="2" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Iniciar Chat en Telegram
              </a>
            ) : (
              <span className="text-[8px] text-foreground/30 uppercase italic block mt-1">
                (Telegram de soporte no configurado)
              </span>
            )}
          </div>

          {/* Iconos de Redes Sociales */}
          {hasSocials && (
            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-foreground/60 text-[8px] font-bold tracking-widest uppercase">
                Sigue a ALVIAL en Redes
              </span>
              <div className="flex items-center gap-3">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-full border border-white/5 bg-zinc-900/30 hover:border-pink-500/50 hover:bg-pink-500/10 flex items-center justify-center text-foreground/60 hover:text-pink-500 transition-all cursor-pointer"
                    aria-label="Instagram ALVIAL"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-full border border-white/5 bg-zinc-900/30 hover:border-red-500/50 hover:bg-red-500/10 flex items-center justify-center text-foreground/60 hover:text-red-500 transition-all cursor-pointer"
                    aria-label="YouTube ALVIAL"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                      <polygon points="10 15 15 12 10 9" fill="currentColor" />
                    </svg>
                  </a>
                )}
                {soundcloudUrl && (
                  <a
                    href={soundcloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-full border border-white/5 bg-zinc-900/30 hover:border-orange-500/50 hover:bg-orange-500/10 flex items-center justify-center text-foreground/60 hover:text-orange-500 transition-all cursor-pointer"
                    aria-label="SoundCloud ALVIAL"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </a>
                )}
                {telegramUrl && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-full border border-white/5 bg-zinc-900/30 hover:border-sky-400/50 hover:bg-sky-400/10 flex items-center justify-center text-foreground/60 hover:text-sky-400 transition-all cursor-pointer"
                    aria-label="Telegram ALVIAL"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" x2="11" y1="2" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          {/* Copyright y Descargo de responsabilidad adaptado */}
          <p className="text-center md:text-left max-w-xl leading-relaxed uppercase text-[9px]">
            © 2026 ALVIAL. Todos los derechos reservados. Licenciamiento de instrumentales y beats sujeto a términos y condiciones de licencia.
          </p>

          {/* Enlaces de políticas */}
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-primary transition-colors uppercase text-[9px]"
            >
              Términos
            </Link>
            <Link
              href="#"
              className="hover:text-primary transition-colors uppercase text-[9px]"
            >
              Privacidad
            </Link>
            <Link
              href="#"
              className="hover:text-primary transition-colors uppercase text-[9px]"
            >
              Ayuda
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
