"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Search, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import Script from "next/script"

declare global {
  interface Window {
    google: any
  }
}

const NAV: { label: string; char: string }[] = []

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [gsiLoaded, setGsiLoaded] = useState(false)
  const googleInitializedRef = useRef(false)
  const { 
    cart, 
    setCartOpen, 
    purchasedItems, 
    openDownloads, 
    openSearch,
    user,
    loginUser,
    logoutUser,
    logoUrl
  } = useCart()

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || user?.email === "music.bests.page.is@gmail.com"

  // Evitar desajustes de hidratación en Next.js
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initGoogle = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      if (!clientId) {
        console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured in .env.local")
        return
      }

      if (typeof window !== "undefined" && window.google && !user) {
        try {
          if (!googleInitializedRef.current) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: async (response: any) => {
                if (response.credential) {
                  await loginUser(response.credential)
                }
              },
              auto_select: false,
            })
            googleInitializedRef.current = true
          }

          // 1. Botón de Escritorio (Solo icono G, circular)
          const desktopContainer = document.getElementById("google-login-btn-desktop")
          if (desktopContainer) {
            window.google.accounts.id.renderButton(desktopContainer, {
              type: "icon",
              theme: "filled_black",
              shape: "circle",
              size: "medium",
            })
          }

          // 2. Botón Móvil (Dentro del menú hamburguesa, completo)
          const mobileContainer = document.getElementById("google-login-btn-mobile")
          if (mobileContainer) {
            window.google.accounts.id.renderButton(mobileContainer, {
              theme: "filled_black",
              size: "medium",
              shape: "rectangular",
              text: "signin_with",
            })
          }
        } catch (err) {
          console.error("Error rendering Google login button:", err)
        }
      }
    }

    let timer: NodeJS.Timeout
    if (gsiLoaded || (typeof window !== "undefined" && window.google)) {
      timer = setTimeout(() => {
        initGoogle()
      }, 100)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [user, gsiLoaded, mounted, open]) // Re-inicializar si cambia el estado del menú hamburguesa

  return (
    <header className="relative z-30 border-b border-white/5 bg-black/20 backdrop-blur-md">
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setGsiLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2" aria-label="ALVIAL inicio">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt="ALVIAL" className="h-8 max-w-[150px] object-contain" />
          ) : (
            <span className="font-heading text-2xl font-black tracking-[-0.04em] text-foreground md:text-3xl">
              ALVIAL
            </span>
          )}
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.label}
              href="#"
              className="group flex items-center gap-1 font-mono text-[11px] tracking-[0.18em] text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="text-foreground/40 transition-colors group-hover:text-foreground/70">
                {item.char}
              </span>
            </a>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {mounted && isAdmin && (
            <a
              href="/admin"
              className="inline-flex items-center justify-center gap-1.5 border border-primary/40 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-[9px] tracking-[0.12em] font-bold px-3 py-2 transition-all cursor-pointer rounded-sm shadow-sm hover:shadow-primary/20"
            >
              ADMINISTRACIÓN
            </a>
          )}

          {purchasedItems.length > 0 && (
            <button
              onClick={openDownloads}
              className="inline-flex items-center justify-center gap-1.5 border border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 font-mono text-[9px] tracking-[0.12em] font-bold px-3 py-2 transition-all cursor-pointer rounded-sm"
            >
              MIS DESCARGAS
            </button>
          )}

          {/* Google Auth Button / User Dropdown (Mounted client-side only) */}
          {mounted && (
            user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 border border-white/10 bg-white/5 p-1 pr-3 rounded-full hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="size-7 rounded-full object-cover border border-white/20" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-mono text-[9px] tracking-[0.12em] font-bold text-foreground max-w-[90px] truncate hidden md:inline">
                    {user.name.split(" ")[0].toUpperCase()}
                  </span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-sm border border-white/10 bg-zinc-950/95 backdrop-blur-md p-1.5 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="font-mono text-[10px] font-bold text-foreground truncate">{user.name}</p>
                    <p className="font-mono text-[8px] text-foreground/45 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="w-full text-left font-mono text-[9px] tracking-[0.12em] text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 transition-all cursor-pointer rounded-sm mt-1"
                  >
                    CERRAR SESIÓN
                  </button>
                </div>
              </div>
            ) : (
              /* Desktop/Laptop only: Compact circular Google G-logo button */
              <div 
                className="hidden sm:flex h-[32px] w-[32px] items-center justify-center border border-primary/30 bg-black/40 rounded-full hover:border-primary transition-all overflow-hidden"
                style={{ colorScheme: "light" }}
              >
                <div 
                  id="google-login-btn-desktop" 
                  className="h-[32px] w-[32px] flex items-center justify-center bg-transparent [&_iframe]:!bg-transparent [&_iframe]:!border-none"
                ></div>
              </div>
            )
          )}

          {/* Header Search Icon Button */}
          <button
            onClick={() => openSearch()}
            className="flex size-9 items-center justify-center border border-border bg-card/40 text-foreground/80 transition-colors hover:bg-card cursor-pointer"
            aria-label="Buscar"
          >
            <Search className="size-4" />
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex size-9 items-center justify-center border border-border bg-card/40 text-foreground/80 transition-colors hover:bg-card cursor-pointer"
            aria-label="Carrito"
          >
            <ShoppingBag className="size-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[8px] font-mono font-bold text-primary-foreground border border-background shadow-lg">
                {cart.length}
              </span>
            )}
          </button>
          <button
            className="flex size-9 items-center justify-center border border-border bg-card/40 text-foreground/80 transition-colors hover:bg-card lg:hidden cursor-pointer"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="border-y border-border bg-background/95 px-4 py-4 backdrop-blur lg:hidden"
          aria-label="Móvil"
        >
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className="flex items-center justify-between border-b border-border/60 py-3 font-mono text-xs tracking-[0.18em] text-foreground/90"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span className="text-foreground/40">{item.char}</span>
                </a>
              </li>
            ))}

            {mounted && isAdmin && (
              <li>
                <a
                  href="/admin"
                  className="flex items-center justify-between border-b border-primary/30 py-3 font-mono text-xs tracking-[0.18em] text-primary hover:text-primary-light font-bold"
                  onClick={() => setOpen(false)}
                >
                  ADMINISTRACIÓN
                  <span className="text-primary/70">↗</span>
                </a>
              </li>
            )}

            {/* Google Sign-in Option inside the mobile menu drawer */}
            {!user && (
              <li className="mt-4 pt-4 border-t border-white/5 flex flex-col items-center justify-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.15em] text-foreground/40 uppercase">
                  INGRESAR A TU CUENTA:
                </span>
                <div 
                  className="flex h-[36px] w-[200px] items-center justify-center border border-primary/30 bg-black/40 rounded-sm hover:border-primary transition-all overflow-hidden"
                  style={{ colorScheme: "light" }}
                >
                  <div 
                    id="google-login-btn-mobile" 
                    className="h-[32px] flex items-center bg-transparent [&_iframe]:!bg-transparent [&_iframe]:!border-none [&_div]:!bg-transparent"
                  ></div>
                </div>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
