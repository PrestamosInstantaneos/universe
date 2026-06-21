"use client"

import React from "react"
import { useCart } from "./cart-context"

type GenreItem = {
  id: string
  name: string
  overlayText: string
  img: string
  primaryTag: string
  left: string
  top: string
  delay: string
}

const GENRES: GenreItem[] = [
  {
    id: "g-hiphop",
    name: "Hip Hop",
    overlayText: "HIP-HOP",
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    primaryTag: "TRAP",
    left: "33%",
    top: "5%",
    delay: "0s"
  },
  {
    id: "g-pop",
    name: "Pop",
    overlayText: "POP",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    primaryTag: "NEÓN",
    left: "6%",
    top: "23.5%",
    delay: "1.5s"
  },
  {
    id: "g-rnb",
    name: "R&B",
    overlayText: "R&B",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    primaryTag: "R&B",
    left: "33%",
    top: "42%",
    delay: "0.8s"
  },
  {
    id: "g-rock",
    name: "Rock",
    overlayText: "ROCK",
    img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80",
    primaryTag: "CLASSIC",
    left: "60%",
    top: "23.5%",
    delay: "2.2s"
  },
  {
    id: "g-electronic",
    name: "Electronic",
    overlayText: "ELECTRONIC",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    primaryTag: "HOUSE",
    left: "6%",
    top: "60.5%",
    delay: "1.2s"
  },
  {
    id: "g-reggae",
    name: "Reggae",
    overlayText: "REGGAE",
    img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&auto=format&fit=crop&q=80",
    primaryTag: "REGGAETÓN",
    left: "60%",
    top: "60.5%",
    delay: "1.8s"
  }
]

export function PopularGenres() {
  const { openSearch } = useCart()

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 space-y-8">
      
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

      {/* GENRES HONEYCOMB CLUSTER WALL */}
      <div className="relative w-full max-w-[620px] aspect-[1.15/1] mx-auto my-10 select-none">
        <style>{`
          .clip-hexagon {
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          }
          @keyframes float-hexagon {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>
        
        {GENRES.map((genre) => (
          <div 
            key={genre.id}
            onClick={() => openSearch(genre.primaryTag)}
            className="absolute w-[34%] aspect-[1.15/1] cursor-pointer group"
            style={{
              left: genre.left,
              top: genre.top,
              filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.65))",
              animation: "float-hexagon 6s ease-in-out infinite",
              animationDelay: genre.delay
            }}
          >
            {/* Hexagon Outer Border */}
            <div className="w-full h-full bg-white/10 hover:bg-primary transition-all duration-500 clip-hexagon p-[2px] group-hover:scale-[1.03] group-active:scale-[0.98]">
              {/* Hexagon Content Container */}
              <div className="w-full h-full bg-zinc-950 clip-hexagon relative overflow-hidden">
                {/* Background Genre Photo */}
                <img 
                  src={genre.img} 
                  alt={genre.name} 
                  className="size-full object-cover grayscale brightness-[0.55] group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700"
                  loading="lazy"
                />
                
                {/* Overlay color gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent group-hover:bg-black/15 transition-colors duration-500" />
                
                {/* Center text overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                  <span className="font-heading text-[10px] sm:text-xs md:text-sm font-black tracking-wider text-white uppercase drop-shadow-md group-hover:text-primary group-hover:scale-105 transition-all duration-300">
                    {genre.overlayText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
