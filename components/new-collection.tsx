"use client"

import { useState, useEffect } from "react"
import { Play, Pause, ShoppingCart, Music, Layers, Disc, CircleHelp } from "lucide-react"

type Track = {
  id: string
  img: string
  title: string
  producer: string
  tags: string[]
  bpm: number
  key: string
  price: string
  audioUrl: string
}

const TRACKS: Track[] = [
  {
    id: "1",
    img: "/images/artist-1.png",
    title: "AURORA SILVER",
    producer: "FRZN SOUND",
    tags: ["TRAP", "NEÓN", "808"],
    bpm: 140,
    key: "G# Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "2",
    img: "/images/artist-2.png",
    title: "DIRECT SILVER",
    producer: "FRZN SOUND",
    tags: ["R&B", "CHILL"],
    bpm: 95,
    key: "C Major",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "3",
    img: "/images/artist-3.png",
    title: "STEALTH BLACK",
    producer: "FRZN SOUND",
    tags: ["DRILL", "HEAVY", "808"],
    bpm: 142,
    key: "D# Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "4",
    img: "/images/artist-4.png",
    title: "GLACIER WHITE",
    producer: "FRZN SOUND",
    tags: ["AFROBEATS", "SUMMER"],
    bpm: 110,
    key: "A Minor",
    price: "$39.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "5",
    img: "/images/artist-5.png",
    title: "POLAR GLOSS",
    producer: "FRZN SOUND",
    tags: ["WAVE", "SYNTH"],
    bpm: 128,
    key: "F Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: "6",
    img: "/images/artist-6.png",
    title: "STEALTH NAVY",
    producer: "FRZN SOUND",
    tags: ["HOUSE", "CLUB"],
    bpm: 124,
    key: "A# Minor",
    price: "$34.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "7",
    img: "/images/artist-7.png",
    title: "ICEFIELD BLUE",
    producer: "FRZN SOUND",
    tags: ["REGGAETÓN", "LATIN"],
    bpm: 98,
    key: "E Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "8",
    img: "/images/artist-8.png",
    title: "POLAR WHITE",
    producer: "FRZN SOUND",
    tags: ["BOOM BAP", "CLASSIC"],
    bpm: 90,
    key: "B Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
]

const LICENSES = [
  {
    name: "LICENCIA BÁSICA",
    price: "$29.99",
    type: "MP3 SOLAMENTE",
    features: [
      "Distribución hasta 2,000 copias",
      "500,000 reproducciones de audio",
      "Uso no exclusivo",
      "Ideal para artistas independientes comenzando"
    ]
  },
  {
    name: "LICENCIA PREMIUM",
    price: "$49.99",
    type: "WAV + MP3",
    features: [
      "Distribución hasta 10,000 copias",
      "1,000,000 reproducciones de audio",
      "Uso no exclusivo",
      "Archivos de alta calidad para masterizar"
    ],
    featured: true
  },
  {
    name: "LICENCIA ILIMITADA",
    price: "$99.99",
    type: "STEMS + WAV + MP3",
    features: [
      "Distribución ilimitada",
      "Reproducciones ilimitadas",
      "Uso no exclusivo",
      "Pistas por separado (Stems) para mezcla profesional"
    ]
  },
  {
    name: "ADQUISICIÓN EXCLUSIVA",
    price: "CONTACTAR",
    type: "PROPIEDAD TOTAL",
    features: [
      "Propiedad total de la producción",
      "Retirado del catálogo (nadie más lo compra)",
      "Derechos ilimitados de monetización y radio",
      "Acuerdo legal firmado por el productor"
    ]
  }
]

export function NewCollection() {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

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

  // Disparar reproducción del track
  const handlePlayClick = (track: Track) => {
    if (currentTrackId === track.id) {
      // Toggle play/pause del mismo track
      const event = new CustomEvent("toggle-play")
      window.dispatchEvent(event)
    } else {
      // Cargar y reproducir un nuevo track
      const event = new CustomEvent("play-track", {
        detail: {
          id: track.id,
          title: track.title,
          producer: track.producer,
          img: track.img,
          audioUrl: track.audioUrl,
          price: track.price
        }
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-20 space-y-20">
      
      {/* SECCIÓN DE BEATS */}
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">[ FRZN TRENDS ]</span>
            <h2 className="font-heading text-3xl font-black tracking-[-0.02em] text-foreground md:text-4xl mt-1 uppercase">
              Tracks en tendencia
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-foreground/50 uppercase">ORDENAR POR: POPULARES</span>
          </div>
        </div>

        {/* Lista de Beats interactivos (Fila por Fila, estilo Beatstars) */}
        <div className="border border-border/60 bg-card/10 divide-y divide-border/40 overflow-hidden rounded-lg">
          {TRACKS.map((track, index) => {
            const isThisTrackPlaying = currentTrackId === track.id && isPlaying
            return (
              <div 
                key={track.id} 
                className={`group flex flex-col md:flex-row md:items-center gap-4 p-4 transition-all duration-300 ${
                  currentTrackId === track.id ? "bg-primary/5" : "hover:bg-card/25"
                }`}
              >
                {/* Posición y botón play */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-xs text-foreground/30 w-5 text-center">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => handlePlayClick(track)}
                    className={`flex size-10 items-center justify-center rounded-full transition-all border ${
                      isThisTrackPlaying 
                        ? "bg-primary text-primary-foreground border-primary scale-105" 
                        : "bg-card/50 text-foreground/80 border-border hover:border-primary hover:text-primary hover:bg-card"
                    }`}
                    aria-label={isThisTrackPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isThisTrackPlaying ? (
                      <Pause className="size-4.5 fill-current" />
                    ) : (
                      <Play className="size-4.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Portada e información */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative size-12 overflow-hidden border border-border bg-card shrink-0">
                    <img
                      src={track.img}
                      alt={track.title}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                      {track.title}
                    </h3>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-foreground/50 uppercase mt-0.5">
                      {track.producer}
                    </p>
                  </div>
                </div>

                {/* Detalles técnicos (BPM, Tono) */}
                <div className="flex items-center gap-8 shrink-0 font-mono text-[11px] text-foreground/70">
                  <div className="flex items-center gap-1.5 w-20">
                    <Disc className="size-3.5 text-foreground/40 shrink-0" />
                    <span>{track.bpm} <span className="text-foreground/45 text-[9px]">BPM</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 w-24">
                    <Music className="size-3.5 text-foreground/40 shrink-0" />
                    <span>{track.key}</span>
                  </div>
                </div>

                {/* Tags de género */}
                <div className="flex flex-wrap gap-2 shrink-0 md:w-60">
                  {track.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="font-mono text-[9px] tracking-widest text-foreground/60 border border-border/80 bg-card/30 px-2 py-0.5 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Comprar / Monetización */}
                <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
                  <span className="font-mono text-sm font-bold text-foreground pr-2">
                    {track.price}
                  </span>
                  <button
                    onClick={() => {
                      const event = new CustomEvent("add-to-cart", { detail: track })
                      window.dispatchEvent(event)
                    }}
                    className="flex items-center gap-2 rounded bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-[10px] tracking-widest font-bold px-4.5 py-2.5 transition-colors"
                  >
                    <ShoppingCart className="size-3.5" />
                    COMPRAR
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* SECCIÓN DE PRECIOS Y LICENCIAS (MONETIZACIÓN) */}
      <div className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">[ MONETIZACIÓN ]</span>
          <h2 className="font-heading text-3xl font-black tracking-tight text-foreground uppercase">
            Planes de Licencia de Beats
          </h2>
          <p className="font-mono text-xs text-foreground/60 max-w-xl mx-auto uppercase">
            Elige la licencia perfecta para tu proyecto. Monetiza tus canciones en Spotify, Apple Music, YouTube y más.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LICENSES.map((lic) => (
            <div 
              key={lic.name}
              className={`relative flex flex-col justify-between p-6 rounded-lg border bg-card/25 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                lic.featured 
                  ? "border-primary/80 shadow-lg shadow-primary/5" 
                  : "border-border/60 hover:border-border"
              }`}
            >
              {lic.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-primary text-primary-foreground font-mono text-[9px] tracking-widest font-bold px-3 py-1 shadow uppercase">
                  Recomendado
                </span>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-heading text-xs font-black text-foreground/90 uppercase tracking-widest">
                    {lic.name}
                  </h3>
                  <p className="font-mono text-[9px] tracking-wider text-primary font-semibold uppercase">
                    {lic.type}
                  </p>
                </div>
                
                <p className="font-heading text-3xl font-black text-foreground tracking-tight">
                  {lic.price}
                </p>

                <ul className="space-y-2 pt-4 border-t border-border/40 font-mono text-[10px] tracking-wide text-foreground/75">
                  {lic.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  className={`w-full rounded font-mono text-[10px] tracking-widest font-bold py-3 transition-colors ${
                    lic.featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/95"
                      : "bg-card border border-border text-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  SELECCIONAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}>
  )
}
