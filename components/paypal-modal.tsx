"use client"

import React, { useState } from "react"
import { Shield, Lock, ArrowLeft, RefreshCw, CheckCircle2, X } from "lucide-react"
import { useCart } from "./cart-context"

export function PaypalModal() {
  const { 
    isPaypalOpen, 
    paypalState, 
    setPaypalState, 
    closeCheckout, 
    confirmPurchase, 
    cart,
    user,
    paypalEmail,
    binanceId,
    zinliPhone
  } = useCart()

  // Estados locales de métodos
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'binance' | 'zinli' | null>(null)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [localProcessing, setLocalProcessing] = useState(false)
  const [localSuccess, setLocalSuccess] = useState(false)
  const [showPendingSuccess, setShowPendingSuccess] = useState(false)

  // Credenciales simuladas para PayPal
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  React.useEffect(() => {
    if (isPaypalOpen && user) {
      setEmail(user.email)
      setPassword("••••••••••••")
    } else if (isPaypalOpen && !user) {
      setEmail("")
      setPassword("")
    }
  }, [isPaypalOpen, user])

  React.useEffect(() => {
    if (!isPaypalOpen) {
      setSelectedMethod(null)
      setLocalProcessing(false)
      setLocalSuccess(false)
      setShowPendingSuccess(false)
    }
  }, [isPaypalOpen])

  if (!isPaypalOpen) return null

  // Calcular items seleccionados y total
  const selectedItems = cart.filter(item => item.selected)
  const total = selectedItems.reduce((sum, item) => sum + item.price, 0)

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Por favor, introduce tu correo electrónico y contraseña.")
      return
    }
    setError("")
    setPaypalState("review")
  }

  const handleConfirmPayment = () => {
    setPaypalState("processing")
    setTimeout(() => {
      setPaypalState("success")
      setTimeout(async () => {
        await confirmPurchase("paypal")
        setSelectedMethod(null)
        setShowPendingSuccess(true)
      }, 1500)
    }, 2000)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  const handleManualPaymentConfirm = () => {
    setLocalProcessing(true)
    setTimeout(() => {
      setLocalProcessing(false)
      setLocalSuccess(true)
      setTimeout(async () => {
        setLocalSuccess(false)
        await confirmPurchase(selectedMethod || "binance")
        setSelectedMethod(null)
        setShowPendingSuccess(true)
      }, 1500)
    }, 2000)
  }

  // Render Selector Screen
  const renderSelectionScreen = () => {
    if (!user) {
      return (
        <div className="p-6 md:p-8 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-6 text-center my-auto">
            <div className="mx-auto size-12 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
              <Lock className="size-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-base font-black text-foreground uppercase tracking-wider">Inicio de Sesión Requerido</h3>
              <p className="font-mono text-[9px] leading-relaxed text-foreground/50 uppercase max-w-xs mx-auto">
                Debes iniciar sesión con tu cuenta de Google en la barra superior para continuar y asegurar que tus descargas queden registradas.
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 mt-6">
            <button
              onClick={closeCheckout}
              className="w-full border border-white/10 hover:bg-white/5 text-foreground font-mono text-xs tracking-widest font-bold py-3 rounded uppercase transition-colors cursor-pointer"
            >
              Cerrar y Volver
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6 md:p-8 flex flex-col justify-between min-h-[400px]">
        <div className="space-y-6 text-center">
          <div className="space-y-1">
            <span className="font-mono text-[9px] tracking-[0.25em] text-primary uppercase font-bold">[ PAGO SEGURO ]</span>
            <h3 className="font-heading text-xl font-black text-foreground uppercase tracking-wider">Método de Pago</h3>
            <p className="font-mono text-[10px] text-foreground/45 uppercase">Seleccione cómo desea realizar su pago de ${total.toFixed(2)} USD</p>
          </div>

          <div className="space-y-3">
            {/* Opción PayPal */}
            <button
              onClick={() => { setSelectedMethod('paypal'); setPaypalState('login'); }}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-[#0079c1] hover:bg-[#0079c1]/5 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded bg-[#003087]/10 flex items-center justify-center font-black italic text-lg text-[#0079c1]">
                  PP
                </div>
                <div>
                  <span className="text-sm font-heading font-bold text-foreground block group-hover:text-[#0079c1] transition-colors">PayPal / Tarjeta</span>
                  <span className="text-[9px] font-mono text-foreground/40 uppercase">Saldo PayPal o Tarjetas de Crédito/Débito</span>
                </div>
              </div>
              <span className="text-xs font-mono text-foreground/30 font-bold group-hover:text-[#0079c1] transition-colors">➔</span>
            </button>

            {/* Opción Binance Pay */}
            <button
              onClick={() => setSelectedMethod('binance')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded bg-[#F3BA2F]/10 flex items-center justify-center font-black text-lg text-[#F3BA2F]">
                  B
                </div>
                <div>
                  <span className="text-sm font-heading font-bold text-foreground block group-hover:text-[#F3BA2F] transition-colors">Binance Pay (Cripto)</span>
                  <span className="text-[9px] font-mono text-foreground/40 uppercase">Pago inmediato con USDT / Cryptos</span>
                </div>
              </div>
              <span className="text-xs font-mono text-foreground/30 font-bold group-hover:text-[#F3BA2F] transition-colors">➔</span>
            </button>

            {/* Opción Zinli */}
            <button
              onClick={() => setSelectedMethod('zinli')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-[#9d4edd] hover:bg-[#9d4edd]/5 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded bg-[#9d4edd]/10 flex items-center justify-center font-black text-lg text-[#9d4edd]">
                  Z
                </div>
                <div>
                  <span className="text-sm font-heading font-bold text-foreground block group-hover:text-[#9d4edd] transition-colors">Zinli Wallet</span>
                  <span className="text-[9px] font-mono text-foreground/40 uppercase">Transferencia directa entre monederos Zinli</span>
                </div>
              </div>
              <span className="text-xs font-mono text-foreground/30 font-bold group-hover:text-[#9d4edd] transition-colors">➔</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex gap-4 border-t border-white/5 mt-6">
          <button
            onClick={closeCheckout}
            className="w-full border border-white/10 hover:bg-white/5 text-foreground font-mono text-xs tracking-widest font-bold py-3 rounded uppercase transition-colors cursor-pointer"
          >
            Cancelar y Volver
          </button>
        </div>
      </div>
    )
  }

  // Render Manual Payment Screen (PayPal / Binance / Zinli)
  const renderManualPayment = (method: 'paypal' | 'binance' | 'zinli') => {
    const isPaypal = method === 'paypal'
    const isBinance = method === 'binance'
    const title = isPaypal ? 'PayPal' : isBinance ? 'Binance Pay' : 'Zinli Wallet'
    const color = isPaypal ? '#0079c1' : isBinance ? '#F3BA2F' : '#9d4edd'
    const addressLabel = isPaypal 
      ? 'Correo de PayPal del Administrador' 
      : isBinance 
        ? 'Binance Pay ID del Administrador' 
        : 'Teléfono / Correo de Zinli'
    const addressVal = isPaypal 
      ? (paypalEmail || "No configurado") 
      : isBinance 
        ? (binanceId || "No configurado") 
        : (zinliPhone || "No configurado")
    
    if (localProcessing) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center font-mono min-h-[420px]">
          <RefreshCw className="size-10 animate-spin" style={{ color }} />
          <div className="space-y-1">
            <h4 className="font-bold text-foreground uppercase text-sm">Verificando transacción...</h4>
            <p className="text-[9px] text-foreground/50 uppercase leading-relaxed">
              Procesando solicitud de pago. Por favor espera.
            </p>
          </div>
        </div>
      )
    }

    if (localSuccess) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center font-mono min-h-[420px] animate-in zoom-in duration-200">
          <CheckCircle2 className="size-16 text-emerald-500 fill-emerald-500/10 animate-pulse" />
          <div className="space-y-1">
            <h4 className="font-bold text-foreground text-sm uppercase">¡Pago Registrado!</h4>
            <p className="text-[9px] text-foreground/50 uppercase">Liberando descargas...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6 md:p-8 flex flex-col justify-between min-h-[420px] text-left">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <button
              onClick={() => setSelectedMethod(null)}
              className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-foreground/60 hover:text-foreground uppercase font-bold cursor-pointer"
            >
              <ArrowLeft className="size-3" />
              Atrás
            </button>
            <div className="text-right">
              <span className="text-foreground/40 text-[9px] uppercase font-bold block tracking-wider">
                Total a Transferir
              </span>
              <span className="text-emerald-400 font-bold text-lg font-mono">
                ${total.toFixed(2)} USD
              </span>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1 text-center">
              <h3 className="font-heading text-base font-black uppercase tracking-wider text-foreground">
                Instrucciones de Pago ({title})
              </h3>
              <p className="text-[8px] text-foreground/50 uppercase">Sigue los pasos a continuación para completar tu compra</p>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-4 space-y-3">
              <span className="text-[8px] text-foreground/45 uppercase tracking-wider block font-bold">
                {addressLabel}
              </span>
              <div className="flex items-center justify-between gap-3 bg-black/45 border border-white/10 p-2.5 rounded font-mono text-xs">
                <span className="text-foreground select-all break-all font-bold tracking-wider">{addressVal}</span>
                <button
                  onClick={() => handleCopy(addressVal)}
                  disabled={addressVal === "No configurado"}
                  className="px-2.5 py-1 text-[8.5px] font-bold border border-white/10 hover:border-primary/50 text-foreground/60 hover:text-primary rounded cursor-pointer shrink-0 uppercase transition-all"
                >
                  {copyFeedback ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-white/5 rounded-lg p-4 space-y-2 leading-relaxed text-[9.5px] text-foreground/60 uppercase">
              <span className="font-bold text-foreground block text-[10px] tracking-wider mb-1">📋 Pasos a seguir:</span>
              <p>1. Abre la aplicación o sitio de {title} y selecciona enviar saldo.</p>
              <p>2. Ingresa el ID/Teléfono/Correo arriba indicado.</p>
              <p>3. Transfiere exactamente el total de <span className="text-emerald-400 font-bold">${total.toFixed(2)} USD</span>.</p>
              <p>4. Una vez enviada la transferencia, haz clic en el botón inferior "CONFIRMAR PAGO".</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 mt-6">
          <button
            onClick={handleManualPaymentConfirm}
            disabled={addressVal === "No configurado"}
            className="w-full flex items-center justify-center gap-1.5 font-mono text-xs tracking-widest font-bold py-3.5 rounded transition-colors shadow-lg cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: color, color: isBinance ? '#000000' : '#ffffff' }}
          >
            CONFIRMAR PAGO
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Wrapper Window Container */}
      <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl flex flex-col font-sans transition-all duration-300 bg-zinc-950 border border-white/10 text-foreground">
        
        {showPendingSuccess ? (
          <div className="p-6 md:p-8 flex flex-col justify-between min-h-[400px] text-center space-y-6">
            <div className="space-y-4 my-auto">
              <div className="mx-auto size-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center border border-amber-500/20">
                <RefreshCw className="size-8 text-amber-500 animate-spin" />
              </div>
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 font-mono text-[8px] uppercase tracking-widest font-black border border-amber-500/25">
                  Pago Bajo Verificación
                </span>
                <h3 className="font-heading text-lg font-black tracking-tight text-foreground uppercase">
                  ¡Solicitud Enviada con Éxito!
                </h3>
                <p className="font-mono text-[9px] leading-relaxed text-foreground/75 uppercase max-w-sm mx-auto">
                  Tu pago ha sido registrado y está bajo verificación del administrador (ALVIAL). Una vez confirmado el depósito, se liberará tu descarga.
                </p>
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-3.5 text-left font-mono text-[8.5px] leading-relaxed text-foreground/50 uppercase mt-4">
                  <span className="font-bold text-foreground block mb-1">💡 ¿Cómo descargar tus beats?</span>
                  Cuando el administrador apruebe la verificación, tus beats se habilitarán automáticamente para descarga directa en la pestaña <span className="text-emerald-400 font-bold">"MIS DESCARGAS"</span> de la barra superior.
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <button
                onClick={() => {
                  setShowPendingSuccess(false)
                  closeCheckout()
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-mono text-xs tracking-widest font-bold py-3.5 rounded uppercase transition-colors cursor-pointer"
              >
                Entendido / Cerrar
              </button>
            </div>
          </div>
        ) : selectedMethod ? (
          renderManualPayment(selectedMethod)
        ) : (
          renderSelectionScreen()
        )}

      </div>
    </div>
  )
}

