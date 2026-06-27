"use client"

import React from "react"
import { X, Download, FileText, CheckCircle2, ShoppingBag, Music, Disc } from "lucide-react"
import { useCart, CartItem } from "./cart-context"

export function DownloadsModal() {
  const { isDownloadsOpen, closeDownloads, purchasedItems, licenses } = useCart()

  if (!isDownloadsOpen) return null

  // Función para forzar la descarga de un archivo de texto simulando el Beat/Contrato
  const downloadTextFile = (filename: string, textContent: string) => {
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Generar contrato de licencia ficticio
  const generateLicenseText = (item: CartItem) => {
    const license = licenses.find(l => l.type === item.licenseType)
    const termsStr = license?.terms.map((t, idx) => `${idx + 1}. ${t}`).join("\n") || ""
    
    return `==================================================================
ALVIAL - CONTRATO DE LICENCIA COMERCIAL
==================================================================
ID del Pedido: ALVIAL-MOCK-${item.cartId.slice(-6).toUpperCase()}
Fecha: ${new Date().toLocaleDateString()}
Licenciatario: Productor Autorizado / Cliente ALVIAL
Lugar de Emisión: ALVIAL Store

------------------------------------------------------------------
INFORMACIÓN DE LA OBRA:
------------------------------------------------------------------
Título del Beat: ${item.track.title}
Productor: ${item.track.producer}
BPM: ${item.track.bpm} | Tono: ${item.track.key}
Licencia Adquirida: ${license?.name || item.licenseType}
Monto Pagado: $${item.price.toFixed(2)} USD

------------------------------------------------------------------
TÉRMINOS Y CONDICIONES DE USO:
------------------------------------------------------------------
El productor ${item.track.producer} concede al Licenciatario derechos de explotación no exclusivos (salvo que sea licencia exclusiva) bajo los siguientes términos:

${termsStr}

------------------------------------------------------------------
FIRMA Y ACEPTACIÓN:
Este acuerdo es digital y entra en vigor automáticamente al confirmarse el pago por PayPal. La alteración de los metadatos o incumplimiento de los límites invalidará esta licencia.

ALVIAL Records Inc.
==================================================================`
  }

  const handleDownloadLicense = (item: CartItem) => {
    const filename = `ALVIAL_Licencia_${item.track.title.replace(/\s+/g, "_")}_${item.licenseType}.txt`
    const content = generateLicenseText(item)
    downloadTextFile(filename, content)
  }

  const getDriveDownloadUrl = (url: string) => {
    if (!url) return ""
    if (url.startsWith("blob:") || url.startsWith("/") || url.startsWith("data:")) {
      return url
    }
    const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (dMatch && dMatch[1]) {
      return `https://docs.google.com/uc?export=download&id=${dMatch[1]}`
    }
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (idMatch && idMatch[1]) {
      return `https://docs.google.com/uc?export=download&id=${idMatch[1]}`
    }
    return url
  }

  const handleDownloadAudio = async (item: CartItem, format: "MP3" | "WAV") => {
    const originalUrl = item.track.audioUrl
    if (!originalUrl) {
      alert("Error: No hay URL de audio disponible para este track.")
      return
    }

    if (originalUrl.includes("lh3.googleusercontent.com") || originalUrl.includes("drive.google.com") || originalUrl.includes("docs.google.com")) {
      const driveDownloadUrl = getDriveDownloadUrl(originalUrl)
      window.open(driveDownloadUrl, "_blank")
      return
    }

    try {
      const response = await fetch(originalUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const ext = format.toLowerCase()
      const cleanTitle = item.track.title.replace(/\s+/g, "_")
      link.setAttribute("download", `${cleanTitle}_(${item.track.producer})_[ALVIAL_${format}].${ext}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.warn("CORS/Fetch error, falling back to window.open:", error)
      window.open(originalUrl, "_blank")
    }
  }

  const handleDownloadStems = (item: CartItem) => {
    const filename = `${item.track.title.replace(/\s+/g, "_")}_Trackout_Stems_ZIP.txt`
    const content = `==================================================================
ALVIAL TRACKOUT STEMS DESCARGA (.ZIP)
==================================================================
Beat: ${item.track.title}
Productor: ${item.track.producer}
Licencia: ${item.licenseType.toUpperCase()}

Archivos de stems individuales incluidos en el paquete virtual:
- 01_kick.wav
- 02_snare.wav
- 03_hihat.wav
- 04_perc.wav
- 05_808_bass.wav
- 06_melody_synth.wav
- 07_vocal_chops.wav
- 08_sfx.wav

* Nota: En un entorno de producción real, este botón descargaría el archivo comprimido .ZIP que contiene las pistas de audio individuales (stems) por separado para mezclar y masterizar.*
==================================================================`
    downloadTextFile(filename, content)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Downloads Panel Container */}
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={closeDownloads}
          className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/50 border border-white/10 text-foreground/75 hover:text-foreground hover:border-primary transition-all cursor-pointer"
          aria-label="Cerrar descargas"
        >
          <X className="size-4" />
        </button>

        {/* HEADER AREA */}
        <div className="p-6 border-b border-white/5 bg-zinc-900/20 text-center space-y-3">
          <div className="mx-auto size-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="size-6 fill-current text-zinc-950" />
          </div>
          
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-black tracking-tight text-foreground uppercase">
              ¡Compra procesada con éxito!
            </h3>
            <p className="font-mono text-[9px] tracking-wider text-foreground/50 uppercase">
              Tus archivos de audio de alta calidad y contratos ya están listos
            </p>
          </div>

          <div className="font-mono text-[8px] bg-zinc-900/60 border border-white/5 px-3 py-1.5 rounded inline-block text-foreground/40 uppercase">
            ID de Factura: ALVIAL-TX-{Math.floor(100000 + Math.random() * 900000)}
          </div>
        </div>

        {/* PURCHASED ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none">
          {purchasedItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShoppingBag className="size-8 text-foreground/20 mx-auto" />
              <p className="font-mono text-[10px] text-foreground/45 uppercase tracking-wide">
                No tienes compras registradas en esta sesión.
              </p>
            </div>
          ) : (
            purchasedItems.map((item, idx) => {
              const showWav = ["premium", "unlimited", "exclusive"].includes(item.licenseType)
              const showStems = ["unlimited", "exclusive"].includes(item.licenseType)
              
              return (
                <div 
                  key={`${item.cartId}-${idx}`}
                  className="bg-zinc-900/30 border border-white/5 hover:border-primary/20 rounded-lg p-4 space-y-4 transition-all"
                >
                  {/* Track Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="size-11 border border-white/10 rounded overflow-hidden bg-zinc-900 shrink-0">
                      <img src={item.track.img} alt={item.track.title} className="size-full object-cover" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-tight truncate">
                        {item.track.title}
                      </h4>
                      <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-wide truncate">
                        {item.track.producer}
                      </p>
                      <span className="inline-block font-mono text-[7px] text-emerald-400 uppercase tracking-widest bg-emerald-400/5 border border-emerald-400/10 px-1 py-0.5 rounded mt-1.5 font-bold">
                        {licenses.find(l => l.type === item.licenseType)?.name || item.licenseType}
                      </span>
                    </div>
                  </div>

                  {/* Download Action Row Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-white/5">
                    
                    {/* MP3 Audio Download */}
                    <button
                      onClick={() => handleDownloadAudio(item, "MP3")}
                      className="flex items-center justify-center gap-2 border border-white/5 bg-zinc-900/60 hover:bg-zinc-800 hover:border-primary/20 text-foreground font-mono text-[8px] tracking-wider font-bold py-2 rounded transition-all cursor-pointer"
                    >
                      <Download className="size-3 text-primary" />
                      DESCARGAR MP3
                    </button>

                    {/* WAV Audio Download */}
                    {showWav ? (
                      <button
                        onClick={() => handleDownloadAudio(item, "WAV")}
                        className="flex items-center justify-center gap-2 border border-white/5 bg-zinc-900/60 hover:bg-zinc-800 hover:border-primary/20 text-foreground font-mono text-[8px] tracking-wider font-bold py-2 rounded transition-all cursor-pointer"
                      >
                        <Download className="size-3 text-primary" />
                        DESCARGAR WAV
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 border border-transparent bg-zinc-900/25 text-zinc-600 font-mono text-[8px] tracking-wider font-bold py-2 rounded cursor-not-allowed opacity-40"
                        title="Disponible solo en licencias Premium, Unlimited y Exclusive"
                      >
                        WAV NO DISPONIBLE
                      </button>
                    )}

                    {/* STEMS Download */}
                    {showStems ? (
                      <button
                        onClick={() => handleDownloadStems(item)}
                        className="flex items-center justify-center gap-2 border border-white/5 bg-zinc-900/60 hover:bg-zinc-800 hover:border-primary/20 text-foreground font-mono text-[8px] tracking-wider font-bold py-2 rounded transition-all cursor-pointer"
                      >
                        <Download className="size-3 text-primary" />
                        TRACKOUT STEMS
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 border border-transparent bg-zinc-900/25 text-zinc-600 font-mono text-[8px] tracking-wider font-bold py-2 rounded cursor-not-allowed opacity-40"
                        title="Disponible solo en licencias Unlimited y Exclusive"
                      >
                        STEMS NO DISPONIBLES
                      </button>
                    )}

                    {/* License Contract Download */}
                    <button
                      onClick={() => handleDownloadLicense(item)}
                      className="flex items-center justify-center gap-2 border border-white/5 bg-zinc-900/60 hover:bg-zinc-800 hover:border-primary/20 text-foreground font-mono text-[8px] tracking-wider font-bold py-2 rounded transition-all cursor-pointer"
                    >
                      <FileText className="size-3 text-primary" />
                      CONTRATO (.TXT)
                    </button>

                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[8px] text-foreground/45 max-w-[360px] text-center sm:text-left leading-relaxed">
            Se ha enviado un correo electrónico de confirmación junto con tu recibo de PayPal y enlaces de respaldo permanentes.
          </p>
          
          <button
            onClick={closeDownloads}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-[9px] tracking-widest font-bold px-6 py-2.5 rounded transition-all active:scale-[0.98] cursor-pointer"
          >
            VOLVER AL SITIO
          </button>
        </div>

      </div>
    </div>
  )
}
