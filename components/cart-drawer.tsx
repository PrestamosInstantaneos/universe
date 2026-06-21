"use client"

import React from "react"
import { X, Trash2, ShoppingBag, Check, ShieldCheck } from "lucide-react"
import { useCart, LICENSES } from "./cart-context"

export function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setCartOpen, 
    removeFromCart, 
    toggleItemSelection, 
    startCheckout,
    openLicenseModal
  } = useCart()

  // Calcular items seleccionados y totales
  const selectedItems = cart.filter(item => item.selected)
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0)
  const total = subtotal // Podemos añadir cargos extra si quisiéramos, pero $0 por ahora

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isCartOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
    >
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Container Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4.5 text-primary" />
            <h3 className="font-heading text-sm font-black uppercase tracking-wider text-foreground">
              Carrito de compras
            </h3>
            {cart.length > 0 && (
              <span className="font-mono text-[9px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded font-bold">
                {cart.length}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setCartOpen(false)}
            className="flex size-7 items-center justify-center rounded border border-white/5 text-foreground/50 hover:text-foreground hover:border-primary transition-all cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
          {cart.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="size-16 rounded-full border border-dashed border-white/10 flex items-center justify-center text-foreground/30 animate-pulse">
                <ShoppingBag className="size-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground/80">
                  Tu carrito está vacío
                </h4>
                <p className="font-mono text-[9px] text-foreground/45 max-w-[240px] leading-relaxed mx-auto">
                  Agrega licencias de beats en tendencia para empezar a producir tu próxima canción.
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-[9px] tracking-widest font-bold px-5 py-2.5 rounded transition-all cursor-pointer"
              >
                EXPLORAR TRACKS
              </button>
            </div>
          ) : (
            /* Items List */
            cart.map((item) => {
              const license = LICENSES.find(l => l.type === item.licenseType)
              
              return (
                <div 
                  key={item.cartId}
                  className={`flex items-center gap-3.5 p-3 rounded-lg border transition-all ${
                    item.selected 
                      ? "bg-zinc-900/30 border-white/10" 
                      : "bg-zinc-950/20 border-white/5 opacity-55 hover:opacity-80"
                  }`}
                >
                  {/* Select Checkbox */}
                  <button
                    onClick={() => toggleItemSelection(item.cartId)}
                    className={`size-5 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      item.selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/20 bg-transparent hover:border-white/40"
                    }`}
                    aria-label={item.selected ? "Desmarcar para comprar" : "Marcar para comprar"}
                  >
                    {item.selected && <Check className="size-3.5 stroke-[3]" />}
                  </button>

                  {/* Clickable details trigger */}
                  <div 
                    onClick={() => openLicenseModal(item.track, item.licenseType, item.cartId)}
                    className="flex-1 flex items-center gap-3.5 min-w-0 text-left cursor-pointer group/cartitem hover:opacity-85 transition-opacity"
                    title="Hacer clic para ver detalles y licencias"
                  >
                    {/* Artwork Image */}
                    <div className="relative size-12 overflow-hidden border border-white/15 bg-zinc-900 rounded shrink-0 group-hover/cartitem:border-primary/45 transition-all">
                      <img 
                        src={item.track.img} 
                        alt={item.track.title} 
                        className="size-full object-cover"
                      />
                    </div>

                    {/* Info Details */}
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-heading text-xs font-bold text-foreground truncate uppercase tracking-tight group-hover/cartitem:text-primary transition-colors">
                        {item.track.title}
                      </h4>
                      <p className="font-mono text-[8px] text-foreground/45 uppercase tracking-wide truncate mt-0.5">
                        {item.track.producer}
                      </p>
                      <span className="inline-block font-mono text-[7px] text-primary/80 uppercase tracking-widest bg-primary/5 border border-primary/10 px-1 py-0.5 rounded mt-1.5 font-bold">
                        {license?.name || item.licenseType}
                      </span>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-foreground/40 hover:text-red-500 hover:border-red-500/20 transition-all rounded p-1 cursor-pointer"
                      aria-label="Eliminar del carrito"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    
                    <span className="font-heading text-xs font-black text-foreground">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ORDER SUMMARY & CHECKOUT BUTTON */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-white/5 bg-zinc-900/20 space-y-4">
            
            {/* Calculation details */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-[9px] text-foreground/50">
                <span>ITEMS SELECCIONADOS ({selectedItems.length})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-mono text-[9px] text-foreground/50">
                <span>TASAS / COMISIONES</span>
                <span className="text-primary font-bold">GRATIS</span>
              </div>
              
              <div className="h-px bg-white/5 my-2" />
              
              <div className="flex justify-between items-end">
                <span className="font-mono text-[10px] text-foreground/80 uppercase font-bold">Total Compra</span>
                <span className="font-heading text-2xl font-black text-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shield disclaimer */}
            <div className="flex items-start gap-2.5 bg-zinc-900/60 border border-white/5 rounded p-2.5">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="font-mono text-[8px] text-foreground/45 leading-normal">
                Transacción protegida por cifrado SSL. Entrega digital inmediata una vez verificado el pago por PayPal.
              </p>
            </div>

            {/* Paypal button */}
            {selectedItems.length > 0 ? (
              <button
                onClick={startCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#ffc439] hover:bg-[#f2b930] text-[#003087] font-sans text-xs font-black py-3 rounded-lg shadow-lg shadow-yellow-500/5 hover:shadow-yellow-500/15 transition-all active:scale-[0.98] cursor-pointer"
              >
                {/* Simulated PayPal Pill Style */}
                <span className="italic font-bold tracking-tight text-sm">Pay</span>
                <span className="italic font-bold tracking-tight text-sm text-[#0079c1] -ml-1">Pal</span>
                <span className="font-mono font-bold text-[10px] tracking-widest text-[#003087]/70 ml-1 uppercase">
                  Pagar Ahora
                </span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-500 font-mono text-[9px] tracking-wider font-bold py-3.5 rounded-lg cursor-not-allowed opacity-50"
                >
                  PAGAR CON PAYPAL
                </button>
                <p className="text-center font-mono text-[7.5px] text-amber-500/80 uppercase tracking-wider font-bold">
                  ⚠️ Selecciona al menos un artículo para calcular total y pagar
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
