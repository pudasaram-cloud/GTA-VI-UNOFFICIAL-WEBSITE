import React from 'react'
import logosix from '../assets/logosix.png'

export default function FooterSection() {
  return (
    <footer className="w-full bg-transparent pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10 lg:px-16 select-none">
      <div className="max-w-[1240px] mx-auto">
        {/* Main GTA VI Branding: VI Roman Numeral + GRAND THEFT AUTO */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 py-6 sm:py-10 md:py-14">
          {/* Left: VI Palm Logo */}
          <div className="w-[150px] sm:w-[220px] md:w-[260px] lg:w-[300px] xl:w-[320px] flex-shrink-0 flex items-center justify-center">
            <img
              src={logosix}
              alt="GTA VI Roman Numeral Logo"
              className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_10px_35px_rgba(255,97,141,0.3)]"
              loading="lazy"
            />
          </div>

          {/* Right: GRAND THEFT AUTO in Pricedown font */}
          <div className="flex flex-col items-center sm:items-start justify-center text-center sm:text-left leading-[0.88] select-none">
            <span className="font-pricedown text-white uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              GRAND THEFT
            </span>
            <span className="font-pricedown text-white uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] mt-1 sm:mt-2">
              AUTO
            </span>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-white/20 mt-12 sm:mt-16 md:mt-20 mb-6 sm:mb-8" />

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-white/60 font-sans text-xs sm:text-[13px] text-center md:text-left">
          <p className="order-2 md:order-1">
            An unofficial fan-made website dedicated to Grand Theft Auto VI.
          </p>
          <p className="order-1 md:order-2 font-medium text-white/70">
            © 2026 GTA VI Fan Website. All Rights Reserved.
          </p>
          <p className="order-3 font-semibold tracking-wider text-white/80 uppercase">
            GRAND THEFT AUTO VI
          </p>
        </div>
      </div>
    </footer>
  )
}
