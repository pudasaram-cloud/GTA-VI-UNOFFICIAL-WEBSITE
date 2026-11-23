import { useState } from 'react'
import couple2 from '../assets/couple2.png'

export default function SecondPage({ isActive = false }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!isActive) return
    const { innerWidth, innerHeight } = window
    const x = (e.clientX / innerWidth - 0.5) * 2
    const y = (e.clientY / innerHeight - 0.5) * 2
    setOffset({ x, y })
  }

  const handleTouchMove = (e) => {
    if (!isActive || !e.touches[0]) return
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
      className="relative w-screen h-screen overflow-hidden select-none flex items-center justify-between"
      style={{
        background:
          'linear-gradient(180deg, #27213c 0%, #3e3153 18%, #664969 38%, #85586f 55%, #9b6164 72%, #aa6e53 88%, #a9663f 100%)',
      }}
    >
      {/* Background Ambient Glows */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ease-in-out"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        {/* Soft violet dusk glow at the top - Zero-cost radial gradient */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(126, 34, 206, 0.22) 0%, transparent 70%)' }}
        />
        {/* Warm sunset amber glow behind the card - Zero-cost radial gradient */}
        <div
          className="absolute top-1/2 right-10 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, transparent 70%)' }}
        />
      </div>

      {/* Left/Bottom Characters: Jason & Lucia (couple2.png) - Flush against bottom-left corner */}
      <div
        className="absolute -left-2 sm:-left-3 lg:-left-4 bottom-0 z-10 flex items-end justify-start pointer-events-none will-change-transform"
        style={{
          transform: isActive
            ? `translate3d(${Math.min(0, offset.x * 8)}px, ${offset.y * 5}px, 0) scale(1)`
            : 'translate3d(-90px, 20px, 0) scale(0.95)',
          opacity: isActive ? 1 : 0,
          transformOrigin: 'left bottom',
          transition: isActive
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.75s ease-out 0.15s'
            : 'transform 0.65s ease-in, opacity 0.55s ease-in',
        }}
      >
        <img
          src={couple2}
          alt="Jason and Lucia - Grand Theft Auto VI"
          className="h-[78vh] sm:h-[84vh] md:h-[90vh] lg:h-[95vh] xl:h-[97vh] w-auto max-w-none object-contain object-left-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      </div>

      {/* Right Side: Glassmorphism Information Card - Cinematic Crystallize Transition */}
      <div className="relative w-full h-full flex items-center justify-end px-6 sm:px-10 lg:px-14 xl:pr-20 z-20 pointer-events-none">
        <div
          className="w-full lg:w-[48%] xl:w-[45%] flex items-center justify-center lg:justify-end will-change-transform"
          style={{
            transform: isActive
              ? `translate3d(${offset.x * -6}px, ${offset.y * -4}px, 0) scale(1)`
              : 'translate3d(80px, 0, 0) scale(0.92)',
            opacity: isActive ? 1 : 0,
            filter: isActive ? 'blur(0px)' : 'blur(8px)',
            pointerEvents: isActive ? 'auto' : 'none',
            transition: isActive
              ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, opacity 0.75s ease-out 0.25s, filter 0.75s ease-out 0.25s'
              : 'transform 0.65s ease-in, opacity 0.55s ease-in, filter 0.55s ease-in',
          }}
        >
          <div className="w-full max-w-xl xl:max-w-2xl rounded-[28px] sm:rounded-[36px] bg-white/[0.09] backdrop-blur-2xl border border-white/30 p-8 sm:p-10 md:p-12 lg:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:bg-white/[0.12] hover:border-white/40">
            <p className="font-sans font-medium text-white/95 text-center text-sm sm:text-base md:text-lg lg:text-[1.18rem] xl:text-[1.25rem] leading-relaxed lg:leading-[1.75] tracking-wide drop-shadow-sm select-text">
              Grand Theft Auto VI takes players back to the iconic state of Leonida, featuring the neon-lit streets of Vice City and a vast, dynamic open world. Follow the story of Jason and Lucia as they navigate a dangerous world of crime, betrayal, and ambition. Experience thrilling missions, intense action, stunning visuals, and complete freedom in the next evolution of the Grand Theft Auto series.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
