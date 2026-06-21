"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Track = {
  id: string
  img: string
  title: string
  producer: string
  tags: string[]
  bpm: number
  key: string
  price: string
  audioUrl: string
  isAd?: boolean
  hasDownload?: boolean
  emoji?: string
}

export type LicenseType = 'basic' | 'premium' | 'unlimited' | 'exclusive'

export type License = {
  type: LicenseType
  name: string
  priceOffset: number
  format: string
  terms: string[]
}

export type CartItem = {
  cartId: string
  track: Track
  licenseType: LicenseType
  price: number
  selected: boolean
}

export const LICENSES: License[] = [
  {
    type: 'basic',
    name: 'Basic License (MP3)',
    priceOffset: 0,
    format: 'MP3',
    terms: [
      'Uso no comercial y sin fines de lucro',
      'Límite de 3,000 reproducciones/streams',
      'Distribución física limitada a 100 copias',
      'Derecho a 1 video musical no monetizado',
      'No exclusivo (el beat sigue en venta)'
    ]
  },
  {
    type: 'premium',
    name: 'Premium License (WAV)',
    priceOffset: 15.00,
    format: 'WAV + MP3',
    terms: [
      'Uso comercial limitado (plataformas de streaming)',
      'Límite de 10,000 reproducciones/streams',
      'Distribución física limitada a 500 copias',
      'Derecho a 1 video musical monetizado',
      'No exclusivo (el beat sigue en venta)'
    ]
  },
  {
    type: 'unlimited',
    name: 'Unlimited (WAV + STEMS)',
    priceOffset: 50.00,
    format: 'WAV + MP3 + Stems (Trackout)',
    terms: [
      'Uso comercial ilimitado en todas las plataformas',
      'Reproducciones y streams ilimitados',
      'Distribución física ilimitada',
      'Videos musicales monetizados ilimitados',
      'Derechos de presentación en vivo ilimitados',
      'No exclusivo (el beat sigue en venta)'
    ]
  },
  {
    type: 'exclusive',
    name: 'Exclusive License (Full Rights)',
    priceOffset: 200.00,
    format: 'WAV + MP3 + Stems + Contrato de Exclusividad',
    terms: [
      'Transferencia completa de propiedad y derechos de autor',
      'El beat se retira de la tienda inmediatamente',
      'Uso comercial ilimitado en todos los medios',
      'Derechos exclusivos (nadie más puede comprar este beat)',
      'Contrato legal firmado para derechos de autor'
    ]
  }
]

type CartContextType = {
  cart: CartItem[]
  licenseModalTrack: Track | null
  isCartOpen: boolean
  isPaypalOpen: boolean
  paypalState: 'login' | 'review' | 'processing' | 'success'
  purchasedItems: CartItem[]
  isDownloadsOpen: boolean
  openLicenseModal: (track: Track) => void
  closeLicenseModal: () => void
  addToCart: (track: Track, licenseType: LicenseType) => void
  removeFromCart: (cartId: string) => void
  toggleItemSelection: (cartId: string) => void
  setCartOpen: (open: boolean) => void
  startCheckout: () => void
  closeCheckout: () => void
  setPaypalState: (state: 'login' | 'review' | 'processing' | 'success') => void
  confirmPurchase: () => void
  closeDownloads: () => void
  openDownloads: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [licenseModalTrack, setLicenseModalTrack] = useState<Track | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPaypalOpen, setIsPaypalOpen] = useState(false)
  const [paypalState, setPaypalState] = useState<'login' | 'review' | 'processing' | 'success'>('login')
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([])
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false)

  // Cargar estado inicial desde localStorage si es posible
  useEffect(() => {
    const savedCart = localStorage.getItem("frzn_cart")
    const savedPurchased = localStorage.getItem("frzn_purchased")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error(e)
      }
    }
    if (savedPurchased) {
      try {
        setPurchasedItems(JSON.parse(savedPurchased))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Sincronizar carrito con localStorage
  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem("frzn_cart", JSON.stringify(newCart))
  }

  const openLicenseModal = (track: Track) => {
    setLicenseModalTrack(track)
  }

  const closeLicenseModal = () => {
    setLicenseModalTrack(null)
  }

  const parseBasePrice = (priceStr: string): number => {
    const cleanPrice = priceStr.replace("$", "").trim()
    const parsed = parseFloat(cleanPrice)
    return isNaN(parsed) ? 0 : parsed
  }

  const addToCart = (track: Track, licenseType: LicenseType) => {
    const license = LICENSES.find(l => l.type === licenseType)
    const basePrice = parseBasePrice(track.price)
    const finalPrice = basePrice + (license ? license.priceOffset : 0)
    
    // Evitar duplicados del mismo track con la misma licencia
    const existingIndex = cart.findIndex(item => item.track.id === track.id && item.licenseType === licenseType)
    
    if (existingIndex > -1) {
      // Si ya existe, nos aseguramos que esté seleccionado
      const updatedCart = [...cart]
      updatedCart[existingIndex].selected = true
      saveCartToStorage(updatedCart)
    } else {
      const newItem: CartItem = {
        cartId: `${track.id}-${licenseType}-${Date.now()}`,
        track,
        licenseType,
        price: parseFloat(finalPrice.toFixed(2)),
        selected: true // Por defecto seleccionada para la compra
      }
      saveCartToStorage([...cart, newItem])
    }
  }

  const removeFromCart = (cartId: string) => {
    const newCart = cart.filter(item => item.cartId !== cartId)
    saveCartToStorage(newCart)
  }

  const toggleItemSelection = (cartId: string) => {
    const newCart = cart.map(item => {
      if (item.cartId === cartId) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    saveCartToStorage(newCart)
  }

  const startCheckout = () => {
    setIsCartOpen(false)
    setPaypalState('login')
    setIsPaypalOpen(true)
  }

  const closeCheckout = () => {
    setIsPaypalOpen(false)
  }

  const confirmPurchase = () => {
    // Tomar solo los ítems seleccionados
    const itemsToBuy = cart.filter(item => item.selected)
    const remainingItems = cart.filter(item => !item.selected)
    
    const newPurchased = [...itemsToBuy, ...purchasedItems]
    setPurchasedItems(newPurchased)
    localStorage.setItem("frzn_purchased", JSON.stringify(newPurchased))
    
    // Limpiar del carrito los ítems comprados
    saveCartToStorage(remainingItems)
    
    setIsPaypalOpen(false)
    setIsDownloadsOpen(true)
  }

  const closeDownloads = () => {
    setIsDownloadsOpen(false)
  }

  const openDownloads = () => {
    setIsDownloadsOpen(true)
  }

  return (
    <CartContext.Provider value={{
      cart,
      licenseModalTrack,
      isCartOpen,
      isPaypalOpen,
      paypalState,
      purchasedItems,
      isDownloadsOpen,
      openLicenseModal,
      closeLicenseModal,
      addToCart,
      removeFromCart,
      toggleItemSelection,
      setCartOpen: setIsCartOpen,
      startCheckout,
      closeCheckout,
      setPaypalState,
      confirmPurchase,
      closeDownloads,
      openDownloads
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
