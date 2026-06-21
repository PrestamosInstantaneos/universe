"use client"

import React, { useState, useEffect } from "react"
import { X, Check, ShoppingCart, ShieldCheck, Music, Disc } from "lucide-react"
import { useCart, LICENSES, LicenseType } from "./cart-context"

export function LicenseModal() {
  const { 
    licenseModalTrack, 
    closeLicenseModal, 
    addToCart, 
    setCartOpen, 
    startCheckout,
    licenseModalDefaultType,
    licenseModalCartId,
    updateCartItemLicense
  } = useCart()

  const [selectedLicense, setSelectedLicense] = useState<LicenseType>("basic")

  // Sincronizar el estado interno de la licencia cuando cambie la predeterminada al abrirse
  useEffect(() => {
    if (licenseModalTrack) {
      setSelectedLicense(licenseModalDefaultType)
    }
  }, [licenseModalTrack, licenseModalDefaultType])

  if (!licenseModalTrack) return null

  const basePrice = parseFloat(licenseModalTrack.price.replace("$", "").trim()) || 0

  const handleAddToCartAndView = () => {
    addToCart(licenseModalTrack, selectedLicense)
    closeLicenseModal()
    setCartOpen(true)
  }

  const handleBuyNow = () => {
    addToCart(licenseModalTrack, selectedLicense)
    closeLicenseModal()
    startCheckout()
  }

  const handleUpdateInCart = () => {
    if (licenseModalCartId) {
      updateCartItemLicense(licenseModalCartId, selectedLicense)
      closeLicenseModal()
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-zinc-950/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={closeLicenseModal}
          className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/50 border border-white/10 text-foreground/75 hover:text-foreground hover:border-primary transition-all cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="size-4" />
        </button>

        {/* LEFT COLUMN: Track Info & Selected Summary */}
        <div className="w-full md:w-2/5 p-6 bg-zinc-900/40 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <span className="font-mono text-[9px] tracking-[0.2em] text-primary uppercase font-bold px-2.5 py-1 bg-primary/10 rounded border border-primary/20 inline-block">
              {licenseModalCartId ? "DETALLES DEL PRODUCTO" : "ELEGIR LICENCIA"}
            </span>

            {/* Track Album Art Cover */}
            <div className="relative aspect-square w-40 max-w-full mx-auto md:w-full border border-white/10 bg-zinc-950 rounded-lg overflow-hidden shadow-lg group">
              <img
                src={licenseModalTrack.img}
                alt={licenseModalTrack.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
            </div>

            {/* Metadata */}
            <div className="text-center md:text-left space-y-1">
              <h3 className="font-heading text-lg font-bold text-foreground uppercase tracking-tight line-clamp-1">
                {licenseModalTrack.title}
              </h3>
              <p className="font-mono text-[10px] tracking-widest text-foreground/50 uppercase">
                PRODUCIDO POR {licenseModalTrack.producer}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 pt-2 font-mono text-[9px] text-foreground/40">
                <span className="bg-zinc-800/80 px-2 py-0.5 rounded">{licenseModalTrack.bpm} BPM</span>
                <span>•</span>
                <span className="bg-zinc-800/80 px-2 py-0.5 rounded">{licenseModalTrack.key}</span>
              </div>
            </div>
          </div>

          {/* Selected License Short Description */}
          <div className="mt-6 md:mt-0 pt-6 border-t border-white/5 space-y-3">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[10px] text-foreground/45 uppercase">Precio Final</span>
              <span className="font-heading text-3xl font-black text-primary">
                ${(basePrice + (LICENSES.find(l => l.type === selectedLicense)?.priceOffset || 0)).toFixed(2)}
              </span>
            </div>
            <div className="bg-zinc-900/60 border border-white/5 rounded p-3 flex items-start gap-2.5">
              <ShieldCheck className="size-4.5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-[9px] tracking-wider text-foreground/80 font-bold uppercase">
                  Garantía FRZN
                </h4>
                <p className="font-mono text-[8px] leading-relaxed text-foreground/45 mt-0.5">
                  Archivos de audio de alta fidelidad, libres de marcas de agua por voz, listos para tu distribución.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: License Tiers & Details */}
        <div className="w-full md:w-3/5 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              {licenseModalCartId ? "Revisar/Cambiar Contrato de Licencia" : "Selecciona tu tipo de contrato"}
            </h4>
            
            {/* Grid of Licenses */}
            <div className="grid grid-cols-1 gap-2.5">
              {LICENSES.map((lic) => {
                const isSelected = selectedLicense === lic.type
                const finalPrice = basePrice + lic.priceOffset
                
                return (
                  <button
                    key={lic.type}
                    onClick={() => setSelectedLicense(lic.type)}
                    className={`flex items-center justify-between p-3.5 rounded-lg border text-left transition-all relative overflow-hidden group/item cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-foreground shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                        : "bg-zinc-900/40 border-white/5 text-foreground/70 hover:bg-zinc-900/80 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Check dot */}
                      <div className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-white/20"
                      }`}>
                        {isSelected && <Check className="size-2.5 stroke-[3]" />}
                      </div>
                      
                      <div>
                        <div className="font-heading text-xs font-bold uppercase tracking-tight group-hover/item:text-foreground transition-colors">
                          {lic.name}
                        </div>
                        <div className="font-mono text-[9px] text-foreground/45 mt-0.5">
                          {lic.format}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className={`font-heading text-sm font-black ${isSelected ? "text-primary" : "text-foreground"}`}>
                        ${finalPrice.toFixed(2)}
                      </div>
                      <div className="font-mono text-[8px] text-foreground/40 mt-0.5 uppercase tracking-wider">
                        PAGO ÚNICO
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* License Terms Section */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <h5 className="font-mono text-[9px] font-bold text-foreground/60 uppercase tracking-widest mb-2.5">
                Términos y Derechos Incluidos:
              </h5>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(LICENSES.find(l => l.type === selectedLicense)?.terms || []).map((term, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground/75 font-mono text-[9px] leading-relaxed">
                    <Check className="size-3 text-primary shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ACTION BUTTONS (Context-Dependent) */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
            {licenseModalCartId ? (
              <>
                {/* Mode: Edit Cart Item Details */}
                <button
                  onClick={closeLicenseModal}
                  className="flex-1 flex items-center justify-center gap-2 border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-foreground font-mono text-[10px] tracking-widest font-bold py-3 rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  CERRAR DETALLES
                </button>

                <button
                  onClick={handleUpdateInCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-mono text-[10px] tracking-widest font-bold py-3 rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Check className="size-4 shrink-0 stroke-[3]" />
                  ACTUALIZAR EN CARRITO
                </button>
              </>
            ) : (
              <>
                {/* Mode: Standard Purchase License Choice */}
                <button
                  onClick={handleAddToCartAndView}
                  className="flex-1 flex items-center justify-center gap-2 border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-foreground font-mono text-[10px] tracking-widest font-bold py-3 rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingCart className="size-4 text-primary" />
                  AÑADIR Y VER CARRITO
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-[10px] tracking-widest font-bold py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Disc className="size-4 fill-current animate-spin-slow shrink-0" />
                  COMPRAR AHORA (BUY NOW)
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
