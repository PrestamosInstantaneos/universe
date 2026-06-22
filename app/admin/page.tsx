"use client"

import React, { useState, useEffect } from "react"
import { useCart } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { 
  Upload, 
  Music, 
  Image as ImageIcon, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  BarChart3, 
  Library, 
  RefreshCw, 
  Users, 
  ShoppingBag, 
  ExternalLink,
  ChevronRight
} from "lucide-react"

type AdminStats = {
  totalUsers: number
  totalCartItems: number
  users: Array<{
    id: string
    email: string
    name: string
    picture: string
    dateAdded: string
  }>
  cartItems: Array<{
    email: string
    trackId: string
    title: string
    licenseType: string
    price: number
    selected: boolean
    dateAdded: string
  }>
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const { user, logoutUser, refreshCatalog, tracks, allTracks } = useCart()

  // Tab State
  const [activeTab, setActiveTab] = useState<"stats" | "upload" | "catalog">("stats")

  // Statistics State
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)

  // Upload Form fields
  const [title, setTitle] = useState("")
  const [producer, setProducer] = useState("FRZN SOUND")
  const [price, setPrice] = useState("29.99")
  const [bpm, setBpm] = useState("120")
  const [key, setKey] = useState("")
  const [tags, setTags] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  // Form submission status
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchStats = async () => {
    setLoadingStats(true)
    setStatsError(null)
    try {
      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      if (!appsScriptUrl) {
        throw new Error("La URL de Google Apps Script no está configurada en .env.local")
      }
      const response = await fetch(`${appsScriptUrl}?action=getAdminStats`)
      const result = await response.json()
      if (result.status === "success" && result.stats) {
        setStats(result.stats)
      } else {
        throw new Error(result.message || "Error al obtener estadísticas de Apps Script.")
      }
    } catch (err: any) {
      console.error("Error fetching stats:", err)
      setStatsError(err.message || "Error de conexión con Google Apps Script.")
    } finally {
      setLoadingStats(false)
    }
  }

  // Cargar estadísticas si el usuario es administrador
  useEffect(() => {
    if (mounted && user) {
      const isAuthorized =
        user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
        user.email === "music.bests.page.is@gmail.com"
      
      if (isAuthorized) {
        fetchStats()
      }
    }
  }, [mounted, user])

  const readFileAsBase64 = (file: File): Promise<{ data: string; mime: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const commaIndex = result.indexOf(",")
        const base64 = commaIndex > -1 ? result.substring(commaIndex + 1) : result
        resolve({ data: base64, mime: file.type })
      }
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !producer || !price || !bpm || !key || !tags || !imageFile || !audioFile) {
      setStatus("error")
      setStatusMessage("Todos los campos y archivos son requeridos.")
      return
    }

    setStatus("loading")
    setStatusMessage("Leyendo archivos y codificando en Base64...")

    try {
      const imageResult = await readFileAsBase64(imageFile)
      const audioResult = await readFileAsBase64(audioFile)

      setStatusMessage("Enviando archivos a Google Drive y Sheets...")

      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID

      if (!appsScriptUrl) {
        throw new Error("La URL de Google Apps Script no está configurada.")
      }
      if (!folderId) {
        throw new Error("El ID de la carpeta de Google Drive no está configurado.")
      }

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "uploadBeat",
          folderId,
          title,
          producer,
          price: parseFloat(price),
          bpm: parseInt(bpm, 10),
          key,
          tags,
          imageData: imageResult.data,
          imageMime: imageResult.mime,
          imageName: imageFile.name,
          audioData: audioResult.data,
          audioMime: audioResult.mime,
          audioName: audioFile.name,
        }),
      })

      const result = await response.json()
      if (result.status === "success") {
        setStatus("success")
        setStatusMessage("¡Beat subido exitosamente a Google Drive y Sheets!")
        
        // Refrescar catálogo
        await refreshCatalog()
        // Recargar stats
        fetchStats()

        // Reset campos no fijos
        setTitle("")
        setKey("")
        setTags("")
        setImageFile(null)
        setAudioFile(null)
      } else {
        throw new Error(result.message || "Error al registrar el beat.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Ocurrió un error inesperado al subir el beat.")
    }
  }

  // Formatear fechas cortas
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch {
      return dateStr
    }
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return (
          <div className="space-y-8">
            {/* Tarjetas Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Usuarios */}
              <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-lg text-left relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] tracking-wider text-foreground/45 uppercase font-bold">Usuarios Registrados</span>
                    <h3 className="text-3xl font-heading font-black text-foreground">
                      {loadingStats ? (
                        <Loader2 className="size-6 animate-spin text-primary" />
                      ) : (
                        stats?.totalUsers || 0
                      )}
                    </h3>
                  </div>
                  <div className="size-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Users className="size-5" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-transparent opacity-50" />
              </div>

              {/* Card 2: Items en Carrito */}
              <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-lg text-left relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] tracking-wider text-foreground/45 uppercase font-bold">Carrito Activo (Items)</span>
                    <h3 className="text-3xl font-heading font-black text-foreground">
                      {loadingStats ? (
                        <Loader2 className="size-6 animate-spin text-primary" />
                      ) : (
                        stats?.totalCartItems || 0
                      )}
                    </h3>
                  </div>
                  <div className="size-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <ShoppingBag className="size-5" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-transparent opacity-50" />
              </div>

              {/* Card 3: Beats en Catálogo */}
              <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-lg text-left relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] tracking-wider text-foreground/45 uppercase font-bold">Beats en Catálogo</span>
                    <h3 className="text-3xl font-heading font-black text-foreground">
                      {tracks.length}
                    </h3>
                  </div>
                  <div className="size-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Music className="size-5" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-transparent opacity-50" />
              </div>
            </div>

            {statsError && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded font-mono text-xs uppercase tracking-wide">
                <ShieldAlert className="size-5 shrink-0" />
                <span>{statsError}</span>
              </div>
            )}

            {/* Listas y Tablas */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-left">
              {/* Tabla 1: Usuarios */}
              <div className="xl:col-span-5 bg-zinc-950/45 border border-white/5 rounded-lg p-5 space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">
                    Ultimos Usuarios Registrados
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-white/5 text-foreground/40 text-left">
                        <th className="pb-2 font-bold uppercase">Perfil</th>
                        <th className="pb-2 font-bold uppercase">Nombre</th>
                        <th className="pb-2 font-bold uppercase">Email</th>
                        <th className="pb-2 font-bold uppercase hidden sm:table-cell">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stats && stats.users.length > 0 ? (
                        stats.users.map((u) => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={u.picture} alt="" className="size-6 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                            </td>
                            <td className="py-2.5 font-bold text-foreground truncate max-w-[100px]">{u.name}</td>
                            <td className="py-2.5 text-foreground/75 truncate max-w-[120px]">{u.email}</td>
                            <td className="py-2.5 text-foreground/40 hidden sm:table-cell">{formatDate(u.dateAdded)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-foreground/30">
                            {loadingStats ? "Cargando usuarios..." : "No hay usuarios registrados aún."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tabla 2: Items en Carritos */}
              <div className="xl:col-span-7 bg-zinc-950/45 border border-white/5 rounded-lg p-5 space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">
                    Items en Carritos Activos
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-white/5 text-foreground/40 text-left">
                        <th className="pb-2 font-bold uppercase">Usuario</th>
                        <th className="pb-2 font-bold uppercase">Beat (Track)</th>
                        <th className="pb-2 font-bold uppercase">Licencia</th>
                        <th className="pb-2 font-bold uppercase">Precio</th>
                        <th className="pb-2 font-bold uppercase hidden sm:table-cell text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stats && stats.cartItems.length > 0 ? (
                        stats.cartItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 text-foreground/80 truncate max-w-[140px] font-bold">{item.email}</td>
                            <td className="py-2.5 text-primary uppercase font-bold truncate max-w-[150px]">{item.title}</td>
                            <td className="py-2.5 uppercase text-foreground/50">{item.licenseType}</td>
                            <td className="py-2.5 text-emerald-400 font-bold">${item.price.toFixed(2)}</td>
                            <td className="py-2.5 hidden sm:table-cell text-center">
                              {item.selected ? (
                                <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  LISTO
                                </span>
                              ) : (
                                <span className="bg-zinc-500/10 text-zinc-400 text-[8px] px-1.5 py-0.5 rounded border border-zinc-500/20">
                                  PAUSADO
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-foreground/30">
                            {loadingStats ? "Cargando carrito..." : "No hay beats en carritos actualmente."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      case "upload":
        return (
          <div className="bg-zinc-950/45 border border-white/5 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="border-b border-white/5 pb-4 mb-6 text-left">
              <h3 className="font-heading text-lg font-bold text-foreground uppercase">Formulario de Carga</h3>
              <p className="font-mono text-[9px] text-foreground/45 uppercase mt-1">Sube audio y foto de portada directamente a Google Drive</p>
            </div>

            {status === "success" && (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded mb-6 font-mono text-xs uppercase tracking-wide text-left">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded mb-6 font-mono text-xs uppercase tracking-wide text-left">
                <ShieldAlert className="size-5 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Título */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Título del Beat</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. ICEFIELD BLUE"
                    disabled={status === "loading"}
                    className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none transition-colors"
                    required
                  />
                </div>

                {/* Productor */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Productor</label>
                  <input
                    type="text"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="Ej. FRZN SOUND"
                    disabled={status === "loading"}
                    className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none transition-colors"
                    required
                  />
                </div>

                {/* Precio */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Precio Base ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29.99"
                    disabled={status === "loading"}
                    className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none transition-colors"
                    required
                  />
                </div>

                {/* BPM */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">BPM</label>
                  <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                    placeholder="140"
                    disabled={status === "loading"}
                    className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none transition-colors"
                    required
                  />
                </div>

                {/* Key */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Tonalidad (Key)</label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Ej. G# Minor"
                    disabled={status === "loading"}
                    className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none transition-colors"
                    required
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Tags (Separados por comas)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Ej. TRAP, NEON, 808"
                    disabled={status === "loading"}
                    className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Files */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Image File */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Imagen de Portada</label>
                  <div className="relative group flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/30 rounded-lg p-6 transition-colors text-center cursor-pointer min-h-[140px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      disabled={status === "loading"}
                      className="absolute inset-0 size-full opacity-0 cursor-pointer"
                      required
                    />
                    {imageFile ? (
                      <div className="space-y-2">
                        <ImageIcon className="size-8 text-primary mx-auto" />
                        <p className="font-mono text-[10px] text-foreground font-bold truncate max-w-[200px]">{imageFile.name}</p>
                        <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-wide">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="size-8 text-foreground/40 mx-auto group-hover:text-primary transition-colors" />
                        <p className="font-mono text-[10px] text-foreground/60">Seleccionar portada</p>
                        <p className="font-mono text-[8px] text-foreground/30 uppercase tracking-wide">Cuadrada JPG/PNG</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio File */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Archivo de Audio</label>
                  <div className="relative group flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/30 rounded-lg p-6 transition-colors text-center cursor-pointer min-h-[140px]">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      disabled={status === "loading"}
                      className="absolute inset-0 size-full opacity-0 cursor-pointer"
                      required
                    />
                    {audioFile ? (
                      <div className="space-y-2">
                        <Music className="size-8 text-primary mx-auto" />
                        <p className="font-mono text-[10px] text-foreground font-bold truncate max-w-[200px]">{audioFile.name}</p>
                        <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-wide">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="size-8 text-foreground/40 mx-auto group-hover:text-primary transition-colors" />
                        <p className="font-mono text-[10px] text-foreground/60">Seleccionar beat de audio</p>
                        <p className="font-mono text-[8px] text-foreground/30 uppercase tracking-wide">Formato MP3/WAV</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-xs tracking-widest font-bold py-3.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {statusMessage}
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      SUBIR BEAT AL CATÁLOGO
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )
      case "catalog":
        return (
          <div className="bg-zinc-950/45 border border-white/5 rounded-lg p-5 space-y-6 text-left">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-heading text-lg font-bold text-foreground uppercase">Catálogo de Música Activo</h3>
              <p className="font-mono text-[9px] text-foreground/45 uppercase mt-1">Registros actuales en Google Sheets y Google Drive</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTracks.map((track) => (
                <div 
                  key={track.id} 
                  className="flex gap-4 p-4 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-primary/20 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={track.img} alt="" className="size-16 object-cover rounded border border-white/10 shrink-0 bg-black" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between font-mono text-[10px]">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-heading text-xs font-bold text-foreground truncate uppercase">{track.title}</h4>
                        <span className="text-emerald-400 font-bold shrink-0">{track.price}</span>
                      </div>
                      <p className="text-foreground/40 uppercase mt-0.5 text-[8px]">{track.producer}</p>
                      <div className="flex items-center gap-3 text-[8px] text-foreground/40 mt-1.5">
                        <span>{track.bpm} BPM</span>
                        <span>•</span>
                        <span>{track.key}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-2 border-t border-white/5 pt-2 text-[8px] text-primary font-bold">
                      <a href={track.audioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                        AUDIO <ExternalLink className="size-2.5" />
                      </a>
                      <a href={track.img} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                        PORTADA <ExternalLink className="size-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  // Render Access protection
  const renderAccessView = () => {
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 max-w-lg mx-auto">
          <div className="size-16 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center shadow-lg shadow-primary/5">
            <Lock className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-foreground">Acceso Restringido</h1>
          <p className="text-sm font-mono tracking-wide text-foreground/60 leading-relaxed">
            Esta es una zona de administración protegida. Por favor, inicia sesión con tu cuenta de Google utilizando el botón de la barra superior para continuar.
          </p>
        </div>
      )
    }

    const isAuthorized =
      user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      user.email === "music.bests.page.is@gmail.com"

    if (!isAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 max-w-lg mx-auto">
          <div className="size-16 rounded-full border border-red-500/30 bg-red-500/5 flex items-center justify-center shadow-lg shadow-red-500/5">
            <ShieldAlert className="size-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-foreground">No Autorizado</h1>
          <p className="text-sm font-mono tracking-wide text-foreground/60 leading-relaxed">
            Tu cuenta (<span className="text-primary font-bold">{user.email}</span>) no tiene permisos de administrador. Si eres el propietario, configura tu correo en las variables de entorno de Vercel.
          </p>
          <button
            onClick={logoutUser}
            className="border border-red-500/30 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-400 font-mono text-xs tracking-wider px-6 py-2.5 rounded-full transition-all cursor-pointer font-bold uppercase"
          >
            CERRAR SESIÓN
          </button>
        </div>
      )
    }

    return (
      <div className="max-w-[1200px] mx-auto py-12 px-6 space-y-8">
        {/* Encabezado del Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="text-left">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase font-bold">[ DASHBOARD CONTROL ]</span>
            <h1 className="font-heading text-3xl font-black tracking-[-0.02em] text-foreground sm:text-4xl mt-1 uppercase">
              Panel de Administración
            </h1>
            <p className="font-mono text-[9px] text-foreground/45 uppercase tracking-wider mt-2">
              ADMIN: <span className="text-foreground/80 font-bold">{user.name}</span> ({user.email})
            </p>
          </div>

          {/* Botón Refrescar Estadísticas */}
          <button
            onClick={fetchStats}
            disabled={loadingStats}
            className="inline-flex items-center gap-2 border border-white/10 hover:border-primary/50 bg-zinc-950/60 hover:bg-primary/5 text-foreground hover:text-primary font-mono text-[10px] tracking-wider font-bold px-4 py-2.5 rounded transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loadingStats ? "animate-spin text-primary" : ""}`} />
            ACTUALIZAR DATOS
          </button>
        </div>

        {/* Barra de Pestañas (Tabs) */}
        <div className="flex border-b border-white/5 gap-2">
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "stats"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <BarChart3 className="size-3.5" />
            ESTADÍSTICAS
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Upload className="size-3.5" />
            SUBIR BEAT
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Library className="size-3.5" />
            BIBLIOTECA ({tracks.length})
          </button>
        </div>

        {/* Contenido Pestaña Activa */}
        <div>{renderTabContent()}</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex flex-col justify-center">
        {mounted ? renderAccessView() : null}
      </div>
      <SiteFooter />
    </main>
  )
}
