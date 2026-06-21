"use client"

import React from "react"

export function WaveformDivider() {
  return (
    <div className="relative w-full h-16 sm:h-20 overflow-hidden bg-black/40 border-y border-white/5 flex items-center select-none pointer-events-none">
      <style>{`
        @keyframes slide-wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes slide-wave-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .glow-filter-cyan {
          filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 12px rgba(34, 211, 238, 0.4));
        }
        .glow-filter-magenta {
          filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 12px rgba(236, 72, 153, 0.4));
        }
        .glow-filter-purple {
          filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.4));
        }
      `}</style>

      {/* SVG Container */}
      <svg 
        className="w-[200%] h-full shrink-0 flex"
        viewBox="0 0 2400 100" 
        preserveAspectRatio="none"
      >
        {/* Wave 1: Cyan (Flowing forward) */}
        <path
          d="M 0 50 Q 150 15 300 50 T 600 50 T 900 50 T 1200 50 Q 1350 15 1500 50 T 1800 50 T 2100 50 T 2400 50"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
          className="glow-filter-cyan"
          style={{
            animation: "slide-wave 12s linear infinite"
          }}
        />

        {/* Wave 2: Magenta (Flowing backward, shifted) */}
        <path
          d="M 0 50 Q 150 75 300 50 T 600 50 T 900 50 T 1200 50 Q 1350 75 1500 50 T 1800 50 T 2100 50 T 2400 50"
          fill="none"
          stroke="#ec4899"
          strokeWidth="2"
          className="glow-filter-magenta opacity-80"
          style={{
            animation: "slide-wave-reverse 18s linear infinite"
          }}
        />

        {/* Wave 3: Purple (Flowing forward, tighter waves) */}
        <path
          d="M 0 50 Q 100 30 200 50 T 400 50 T 600 50 T 800 50 T 1000 50 T 1200 50 Q 1300 30 1400 50 T 1600 50 T 1800 50 T 2000 50 T 2200 50 T 2400 50"
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          className="glow-filter-purple opacity-65"
          style={{
            animation: "slide-wave 8s linear infinite"
          }}
        />
      </svg>
      
      {/* Decorative vertical border fade */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}
