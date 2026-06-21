"use client"

import React, { useState } from "react"
import { Calendar, User, ArrowRight, X, Megaphone, BookOpen, Clock } from "lucide-react"

type Post = {
  id: string
  title: string
  date: string
  tag: string
  tagColor: string
  summary: string
  content: string
  image: string
  author: string
  readTime: string
}

const NEWS_POSTS: Post[] = [
  {
    id: "post-1",
    title: "Actualización de Verano: 15 Nuevos Beats Melódicos",
    date: "20 DE JUNIO, 2026",
    tag: "NUEVO DROPEO",
    tagColor: "text-primary border-primary/30 bg-primary/5",
    summary: "El catálogo se ha actualizado con nuevos ritmos de trap y R&B. Escucha los adelantos exclusivos en la sección de drops.",
    content: "Nuestros administradores acaban de publicar un lote de 15 instrumentales exclusivos con enfoque melódico, ideales para voces R&B y trap agresivo. Además, se han ajustado los contratos de la licencia Unlimited para otorgar un 10% adicional de regalías en favor del artista en plataformas de streaming. ¡No te pierdas estos nuevos beats e impulsa tu siguiente lanzamiento hoy mismo!",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
    author: "FRZN Admin",
    readTime: "2 min de lectura"
  },
  {
    id: "post-2",
    title: "2x1 en Licencias Básicas y Premium por Tiempo Limitado",
    date: "18 DE JUNIO, 2026",
    tag: "OFERTA",
    tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
    summary: "Añade dos beats con la misma licencia a tu carrito y el descuento se aplicará automáticamente al pagar.",
    content: "Queremos apoyar a los artistas independientes este mes. Al añadir cualquier par de beats de la misma categoría de licencia (Basic o Premium) a tu carrito de compras, el sistema de FRZN descontará automáticamente el de menor valor. Esta oferta especial estará activa por tiempo limitado y finalizará el 30 de junio. ¡Aprovecha para armar tus maquetas!",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop&q=80",
    author: "Marketing FRZN",
    readTime: "3 min de lectura"
  },
  {
    id: "post-3",
    title: "Cómo registrar y monetizar tu canción usando nuestras licencias",
    date: "15 DE JUNIO, 2026",
    tag: "TUTORIAL",
    tagColor: "text-sky-400 border-sky-500/30 bg-sky-500/5",
    summary: "Una guía rápida paso a paso sobre cómo registrar tus canciones en BMI/ASCAP utilizando la licencia exclusiva de FRZN.",
    content: "Comprar un beat es solo el primer paso en tu carrera musical. En este post de ayuda, te explicamos detalladamente cómo debes rellenar los datos de escritor y editor al registrar tu tema en sociedades de gestión de derechos de autor (como BMI, ASCAP o SCD). Desglosamos las diferencias clave sobre las cláusulas de regalías contenidas en tu licencia digital para que no tengas ningún inconveniente al monetizar tus pistas en plataformas de streaming como YouTube o Spotify.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=80",
    author: "Soporte FRZN",
    readTime: "5 min de lectura"
  }
]

export function NewsSection() {
  const [activePost, setActivePost] = useState<Post | null>(null)

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
        {NEWS_POSTS.map((post) => (
          <article 
            key={post.id}
            className="group flex flex-col bg-zinc-950/40 border border-white/5 hover:border-primary/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.06)]"
          >
            {/* Post Image Banner */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
              <img 
                src={post.image} 
                alt={post.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80" />
              
              {/* Category Tag */}
              <span className={`absolute top-4 left-4 border font-mono text-[8px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${post.tagColor}`}>
                {post.tag}
              </span>
            </div>

            {/* Post Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                {/* Meta details */}
                <div className="flex items-center gap-3.5 font-mono text-[8.5px] text-foreground/45 uppercase tracking-wide">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3 text-primary/75" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3 text-foreground/35" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="font-heading text-sm sm:text-base font-bold text-foreground line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="font-sans text-[11px] leading-relaxed text-foreground/60 line-clamp-3">
                  {post.summary}
                </p>
              </div>

              {/* Read More button trigger */}
              <div className="pt-2">
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
        ))}
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
                src={activePost.image} 
                alt={activePost.title} 
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              
              <span className={`absolute bottom-4 left-6 border font-mono text-[8px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${activePost.tagColor}`}>
                {activePost.tag}
              </span>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-5 scrollbar-none">
              <div className="space-y-3">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 font-mono text-[9px] text-foreground/45 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary/75" />
                    <span>{activePost.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-primary/75" />
                    <span>POR {activePost.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-foreground/35" />
                    <span>{activePost.readTime}</span>
                  </div>
                </div>

                <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-black text-foreground uppercase tracking-tight leading-snug">
                  {activePost.title}
                </h3>
              </div>

              <div className="border-t border-white/5 pt-5">
                <p className="font-sans text-[12.5px] leading-relaxed text-foreground/80 whitespace-pre-line text-justify">
                  {activePost.content}
                </p>
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
