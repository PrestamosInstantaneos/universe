"use client"

import React, { useState, useEffect } from "react"
import { X, Search, Play, Pause, ShoppingCart, Music, SlidersHorizontal, RefreshCw } from "lucide-react"
import { useCart, Track } from "./cart-context"

export function SearchModal() {
  const {
    isSearchOpen,
    closeSearch,
    searchQuery,
    setSearchQuery,
    searchSelectedTags,
    toggleSearchTag,
    clearSearchFilters,
    openLicenseModal,
    allTracks
  } = useCart()

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

  if (!isSearchOpen) return null

  const allUniqueTags = Array.from(
    new Set(allTracks.flatMap(t => t.tags.map(tag => tag.toUpperCase())))
  ).sort()

  // Filtrar pistas dinámicamente según la consulta de texto y las etiquetas seleccionadas
  const filteredTracks = allTracks.filter(track => {
    if (track.expuesto === false) return false
    
    const query = searchQuery.toLowerCase().trim()
    const matchesQuery = !query || 
      track.title.toLowerCase().includes(query) ||
      track.producer.toLowerCase().includes(query) ||
      track.tags.some(t => t.toLowerCase().includes(query))

    const matchesTags = searchSelectedTags.length === 0 ||
      track.tags.some(t => searchSelectedTags.includes(t.toUpperCase()))

    return matchesQuery && matchesTags
  })

  const handlePlayClick = (track: Track) => {
    if (currentTrackId === track.id) {
      const event = new CustomEvent("toggle-play")
      window.dispatchEvent(event)
    } else {
      const event = new CustomEvent("play-track", { detail: track })
      window.dispatchEvent(event)
    }
  }

  const handleBuyClick = (track: Track) => {
    closeSearch()
    openLicenseModal(track)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Search Panel Container */}
      <div className="relative w-full max-w-4xl bg-zinc-950/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header close */}
        <button
          onClick={closeSearch}
          className="absolute top-4.5 right-4.5 z-10 flex size-8 items-center justify-center rounded-full bg-black/50 border border-white/10 text-foreground/75 hover:text-foreground hover:border-primary transition-all cursor-pointer"
          aria-label="Cerrar búsqueda"
        >
          <X className="size-4" />
        </button>

        {/* INPUT AREA */}
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="size-5 text-primary" />
            <h3 className="font-heading text-sm font-black uppercase tracking-wider text-foreground">
              Buscar en ALVIAL Store
            </h3>
          </div>

          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, productor, género o etiqueta..."
              className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-3 text-sm text-foreground outline-none transition-all placeholder-white/30"
              autoFocus
            />
            <Search className="absolute left-3.5 top-3.5 size-4 text-white/30" />
          </div>

          {/* DYNAMIC TAG CLOUD */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-foreground/45 uppercase">
              <span>Etiquetas de géneros populares</span>
              {(searchQuery || searchSelectedTags.length > 0) && (
                <button
                  onClick={clearSearchFilters}
                  className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="size-2.5" />
                  LIMPIAR FILTROS
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-2 scrollbar-none">
              {allUniqueTags.map((tag) => {
                const isActive = searchSelectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleSearchTag(tag)}
                    className={`font-mono text-[9px] px-2.5 py-1 rounded transition-all border cursor-pointer uppercase ${
                      isActive 
                        ? "bg-primary border-primary text-primary-foreground font-bold shadow-md shadow-primary/10" 
                        : "bg-zinc-900/40 border-white/5 text-foreground/50 hover:text-foreground hover:border-white/10"
                    }`}
                  >
                    #{tag}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* RESULTS SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-none">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-foreground/40 uppercase mb-2">
            <span>Resultados de búsqueda</span>
            <span>Encontrados: {filteredTracks.length} beats</span>
          </div>

          {filteredTracks.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Music className="size-8 text-foreground/20 mx-auto animate-pulse" />
              <p className="font-mono text-[10.5px] text-foreground/45 uppercase tracking-wider">
                No se encontraron beats que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTracks.map((track) => {
                const isThisTrackPlaying = currentTrackId === track.id && isPlaying
                return (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-3 bg-zinc-900/20 border border-white/5 hover:border-primary/20 rounded-lg transition-all"
                  >
                    {/* Cover Art and Play Hover */}
                    <div className="relative size-12 border border-white/10 bg-zinc-900 rounded overflow-hidden shrink-0 group">
                      <img src={track.img} alt={track.title} className="size-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className="size-7 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                          aria-label="Reproducir beat"
                        >
                          {isThisTrackPlaying ? <Pause className="size-3 fill-current" /> : <Play className="size-3 fill-current ml-0.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading text-xs font-bold text-foreground truncate uppercase tracking-tight">
                          {track.title}
                        </h4>
                        {track.isAd && (
                          <span className="bg-foreground/10 text-foreground/45 text-[6.5px] font-mono px-1 py-0.5 rounded uppercase font-bold shrink-0 leading-none">
                            AD
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-wide truncate mt-0.5">
                        {track.producer}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="font-mono text-[7.5px] text-foreground/35 bg-zinc-800/40 px-1 rounded uppercase">
                          {track.bpm} BPM
                        </span>
                        <span className="font-mono text-[7.5px] text-foreground/35 bg-zinc-800/40 px-1 rounded uppercase">
                          {track.key}
                        </span>
                        {track.tags.map((tag) => (
                          <span 
                            key={tag} 
                            onClick={() => toggleSearchTag(tag)}
                            className={`font-mono text-[7px] px-1 py-0.5 rounded cursor-pointer transition-colors ${
                              searchSelectedTags.includes(tag.toUpperCase())
                                ? "bg-primary/20 text-primary border border-primary/30 font-bold"
                                : "bg-zinc-900/50 text-foreground/30 border border-white/5 hover:text-foreground"
                            }`}
                          >
                            #{tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions and Price */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handlePlayClick(track)}
                        className={`hidden sm:flex size-8.5 items-center justify-center rounded border transition-colors cursor-pointer ${
                          isThisTrackPlaying
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-card/40 border-border text-foreground/60 hover:text-foreground hover:border-primary"
                        }`}
                        aria-label="Escuchar"
                      >
                        {isThisTrackPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                      </button>

                      <button
                        onClick={() => handleBuyClick(track)}
                        className="flex items-center justify-center gap-1 bg-primary text-primary-foreground hover:bg-primary/95 font-mono text-[9px] tracking-wider font-bold px-3 py-2 rounded transition-all cursor-pointer shadow-md shadow-primary/10"
                      >
                        <ShoppingCart className="size-3" />
                        {track.price}
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/20 text-center">
          <p className="font-mono text-[8px] text-foreground/30 uppercase tracking-widest leading-none">
            💡 Consejo: Haz clic en cualquier etiqueta (#) para filtrar beats por su género
          </p>
        </div>

      </div>
    </div>
  )
}
