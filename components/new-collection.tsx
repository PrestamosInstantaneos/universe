import { ArrowUpRight } from "lucide-react"

type Release = {
  img: string
  title: string
  subtitle: string
  tags: { label: string; tone: string }[]
  price: string
}

const RELEASES: Release[] = [
  {
    img: "/images/artist-1.png",
    title: "AURORA SILVER",
    subtitle: "REFLECTIVE TRAP EP",
    tags: [
      { label: "TRAP", tone: "bg-foreground" },
      { label: "NEÓN", tone: "bg-primary" },
    ],
    price: "$9.99",
  },
  {
    img: "/images/artist-2.png",
    title: "DIRECT SILVER",
    subtitle: "HIGH-GLOSS SINGLE",
    tags: [{ label: "R&B", tone: "bg-secondary-foreground" }],
    price: "$3.99",
  },
  {
    img: "/images/artist-3.png",
    title: "STEALTH BLACK",
    subtitle: "HEAVY DRILL TAPE",
    tags: [
      { label: "DRILL", tone: "bg-primary" },
      { label: "808", tone: "bg-foreground" },
    ],
    price: "$12.99",
  },
  {
    img: "/images/artist-4.png",
    title: "GLACIER WHITE",
    subtitle: "INSULATED AFRO ALBUM",
    tags: [{ label: "AFROBEATS", tone: "bg-foreground" }],
    price: "$14.99",
  },
  {
    img: "/images/artist-5.png",
    title: "POLAR GLOSS",
    subtitle: "BLUE WAVE MIXTAPE",
    tags: [{ label: "WAVE", tone: "bg-chart-2" }],
    price: "$8.99",
  },
  {
    img: "/images/artist-6.png",
    title: "STEALTH NAVY",
    subtitle: "HEAVY HOUSE SET",
    tags: [
      { label: "HOUSE", tone: "bg-primary" },
      { label: "BLACK", tone: "bg-foreground" },
    ],
    price: "$11.99",
  },
  {
    img: "/images/artist-7.png",
    title: "ICEFIELD BLUE",
    subtitle: "TECH REGGAETÓN EP",
    tags: [{ label: "REGGAETÓN", tone: "bg-chart-2" }],
    price: "$9.99",
  },
  {
    img: "/images/artist-8.png",
    title: "POLAR WHITE",
    subtitle: "SHELL BOOM BAP LP",
    tags: [{ label: "BOOM BAP", tone: "bg-foreground" }],
    price: "$14.99",
  },
]

function ReleaseCard({ release }: { release: Release }) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden border border-border bg-card">
        <img
          src={release.img || "/placeholder.svg"}
          alt={`Portada de ${release.title}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <button
          aria-label={`Reproducir ${release.title}`}
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center border border-border bg-background/70 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </button>
      </div>
      <div className="mt-3 space-y-1.5">
        <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">
          {release.title}
        </h3>
        <p className="font-mono text-[10px] tracking-[0.14em] text-foreground/55">
          {release.subtitle}
        </p>
        <div className="flex items-center gap-3 pt-1">
          {release.tags.map((t) => (
            <span
              key={t.label}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-foreground/70"
            >
              <span className={`size-2 rounded-full ${t.tone}`} />
              {t.label}
            </span>
          ))}
        </div>
        <p className="pt-1 font-mono text-[11px] tracking-[0.1em] text-foreground/80">
          {release.price}
        </p>
      </div>
    </article>
  )
}

export function NewCollection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-16">
      {/* Heading row */}
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <h2 className="font-heading text-3xl font-black tracking-[-0.02em] text-foreground md:text-4xl">
          NUEVOS RELEASES
        </h2>
        <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
          <div className="font-mono text-[10px] leading-relaxed tracking-[0.14em] text-foreground/55">
            <p>[ NUEVO DROP ]</p>
            <p>[ FRZN_V1 ]</p>
          </div>
          <div className="font-mono text-[10px] leading-relaxed tracking-[0.14em] text-foreground/55">
            <p>TRAP / DRILL</p>
            <p>AFRO / R&amp;B</p>
            <p>HOUSE / REGGAETÓN</p>
            <p>LÍNEA URBANA</p>
          </div>
          <button className="border border-border bg-card/40 px-5 py-2 font-mono text-[10px] tracking-[0.2em] text-foreground transition-colors hover:bg-card">
            FILTROS
          </button>
        </div>
      </div>

      {/* Top row: featured + 3 cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Featured (spans bigger on large screens) */}
        <article className="relative col-span-1 overflow-hidden border border-border bg-card sm:col-span-2 lg:col-span-1">
          <div className="relative h-full min-h-[320px]">
            <img
              src="/images/featured.png"
              alt="Artista destacada AURORA de FRZN"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
            <div className="absolute right-0 top-0 p-4 text-right">
              <p className="font-heading text-2xl font-black tracking-tight text-foreground">
                AURORA
                <sup className="align-super text-xs">™</sup>
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <span className="graffiti text-3xl">FRZN</span>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Reproducir AURORA"
                  className="flex size-9 items-center justify-center border border-border bg-background/60 text-foreground backdrop-blur"
                >
                  <ArrowUpRight className="size-4" />
                </button>
                <div className="font-mono text-[10px] tracking-[0.12em] text-foreground/80">
                  <p className="text-foreground/55">ESCUCHAR</p>
                  <p className="text-foreground">$19.99</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {RELEASES.slice(0, 3).map((r) => (
          <ReleaseCard key={r.title} release={r} />
        ))}
      </div>

      {/* Bottom row: 5 cards */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {RELEASES.slice(3).map((r) => (
          <ReleaseCard key={r.title} release={r} />
        ))}
      </div>
    </section>
  )
}
