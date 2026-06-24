"use client"

import React, { useState, useEffect } from "react"
import { Play, Pause, ShoppingCart, ChevronRight } from "lucide-react"
import { useCart, Track } from "./cart-context"

const RELEASES: Track[] = [
  {
    id: "rel-1",
    img: "/images/artist-7.png",
    title: "Ghetto Romance",
    producer: "FRZN SOUND",
    tags: ["REGGAETÓN", "LATIN"],
    bpm: 98,
    key: "E Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "rel-2",
    img: "/images/artist-2.png",
    title: "Cyber Trap 2099",
    producer: "LokernG",
    tags: ["TRAP", "GLITCH"],
    bpm: 140,
    key: "C Minor",
    price: "$19.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "rel-3",
    img: "/images/artist-4.png",
    title: "Afro Chill Vibes",
    producer: "Markk Aylin",
    tags: ["AFROBEATS", "DANCEHALL"],
    bpm: 105,
    key: "G Major",
    price: "$39.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "rel-4",
    img: "/images/artist-3.png",
    title: "Drill Symphony",
    producer: "Onibur",
    tags: ["DRILL", "DARK"],
    bpm: 144,
    key: "D# Minor",
    price: "$24.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "rel-5",
    img: "/images/artist-6.png",
    title: "Midnight House",
    producer: "Junkey",
    tags: ["HOUSE", "DEEP"],
    bpm: 126,
    key: "A Minor",
    price: "$44.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "rel-6",
    img: "/images/artist-8.png",
    title: "Polar Express",
    producer: "FRZN SOUND",
    tags: ["BOOM BAP", "CLASSIC"],
    bpm: 92,
    key: "E Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
]

export function ReleasesSection() {
  const { releases, openLicenseModal } = useCart()
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  if (releases.length === 0) return null

  // Safe helper to get releases
  const col1Tracks = [releases[0], releases[1]].filter(Boolean)
  const col2Tracks = [releases[2], releases[3]].filter(Boolean)
  const col3Tracks = [releases[4], releases[5]].filter(Boolean)

  // Escuchar el estado de reproducción del reproductor de audio global
  useEffect(() => {
    const handleAudioStatus = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        setCurrentTrackId(customEvent.detail.trackId)
        setIsPlaying(customEvent.detail.isPlaying)
      }
    }

    window.addEventListener("audio-status", handleAudioStatus)
    return () => {
      window.removeEventListener("audio-status", handleAudioStatus)
    }
  }, [])

  // Controlar play/pause de las canciones
  const handlePlayClick = (track: Track) => {
    if (currentTrackId === track.id) {
      const event = new CustomEvent("toggle-play")
      window.dispatchEvent(event)
    } else {
      const event = new CustomEvent("play-track", {
        detail: track
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-20 border-t border-white/5">
      
      {/* Injected loop scroll animations */}
      <style>{`
        .scroll-col-up {
          animation: scrollColumnUp 24s linear infinite;
        }
        .scroll-col-down {
          animation: scrollColumnDown 24s linear infinite;
        }
        .releases-scroll-container:hover .scroll-col-up,
        .releases-scroll-container:hover .scroll-col-down {
          animation-play-state: paused;
        }
        
        @keyframes scrollColumnUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollColumnDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: Text Content & Branding */}
        <div className="lg:col-span-5 text-left space-y-6 lg:max-w-md">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase font-bold">
              #NUEVOSLANZAMIENTOS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] leading-tight text-foreground uppercase">
              SI, ESE BEAT ACABA DE SER DROPEADO.
            </h2>
          </div>


          <div>
            <button
              onClick={() => {
                // Hacer scroll suave hacia la sección de colección
                const collectionEl = document.querySelector("section")
                if (collectionEl) {
                  collectionEl.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="inline-flex items-center gap-2 border border-white/10 hover:border-primary/50 bg-zinc-950/60 hover:bg-primary/5 text-foreground hover:text-primary font-mono text-[10px] tracking-wider font-bold px-6 py-3 rounded-full transition-all group cursor-pointer shadow-lg shadow-black/30"
            >
              NUEVO HIT EN CAMINO
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Infinite Vertical Scroll Staggered Grid */}
        <div className="lg:col-span-7 relative h-[620px] overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/20 px-4 py-2 releases-scroll-container">
          
          {/* Top Fade Overlay */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          
          {/* Bottom Fade Overlay */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

          {/* Staggered Columns Wrapper */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 h-full">
            
            {/* Column 1 (Scrolls UP) */}
            <div className="scroll-col-up flex flex-col">
              
              {/* Group 1 */}
              <div className="flex flex-col gap-6 pb-6 shrink-0">
                {col1Tracks.map((track) => {
                  const isThisTrackPlaying = currentTrackId === track.id && isPlaying
                  return (
                    <div 
                      key={`${track.id}-g1`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-950/40 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 hover:shadow-primary/5"
                    >
                      <img 
                        src={track.img} 
                        alt={track.title} 
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className={`size-12 rounded-full flex items-center justify-center border shadow-xl transition-all duration-300 cursor-pointer ${
                            isThisTrackPlaying
                              ? "bg-primary text-primary-foreground border-primary scale-110"
                              : "bg-black/90 text-foreground border-white/20 hover:border-primary hover:text-primary hover:scale-110"
                          }`}
                        >
                          {isThisTrackPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left select-none">
                        <div>
                          <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-tight line-clamp-1">
                            {track.title}
                          </h4>
                          <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-widest mt-0.5">
                            {track.producer}
                          </p>
                        </div>
                        <button
                          onClick={() => openLicenseModal(track)}
                          className="w-full flex items-center justify-center gap-1.5 rounded bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-foreground hover:text-primary-foreground font-mono text-[9px] tracking-wider font-bold py-2 mt-2 transition-all cursor-pointer"
                        >
                          COMPRAR {track.price}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Group 2 (Duplicate for Seamless Loop) */}
              <div className="flex flex-col gap-6 pb-6 shrink-0">
                {col1Tracks.map((track) => {
                  const isThisTrackPlaying = currentTrackId === track.id && isPlaying
                  return (
                    <div 
                      key={`${track.id}-g2`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-950/40 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 hover:shadow-primary/5"
                    >
                      <img 
                        src={track.img} 
                        alt={track.title} 
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className={`size-12 rounded-full flex items-center justify-center border shadow-xl transition-all duration-300 cursor-pointer ${
                            isThisTrackPlaying
                              ? "bg-primary text-primary-foreground border-primary scale-110"
                              : "bg-black/90 text-foreground border-white/20 hover:border-primary hover:text-primary hover:scale-110"
                          }`}
                        >
                          {isThisTrackPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left select-none">
                        <div>
                          <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-tight line-clamp-1">
                            {track.title}
                          </h4>
                          <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-widest mt-0.5">
                            {track.producer}
                          </p>
                        </div>
                        <button
                          onClick={() => openLicenseModal(track)}
                          className="w-full flex items-center justify-center gap-1.5 rounded bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-foreground hover:text-primary-foreground font-mono text-[9px] tracking-wider font-bold py-2 mt-2 transition-all cursor-pointer"
                        >
                          COMPRAR {track.price}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

            {/* Column 2 (Scrolls DOWN) */}
            <div className="scroll-col-down flex flex-col">
              
              {/* Group 1 */}
              <div className="flex flex-col gap-6 pb-6 shrink-0">
                {col2Tracks.map((track) => {
                  const isThisTrackPlaying = currentTrackId === track.id && isPlaying
                  return (
                    <div 
                      key={`${track.id}-g1`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-950/40 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 hover:shadow-primary/5"
                    >
                      <img 
                        src={track.img} 
                        alt={track.title} 
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className={`size-12 rounded-full flex items-center justify-center border shadow-xl transition-all duration-300 cursor-pointer ${
                            isThisTrackPlaying
                              ? "bg-primary text-primary-foreground border-primary scale-110"
                              : "bg-black/90 text-foreground border-white/20 hover:border-primary hover:text-primary hover:scale-110"
                          }`}
                        >
                          {isThisTrackPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left select-none">
                        <div>
                          <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-tight line-clamp-1">
                            {track.title}
                          </h4>
                          <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-widest mt-0.5">
                            {track.producer}
                          </p>
                        </div>
                        <button
                          onClick={() => openLicenseModal(track)}
                          className="w-full flex items-center justify-center gap-1.5 rounded bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-foreground hover:text-primary-foreground font-mono text-[9px] tracking-wider font-bold py-2 mt-2 transition-all cursor-pointer"
                        >
                          COMPRAR {track.price}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Group 2 (Duplicate for Seamless Loop) */}
              <div className="flex flex-col gap-6 pb-6 shrink-0">
                {col2Tracks.map((track) => {
                  const isThisTrackPlaying = currentTrackId === track.id && isPlaying
                  return (
                    <div 
                      key={`${track.id}-g2`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-950/40 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 hover:shadow-primary/5"
                    >
                      <img 
                        src={track.img} 
                        alt={track.title} 
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className={`size-12 rounded-full flex items-center justify-center border shadow-xl transition-all duration-300 cursor-pointer ${
                            isThisTrackPlaying
                              ? "bg-primary text-primary-foreground border-primary scale-110"
                              : "bg-black/90 text-foreground border-white/20 hover:border-primary hover:text-primary hover:scale-110"
                          }`}
                        >
                          {isThisTrackPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left select-none">
                        <div>
                          <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-tight line-clamp-1">
                            {track.title}
                          </h4>
                          <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-widest mt-0.5">
                            {track.producer}
                          </p>
                        </div>
                        <button
                          onClick={() => openLicenseModal(track)}
                          className="w-full flex items-center justify-center gap-1.5 rounded bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-foreground hover:text-primary-foreground font-mono text-[9px] tracking-wider font-bold py-2 mt-2 transition-all cursor-pointer"
                        >
                          COMPRAR {track.price}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

            {/* Column 3 (Scrolls UP) */}
            <div className="scroll-col-up flex flex-col hidden sm:flex">
              
              {/* Group 1 */}
              <div className="flex flex-col gap-6 pb-6 shrink-0">
                {col3Tracks.map((track) => {
                  const isThisTrackPlaying = currentTrackId === track.id && isPlaying
                  return (
                    <div 
                      key={`${track.id}-g1`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-950/40 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 hover:shadow-primary/5"
                    >
                      <img 
                        src={track.img} 
                        alt={track.title} 
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className={`size-12 rounded-full flex items-center justify-center border shadow-xl transition-all duration-300 cursor-pointer ${
                            isThisTrackPlaying
                              ? "bg-primary text-primary-foreground border-primary scale-110"
                              : "bg-black/90 text-foreground border-white/20 hover:border-primary hover:text-primary hover:scale-110"
                          }`}
                        >
                          {isThisTrackPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left select-none">
                        <div>
                          <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-tight line-clamp-1">
                            {track.title}
                          </h4>
                          <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-widest mt-0.5">
                            {track.producer}
                          </p>
                        </div>
                        <button
                          onClick={() => openLicenseModal(track)}
                          className="w-full flex items-center justify-center gap-1.5 rounded bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-foreground hover:text-primary-foreground font-mono text-[9px] tracking-wider font-bold py-2 mt-2 transition-all cursor-pointer"
                        >
                          COMPRAR {track.price}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Group 2 (Duplicate for Seamless Loop) */}
              <div className="flex flex-col gap-6 pb-6 shrink-0">
                {col3Tracks.map((track) => {
                  const isThisTrackPlaying = currentTrackId === track.id && isPlaying
                  return (
                    <div 
                      key={`${track.id}-g2`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-950/40 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 hover:shadow-primary/5"
                    >
                      <img 
                        src={track.img} 
                        alt={track.title} 
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className={`size-12 rounded-full flex items-center justify-center border shadow-xl transition-all duration-300 cursor-pointer ${
                            isThisTrackPlaying
                              ? "bg-primary text-primary-foreground border-primary scale-110"
                              : "bg-black/90 text-foreground border-white/20 hover:border-primary hover:text-primary hover:scale-110"
                          }`}
                        >
                          {isThisTrackPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left select-none">
                        <div>
                          <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-tight line-clamp-1">
                            {track.title}
                          </h4>
                          <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-widest mt-0.5">
                            {track.producer}
                          </p>
                        </div>
                        <button
                          onClick={() => openLicenseModal(track)}
                          className="w-full flex items-center justify-center gap-1.5 rounded bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-foreground hover:text-primary-foreground font-mono text-[9px] tracking-wider font-bold py-2 mt-2 transition-all cursor-pointer"
                        >
                          COMPRAR {track.price}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
