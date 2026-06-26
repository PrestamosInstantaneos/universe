"use client"

import React, { useState, useEffect } from "react"
import { useCart, Track, NewsPost, GenreItem } from "@/components/cart-context"
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
  Edit,
  PlusCircle,
  Megaphone,
  Trash2,
  X
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
  const { user, logoutUser, refreshCatalog, allTracks, allNews, licenses, logoUrl, paypalEmail, binanceId, zinliPhone, deleteBeat, genres, updateGenres } = useCart()

  // Tab State: stats | upload | catalog | news | settings
  const [activeTab, setActiveTab] = useState<"stats" | "upload" | "catalog" | "news" | "settings">("stats")

  // Logotipo y Licencias
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [localLicenses, setLocalLicenses] = useState<any[]>([])
  const [selectedLicenseType, setSelectedLicenseType] = useState<string>("basic")
  const [newConditionText, setNewConditionText] = useState<string>("")

  // Payment settings state
  const [localPaypalEmail, setLocalPaypalEmail] = useState("")
  const [localBinanceId, setLocalBinanceId] = useState("")
  const [localZinliPhone, setLocalZinliPhone] = useState("")

  useEffect(() => {
    if (paypalEmail) setLocalPaypalEmail(paypalEmail)
    if (binanceId) setLocalBinanceId(binanceId)
    if (zinliPhone) setLocalZinliPhone(zinliPhone)
  }, [paypalEmail, binanceId, zinliPhone])

  useEffect(() => {
    if (licenses) {
      setLocalLicenses(JSON.parse(JSON.stringify(licenses)))
    }
  }, [licenses])

  // Géneros Populares
  const [localGenres, setLocalGenres] = useState<GenreItem[]>([])
  const [genreFiles, setGenreFiles] = useState<{ [id: string]: File | null }>({})

  useEffect(() => {
    if (genres) {
      setLocalGenres(JSON.parse(JSON.stringify(genres)))
    }
  }, [genres])

  const updateGenreField = (id: string, field: "name" | "tag", value: string) => {
    setLocalGenres(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  // Local state copies for instant toggles
  const [localTracks, setLocalTracks] = useState<Track[]>([])
  const [localNews, setLocalNews] = useState<NewsPost[]>([])

  // Statistics State
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)

  // Upload Form fields
  const [title, setTitle] = useState("")
  const [producer, setProducer] = useState("ALVIAL")
  const [price, setPrice] = useState("29.99")
  const [bpm, setBpm] = useState("120")
  const [key, setKey] = useState("")
  const [tags, setTags] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [expuestoCheck, setExpuestoCheck] = useState(true)
  const [tendenciaCheck, setTendenciaCheck] = useState(true)
  const [dropeadoCheck, setDropeadoCheck] = useState(false)

  // Edit Modal States for Beats
  const [editingBeat, setEditingBeat] = useState<Track | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editProducer, setEditProducer] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editBpm, setEditBpm] = useState("")
  const [editKey, setEditKey] = useState("")
  const [editTags, setEditTags] = useState("")
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editExpuesto, setEditExpuesto] = useState(true)
  const [editTendencia, setEditTendencia] = useState(true)
  const [editDropeado, setEditDropeado] = useState(false)

  // News CRUD form fields
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null)
  const [newsTitle, setNewsTitle] = useState("")
  const [newsTag, setNewsTag] = useState("AVISO")
  const [newsDescription, setNewsDescription] = useState("")
  const [newsContent, setNewsContent] = useState("")
  const [newsLink, setNewsLink] = useState("")
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null)
  const [newsExpuesto, setNewsExpuesto] = useState(true)
  const [showNewsModal, setShowNewsModal] = useState(false)

  // Global action statuses
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (allTracks) setLocalTracks(allTracks)
  }, [allTracks])

  useEffect(() => {
    if (allNews) setLocalNews(allNews)
  }, [allNews])

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
        throw new Error(result.message || "Error al obtener estadísticas.")
      }
    } catch (err: any) {
      console.error("Error fetching stats:", err)
      setStatsError(err.message || "Error de conexión con Google Apps Script.")
    } finally {
      setLoadingStats(false)
    }
  }

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

  // Subir Nuevo Beat (Crear)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !producer || !price || !bpm || !key || !tags || !imageFile || !audioFile) {
      setStatus("error")
      setStatusMessage("Todos los campos y archivos son requeridos.")
      return
    }

    setStatus("loading")
    setStatusMessage("Procesando archivos...")

    try {
      const imageResult = await readFileAsBase64(imageFile)
      const audioResult = await readFileAsBase64(audioFile)

      setStatusMessage("Subiendo archivos y registrando beat...")

      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID

      if (!appsScriptUrl || !folderId) {
        throw new Error("Configuración incompleta en variables de entorno.")
      }

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
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
          expuesto: expuestoCheck,
          tendencia: tendenciaCheck,
          dropeado: dropeadoCheck
        }),
      })

      const result = await response.json()
      if (result.status === "success") {
        setStatus("success")
        setStatusMessage("¡Beat subido exitosamente!")
        await refreshCatalog()
        fetchStats()

        // Reset
        setTitle("")
        setKey("")
        setTags("")
        setImageFile(null)
        setAudioFile(null)
      } else {
        throw new Error(result.message || "Error al registrar beat.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error inesperado al subir beat.")
    }
  }

  // Toggles de Estado Rápidos
  const handleToggle = async (id: string, type: "beats" | "news", field: "expuesto" | "tendencia" | "dropeado") => {
    // Actualización optimista local
    if (type === "beats") {
      setLocalTracks(prev => prev.map(t => t.id === id ? { ...t, [field]: !t[field] } : t))
    } else {
      setLocalNews(prev => prev.map(n => n.id === id ? { ...n, [field]: !n[field] } : n))
    }

    try {
      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      if (!appsScriptUrl) throw new Error("URL de Apps Script no configurada")

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "toggleStatus",
          type,
          field,
          id
        })
      })
      const result = await response.json()
      if (result.status !== "success") {
        throw new Error(result.message || "Error en el servidor")
      }
      // Sincronizar catálogo global de forma silenciosa
      await refreshCatalog()
    } catch (err: any) {
      console.error(err)
      alert(`Error al actualizar estado: ${err.message}`)
      // Revertir cambio local
      if (type === "beats") {
        setLocalTracks(prev => prev.map(t => t.id === id ? { ...t, [field]: !t[field] } : t))
      } else {
        setLocalNews(prev => prev.map(n => n.id === id ? { ...n, [field]: !n[field] } : n))
      }
    }
  }

  // Abrir Modal de Edición de Beat
  const openEditBeatModal = (track: Track) => {
    setEditingBeat(track)
    setEditTitle(track.title)
    setEditProducer(track.producer)
    setEditPrice(track.price.replace("$", ""))
    setEditBpm(String(track.bpm))
    setEditKey(track.key)
    setEditTags(track.tags.join(", "))
    setEditExpuesto(track.expuesto !== false)
    setEditTendencia(track.tendencia !== false)
    setEditDropeado(track.dropeado === true)
    setEditImageFile(null)
  }

  // Enviar Cambios de Beat Modificado
  const handleEditBeatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBeat) return

    setStatus("loading")
    setStatusMessage("Guardando cambios del beat...")

    try {
      let imageData = ""
      let imageMime = ""
      let imageName = ""

      if (editImageFile) {
        setStatusMessage("Codificando nueva portada...")
        const imageResult = await readFileAsBase64(editImageFile)
        imageData = imageResult.data
        imageMime = imageResult.mime
        imageName = editImageFile.name
      }

      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID

      if (!appsScriptUrl) throw new Error("URL de Apps Script no configurada.")

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "updateBeat",
          id: editingBeat.id,
          folderId,
          title: editTitle,
          producer: editProducer,
          price: parseFloat(editPrice),
          bpm: parseInt(editBpm, 10),
          key: editKey,
          tags: editTags,
          imageData,
          imageMime,
          imageName,
          expuesto: editExpuesto,
          tendencia: editTendencia,
          dropeado: editDropeado
        })
      })

      const result = await response.json()
      if (result.status === "success") {
        setStatus("success")
        setStatusMessage("¡Beat actualizado correctamente!")
        setEditingBeat(null)
        await refreshCatalog()
      } else {
        throw new Error(result.message || "Error al actualizar beat.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error al modificar beat.")
    }
  }

  // Abrir Modal de Carga/Edición de Noticias
  const openCreateNews = () => {
    setEditingNews(null)
    setNewsTitle("")
    setNewsTag("NUEVO DROPEO")
    setNewsDescription("")
    setNewsContent("")
    setNewsLink("")
    setNewsImageFile(null)
    setNewsExpuesto(true)
    setShowNewsModal(true)
  }

  const openEditNews = (post: NewsPost) => {
    setEditingNews(post)
    setNewsTitle(post.title)
    setNewsTag(post.tag)
    setNewsDescription(post.description)
    setNewsContent(post.content)
    setNewsLink(post.link || "")
    setNewsImageFile(null)
    setNewsExpuesto(post.expuesto !== false)
    setShowNewsModal(true)
  }

  // Guardar Noticia (Crear o Modificar)
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setStatusMessage("Procesando noticia...")

    try {
      let imageData = ""
      let imageMime = ""
      let imageName = ""

      if (newsImageFile) {
        setStatusMessage("Cargando imagen de noticia...")
        const imageResult = await readFileAsBase64(newsImageFile)
        imageData = imageResult.data
        imageMime = imageResult.mime
        imageName = newsImageFile.name
      }

      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID

      if (!appsScriptUrl) throw new Error("URL de Apps Script no configurada.")

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: editingNews ? "updateNews" : "uploadNews",
          id: editingNews?.id || "",
          folderId,
          title: newsTitle,
          tag: newsTag,
          description: newsDescription,
          content: newsContent,
          link: newsLink,
          imageData,
          imageMime,
          imageName,
          existingImage: editingNews?.image || "",
          expuesto: newsExpuesto
        })
      })

      const result = await response.json()
      if (result.status === "success") {
        setStatus("success")
        setStatusMessage(editingNews ? "Noticia actualizada" : "Noticia publicada con éxito")
        setShowNewsModal(false)
        await refreshCatalog()
        fetchStats()
      } else {
        throw new Error(result.message || "Error al guardar noticia.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error al procesar aviso.")
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    } catch {
      return dateStr
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()

    setStatus("loading")
    setStatusMessage("Guardando configuraciones y ajustes...")

    try {
      let imageData = ""
      let imageMime = ""
      let imageName = ""

      if (logoFile) {
        setStatusMessage("Procesando imagen de logotipo...")
        const logoResult = await readFileAsBase64(logoFile)
        imageData = logoResult.data
        imageMime = logoResult.mime
        imageName = logoFile.name
      }

      setStatusMessage("Enviando ajustes al servidor...")

      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID

      if (!appsScriptUrl || !folderId) {
        throw new Error("Configuración incompleta en variables de entorno.")
      }

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "updateSettings",
          folderId,
          imageData,
          imageMime,
          imageName,
          existingLogo: logoUrl,
          paypalEmail: localPaypalEmail,
          binanceId: localBinanceId,
          zinliPhone: localZinliPhone
        })
      })

      const result = await response.json()
      if (result.status === "success") {
        setStatus("success")
        setStatusMessage("¡Configuraciones guardadas y actualizadas exitosamente!")
        setLogoFile(null)
        await refreshCatalog()
      } else {
        throw new Error(result.message || "Error al actualizar configuraciones.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error al guardar configuraciones.")
    }
  }

  const handleDeleteBeat = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este beat permanentemente del catálogo?")) return

    setStatus("loading")
    setStatusMessage("Eliminando beat...")

    try {
      const result = await deleteBeat(id)
      if (result.success) {
        setStatus("success")
        setStatusMessage(result.message || "¡Beat eliminado exitosamente del catálogo!")
        fetchStats()
      } else {
        throw new Error(result.message || "No se pudo eliminar el beat. Por favor, inténtalo de nuevo.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error al eliminar beat.")
    }
  }

  const handleResetLogo = async () => {
    if (!confirm("¿Seguro que deseas restablecer el logotipo y volver al formato de texto estándar?")) return

    setStatus("loading")
    setStatusMessage("Restableciendo logotipo...")

    try {
      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      if (!appsScriptUrl) throw new Error("URL de Apps Script no configurada.")

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "updateSettings",
          existingLogo: "",
          paypalEmail: localPaypalEmail,
          binanceId: localBinanceId,
          zinliPhone: localZinliPhone
        })
      })

      const result = await response.json()
      if (result.status === "success") {
        setStatus("success")
        setStatusMessage("¡Logotipo restablecido correctamente a texto!")
        await refreshCatalog()
      } else {
        throw new Error(result.message || "Error al restablecer logotipo.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error al restablecer logotipo.")
    }
  }

  const updateLicenseField = (type: string, field: string, value: any) => {
    setLocalLicenses(prev => prev.map(lic => {
      if (lic.type === type) {
        return { ...lic, [field]: value }
      }
      return lic
    }))
  }

  const handleAddCondition = (type: string) => {
    if (!newConditionText.trim()) return
    setLocalLicenses(prev => prev.map(lic => {
      if (lic.type === type) {
        return {
          ...lic,
          terms: [...(lic.terms || []), newConditionText.trim()]
        }
      }
      return lic
    }))
    setNewConditionText("")
  }

  const handleRemoveCondition = (type: string, index: number) => {
    setLocalLicenses(prev => prev.map(lic => {
      if (lic.type === type) {
        const updatedTerms = [...(lic.terms || [])]
        updatedTerms.splice(index, 1)
        return {
          ...lic,
          terms: updatedTerms
        }
      }
      return lic
    }))
  }

  const handleSaveLicenses = async () => {
    setStatus("loading")
    setStatusMessage("Guardando plantillas de licencias en la base de datos...")

    try {
      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      if (!appsScriptUrl) throw new Error("URL de Apps Script no configurada.")

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "updateLicenses",
          licenses: localLicenses
        })
      })

      const result = await response.json()
      if (result.status === "success") {
        setStatus("success")
        setStatusMessage("¡Plantillas de licencias guardadas y actualizadas exitosamente!")
        await refreshCatalog()
      } else {
        throw new Error(result.message || "Error al guardar licencias.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error al guardar licencias.")
    }
  }

  const handleSaveGenres = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setStatusMessage("Procesando imágenes de géneros populares...")

    try {
      const updatedList = await Promise.all(localGenres.map(async (genre) => {
        const file = genreFiles[genre.id]
        if (file) {
          const fileResult = await readFileAsBase64(file)
          return {
            ...genre,
            imageData: fileResult.data,
            imageMime: fileResult.mime,
            imageName: file.name
          }
        }
        return genre
      }))

      setStatusMessage("Actualizando géneros populares en el servidor...")
      const result = await updateGenres(updatedList)
      if (result.success) {
        setStatus("success")
        setStatusMessage("¡Géneros populares actualizados exitosamente!")
        setGenreFiles({})
      } else {
        throw new Error(result.message || "Error al actualizar los géneros populares.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setStatusMessage(err.message || "Error al guardar géneros populares.")
    }
  }

  const renderSettingsTab = () => {
    const activeLic = localLicenses.find(l => l.type === selectedLicenseType)

    return (
      <div className="space-y-8 text-left max-w-4xl mx-auto">
        <div className="border-b border-white/5 pb-3">
          <h3 className="font-heading text-lg font-bold text-foreground uppercase">Ajustes Generales y Licencias</h3>
          <p className="font-mono text-[9px] text-foreground/45 uppercase mt-1">Configura el logotipo de la discográfica y edita los contratos de las licencias</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* SECCIÓN LOGO Y PAGOS */}
          <div className="bg-zinc-950/45 border border-white/5 rounded-lg p-6 space-y-6">
            <div>
              <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest border-b border-white/5 pb-2">Ajustes de Marca y Pagos</h4>
              <p className="font-mono text-[8px] text-foreground/40 uppercase mt-1.5 leading-relaxed">
                Configura el logotipo de ALVIAL y las direcciones/identificadores receptores para las compras de beats.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center p-4 rounded bg-zinc-900/30 border border-white/5 min-h-[80px]">
                {logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={logoUrl} alt="Logo de ALVIAL" className="h-10 max-w-[200px] object-contain border border-white/10 p-1.5 rounded bg-black" />
                ) : (
                  <span className="font-heading text-xl font-black tracking-[-0.04em] text-foreground uppercase">ALVIAL</span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Subir Nuevo Logo</label>
                  <div className="relative flex items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/20 p-4 rounded text-center cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="absolute inset-0 size-full opacity-0 cursor-pointer" />
                    <span className="font-mono text-[9px] text-foreground/60 flex items-center gap-2">
                      <ImageIcon className="size-4 text-primary shrink-0" />
                      {logoFile ? logoFile.name : "Seleccionar imagen..."}
                    </span>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 p-3 rounded space-y-1.5">
                    <span className="font-mono text-[8.5px] font-bold text-amber-500 uppercase block">💡 Recomendaciones:</span>
                    <ul className="list-disc list-inside font-mono text-[8px] text-foreground/50 space-y-1 leading-normal">
                      <li>Usar formato PNG con fondo transparente</li>
                      <li>Dimensiones recomendadas: 150px de ancho x 50px de alto</li>
                    </ul>
                  </div>
                </div>

                {/* Métodos de Pago */}
                <div className="border-t border-white/5 pt-4 space-y-4 text-left">
                  <h5 className="font-heading text-[10px] font-bold text-primary uppercase tracking-wider">Configuración de Pasarelas de Pago</h5>
                  
                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold block">Correo de PayPal</label>
                    <input
                      type="email"
                      value={localPaypalEmail}
                      onChange={(e) => setLocalPaypalEmail(e.target.value)}
                      placeholder="Ej. ventas@alvial.com"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-2.5 rounded outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold block">Binance Pay ID</label>
                    <input
                      type="text"
                      value={localBinanceId}
                      onChange={(e) => setLocalBinanceId(e.target.value)}
                      placeholder="Ej. 123456789"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-2.5 rounded outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold block">Teléfono o Email de Zinli</label>
                    <input
                      type="text"
                      value={localZinliPhone}
                      onChange={(e) => setLocalZinliPhone(e.target.value)}
                      placeholder="Ej. +584123456789 o correo@zinli.com"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-2.5 rounded outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-[9.5px] tracking-wider font-bold py-2.5 rounded cursor-pointer transition-colors"
                  >
                    GUARDAR AJUSTES
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 font-mono text-[9.5px] tracking-wider font-bold px-4 rounded cursor-pointer transition-colors"
                    >
                      RESTABLECER LOGO
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* SECCIÓN LICENCIAS */}
          <div className="bg-zinc-950/45 border border-white/5 rounded-lg p-6 space-y-6">
            <div>
              <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest border-b border-white/5 pb-2">Editor de Plantillas de Licencia</h4>
              <p className="font-mono text-[8px] text-foreground/40 uppercase mt-1.5 leading-relaxed">
                Modifica el nombre, formatos, precios y añade/elimina las condiciones legales de cada contrato.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Seleccionar Plantilla</label>
                <select
                  value={selectedLicenseType}
                  onChange={(e) => { setSelectedLicenseType(e.target.value); setNewConditionText(""); }}
                  className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs font-mono text-foreground outline-none cursor-pointer"
                >
                  <option value="basic">BASIC LICENSE (MP3)</option>
                  <option value="premium">PREMIUM LICENSE (WAV)</option>
                  <option value="unlimited">UNLIMITED (WAV + STEMS)</option>
                  <option value="exclusive">EXCLUSIVE LICENSE (FULL RIGHTS)</option>
                </select>
              </div>

              {activeLic && (
                <div className="space-y-4 font-mono text-[10px] border-t border-white/5 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] text-foreground/50 uppercase font-bold">Nombre</label>
                      <input
                        type="text"
                        value={activeLic.name}
                        onChange={(e) => updateLicenseField(activeLic.type, "name", e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-foreground/50 uppercase font-bold">Formatos</label>
                      <input
                        type="text"
                        value={activeLic.format}
                        onChange={(e) => updateLicenseField(activeLic.type, "format", e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] text-foreground/50 uppercase font-bold">Precio Adicional / Offset ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={activeLic.priceOffset}
                      onChange={(e) => updateLicenseField(activeLic.type, "priceOffset", parseFloat(e.target.value) || 0)}
                      className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground outline-none"
                    />
                  </div>

                  {/* Condiciones */}
                  <div className="space-y-2">
                    <label className="text-[8px] text-foreground/50 uppercase font-bold block border-b border-white/5 pb-1">Términos y Condiciones ({activeLic.terms?.length || 0})</label>

                    {/* Lista actual */}
                    <div className="space-y-1 max-h-[160px] overflow-y-auto bg-zinc-900/20 border border-white/5 p-2 rounded text-[8.5px] leading-relaxed">
                      {activeLic.terms && activeLic.terms.length > 0 ? (
                        activeLic.terms.map((term: string, idx: number) => (
                          <div key={idx} className="flex items-start justify-between gap-3 p-1.5 hover:bg-white/5 rounded">
                            <span className="text-foreground/75 truncate">{idx + 1}. {term}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCondition(activeLic.type, idx)}
                              className="text-red-400 hover:text-red-300 font-bold uppercase shrink-0 px-1 hover:bg-red-500/10 rounded cursor-pointer"
                            >
                              ELIMINAR
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-foreground/30 py-4 uppercase">No hay términos cargados en esta plantilla.</p>
                      )}
                    </div>

                    {/* Agregar condición */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Redactar nueva condición del contrato..."
                        value={newConditionText}
                        onChange={(e) => setNewConditionText(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground placeholder-foreground/30 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCondition(activeLic.type)}
                        className="bg-primary/10 border border-primary/20 hover:bg-primary hover:text-primary-foreground text-primary px-3 rounded text-[9.5px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                      >
                        AGREGAR
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={handleSaveLicenses}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-mono text-[9.5px] tracking-widest font-bold py-3.5 rounded cursor-pointer transition-colors shadow-lg shadow-emerald-500/10"
                    >
                      <PlusCircle className="size-4 shrink-0" />
                      GUARDAR PLANTILLAS DE LICENCIAS
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* SECCIÓN GÉNEROS POPULARES */}
        <div className="bg-zinc-950/45 border border-white/5 rounded-lg p-6 space-y-6">
          <div>
            <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest border-b border-white/5 pb-2">Configuración de Géneros Populares (Hexágonos)</h4>
            <p className="font-mono text-[8px] text-foreground/40 uppercase mt-1.5 leading-relaxed">
              Personaliza el nombre, tag de búsqueda e imagen de portada para cada uno de los 7 hexágonos flotantes de la página de inicio.
              Si dejas un género vacío (sin nombre o sin tag), se mostrará como un hexágono visual grisáceo no interactivo.
            </p>
          </div>

          <form onSubmit={handleSaveGenres} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localGenres.map((genre, idx) => {
                const isSelectedFile = !!genreFiles[genre.id]
                return (
                  <div key={genre.id} className="bg-zinc-900/20 border border-white/5 p-4 rounded space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                      <span className="font-mono text-[10px] font-bold text-primary">HEXÁGONO {idx + 1}</span>
                      {genre.img && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={genre.img} alt="" className="size-6 object-cover rounded border border-white/10" />
                      )}
                    </div>

                    <div className="space-y-2 text-[10px] font-mono">
                      <div className="space-y-1">
                        <label className="text-[8px] text-foreground/50 uppercase font-bold">Nombre del Género</label>
                        <input
                          type="text"
                          value={genre.name}
                          onChange={(e) => updateGenreField(genre.id, "name", e.target.value)}
                          placeholder="Ej. Hip Hop"
                          className="w-full bg-zinc-900 border border-white/10 p-2 rounded text-xs text-foreground outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] text-foreground/50 uppercase font-bold">Tag de Búsqueda</label>
                        <input
                          type="text"
                          value={genre.tag}
                          onChange={(e) => updateGenreField(genre.id, "tag", e.target.value)}
                          placeholder="Ej. TRAP"
                          className="w-full bg-zinc-900 border border-white/10 p-2 rounded text-xs text-foreground outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] text-foreground/50 uppercase font-bold block">Foto de Portada</label>
                        <div className="relative flex items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/30 p-2 rounded text-center cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null
                              setGenreFiles(prev => ({ ...prev, [genre.id]: file }))
                            }}
                            className="absolute inset-0 size-full opacity-0 cursor-pointer"
                          />
                          <span className="text-[8.5px] text-foreground/60 flex items-center gap-1">
                            <ImageIcon className="size-3.5 text-primary shrink-0" />
                            {isSelectedFile ? genreFiles[genre.id]!.name : "Reemplazar imagen..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-[9.5px] tracking-widest font-bold py-3 px-6 rounded cursor-pointer transition-colors"
              >
                {status === "loading" && statusMessage.includes("géneros") ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    GUARDANDO GÉNEROS...
                  </>
                ) : (
                  "GUARDAR GÉNEROS POPULARES"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    )
  }

  // Render Pestaña Noticias
  const renderNewsTab = () => {
    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground uppercase">Gestión de Noticias y Comunicados</h3>
            <p className="font-mono text-[9px] text-foreground/45 uppercase mt-1">Crea y edita los posts que se visualizan en la web</p>
          </div>
          <button
            onClick={openCreateNews}
            className="flex items-center gap-2 border border-primary/50 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-[10px] tracking-widest font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
          >
            <PlusCircle className="size-3.5" />
            NUEVA NOTICIA
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localNews.map((post) => (
            <div 
              key={post.id}
              className="flex gap-4 p-4 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-primary/20 transition-all text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image || "/images/featured.png"} alt="" className="w-24 h-20 object-cover rounded border border-white/5 bg-zinc-950 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col justify-between font-mono text-[9.5px]">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-heading text-xs font-bold text-foreground uppercase truncate leading-tight">{post.title}</h4>
                    <span className="text-primary font-bold uppercase tracking-wider text-[8px] border border-primary/20 px-1 py-0.5 rounded shrink-0">
                      {post.tag}
                    </span>
                  </div>
                  <p className="text-foreground/40 mt-1 line-clamp-2 leading-relaxed text-[8.5px]">{post.description}</p>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                  {/* Interruptor Expuesto */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={post.expuesto} 
                      onChange={() => handleToggle(post.id, "news", "expuesto")}
                      className="sr-only peer"
                    />
                    <div className="w-7 h-4 bg-zinc-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary relative peer-checked:after:bg-foreground" />
                    <span className="text-[8px] text-foreground/50 uppercase font-bold">EXPUESTO</span>
                  </label>

                  <button
                    onClick={() => openEditNews(post)}
                    className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors uppercase font-bold text-[8.5px]"
                  >
                    <Edit className="size-3" />
                    EDITAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render Pestaña Biblioteca de Beats
  const renderCatalogTab = () => {
    return (
      <div className="space-y-6 text-left">
        <div className="border-b border-white/5 pb-3">
          <h3 className="font-heading text-lg font-bold text-foreground uppercase">Gestión de Catálogo de Beats</h3>
          <p className="font-mono text-[9px] text-foreground/45 uppercase mt-1">Habilita secciones y edita metadata o archivos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {localTracks.map((track) => (
            <div 
              key={track.id} 
              className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-primary/20 transition-all text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={track.img} alt="" className="size-20 object-cover rounded border border-white/10 shrink-0 bg-black mx-auto md:mx-0" />
              
              <div className="flex-1 min-w-0 flex flex-col justify-between font-mono text-[9.5px]">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-heading text-xs font-bold text-foreground truncate uppercase">{track.title}</h4>
                    <span className="text-emerald-400 font-bold shrink-0">{track.price}</span>
                  </div>
                  <p className="text-foreground/40 mt-0.5 text-[8.5px] uppercase">{track.producer}</p>
                  
                  <div className="flex items-center gap-3 text-[8.5px] text-foreground/40 mt-1.5">
                    <span>{track.bpm} BPM</span>
                    <span>•</span>
                    <span>{track.key}</span>
                  </div>
                </div>

                {/* Toggles y Botón de Edición */}
                <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-3 border-t border-white/5">
                  <div className="flex gap-4">
                    {/* Toggle Expuesto */}
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={track.expuesto !== false}
                        onChange={() => handleToggle(track.id, "beats", "expuesto")}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-3 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-zinc-500 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-primary relative" />
                      <span className="text-[7.5px] text-foreground/50 uppercase font-bold">EXPUESTO</span>
                    </label>

                    {/* Toggle Tendencias */}
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={track.tendencia !== false}
                        onChange={() => handleToggle(track.id, "beats", "tendencia")}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-3 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-zinc-500 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-primary relative" />
                      <span className="text-[7.5px] text-foreground/50 uppercase font-bold">TENDENCIA</span>
                    </label>

                    {/* Toggle Dropeados */}
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={track.dropeado === true}
                        onChange={() => handleToggle(track.id, "beats", "dropeado")}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-3 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-zinc-500 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-primary relative" />
                      <span className="text-[7.5px] text-foreground/50 uppercase font-bold">DROP</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditBeatModal(track)}
                      className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors uppercase font-bold text-[8.5px]"
                    >
                      <Edit className="size-3" />
                      EDITAR
                    </button>
                    <button
                      onClick={() => handleDeleteBeat(track.id)}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors uppercase font-bold text-[8.5px]"
                    >
                      <Trash2 className="size-3" />
                      ELIMINAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render Access control check
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
        <div className="flex border-b border-white/5 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab("stats"); setStatus("idle"); }}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "stats"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <BarChart3 className="size-3.5" />
            ESTADÍSTICAS
          </button>
          <button
            onClick={() => { setActiveTab("upload"); setStatus("idle"); }}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "upload"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Upload className="size-3.5" />
            SUBIR BEAT
          </button>
          <button
            onClick={() => { setActiveTab("catalog"); setStatus("idle"); }}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "catalog"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Library className="size-3.5" />
            BIBLIOTECA ({localTracks.length})
          </button>
          <button
            onClick={() => { setActiveTab("news"); setStatus("idle"); }}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "news"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Megaphone className="size-3.5" />
            NOTICIAS ({localNews.length})
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setStatus("idle"); }}
            className={`flex items-center gap-2 font-mono text-[10px] tracking-widest font-bold px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "settings"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Lock className="size-3.5" />
            AJUSTES / LICENCIAS
          </button>
        </div>

        {/* Notificaciones de carga / exito / error */}
        {activeTab !== "upload" && !showNewsModal && !editingBeat && (
          <>
            {status === "success" && (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded text-left font-mono text-xs uppercase tracking-wide">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-left font-mono text-xs uppercase tracking-wide">
                <ShieldAlert className="size-5 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
            {status === "loading" && (
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 text-primary p-4 rounded text-left font-mono text-xs uppercase tracking-wide">
                <Loader2 className="size-5 animate-spin shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
          </>
        )}

        {/* Contenido Pestaña Activa */}
        <div>
          {activeTab === "stats" && (
            <div className="space-y-8">
              {/* Tarjetas Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-lg text-left relative overflow-hidden group hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-wider text-foreground/45 uppercase font-bold">Usuarios Registrados</span>
                      <h3 className="text-3xl font-heading font-black text-foreground">
                        {loadingStats ? <Loader2 className="size-6 animate-spin text-primary" /> : stats?.totalUsers || 0}
                      </h3>
                    </div>
                    <div className="size-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Users className="size-5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-transparent opacity-50" />
                </div>

                <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-lg text-left relative overflow-hidden group hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-wider text-foreground/45 uppercase font-bold">Carrito Activo (Items)</span>
                      <h3 className="text-3xl font-heading font-black text-foreground">
                        {loadingStats ? <Loader2 className="size-6 animate-spin text-primary" /> : stats?.totalCartItems || 0}
                      </h3>
                    </div>
                    <div className="size-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <ShoppingBag className="size-5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-transparent opacity-50" />
                </div>

                <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-lg text-left relative overflow-hidden group hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-wider text-foreground/45 uppercase font-bold">Beats en Catálogo</span>
                      <h3 className="text-3xl font-heading font-black text-foreground">
                        {localTracks.length}
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

              {/* Tablas */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-left">
                {/* Tabla Usuarios */}
                <div className="xl:col-span-5 bg-zinc-950/45 border border-white/5 rounded-lg p-5 space-y-4">
                  <div className="border-b border-white/5 pb-3">
                    <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">Últimos Usuarios Registrados</h4>
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

                {/* Tabla Carritos */}
                <div className="xl:col-span-7 bg-zinc-950/45 border border-white/5 rounded-lg p-5 space-y-4">
                  <div className="border-b border-white/5 pb-3">
                    <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">Ítems en Carritos Activos</h4>
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
                                  <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">LISTO</span>
                                ) : (
                                  <span className="bg-zinc-500/10 text-zinc-400 text-[8px] px-1.5 py-0.5 rounded border border-zinc-500/20">PAUSADO</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-foreground/30">
                              {loadingStats ? "Cargando carritos..." : "No hay beats en carritos actualmente."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
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
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Título del Beat</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. ICEFIELD BLUE"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Productor</label>
                    <input
                      type="text"
                      value={producer}
                      onChange={(e) => setProducer(e.target.value)}
                      placeholder="Ej. ALVIAL"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Precio Base ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="29.99"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">BPM</label>
                    <input
                      type="number"
                      value={bpm}
                      onChange={(e) => setBpm(e.target.value)}
                      placeholder="140"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Tonalidad (Key)</label>
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Ej. G# Minor"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Tags (Separados por comas)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Ej. TRAP, NEON, 808"
                      className="w-full bg-zinc-900/50 border border-white/10 hover:border-white/20 focus:border-primary text-foreground font-mono text-xs p-3 rounded outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Exposición Toggles de Carga */}
                <div className="grid grid-cols-3 gap-4 border border-white/5 p-4 rounded-lg bg-zinc-900/20 text-left font-mono text-[10px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={expuestoCheck} onChange={(e) => setExpuestoCheck(e.target.checked)} className="rounded border-white/10 bg-zinc-900 text-primary focus:ring-primary" />
                    <span>EXPUESTO (WEB)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tendenciaCheck} onChange={(e) => setTendenciaCheck(e.target.checked)} className="rounded border-white/10 bg-zinc-900 text-primary focus:ring-primary" />
                    <span>TENDENCIAS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={dropeadoCheck} onChange={(e) => setDropeadoCheck(e.target.checked)} className="rounded border-white/10 bg-zinc-900 text-primary focus:ring-primary" />
                    <span>RECIÉN DROPEADO</span>
                  </label>
                </div>

                {/* File selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Imagen de Portada</label>
                    <div className="relative group flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/30 rounded-lg p-6 transition-colors text-center cursor-pointer min-h-[140px]">
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 size-full opacity-0 cursor-pointer" required />
                      {imageFile ? (
                        <div className="space-y-2">
                          <ImageIcon className="size-8 text-primary mx-auto" />
                          <p className="font-mono text-[10px] text-foreground font-bold truncate max-w-[200px]">{imageFile.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="size-8 text-foreground/40 mx-auto group-hover:text-primary transition-colors" />
                          <p className="font-mono text-[10px] text-foreground/60">Seleccionar portada</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase font-bold">Archivo de Audio</label>
                    <div className="relative group flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/30 rounded-lg p-6 transition-colors text-center cursor-pointer min-h-[140px]">
                      <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="absolute inset-0 size-full opacity-0 cursor-pointer" required />
                      {audioFile ? (
                        <div className="space-y-2">
                          <Music className="size-8 text-primary mx-auto" />
                          <p className="font-mono text-[10px] text-foreground font-bold truncate max-w-[200px]">{audioFile.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="size-8 text-foreground/40 mx-auto group-hover:text-primary transition-colors" />
                          <p className="font-mono text-[10px] text-foreground/60">Seleccionar instrumental</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-xs tracking-widest font-bold py-3.5 transition-all cursor-pointer disabled:opacity-50 rounded"
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
          )}

          {activeTab === "catalog" && renderCatalogTab()}
          {activeTab === "news" && renderNewsTab()}
          {activeTab === "settings" && renderSettingsTab()}
        </div>

        {/* MODAL DE EDICIÓN DE BEATS */}
        {editingBeat && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-zinc-950/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              <button onClick={() => setEditingBeat(null)} className="absolute top-4.5 right-4.5 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 border border-white/10 text-foreground/80 hover:text-foreground hover:border-primary transition-all cursor-pointer">
                <X className="size-4" />
              </button>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-none text-left">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-heading text-lg font-black text-foreground uppercase">Editar Beat Existente</h3>
                  <p className="font-mono text-[9px] text-foreground/45 uppercase mt-1">ID: {editingBeat.id}</p>
                </div>

                <form onSubmit={handleEditBeatSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Título</label>
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs font-mono text-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Productor</label>
                      <input type="text" value={editProducer} onChange={(e) => setEditProducer(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs font-mono text-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Precio ($)</label>
                      <input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs font-mono text-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">BPM</label>
                      <input type="number" value={editBpm} onChange={(e) => setEditBpm(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs font-mono text-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Tonalidad (Key)</label>
                      <input type="text" value={editKey} onChange={(e) => setEditKey(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs font-mono text-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Tags (separados por comas)</label>
                      <input type="text" value={editTags} onChange={(e) => setEditTags(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs font-mono text-foreground" required />
                    </div>
                  </div>

                  {/* Secciones Checkboxes de Edición */}
                  <div className="grid grid-cols-3 gap-4 border border-white/5 p-4 rounded-lg bg-zinc-900/20 font-mono text-[9px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editExpuesto} onChange={(e) => setEditExpuesto(e.target.checked)} className="rounded border-white/10 bg-zinc-900 text-primary" />
                      <span>EXPUESTO (WEB)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editTendencia} onChange={(e) => setEditTendencia(e.target.checked)} className="rounded border-white/10 bg-zinc-900 text-primary" />
                      <span>TENDENCIA</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editDropeado} onChange={(e) => setEditDropeado(e.target.checked)} className="rounded border-white/10 bg-zinc-900 text-primary" />
                      <span>DROPEADO</span>
                    </label>
                  </div>

                  {/* Carga de Nueva Portada (Opcional) */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] text-foreground/50 uppercase font-bold">Reemplazar Imagen de Portada (Opcional)</label>
                    <div className="relative flex items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/20 p-4 rounded text-center cursor-pointer">
                      <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} className="absolute inset-0 size-full opacity-0 cursor-pointer" />
                      <span className="font-mono text-[9px] text-foreground/60 flex items-center gap-2">
                        <ImageIcon className="size-4 text-primary" />
                        {editImageFile ? editImageFile.name : "Seleccionar nuevo archivo de portada para reemplazar"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-4">
                    <button type="submit" disabled={status === "loading"} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-[10px] tracking-widest font-bold py-3.5 rounded cursor-pointer disabled:opacity-50">
                      {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : "GUARDAR CAMBIOS"}
                    </button>
                    <button type="button" onClick={() => setEditingBeat(null)} className="border border-white/10 hover:bg-white/5 font-mono text-[10px] tracking-widest font-bold px-6 rounded cursor-pointer">
                      CANCELAR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CREAR / EDITAR NOTICIAS */}
        {showNewsModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-zinc-950/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              <button onClick={() => setShowNewsModal(false)} className="absolute top-4.5 right-4.5 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 border border-white/10 text-foreground/80 hover:text-foreground hover:border-primary transition-all cursor-pointer">
                <X className="size-4" />
              </button>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-none text-left">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-heading text-lg font-black text-foreground uppercase">
                    {editingNews ? "Editar Noticia o Aviso" : "Publicar Nueva Noticia / Aviso"}
                  </h3>
                  <p className="font-mono text-[9px] text-foreground/45 uppercase mt-1">Completa los campos para actualizar la sección de novedades</p>
                </div>

                <form onSubmit={handleNewsSubmit} className="space-y-4 font-mono text-[10px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-foreground/50 uppercase font-bold text-[8px]">Título del Aviso</label>
                      <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-foreground/50 uppercase font-bold text-[8px]">Categoría (Tag)</label>
                      <input type="text" value={newsTag} onChange={(e) => setNewsTag(e.target.value)} placeholder="Ej. NUEVO DROPEO, OFERTA, TUTORIAL" className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-foreground/50 uppercase font-bold text-[8px]">Resumen Breve (Summary)</label>
                    <input type="text" value={newsDescription} onChange={(e) => setNewsDescription(e.target.value)} placeholder="Ej. Breve sumario de una línea que aparece en la tarjeta..." className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground" required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-foreground/50 uppercase font-bold text-[8px]">Detalle Completo (Cuerpo del Comunicado)</label>
                    <textarea rows={4} value={newsContent} onChange={(e) => setNewsContent(e.target.value)} placeholder="Escribe el cuerpo completo de la noticia aquí..." className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground outline-none resize-none" required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-foreground/50 uppercase font-bold text-[8px]">Enlace de Redirección (Link / Opcional)</label>
                    <input type="url" value={newsLink} onChange={(e) => setNewsLink(e.target.value)} placeholder="Ej. https://url-de-compra.com o /#releases" className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded text-xs text-foreground" />
                  </div>

                  {/* Imagen y Exposición */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1.5">
                      <label className="text-foreground/50 uppercase font-bold text-[8px]">Banner de Imagen (JPG/PNG)</label>
                      <div className="relative flex items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-zinc-900/20 p-3 rounded text-center cursor-pointer">
                        <input type="file" accept="image/*" onChange={(e) => setNewsImageFile(e.target.files?.[0] || null)} className="absolute inset-0 size-full opacity-0 cursor-pointer" />
                        <span className="text-[9px] text-foreground/60 flex items-center gap-1.5">
                          <ImageIcon className="size-4 text-primary" />
                          {newsImageFile ? newsImageFile.name : (editingNews ? "Cambiar Imagen Actual" : "Seleccionar imagen")}
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer justify-end font-mono">
                      <input type="checkbox" checked={newsExpuesto} onChange={(e) => setNewsExpuesto(e.target.checked)} className="rounded border-white/10 bg-zinc-900 text-primary" />
                      <span>VISIBILIDAD ACTIVA (EXPUESTO)</span>
                    </label>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button type="submit" disabled={status === "loading"} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-[10px] tracking-widest font-bold py-3.5 rounded cursor-pointer disabled:opacity-50">
                      {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : (editingNews ? "GUARDAR CAMBIOS" : "PUBLICAR NOTICIA")}
                    </button>
                    <button type="button" onClick={() => setShowNewsModal(false)} className="border border-white/10 hover:bg-white/5 font-mono text-[10px] tracking-widest font-bold px-6 rounded cursor-pointer">
                      CANCELAR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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
