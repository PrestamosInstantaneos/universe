"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ShoppingCart, Music } from "lucide-react"

type TrackData = {
  id: string
  title: string
  producer: string
  img: string
  audioUrl: string
  price: string
}

export function AudioPlayer() {
  const [track, setTrack] = useState<TrackData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLInputElement | null>(null)

  // 1. Escuchar los eventos de la aplicación
  useEffect(() => {
    const handlePlayTrack = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        const newTrack = customEvent.detail as TrackData
        setTrack(newTrack)
        setIsPlaying(true)
        
        // Cargar audio en la etiqueta nativa si ya existe
        if (audioRef.current) {
          audioRef.current.src = newTrack.audioUrl
          audioRef.current.load()
          // Intentar reproducir (las políticas del navegador requieren interacción del usuario, lo cual se cumple al hacer clic en Play)
          audioRef.current.play().catch((err) => {
            console.warn("Autoplay blocked or playback error: ", err)
          })
        }
      }
    }

    const handleTogglePlay = () => {
      if (!audioRef.current || !track) return
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch((err) => console.warn(err))
        setIsPlaying(true)
      }
    }

    window.addEventListener("play-track", handlePlayTrack)
    window.addEventListener("toggle-play", handleTogglePlay)

    return () => {
      window.removeEventListener("play-track", handlePlayTrack)
      window.removeEventListener("toggle-play", handleTogglePlay)
    }
  }, [track, isPlaying])

  // 2. Emitir el estado del audio hacia la aplicación
  useEffect(() => {
    if (track) {
      const event = new CustomEvent("audio-status", {
        detail: {
          trackId: track.id,
          isPlaying: isPlaying
        }
      })
      window.dispatchEvent(event)
    }
  }, [track, isPlaying])

  // 3. Controlar el elemento de audio nativo
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [track])

  // Controlar volumen y silencio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handlePlayPause = () => {
    if (!audioRef.current || !track) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((err) => console.warn(err))
      setIsPlaying(true)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const newTime = parseFloat(e.target.value)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!track) return null // No renderizar si no hay canción cargada

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-border/80 backdrop-blur-md text-foreground transition-all duration-300 py-3.5 px-4 md:px-8">
      {/* Elemento de audio HTML5 oculto */}
      <audio ref={audioRef} />

      <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4">
        
        {/* LADO IZQUIERDO: Información del Beat + Botón de Compra */}
        <div className="flex items-center gap-2.5 w-auto flex-initial min-w-0 sm:w-1/4 sm:min-w-[200px]">
          <div className="relative size-10 overflow-hidden border border-border bg-card shrink-0">
            <img src={track.img} alt={track.title} className="size-full object-cover" />
          </div>
          <div className="hidden sm:block overflow-hidden mr-2">
            <h4 className="font-heading text-xs font-bold truncate uppercase tracking-tight text-foreground">
              {track.title}
            </h4>
            <p className="font-mono text-[9px] tracking-wider truncate text-foreground/50 uppercase mt-0.5">
              {track.producer}
            </p>
          </div>
          <button 
            className="flex items-center gap-1.5 shrink-0 rounded bg-primary/10 border border-primary/20 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-[9px] tracking-widest font-bold px-3 py-1.5 transition-all"
            onClick={() => {
              const event = new CustomEvent("add-to-cart", { detail: track })
              window.dispatchEvent(event)
            }}
          >
            <ShoppingCart className="size-3" />
            {track.price}
          </button>
        </div>

        {/* LADO CENTRAL: Controles del reproductor y Barra de progreso */}
        <div className="flex flex-col items-center flex-1 max-w-xl">
          <div className="flex items-center gap-5">
            {/* Retroceder (Simulado) */}
            <button className="text-foreground/40 hover:text-foreground transition-colors" aria-label="Anterior">
              <SkipBack className="size-4" />
            </button>
            {/* Play / Pause Principal */}
            <button
              onClick={handlePlayPause}
              className="flex size-9 items-center justify-center rounded-full bg-foreground text-background hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current ml-0.5" />
              )}
            </button>
            {/* Avanzar (Simulado) */}
            <button className="text-foreground/40 hover:text-foreground transition-colors" aria-label="Siguiente">
              <SkipForward className="size-4" />
            </button>
          </div>

          {/* Barra de progreso de la pista */}
          <div className="w-full flex items-center gap-3 mt-2">
            <span className="font-mono text-[9px] text-foreground/50 w-7 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              ref={progressBarRef}
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary border-none outline-none focus:ring-0 [&::-webkit-slider-runnable-track]:bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <span className="font-mono text-[9px] text-foreground/50 w-7 text-left">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* LADO DERECHO: Control de Volumen */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Silenciar"
          >
            {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value))
              setIsMuted(false)
            }}
            className="w-20 h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary border-none outline-none focus:ring-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
        </div>

      </div>
    </div>
  )
}
