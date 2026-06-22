"use client"

import { useState, useEffect } from "react"
import { Menu, X, Search, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import Script from "next/script"

declare global {
  interface Window {
    google: any
  }
}

const NAV = [
  { label: "FEED", char: "↘" },
  { label: "TRACKS (BEATS)", char: "↘" },
  { label: "LICENCIAS", char: "↘" },
  { label: "SOUND KITS", char: "↘" },
  { label: "SERVICIOS", char: "↘" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [gsiLoaded, setGsiLoaded] = useState(false)
  const { 
    cart, 
    setCartOpen, 
    purchasedItems, 
    openDownloads, 
    openSearch,
    user,
    loginUser,
    logoutUser
  } = useCart()

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
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (response.credential) {
                await loginUser(response.credential)
              }
            },
            auto_select: false,
          })

          const container = document.getElementById("google-login-btn")
          if (container) {
            window.google.accounts.id.renderButton(container, {
              theme: "filled_black",
              size: "large",
              shape: "rectangular",
              width: 200,
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
  }, [user, gsiLoaded, mounted])

  return (
    <header className="relative z-30 border-b border-white/5 bg-black/20 backdrop-blur-md">
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setGsiLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2" aria-label="FRZN inicio">
          <span className="font-heading text-2xl font-black tracking-[-0.04em] text-foreground md:text-3xl">
            FRZN
          </span>
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
          {purchasedItems.length > 0 && (
            <button
              onClick={openDownloads}
              className="inline-flex items-center justify-center gap-1.5 border border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 font-mono text-[9px] tracking-[0.12em] font-bold px-3 py-2 transition-all cursor-pointer rounded-sm"
            >
              MIS DESCARGAS
            </button>
          )}
          <a
            href="#"
            className="hidden sm:inline-flex items-center justify-center border border-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-[10px] tracking-[0.15em] font-bold px-4.5 py-2 transition-all"
          >
            START SELLING
          </a>

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
              <div className="relative w-[190px] h-[36px] overflow-hidden rounded-sm">
                {/* Custom styled button matching FRZN UI */}
                <button className="absolute inset-0 w-full h-full flex items-center justify-center gap-2 border border-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary transition-all font-mono text-[9px] tracking-[0.15em] font-bold rounded-sm cursor-pointer">
                  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  LOG IN WITH GOOGLE
                </button>
                {/* Invisible Google Button Overlay scaled to guarantee no dead click zones */}
                <div 
                  id="google-login-btn" 
                  className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto scale-[1.5] origin-center"
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
          </ul>
        </nav>
      )}
    </header>
  )
}
