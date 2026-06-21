"use client"

import React from "react"
import { useCart } from "./cart-context"

type GenreItem = {
  id: string
  name: string
  overlayText: string
  img: string
  primaryTag: string
}

const GENRES: GenreItem[] = [
  {
    id: "g-hiphop",
    name: "Hip Hop",
    overlayText: "HIP-HOP",
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    primaryTag: "TRAP"
  },
  {
    id: "g-pop",
    name: "Pop",
    overlayText: "POP",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    primaryTag: "NEÓN"
  },
  {
    id: "g-rnb",
    name: "R&B",
    overlayText: "R&B",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    primaryTag: "R&B"
  },
  {
    id: "g-rock",
    name: "Rock",
    overlayText: "ROCK",
    img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80",
    primaryTag: "CLASSIC"
  },
  {
    id: "g-electronic",
    name: "Electronic",
    overlayText: "ELECTRONIC",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    primaryTag: "HOUSE"
  },
  {
    id: "g-reggae",
    name: "Reggae",
    overlayText: "REGGAE",
    img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&auto=format&fit=crop&q=80",
    primaryTag: "REGGAETÓN"
  }
]

export function PopularGenres() {
  const { openSearch } = useCart()

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 space-y-6">
      
      {/* HEADER ROW */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-primary uppercase font-bold">[ 02 ]</span>
          <h2 className="font-heading text-xl sm:text-2xl font-black tracking-[-0.02em] text-foreground mt-1 uppercase">
            Géneros Populares
          </h2>
        </div>
        
        <button
          onClick={() => openSearch()}
          className="font-mono text-[9.5px] font-bold text-foreground/50 hover:text-primary tracking-widest uppercase transition-colors cursor-pointer"
        >
          VER MÁS (SEE MORE)
        </button>
      </div>

      {/* GENRES ROW GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {GENRES.map((genre) => (
          <div 
            key={genre.id}
            onClick={() => openSearch(genre.primaryTag)}
            className="group flex flex-col space-y-3 cursor-pointer"
          >
            {/* Genre Card Box */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/5 bg-zinc-950/80 transition-all duration-300 group-hover:scale-[1.03] group-hover:border-primary/40 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.1)]">
              {/* Genre cover photo */}
              <img 
                src={genre.img} 
                alt={genre.name} 
                className="size-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-500"
                loading="lazy"
              />
              
              {/* Dark overlay backdrop */}
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/35 transition-colors duration-300" />
              
              {/* Centered Large Text */}
              <div className="absolute inset-0 flex items-center justify-center p-3">
                <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-white uppercase text-center drop-shadow-md select-none group-hover:scale-105 group-hover:text-primary transition-all duration-300">
                  {genre.overlayText}
                </span>
              </div>
            </div>

            {/* Below label */}
            <span className="font-sans text-[11.5px] font-bold text-foreground/80 tracking-tight text-left select-none group-hover:text-foreground transition-colors pl-1">
              {genre.name}
            </span>
          </div>
        ))}
      </div>

    </section>
  )
}
