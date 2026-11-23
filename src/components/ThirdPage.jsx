import { useState } from 'react'
import trailer from '../assets/trailer.png'
import extend from '../assets/extend.png'
import img01 from '../assets/img01.png'
import img02 from '../assets/img02.png'
import img03 from '../assets/img03.png'

export default function ThirdPage({ isActive = false, showPanels = false, isExitUp = false }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!isActive || isExitUp) return
    const { innerWidth, innerHeight } = window
    const x = (e.clientX / innerWidth - 0.5) * 2
    const y = (e.clientY / innerHeight - 0.5) * 2
    setOffset({ x, y })
  }

  const handleTouchMove = (e) => {
    if (!isActive || isExitUp || !e.touches[0]) return
    const touch = e.touches[0]
    const { innerWidth, innerHeight } = window
    const x = (touch.clientX / innerWidth - 0.5) * 2
    const y = (touch.clientY / innerHeight - 0.5) * 2
    setOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 })
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-screen h-screen overflow-hidden bg-transparent select-none"
    >
      {/* Background: trailer.png - Full width & height */}
      <div
        className="absolute inset-0 w-full h-full z-0 will-change-transform pointer-events-none"
        style={{
          transform: isActive
            ? `scale(1.04) translate3d(${offset.x * -8}px, ${offset.y * -5}px, 0)`
            : 'scale(1.06) translate(0, 30px)',
          filter: showPanels
            ? 'brightness(0.65) blur(1px)'
            : 'brightness(1) blur(0px)',
          opacity: isExitUp ? 0 : isActive ? 1 : 0,
          transition: isExitUp
            ? 'opacity 0.85s ease-in-out'
            : isActive
            ? 'transform 0.3s ease-out, filter 0.7s ease-in-out, opacity 0.8s ease-out'
            : 'transform 0.7s ease-in, filter 0.7s ease-in, opacity 0.7s ease-in',
        }}
      >
        <img
          src={trailer}
          alt="Grand Theft Auto VI Trailer"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      </div>

      {/* Top-Right Title: Watch Launch Trailer */}
      <div
        className="absolute top-[5%] sm:top-[6%] right-[5%] sm:right-[8%] md:right-[11%] lg:right-[14%] z-20 flex flex-col items-center text-center will-change-transform pointer-events-none"
        style={{
          transform: isActive
            ? `translate3d(${offset.x * 6}px, ${offset.y * 4}px, 0)`
            : 'translate3d(0, 40px, 0)',
          opacity: isExitUp ? 0 : isActive ? (showPanels ? 0.45 : 1) : 0,
          transition: isExitUp
            ? 'opacity 0.6s ease-in-out'
            : isActive
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, opacity 0.6s ease-out'
            : 'transform 0.5s ease-in, opacity 0.4s ease-in',
        }}
      >
        {/* Watch */}
        <span className="font-sans font-semibold text-white/95 text-sm sm:text-base md:text-lg lg:text-xl tracking-wider mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Watch
        </span>

        {/* Launch Trailer */}
        <h2 className="font-sans font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.24em] uppercase whitespace-nowrap drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
          Launch Trailer
        </h2>
      </div>

      {/* Center Circular Play Button (Visible in trailer mode, fades out when panels open or exit) */}
      <div
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        style={{
          transform: isActive
            ? `translate3d(${offset.x * 12}px, ${offset.y * 8}px, 0)`
            : 'translate(0, 40px)',
          transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <a
          href="https://youtu.be/rz1B4B2yBZY?si=HyismYreh3y_JyoI"
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:scale-110 hover:shadow-[0_12px_40px_rgba(255,255,255,0.4)] transition-all duration-300 ease-out cursor-pointer ${
            isActive && !showPanels && !isExitUp
              ? 'scale-100 opacity-100 pointer-events-auto'
              : 'scale-75 opacity-0 pointer-events-none'
          }`}
          style={{
            transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.45s ease-out, box-shadow 0.3s ease',
          }}
          title="Watch Grand Theft Auto VI Launch Trailer on YouTube"
          aria-label="Play Grand Theft Auto VI Launch Trailer"
        >
          <span className="absolute inset-0 rounded-full bg-white/30 animate-ping pointer-events-none opacity-40 group-hover:opacity-70" />
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-neutral-900 fill-none ml-0.5 sm:ml-1 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
        </a>
      </div>

      {/* Background Dark Overlay for 4 Panels */}
      <div
        className="absolute inset-0 z-35 transition-all duration-700 ease-in-out pointer-events-none"
        style={{
          backgroundColor: showPanels && !isExitUp ? 'rgba(0, 0, 0, 0.65)' : 'rgba(0, 0, 0, 0)',
          backdropFilter: showPanels && !isExitUp ? 'blur(2px)' : 'blur(0px)',
        }}
      />

      {/* =========================================================================
          4-PANEL EXTEND TRAILER OVERLAY (Animates IN on scroll down, scrolls UP to reveal video)
          ========================================================================= */}
      <div
        className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-5 md:p-8 lg:p-10 pointer-events-none"
      >
        <div
          className={`w-full max-w-[1140px] xl:max-w-[1240px] flex flex-col justify-center select-none will-change-transform ${
            showPanels && !isExitUp ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{
            transform: isExitUp
              ? 'translate3d(0, -135%, 0)'
              : showPanels
              ? 'translate3d(0, 0, 0)'
              : 'translate3d(0, 50px, 0)',
            opacity: isExitUp ? 0 : showPanels ? 1 : 0,
            transition: isExitUp
              ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1)'
              : showPanels
              ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
              : 'transform 0.6s ease-in, opacity 0.4s ease-in',
          }}
        >
          {/* Top Large Feature Panel: Extend Trailer (extend.png) */}
          <div className="relative w-full h-[36vh] sm:h-[40vh] md:h-[44vh] lg:h-[46vh] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group">
            <img
              src={extend}
              alt="Extend Trailer"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
            />

            {/* Gradient shadow overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Bottom-left Content: Extend Trailer + Play Button */}
            <div className="absolute left-5 sm:left-8 md:left-10 bottom-5 sm:bottom-7 md:bottom-8 z-10 flex flex-col items-start pointer-events-auto">
              <h3 className="font-sans font-bold text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide mb-2 sm:mb-3">
                Extend Trailer
              </h3>

              <a
                href="https://youtu.be/rz1B4B2yBZY?si=HyismYreh3y_JyoI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group/btn"
                title="Play Extend Trailer"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900 fill-none transition-transform duration-200 group-hover/btn:scale-110"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
                <span>Play</span>
              </a>
            </div>
          </div>

          {/* Bottom Row of 3 Panels: img01.png, img02.png, img03.png */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5 w-full">
            {/* Panel 1: img01.png (Vice City Beach) */}
            <div className="relative h-[18vh] sm:h-[22vh] md:h-[24vh] lg:h-[26vh] rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group cursor-pointer">
              <img
                src={img01}
                alt="Vice City Beach Scene"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Panel 2: img02.png (Leonida Everglades Airboat) */}
            <div className="relative h-[18vh] sm:h-[22vh] md:h-[24vh] lg:h-[26vh] rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group cursor-pointer">
              <img
                src={img02}
                alt="Leonida Everglades Airboat Scene"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Panel 3: img03.png (Ocean View Hotel Supercar Strip) */}
            <div className="relative h-[18vh] sm:h-[22vh] md:h-[24vh] lg:h-[26vh] rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group cursor-pointer">
              <img
                src={img03}
                alt="Ocean View Hotel Night Strip Scene"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
