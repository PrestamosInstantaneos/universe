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
    user
  } = useCart()

  // Credenciales simuladas
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
    
    // Simular retraso de red de 2 segundos antes de marcar éxito
    setTimeout(() => {
      setPaypalState("success")
      
      // Simular otros 1.5 segundos en éxito antes de cerrar y redirigir
      setTimeout(() => {
        confirmPurchase()
      }, 1500)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Outer Mock Browser Window Container */}
      <div className="w-full max-w-lg bg-[#f5f7fa] text-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col border border-slate-300 font-sans">
        
        {/* BROWSER ADDRESS BAR */}
        <div className="bg-slate-200 border-b border-slate-300 px-4 py-2.5 flex items-center justify-between text-slate-500 text-xs select-none">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 w-full max-w-sm truncate">
            <Lock className="size-3 text-emerald-600 shrink-0 fill-current" />
            <span className="text-emerald-700 font-bold shrink-0">Seguro</span>
            <span className="text-slate-400">|</span>
            <span className="truncate text-slate-600">https://www.paypal.com/checkout/pay?flow=alvial-8293</span>
          </div>
          
          <button 
            onClick={closeCheckout}
            className="flex size-7 items-center justify-center rounded-full hover:bg-slate-300/60 text-slate-600 transition-colors cursor-pointer"
            aria-label="Cerrar ventana PayPal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* PAYPAL COMPONENT BODY */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between min-h-[420px]">
          
          {/* HEADER LOGO */}
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div className="flex items-center gap-1">
              {/* PayPal Blue Letters Mock */}
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
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-3">
            <div className="flex items-center gap-1">
              <Shield className="size-3.5 text-slate-400" />
              <span>Protección al Comprador de PayPal</span>
            </div>
            
            <div className="flex gap-2">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Políticas de Privacidad</a>
              <span>•</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Condiciones de Uso</a>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
