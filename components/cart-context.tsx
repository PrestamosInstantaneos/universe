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
  expuesto?: boolean
  tendencia?: boolean
  dropeado?: boolean
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

export type GoogleUser = {
  id: string
  email: string
  name: string
  picture: string
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

export const ALL_TRACKS: Track[] = [
  {
    id: "1",
    img: "/images/artist-1.png",
    title: "Hard melodic free...",
    producer: "nToucan",
    tags: ["TRAP", "NEÓN"],
    bpm: 140,
    key: "G# Minor",
    price: "$10.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    isAd: true
  },
  {
    id: "2",
    img: "/images/artist-2.png",
    title: "Lüh rich (Yeat x Ke...",
    producer: "LokernG",
    tags: ["R&B"],
    bpm: 95,
    key: "C Major",
    price: "$9.95",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    isAd: true
  },
  {
    id: "3",
    img: "/images/artist-3.png",
    title: "[FREE] DARK MEL...",
    producer: "Onibur",
    tags: ["DRILL", "808"],
    bpm: 142,
    key: "D# Minor",
    price: "$25.00",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    isAd: true,
    hasDownload: true
  },
  {
    id: "4",
    img: "/images/artist-4.png",
    title: "200 Beats For $50...",
    producer: "markk aylin",
    tags: ["AFROBEATS"],
    bpm: 110,
    key: "A Minor",
    price: "$49.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    emoji: "🔥"
  },
  {
    id: "5",
    img: "/images/artist-5.png",
    title: "HURRICANE - 1+4 F...",
    producer: "Gotenkeys",
    tags: ["WAVE"],
    bpm: 128,
    key: "F Minor",
    price: "$50.00",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    emoji: "🌀",
    hasDownload: true
  },
  {
    id: "6",
    img: "/images/artist-6.png",
    title: "\"Arrest\" | 2+3 FREE | Tra...",
    producer: "junkey",
    tags: ["HOUSE"],
    bpm: 124,
    key: "A# Minor",
    price: "$44.95",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "7",
    img: "/images/artist-7.png",
    title: "ICEFIELD BLUE",
    producer: "FRZN SOUND",
    tags: ["REGGAETÓN"],
    bpm: 98,
    key: "E Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    hasDownload: true
  },
  {
    id: "8",
    img: "/images/artist-8.png",
    title: "POLAR WHITE",
    producer: "FRZN SOUND",
    tags: ["BOOM BAP"],
    bpm: 90,
    key: "B Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: "rel-1",
    img: "/images/artist-7.png",
    title: "Ghetto Romance",
    producer: "FRZN SOUND",
    tags: ["REGGAETÓN", "LATIN"],
    bpm: 98,
    key: "E Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "rel-2",
    img: "/images/artist-2.png",
    title: "Cyber Trap 2099",
    producer: "LokernG",
    tags: ["TRAP", "GLITCH"],
    bpm: 140,
    key: "C Minor",
    price: "$19.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "rel-3",
    img: "/images/artist-4.png",
    title: "Afro Chill Vibes",
    producer: "Markk Aylin",
    tags: ["AFROBEATS", "DANCEHALL"],
    bpm: 105,
    key: "G Major",
    price: "$39.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "rel-4",
    img: "/images/artist-3.png",
    title: "Drill Symphony",
    producer: "Onibur",
    tags: ["DRILL", "DARK"],
    bpm: 144,
    key: "D# Minor",
    price: "$24.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "rel-5",
    img: "/images/artist-6.png",
    title: "Midnight House",
    producer: "Junkey",
    tags: ["HOUSE", "DEEP"],
    bpm: 126,
    key: "A Minor",
    price: "$44.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "rel-6",
    img: "/images/artist-8.png",
    title: "Polar Express",
    producer: "FRZN SOUND",
    tags: ["BOOM BAP", "CLASSIC"],
    bpm: 92,
    key: "E Minor",
    price: "$29.99",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
]

export type NewsPost = {
  id: string
  title: string
  description: string
  content: string
  image: string
  link?: string
  date: string
  expuesto: boolean
  tag: string
}

export const DEFAULT_NEWS: NewsPost[] = [
  {
    id: "post-1",
    title: "Actualización de Verano: 15 Nuevos Beats Melódicos",
    date: "20 DE JUNIO, 2026",
    tag: "NUEVO DROPEO",
    description: "El catálogo se ha actualizado con nuevos ritmos de trap y R&B. Escucha los adelantos exclusivos en la sección de drops.",
    content: "Nuestros administradores acaban de publicar un lote de 15 instrumentales exclusivos con enfoque melódico, ideales para voces R&B y trap agresivo. Además, se han ajustado los contratos de la licencia Unlimited para otorgar un 10% adicional de regalías en favor del artista en plataformas de streaming. ¡No te pierdas estos nuevos beats e impulso tu siguiente lanzamiento hoy mismo!",
    image: "/images/featured.png",
    expuesto: true
  },
  {
    id: "post-2",
    title: "2x1 en Licencias Básicas y Premium por Tiempo Limitado",
    date: "18 DE JUNIO, 2026",
    tag: "OFERTA",
    description: "Añade dos beats con la misma licencia a tu carrito y el descuento se aplicará automáticamente al pagar.",
    content: "Queremos apoyar a los artistas independientes este mes. Al añadir cualquier par de beats de la misma categoría de licencia (Basic o Premium) a tu carrito de compras, el sistema de FRZN descontará automáticamente el de menor valor. Esta oferta especial estará activa por tiempo limitado y finalizará el 30 de junio. ¡Aprovecha para armar tus maquetas!",
    image: "/images/city-banner.png",
    expuesto: true
  },
  {
    id: "post-3",
    title: "Cómo registrar y monetizar tu canción usando nuestras licencias",
    date: "15 DE JUNIO, 2026",
    tag: "TUTORIAL",
    description: "Una guía rápida paso a paso sobre cómo registrar tus canciones en BMI/ASCAP utilizando la licencia exclusiva de FRZN.",
    content: "Comprar un beat es solo el primer paso en tu carrera musical. En este post de ayuda, te explicamos detalladamente cómo debes rellenar los datos de escritor y editor al registrar tu tema en sociedades de gestión de derechos de autor (como BMI, ASCAP o SCD). Desglosamos las diferencias clave sobre las cláusulas de regalías contenidas en tu licencia digital para que no tengas ningún inconveniente al monetizar tus pistas en plataformas de streaming como YouTube o Spotify.",
    image: "/images/hero-thumb-2.png",
    expuesto: true
  }
]

type CartContextType = {
  cart: CartItem[]
  licenseModalTrack: Track | null
  licenseModalDefaultType: LicenseType
  licenseModalCartId: string | null
  isCartOpen: boolean
  isPaypalOpen: boolean
  paypalState: 'login' | 'review' | 'processing' | 'success'
  purchasedItems: CartItem[]
  isDownloadsOpen: boolean
  // Dynamic Catalog
  tracks: Track[]
  releases: Track[]
  allTracks: Track[]
  refreshCatalog: () => Promise<void>
  // News
  news: NewsPost[]
  allNews: NewsPost[]
  // User Authentication
  user: GoogleUser | null
  isLoadingUser: boolean
  loginUser: (idToken: string) => Promise<boolean>
  logoutUser: () => void
  // Search state & actions
  isSearchOpen: boolean
  searchQuery: string
  searchSelectedTags: string[]
  openSearch: (initialTag?: string) => void
  closeSearch: () => void
  toggleSearchTag: (tag: string) => void
  setSearchQuery: (query: string) => void
  clearSearchFilters: () => void
  // Cart Actions
  openLicenseModal: (track: Track, defaultLicense?: LicenseType, cartId?: string | null) => void
  closeLicenseModal: () => void
  addToCart: (track: Track, licenseType: LicenseType) => void
  updateCartItemLicense: (cartId: string, licenseType: LicenseType) => void
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
  const [licenseModalDefaultType, setLicenseModalDefaultType] = useState<LicenseType>("basic")
  const [licenseModalCartId, setLicenseModalCartId] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPaypalOpen, setIsPaypalOpen] = useState(false)
  const [paypalState, setPaypalState] = useState<'login' | 'review' | 'processing' | 'success'>('login')
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([])
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false)

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSelectedTags, setSearchSelectedTags] = useState<string[]>([])

  // User Authentication States
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  // Dynamic Catalog States
  const [allTracks, setAllTracks] = useState<Track[]>(() => ALL_TRACKS)
  const [tracks, setTracks] = useState<Track[]>(() => ALL_TRACKS.filter(t => !t.id.startsWith("rel-")))
  const [releases, setReleases] = useState<Track[]>(() => ALL_TRACKS.filter(t => t.id.startsWith("rel-")))
  const [allNews, setAllNews] = useState<NewsPost[]>(() => DEFAULT_NEWS)
  const [news, setNews] = useState<NewsPost[]>(() => DEFAULT_NEWS)

  const refreshCatalog = async () => {
    try {
      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      if (!appsScriptUrl) {
        console.warn("NEXT_PUBLIC_APPS_SCRIPT_URL is not defined")
        return
      }

      // 1. Obtener Beats
      const response = await fetch(`${appsScriptUrl}?action=getTracks`)
      const result = await response.json()
      if (result.status === "success" && Array.isArray(result.tracks)) {
        const parsedTracks = result.tracks.map((t: any) => ({
          ...t,
          expuesto: t.expuesto !== false && t.expuesto !== "FALSE",
          tendencia: t.tendencia !== false && t.tendencia !== "FALSE",
          dropeado: t.dropeado === true || t.dropeado === "TRUE"
        }))

        // Merge fetched tracks with ALL_TRACKS to preserve local metadata/ads/emojis
        const trackMap = new Map<string, Track>()
        ALL_TRACKS.forEach(t => trackMap.set(t.id, t))
        
        parsedTracks.forEach((t: Track) => {
          trackMap.set(t.id, {
            ...trackMap.get(t.id),
            ...t
          })
        })
        
        const combined = Array.from(trackMap.values())
        setAllTracks(combined)
        setTracks(combined.filter(t => t.expuesto !== false && t.tendencia !== false))
        setReleases(combined.filter(t => t.expuesto !== false && t.dropeado === true))
      }

      // 2. Obtener Noticias
      const newsResponse = await fetch(`${appsScriptUrl}?action=getNews`)
      const newsResult = await newsResponse.json()
      if (newsResult.status === "success" && Array.isArray(newsResult.news)) {
        const parsedNews = newsResult.news.map((n: any) => ({
          ...n,
          expuesto: n.expuesto !== false && n.expuesto !== "FALSE"
        }))
        setAllNews(parsedNews)
        setNews(parsedNews.filter((n: NewsPost) => n.expuesto !== false))
      }
    } catch (e) {
      console.error("Error fetching catalog:", e)
    }
  }

  // Fetch catalog on mount
  useEffect(() => {
    refreshCatalog()
  }, [])

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
    const savedUser = localStorage.getItem("frzn_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
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

  // Fusionar el carrito local y el carrito del servidor
  const mergeCarts = (localItems: CartItem[], serverItems: any[]): CartItem[] => {
    const merged = [...localItems]
    serverItems.forEach((sItem: any) => {
      // Buscar si ya existe la misma licencia del mismo track
      const exists = merged.some(
        (lItem) => lItem.track.id === sItem.trackId && lItem.licenseType === sItem.licenseType
      )
      if (!exists) {
        const fullTrack = [...tracks, ...releases].find(t => t.id === sItem.trackId) || ALL_TRACKS.find(t => t.id === sItem.trackId)
        if (fullTrack) {
          merged.push({
            cartId: `${sItem.trackId}-${sItem.licenseType}-${Date.now()}`,
            track: fullTrack,
            licenseType: sItem.licenseType as LicenseType,
            price: sItem.price,
            selected: sItem.selected
          })
        }
      }
    })
    return merged
  }

  // Sincronizar el carrito actual con Google Sheets
  const syncCartWithServer = async (currentCart: CartItem[], userEmail: string) => {
    console.log("🔄 Intentando sincronizar carrito con el servidor para:", userEmail, currentCart);
    try {
      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      if (!appsScriptUrl) {
        console.warn("⚠️ No se puede sincronizar: NEXT_PUBLIC_APPS_SCRIPT_URL no está configurada en las variables de entorno.");
        return
      }
      
      const simplifiedCart = currentCart.map(item => ({
        trackId: item.track.id,
        title: item.track.title,
        licenseType: item.licenseType,
        price: item.price,
        selected: item.selected
      }))
      
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "syncCart",
          email: userEmail,
          cart: simplifiedCart
        }),
      })
      const result = await response.json()
      console.log("✅ Resultado de sincronización de carrito:", result);
    } catch (error) {
      console.error("❌ Error syncing cart to Google Sheets:", error)
    }
  }

  // Sincronizar automáticamente el carrito con el servidor al cambiar
  useEffect(() => {
    if (user) {
      syncCartWithServer(cart, user.email)
    }
  }, [cart, user])

  const openSearch = (initialTag?: string) => {
    setSearchQuery("")
    if (initialTag) {
      setSearchSelectedTags([initialTag.toUpperCase()])
    } else {
      setSearchSelectedTags([])
    }
    setIsSearchOpen(true)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchSelectedTags([])
  }

  const toggleSearchTag = (tag: string) => {
    const formattedTag = tag.toUpperCase()
    if (searchSelectedTags.includes(formattedTag)) {
      setSearchSelectedTags(searchSelectedTags.filter(t => t !== formattedTag))
    } else {
      setSearchSelectedTags([...searchSelectedTags, formattedTag])
    }
  }

  const clearSearchFilters = () => {
    setSearchQuery("")
    setSearchSelectedTags([])
  }

  const openLicenseModal = (
    track: Track, 
    defaultLicense: LicenseType = "basic", 
    cartId: string | null = null
  ) => {
    setLicenseModalTrack(track)
    setLicenseModalDefaultType(defaultLicense)
    setLicenseModalCartId(cartId)
  }

  const closeLicenseModal = () => {
    setLicenseModalTrack(null)
    setLicenseModalDefaultType("basic")
    setLicenseModalCartId(null)
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

  const updateCartItemLicense = (cartId: string, licenseType: LicenseType) => {
    const license = LICENSES.find(l => l.type === licenseType)
    const newCart = cart.map(item => {
      if (item.cartId === cartId) {
        const basePrice = parseBasePrice(item.track.price)
        const finalPrice = basePrice + (license ? license.priceOffset : 0)
        return {
          ...item,
          licenseType,
          price: parseFloat(finalPrice.toFixed(2))
        }
      }
      return item
    })
    saveCartToStorage(newCart)
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

  const loginUser = async (idToken: string): Promise<boolean> => {
    setIsLoadingUser(true)
    try {
      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      if (!appsScriptUrl) {
        console.error("NEXT_PUBLIC_APPS_SCRIPT_URL is not defined")
        setIsLoadingUser(false)
        return false
      }
      
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ action: "login", idToken }),
      })
      const result = await response.json()
      if (result.status === "success" && result.user) {
        setUser(result.user)
        localStorage.setItem("frzn_user", JSON.stringify(result.user))
        
        // Cargar y fusionar el carrito recibido de Google Sheets
        if (result.cart && result.cart.length > 0) {
          const merged = mergeCarts(cart, result.cart)
          setCart(merged)
          localStorage.setItem("frzn_cart", JSON.stringify(merged))
        }
        
        setIsLoadingUser(false)
        return true
      } else {
        console.error("Login failed:", result.message)
      }
    } catch (error) {
      console.error("Error during Google Login sync:", error)
    }
    setIsLoadingUser(false)
    return false
  }

  const logoutUser = () => {
    setUser(null)
    localStorage.removeItem("frzn_user")
  }

  return (
    <CartContext.Provider value={{
      cart,
      licenseModalTrack,
      licenseModalDefaultType,
      licenseModalCartId,
      isCartOpen,
      isPaypalOpen,
      paypalState,
      purchasedItems,
      isDownloadsOpen,
      // Dynamic Catalog
      tracks,
      releases,
      allTracks,
      refreshCatalog,
      // News
      news,
      allNews,
      // User Authentication
      user,
      isLoadingUser,
      loginUser,
      logoutUser,
      // Search Context values
      isSearchOpen,
      searchQuery,
      searchSelectedTags,
      openSearch,
      closeSearch,
      toggleSearchTag,
      setSearchQuery,
      clearSearchFilters,
      // Cart Actions
      openLicenseModal,
      closeLicenseModal,
      addToCart,
      updateCartItemLicense,
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
