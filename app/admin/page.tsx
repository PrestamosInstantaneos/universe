"use client"

import React, { useState, useEffect } from "react"
import { useCart } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Upload, Music, Image as ImageIcon, Loader2, ShieldAlert, CheckCircle2, Lock } from "lucide-react"

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const { user, logoutUser, refreshCatalog } = useCart()

  // Form fields
  const [title, setTitle] = useState("")
  const [producer, setProducer] = useState("FRZN SOUND")
  const [price, setPrice] = useState("29.99")
  const [bpm, setBpm] = useState("120")
  const [key, setKey] = useState("")
  const [tags, setTags] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  // Status
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !producer || !price || !bpm || !key || !tags || !imageFile || !audioFile) {
      setStatus("error")
      setStatusMessage("Todos los campos y archivos son requeridos.")
      return
    }

    setStatus("loading")
    setStatusMessage("Leyendo archivos y convirtiendo...")

    try {
      const imageResult = await readFileAsBase64(imageFile)
      const audioResult = await readFileAsBase64(audioFile)

      setStatusMessage("Subiendo archivos a Google Drive y Sheets...")

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
        setStatusMessage("¡Beat subido exitosamente! Ya está disponible en la tienda.")
        // Refrescar catálogo dinámicamente
        await refreshCatalog()
        // Reset campos no fijos
        setTitle("")
        setKey("")
        setTags("")
        setImageFile(null)
        setAudioFile(null)
      } else {
        throw new Error(result.message || "Error al subir el beat.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Ocurrió un error inesperado al subir el beat.")
    }
  }

  // Render helpers
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
      user.email === "cienc.dev@gmail.com"

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
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Encabezado */}
        <div className="border-b border-white/10 pb-6 mb-8 text-left">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase font-bold">[ ADMIN CONTROL ]</span>
          <h1 className="font-heading text-3xl font-black tracking-[-0.02em] text-foreground sm:text-4xl mt-1 uppercase">
            Subir nuevo beat
          </h1>
          <p className="font-mono text-[10px] text-foreground/45 uppercase tracking-wider mt-2">
            CONECTADO COMO: <span className="text-foreground/80 font-bold">{user.name}</span> ({user.email})
          </p>
        </div>

        {/* Estado */}
        {status === "success" && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded mb-6 font-mono text-xs uppercase tracking-wide">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded mb-6 font-mono text-xs uppercase tracking-wide">
            <ShieldAlert className="size-5 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Files inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Cover art image */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Imagen de Portada (JPG/PNG)</label>
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
                    <p className="font-mono text-[10px] text-foreground/60">Selecciona o arrastra la portada</p>
                    <p className="font-mono text-[8px] text-foreground/30 uppercase tracking-wide">Imagen Cuadrada Recomendada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audio File */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Archivo de Audio (MP3/WAV)</label>
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
                    <p className="font-mono text-[10px] text-foreground/60">Selecciona o arrastra el beat</p>
                    <p className="font-mono text-[8px] text-foreground/30 uppercase tracking-wide">Formato MP3, WAV</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
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
