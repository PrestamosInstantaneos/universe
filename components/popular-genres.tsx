"use client"

import React from "react"
import { useCart } from "./cart-context"

const HEXAGON_LAYOUTS = [
  { left: "31.5%", top: "6.3%", delay: "0s" },
  { left: "2.5%", top: "21.3%", delay: "1.5s" },
  { left: "31.5%", top: "36.3%", delay: "0.8s" },
  { left: "60.5%", top: "21.3%", delay: "2.2s" },
  { left: "2.5%", top: "51.3%", delay: "1.2s" },
  { left: "60.5%", top: "51.3%", delay: "1.8s" },
  { left: "31.5%", top: "66.3%", delay: "1.0s" }
]

export function PopularGenres() {
  const { openSearch, genres } = useCart()

  // Mapeamos los 7 hexágonos con su layout fijo y estado dinámico
  const mappedHexagons = HEXAGON_LAYOUTS.map((layout, index) => {
    const genre = genres[index] || { id: String(index + 1), name: "", tag: "", img: "" }
    const isConfigured = genre.name.trim() !== "" && genre.tag.trim() !== ""
    return {
      ...genre,
      ...layout,
      isConfigured
    }
  })

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 space-y-8">
      
      {/* HEADER ROW */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-primary uppercase">[ 02 ]</span>
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

      {/* GENRES HONEYCOMB CLUSTER WALL (Taller aspect ratio to fit the 5th bottom-center row) */}
      <div className="relative w-full max-w-[500px] aspect-[0.85/1] mx-auto my-10 select-none">
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
          .hexagon-wrapper {
            will-change: transform;
            filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6)) 
                    drop-shadow(0 0 5px rgba(236, 72, 153, 0.2)) 
                    drop-shadow(0 0 8px rgba(34, 211, 238, 0.15));
            transition: filter 0.5s ease-in-out;
          }
          .hexagon-wrapper:hover {
            filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8)) 
                    drop-shadow(0 0 12px rgba(236, 72, 153, 0.7)) 
                    drop-shadow(0 0 20px rgba(34, 211, 238, 0.55));
          }
          .glow-border {
            background: linear-gradient(120deg, #22d3ee, #d946ef, #8b5cf6, #22d3ee);
            background-size: 300% 300%;
            animation: border-flow 6s ease infinite;
          }
          @keyframes border-flow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @media (max-width: 767px) {
            .hexagon-wrapper {
              animation: none !important;
              filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.55)) !important;
            }
          }
        `}</style>
        
        {mappedHexagons.map((hex) => {
          const nameUpper = hex.name.trim().toUpperCase()
          
          return (
            <div 
              key={hex.id}
              onClick={() => {
                if (hex.isConfigured) {
                  openSearch(hex.tag)
                }
              }}
              className={`absolute w-[37%] aspect-[1.15/1] hexagon-wrapper ${
                hex.isConfigured ? "cursor-pointer group" : "cursor-default pointer-events-none opacity-20"
              }`}
              style={{
                left: hex.left,
                top: hex.top,
                animation: "float-hexagon 6s ease-in-out infinite",
                animationDelay: hex.delay
              }}
            >
              {/* Hexagon Outer Border */}
              <div className={`w-full h-full clip-hexagon p-[2.5px] transition-all duration-500 ${
                hex.isConfigured 
                  ? "glow-border group-hover:scale-[1.03] group-active:scale-[0.98]" 
                  : "bg-zinc-800"
              }`}>
                {/* Hexagon Content Container */}
                <div className="w-full h-full bg-zinc-950 clip-hexagon relative overflow-hidden">
                  {hex.isConfigured && hex.img && (
                    <>
                      {/* Background Genre Photo */}
                      <img 
                        src={hex.img} 
                        alt={hex.name} 
                        className="size-full object-cover grayscale brightness-[0.55] group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700"
                        loading="lazy"
                      />
                      
                      {/* Overlay color gradient */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent group-hover:bg-black/15 transition-colors duration-500" />
                      
                      {/* Center text overlay */}
                      <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                        <span className="font-heading text-[10px] sm:text-xs md:text-sm font-black tracking-wider text-white uppercase drop-shadow-md group-hover:text-primary group-hover:scale-105 transition-all duration-300">
                          {nameUpper}
                        </span>
                      </div>
                    </>
                  )}
                  {!hex.isConfigured && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90">
                      <span className="font-mono text-[7px] sm:text-[8px] text-zinc-700 tracking-widest uppercase">
                        VACÍO
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}
