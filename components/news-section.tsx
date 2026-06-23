"use client"

import React, { useState } from "react"
import { Calendar, User, ArrowRight, X, Megaphone, BookOpen, Clock, ExternalLink } from "lucide-react"
import { useCart, NewsPost } from "./cart-context"

export function NewsSection() {
  const { news } = useCart()
  const [activePost, setActivePost] = useState<NewsPost | null>(null)

  const getTagStyles = (tag: string) => {
    const upper = (tag || "").toUpperCase()
    if (upper.includes("OFERTA") || upper.includes("DESCUENTO") || upper.includes("SALE")) {
      return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
    }
    if (upper.includes("NUEVO") || upper.includes("DROP") || upper.includes("LANZAMIENTO")) {
      return "text-primary border-primary/30 bg-primary/5"
    }
    return "text-sky-400 border-sky-500/30 bg-sky-500/5"
  }

  const getReadTime = (content: string) => {
    if (!content) return "1 min de lectura"
    const words = content.split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    return `${minutes} min de lectura`
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).toUpperCase()
    } catch {
      return dateStr
    }
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 space-y-8">
      
      {/* HEADER ROW */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-primary uppercase font-bold">[ 03 ]</span>
          <h2 className="font-heading text-xl sm:text-2xl font-black tracking-[-0.02em] text-foreground mt-1 uppercase">
            Noticias y Avisos
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-foreground/45 font-mono text-[9px] tracking-widest uppercase">
          <Megaphone className="size-3.5 text-primary" />
          <span>COMUNICADOS OFICIALES DEL ADMIN</span>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((post) => (
            <article 
              key={post.id}
              className="group flex flex-col bg-zinc-950/40 border border-white/5 hover:border-primary/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.06)]"
            >
              {/* Post Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                <img 
                  src={post.image || "/images/featured.png"} 
                  alt={post.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80" />
                
                {/* Category Tag */}
                <span className={`absolute top-4 left-4 border font-mono text-[8px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${getTagStyles(post.tag)}`}>
                  {post.tag}
                </span>
              </div>

              {/* Post Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Meta details */}
                  <div className="flex items-center gap-3.5 font-mono text-[8.5px] text-foreground/45 uppercase tracking-wide text-left">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3 text-primary/75" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3 text-foreground/35" />
                      <span>{getReadTime(post.content)}</span>
                    </div>
                  </div>

                  <h3 className="font-heading text-sm sm:text-base font-bold text-foreground line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors text-left">
                    {post.title}
                  </h3>

                  <p className="font-sans text-[11px] leading-relaxed text-foreground/60 line-clamp-3 text-left">
                    {post.description}
                  </p>
                </div>

                {/* Read More button trigger */}
                <div className="pt-2 text-left">
                  <button
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-bold text-primary hover:text-white uppercase tracking-wider transition-colors cursor-pointer group/btn"
                  >
                    <span>LEER MÁS</span>
                    <ArrowRight className="size-3 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-3 py-12 text-center text-foreground/35 font-mono text-xs uppercase tracking-widest">
            No hay comunicados disponibles
          </div>
        )}
      </div>

      {/* FULL POST DETAIL MODAL READER */}
      {activePost && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-zinc-950/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Close button */}
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4.5 right-4.5 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 border border-white/10 text-foreground/80 hover:text-foreground hover:border-primary transition-all cursor-pointer"
              aria-label="Cerrar artículo"
            >
              <X className="size-4" />
            </button>

            {/* Modal Image Header Banner */}
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-zinc-900">
              <img 
                src={activePost.image || "/images/featured.png"} 
                alt={activePost.title} 
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              
              <span className={`absolute bottom-4 left-6 border font-mono text-[8px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${getTagStyles(activePost.tag)}`}>
                {activePost.tag}
              </span>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-none text-left">
              <div className="space-y-3">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 font-mono text-[9px] text-foreground/45 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary/75" />
                    <span>{formatDate(activePost.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-primary/75" />
                    <span>POR FRZN ADMIN</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-foreground/35" />
                    <span>{getReadTime(activePost.content)}</span>
                  </div>
                </div>

                <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-black text-foreground uppercase tracking-tight leading-snug">
                  {activePost.title}
                </h3>
              </div>

              <div className="border-t border-white/5 pt-5 space-y-6">
                <p className="font-sans text-[12.5px] leading-relaxed text-foreground/80 whitespace-pre-line text-justify">
                  {activePost.content}
                </p>

                {/* Botón de Enlace si está disponible */}
                {activePost.link && (
                  <div className="pt-4 border-t border-white/5 flex justify-center">
                    <a
                      href={activePost.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-primary/40 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-[10px] tracking-widest font-bold px-6 py-3.5 rounded transition-all cursor-pointer uppercase shadow-lg shadow-primary/5"
                    >
                      Ver detalles / Visitar enlace
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-zinc-900/20 flex justify-between items-center px-6">
              <div className="flex items-center gap-2">
                <BookOpen className="size-3.5 text-primary" />
                <span className="font-mono text-[8px] text-foreground/35 uppercase tracking-widest leading-none">
                  FRZN Portal de Avisos
                </span>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="font-mono text-[9px] font-bold text-foreground/50 hover:text-white uppercase tracking-wider cursor-pointer"
              >
                Cerrar Artículo
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  )
}
