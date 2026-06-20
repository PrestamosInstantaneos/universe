"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, ShoppingCart, Music, Layers, Disc, Download, ChevronLeft, ChevronRight } from "lucide-react"

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
  isAd?: boolean
  hasDownload?: boolean
  emoji?: string
}

const TRACKS: Track[] = [
  {
    id: "1",
    img: "/images/artist-1.png",
    title: "Hard melodic free...",
    producer: "nToucan",
    tags: ["TRAP", "NEÓN"],
    bpm: 140,
    key: "G# Minor",
    price: "$10.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    isAd: true
  },
  {
    id: "2",
    img: "/images/artist-2.png",
    title: "Lüh rich (Yeat x Ke...",
    producer: "LokernG",
    tags: ["R&B"],
    bpm: 95,
    key: "C Major",
    price: "$9.95",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    isAd: true
  },
  {
    id: "3",
    img: "/images/artist-3.png",
    title: "[FREE] DARK MEL...",
    producer: "Onibur",
    tags: ["DRILL", "808"],
    bpm: 142,
    key: "D# Minor",
    price: "$25.00",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    isAd: true,
    hasDownload: true
  },
  {
    id: "4",
    img: "/images/artist-4.png",
    title: "200 Beats For $50...",
    producer: "markk aylin",
    tags: ["AFROBEATS"],
    bpm: 110,
    key: "A Minor",
    price: "$49.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    emoji: "🔥"
  },
  {
    id: "5",
    img: "/images/artist-5.png",
    title: "HURRICANE - 1+4 F...",
    producer: "Gotenkeys",
    tags: ["WAVE"],
    bpm: 128,
    key: "F Minor",
    price: "$50.00",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    emoji: "🌀",
    hasDownload: true
  },
  {
    id: "6",
    img: "/images/artist-6.png",
    title: "\"Arrest\" | 2+3 FREE | Tra...",
    producer: "junkey",
    tags: ["HOUSE"],
    bpm: 124,
    key: "A# Minor",
    price: "$44.95",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "7",
    img: "/images/artist-7.png",
    title: "ICEFIELD BLUE",
    producer: "FRZN SOUND",
    tags: ["REGGAETÓN"],
    bpm: 98,
    key: "E Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    hasDownload: true
  },
  {
    id: "8",
    img: "/images/artist-8.png",
    title: "POLAR WHITE",
    producer: "FRZN SOUND",
    tags: ["BOOM BAP"],
    bpm: 90,
    key: "B Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
]

const TRIPLED_TRACKS = [...TRACKS, ...TRACKS, ...TRACKS]

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

  // Estados del carrusel interactivo continuo
  const [isDraggingContainer, setIsDraggingContainer] = useState<boolean>(false)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const containerDragStartX = useRef<number>(0)
  const containerDragStartScrollLeft = useRef<number>(0)
  const dragDistance = useRef<number>(0)

  // Pausa temporal del autoplay ante interacción y reanudación a los 6 segundos
  const triggerTempPause = () => {
    setIsPaused(true)
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 6000)
  }

  // Limpiar temporizador de reanudación al desmontar
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [])

  // Inicializar scrollLeft al centro (en la segunda tanda de 3) para permitir loop infinito bidireccional
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    
    // Esperar a que rendericen las tarjetas
    const initScroll = () => {
      const originalWidth = TRACKS.length * 224
      container.scrollLeft = originalWidth
    }

    // Retraso mínimo para asegurar el render inicial de las portadas
    const timer = setTimeout(initScroll, 50)
    return () => clearTimeout(timer)
  }, [])

  // Lógica de loop infinito al hacer scroll manual o drag
  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return
    const originalWidth = TRACKS.length * 224

    // Si pasamos del final de la segunda tanda, volvemos a la primera tanda
    if (container.scrollLeft >= originalWidth * 2) {
      container.scrollLeft = container.scrollLeft - originalWidth
    } 
    // Si bajamos del inicio de la segunda tanda, saltamos a la segunda
    else if (container.scrollLeft <= originalWidth) {
      container.scrollLeft = container.scrollLeft + originalWidth
    }
  }

  // Autoplay continuo de derecha a izquierda (loop infinito lento)
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let animationFrameId: number
    const originalWidth = TRACKS.length * 224

    const step = () => {
      // Avanzar lentamente hacia la izquierda si no hay interferencia del usuario
      if (!isPaused && !isHovering && !isDraggingContainer) {
        let nextScroll = container.scrollLeft + 0.65 // 0.65px por frame
        if (nextScroll >= originalWidth * 2) {
          nextScroll = nextScroll - originalWidth
        }
        container.scrollLeft = nextScroll
      }
      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPaused, isHovering, isDraggingContainer])

  // Drag del Contenedor del Carrusel (Arrastre de Mouse en Desktop)
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Solo botón izquierdo
    
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest("input") || target.closest("a") || target.closest(".cursor-pointer")) {
      return
    }

    const container = scrollRef.current
    if (!container) return

    setIsDraggingContainer(true)
    setIsPaused(true)
    containerDragStartX.current = e.clientX
    containerDragStartScrollLeft.current = container.scrollLeft
    dragDistance.current = 0
  }

  useEffect(() => {
    if (!isDraggingContainer) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = scrollRef.current
      if (!container) return

      const deltaX = e.clientX - containerDragStartX.current
      dragDistance.current = Math.abs(deltaX)
      container.scrollLeft = containerDragStartScrollLeft.current - deltaX
      
      triggerTempPause()
    }

    const handleMouseUp = () => {
      setIsDraggingContainer(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDraggingContainer])

  // Prevenir navegación accidental de click al arrastrar
  const handleContainerClickCapture = (e: React.MouseEvent) => {
    if (dragDistance.current > 5) {
      e.preventDefault()
      e.stopPropagation()
      dragDistance.current = 0
    }
  }

  // Escuchar eventos táctiles y de rueda para pausar autoplay temporalmente
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleTouchStart = () => {
      triggerTempPause()
    }

    const handleWheel = () => {
      triggerTempPause()
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("wheel", handleWheel, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("wheel", handleWheel)
    }
  }, [])

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
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-20 space-y-20">
      
      {/* SECCIÓN DE BEATS (RULETA DE PASOS) */}
      <div className="space-y-6">
        <div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">[ FRZN TRENDS ]</span>
          <h2 className="font-heading text-2xl font-black tracking-[-0.02em] text-foreground sm:text-3xl md:text-4xl mt-1 uppercase">
            Tracks en tendencia
          </h2>
        </div>

        {/* Contenedor del Carrusel / Ruleta */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseDown={handleContainerMouseDown}
          onClickCapture={handleContainerClickCapture}
          className={`flex gap-6 overflow-x-auto scrollbar-none py-4 px-1 ${
            isDraggingContainer ? "select-none" : ""
          }`}
          style={{ 
            WebkitOverflowScrolling: "touch",
            cursor: isDraggingContainer ? "grabbing" : "grab"
          }}
        >
          {TRIPLED_TRACKS.map((track, index) => {
            const isThisTrackPlaying = currentTrackId === track.id && isPlaying
            return (
              <article 
                key={`${track.id}-${index}`}
                className="group flex flex-col w-[200px] shrink-0"
              >
                {/* Portada cuadrada */}
                <div className="relative aspect-square overflow-hidden border border-border/80 bg-card rounded-md">
                  <img
                    src={track.img}
                    alt={track.title}
                    draggable="false"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04] pointer-events-none select-none"
                  />
                  {/* Botón de reproducción superpuesto al hacer hover */}
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlayClick(track)}
                      className={`flex size-12 items-center justify-center rounded-full transition-all border shadow-lg ${
                        isThisTrackPlaying 
                          ? "bg-primary text-primary-foreground border-primary scale-105" 
                          : "bg-black/85 text-foreground border-white/20 hover:border-primary hover:text-primary hover:scale-105"
                      }`}
                      aria-label={isThisTrackPlaying ? "Pausar" : "Reproducir"}
                    >
                      {isThisTrackPlaying ? (
                        <Pause className="size-5 fill-current" />
                      ) : (
                        <Play className="size-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Detalles del track (Título y Productor) */}
                <div className="mt-3 text-left space-y-0.5">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {track.isAd && (
                      <span className="bg-foreground/10 text-foreground/45 text-[7px] font-mono font-bold px-1 py-0.5 rounded shrink-0 leading-none">
                        AD
                      </span>
                    )}
                    {track.emoji && (
                      <span className="text-xs shrink-0">{track.emoji}</span>
                    )}
                    <h3 className="font-heading text-xs font-bold text-foreground truncate w-full uppercase tracking-tight">
                      {track.title}
                    </h3>
                  </div>
                  <p className="font-mono text-[9px] tracking-wider text-foreground/50 truncate uppercase">
                    {track.producer}
                  </p>
                </div>

                {/* Botón de compra / precio y descarga */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const event = new CustomEvent("add-to-cart", { detail: track })
                      window.dispatchEvent(event)
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-[10px] tracking-widest font-bold py-2.5 transition-colors"
                  >
                    <ShoppingCart className="size-3" />
                    {track.price}
                  </button>
                  {track.hasDownload && (
                    <button
                      onClick={() => console.log("Download preview")}
                      className="flex size-9 shrink-0 items-center justify-center rounded border border-border bg-card/40 text-foreground/60 hover:text-foreground hover:border-primary transition-colors"
                      aria-label="Descargar preview"
                    >
                      <Download className="size-3.5" />
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* SECCIÓN DE PRECIOS Y LICENCIAS (MONETIZACIÓN) */}
      <div className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">[ MONETIZACIÓN ]</span>
          <h2 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl uppercase">
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
}
