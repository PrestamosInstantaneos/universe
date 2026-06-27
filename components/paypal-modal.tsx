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

  // Render Manual Payment Screen (Binance / Zinli)
  const renderManualPayment = (method: 'binance' | 'zinli') => {
    const isBinance = method === 'binance'
    const title = isBinance ? 'Binance Pay' : 'Zinli Wallet'
    const color = isBinance ? '#F3BA2F' : '#9d4edd'
    const addressLabel = isBinance ? 'Binance Pay ID del Administrador' : 'Teléfono / Correo de Zinli'
    const addressVal = isBinance ? (binanceId || "No configurado") : (zinliPhone || "No configurado")
    
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
              <p>1. Abre la aplicación de {title} y selecciona enviar saldo.</p>
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
      
      {/* Dynamic Wrapper Window Container */}
      <div className={`w-full max-w-lg rounded-xl overflow-hidden shadow-2xl flex flex-col font-sans transition-all duration-300 ${
        selectedMethod === 'paypal' 
          ? "bg-[#f5f7fa] text-slate-800 border border-slate-300" 
          : "bg-zinc-950 border border-white/10 text-foreground"
      }`}>
        
        {showPendingSuccess ? (
          <div className="p-6 md:p-8 flex flex-col justify-between min-h-[400px] text-center space-y-6">
            <div className="space-y-4 my-auto">
              <div className="mx-auto size-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="size-8 text-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-black tracking-tight text-foreground uppercase">
                  ¡Solicitud de Pedido Enviada!
                </h3>
                <p className="font-mono text-[9.5px] leading-relaxed text-foreground/75 uppercase max-w-sm mx-auto">
                  Hemos registrado tu solicitud de compra de forma exitosa. El administrador verificará la transferencia y aprobará tu pedido.
                </p>
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-3 text-left font-mono text-[8.5px] leading-relaxed text-foreground/50 uppercase mt-4">
                  <span className="font-bold text-foreground block mb-1">💡 ¿Cómo descargar tus beats?</span>
                  Una vez confirmado tu pago por el administrador, las descargas se habilitarán automáticamente en el botón <span className="text-emerald-400 font-bold">"MIS DESCARGAS"</span> de la barra superior.
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <button
                onClick={() => {
                  setShowPendingSuccess(false)
                  closeCheckout()
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-mono text-xs tracking-widest font-bold py-3.5 rounded uppercase transition-colors cursor-pointer"
              >
                Entendido / Cerrar
              </button>
            </div>
          </div>
        ) : selectedMethod === 'paypal' ? (
          <>
            {/* BROWSER ADDRESS BAR */}
            <div className="bg-slate-200 border-b border-slate-300 px-4 py-2.5 flex items-center justify-between text-slate-500 text-xs select-none">
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 w-full max-w-sm truncate">
                <Lock className="size-3 text-emerald-600 shrink-0 fill-current" />
                <span className="text-emerald-700 font-bold shrink-0">Seguro</span>
                <span className="text-slate-400">|</span>
                <span className="truncate text-slate-600">https://www.paypal.com/checkout/pay?flow=alvial-8293</span>
              </div>
              
              <button 
                onClick={() => setSelectedMethod(null)}
                className="flex size-7 items-center justify-center rounded-full hover:bg-slate-300/60 text-slate-600 transition-colors cursor-pointer"
                aria-label="Cerrar ventana PayPal"
              >
                <ArrowLeft className="size-4" />
              </button>
            </div>

            {/* PAYPAL COMPONENT BODY */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between min-h-[420px]">
              
              {/* HEADER LOGO */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div className="flex items-center gap-1">
                  <span className="text-[#003087] font-black italic text-2xl tracking-tight">Pay</span>
                  <span className="text-[#0079c1] font-black italic text-2xl tracking-tight -ml-1">Pal</span>
                </div>
                
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block tracking-wider">
                    Total del pedido
                  </span>
                  <span className="text-slate-900 font-bold text-lg">
                    ${total.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* STATES */}
              <div className="my-6 flex-1 flex flex-col justify-center">

                {/* 1. LOGIN STATE */}
                {paypalState === "login" && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <h3 className="text-center font-bold text-lg text-slate-700">
                      Pagar con PayPal
                    </h3>
                    
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <input
                          type="email"
                          placeholder="Correo electrónico o teléfono móvil"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-950 focus:border-[#0079c1] focus:ring-1 focus:ring-[#0079c1] outline-none transition-all placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-950 focus:border-[#0079c1] focus:ring-1 focus:ring-[#0079c1] outline-none transition-all placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#0079c1] hover:bg-[#005ea6] text-white font-bold text-sm py-3 rounded-md transition-all cursor-pointer shadow-sm shadow-[#0079c1]/20 active:scale-[0.99]"
                      >
                        Iniciar Sesión
                      </button>
                    </div>
                    
                    <div className="text-center pt-2">
                      <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0079c1] hover:underline text-xs font-semibold">
                        ¿Tiene problemas para iniciar sesión?
                      </a>
                    </div>
                  </form>
                )}

                {/* 2. REVIEW STATE */}
                {paypalState === "review" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-lg p-3">
                      {user ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={user.picture} 
                          alt={user.name} 
                          className="size-9 rounded-full object-cover border border-slate-300 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="size-9 bg-[#003087]/10 rounded-full flex items-center justify-center text-[#003087] font-bold text-xs shrink-0">
                          U
                        </div>
                      )}
                      <div className="text-xs">
                        <span className="font-bold text-slate-700 block">Usuario: {user ? user.name : (email || "productor_anonimo@gmail.com")}</span>
                        <span className="text-slate-400">{user ? "Sesión Google Activa" : "Verificado • music_maker_pro"}</span>
                      </div>
                      
                      <button 
                        onClick={() => setPaypalState("login")}
                        className="ml-auto font-mono text-[9px] text-[#0079c1] hover:underline uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <span className="font-bold uppercase tracking-wider text-[9px] text-slate-400 block">
                        Forma de Pago
                      </span>
                      <div className="flex items-center justify-between bg-white border border-slate-300 rounded p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-800 text-sm italic">P</span>
                          <span className="font-semibold text-slate-700">Saldo de PayPal</span>
                        </div>
                        <span className="font-bold text-slate-900">${total.toFixed(2)} USD</span>
                      </div>
                    </div>

                    {/* Items overview */}
                    <div className="max-h-[120px] overflow-y-auto bg-white border border-slate-300 rounded p-2.5 space-y-1.5">
                      <span className="font-bold uppercase tracking-wider text-[8px] text-slate-400 block">
                        Resumen del Carrito ({selectedItems.length} Beats)
                      </span>
                      {selectedItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="truncate max-w-[280px] font-semibold text-slate-700">
                            {item.track.title} ({item.licenseType.toUpperCase()})
                          </span>
                          <span className="font-semibold text-slate-900">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleConfirmPayment}
                        className="w-full bg-[#ffc439] hover:bg-[#f2b930] text-[#003087] font-bold text-sm py-3 rounded-md transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                      >
                        Pagar Ahora (${total.toFixed(2)} USD)
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. PROCESSING STATE */}
                {paypalState === "processing" && (
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <RefreshCw className="size-10 text-[#0079c1] animate-spin" />
                    <div className="text-center space-y-1">
                      <h4 className="font-bold text-slate-800">Procesando pago...</h4>
                      <p className="text-xs text-slate-500">Estamos verificando los fondos de tu cuenta PayPal.</p>
                    </div>
                  </div>
                )}

                {/* 4. SUCCESS STATE */}
                {paypalState === "success" && (
                  <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in zoom-in duration-200">
                    <CheckCircle2 className="size-16 text-emerald-500 fill-emerald-50" />
                    <div className="text-center space-y-1">
                      <h4 className="font-bold text-slate-800 text-lg">¡Pago Autorizado!</h4>
                      <p className="text-xs text-slate-500">Volviendo a ALVIAL...</p>
                    </div>
                  </div>
                )}

              </div>

              {/* FOOTER */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-3 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <Shield className="size-3.5 text-slate-400" />
                  <span>Protección al Comprador de PayPal</span>
                </div>
                
                <div className="flex justify-center sm:justify-end gap-2">
                  <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Privacidad</a>
                  <span>•</span>
                  <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Condiciones</a>
                </div>
              </div>

            </div>
          </>
        ) : selectedMethod === 'binance' ? (
          renderManualPayment('binance')
        ) : selectedMethod === 'zinli' ? (
          renderManualPayment('zinli')
        ) : (
          renderSelectionScreen()
        )}

      </div>
    </div>
  )
}

