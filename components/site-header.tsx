"use client"

import { useState } from "react"
import { Menu, X, Search, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"

const NAV = [
  { label: "FEED", char: "↘" },
  { label: "TRACKS (BEATS)", char: "↘" },
  { label: "LICENCIAS", char: "↘" },
  { label: "SOUND KITS", char: "↘" },
  { label: "SERVICIOS", char: "↘" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { cart, setCartOpen, purchasedItems, openDownloads, openSearch } = useCart()

  return (
    <header className="relative z-30 border-b border-white/5 bg-black/20 backdrop-blur-md">
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
