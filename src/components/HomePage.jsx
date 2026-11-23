import { useState, useEffect } from 'react'
import background from '../assets/background.png'
import couple from '../assets/couple.png'
import logosix from '../assets/logosix.png'
import rockstar from '../assets/rockstar.png'

export default function HomePage({ isActive = true }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isRevealed, setIsRevealed] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen to disable 3D effects and optimize layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Trigger initial smooth entrance, then switch to subtle real-time 3D parallax on desktop
  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setIsRevealed(true)
    }, 50)

    // After 1050ms entrance finishes, activate subtle 3D interactive tracking on desktop
    const interactiveTimer = setTimeout(() => {
      setIsInteractive(true)
    }, 1050)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(interactiveTimer)
    }
  }, [])

  const handleMouseMove = (e) => {
    if (isMobile || !isRevealed || !isActive) return
    const { innerWidth, innerHeight } = window
    const x = (e.clientX / innerWidth - 0.5) * 2
    const y = (e.clientY / innerHeight - 0.5) * 2
    setOffset({ x, y })
  }

  const handleTouchMove = (e) => {
    // 3D parallax disabled on mobile touch screens
    if (isMobile || !isRevealed || !isActive || !e.touches[0]) return
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
      className="relative w-screen h-screen overflow-hidden bg-[#06040a] select-none md:[perspective:1400px]"
      style={{ perspective: isMobile ? 'none' : '1400px' }}
    >
      {/* Layer 1: Background (Vice City Skyline Sunset) */}
      <div
        className="absolute inset-0 w-full h-full z-0 will-change-transform pointer-events-none"
        style={{
          transform: isActive
            ? (isMobile
              ? 'scale(1) translate(0, 0)'
              : (isInteractive
                ? `scale(1.04) translate3d(${offset.x * -7}px, ${offset.y * -4}px, -20px) rotateY(${offset.x * -0.6}deg) rotateX(${-offset.y * -0.4}deg)`
                : `scale(${isRevealed ? 1.04 : 1.08}) translate(0, 0)`))
            : 'scale(1.08) translate(0, 0)',
          filter: isActive
            ? (isRevealed ? 'brightness(1) blur(0px)' : 'brightness(0.6) blur(5px)')
            : 'brightness(0.4) blur(6px)',
          opacity: isActive ? (isRevealed ? 1 : 0) : 0,
          transition: !isActive
            ? 'opacity 0.75s ease-in-out, filter 0.75s ease-in-out, transform 0.75s ease-in-out'
            : (isInteractive && !isMobile
              ? 'transform 0.28s ease-out, opacity 0.8s ease-out, filter 0.8s ease-out'
              : (isRevealed ? 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-out, filter 1s ease-out' : 'none')),
        }}
      >
        <img
          src={background}
          alt="Vice City Skyline Background"
          className="w-full h-full object-cover object-top pointer-events-none"
        />
      </div>

      {/* Layer 2: Grand Theft Auto VI Text & Logo - Midground Layer */}
      <div
        className="absolute left-5 sm:left-[4.1%] top-6 sm:top-[21.5%] z-[25] sm:z-10 w-[88vw] sm:w-[45vw] flex flex-col will-change-transform pointer-events-none select-none"
        style={{
          transform: isActive
            ? (isMobile
              ? (isRevealed ? 'translate(0, 0)' : 'translate(-30px, 0)')
              : (isInteractive
                ? `translate3d(${offset.x * 5}px, ${offset.y * 3}px, 10px) rotateY(${offset.x * 0.8}deg) rotateX(${-offset.y * 0.6}deg)`
                : `translate(${isRevealed ? 0 : -45}px, 0)`))
            : 'translate3d(-90px, 0, 0)',
          opacity: isActive ? (isRevealed ? 1 : 0) : 0,
          filter: isActive ? (isRevealed ? 'blur(0px)' : 'blur(3px)') : 'blur(6px)',
          transformOrigin: 'left center',
          transition: !isActive
            ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-in-out, filter 0.6s ease-in-out'
            : (isInteractive && !isMobile
              ? 'transform 0.25s ease-out, opacity 0.8s ease-out, filter 0.8s ease-out'
              : (isRevealed ? 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, opacity 0.85s ease-out 0.25s, filter 0.85s ease-out 0.25s' : 'none')),
        }}
      >
        {/* Main Title: GRAND THEFT AUTO (Prominently large on mobile) */}
        <div className="relative z-10 font-pricedown text-white gta-clean-shadow select-none">
          {/* Line 1: GRAND THEFT */}
          <div className="text-[11vw] sm:text-[8.4vw] tracking-tight whitespace-nowrap leading-[0.84] uppercase">
            GRAND THEFT
          </div>

          {/* Line 2: AUTO with November 19, 2026 clearly spaced below it */}
          <div className="inline-flex flex-col mt-1 sm:mt-2">
            <div className="text-[11vw] sm:text-[8.4vw] tracking-tight leading-[0.84]">
              {'\uE000UTO'}
            </div>

            {/* Subtext: November 19, 2026 */}
            <div className="self-end text-right mt-1.5 sm:mt-3 md:mt-3.5">
              <span className="font-sans font-bold text-xs sm:text-[1.5vw] md:text-[1.3vw] lg:text-[1.15vw] tracking-wide text-white drop-shadow-md whitespace-nowrap normal-case inline-block">
                November 19, 2026
              </span>
            </div>
          </div>
        </div>

        {/* VI Logo Image placed directly underneath */}
        <div
          className="relative z-0 w-[42vw] sm:w-[48%] md:w-[46%] -mt-[2.5vw] sm:-mt-[3.2vw] md:-mt-[3.6vw] -ml-[2%] will-change-transform"
          style={{
            transform: isActive
              ? (isRevealed ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(18px)')
              : 'scale(0.8) translateY(24px)',
            opacity: isActive ? (isRevealed ? 1 : 0) : 0,
            transition: !isActive
              ? 'transform 0.6s ease-in, opacity 0.5s ease-in'
              : (isRevealed
                ? 'transform 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.45s, opacity 0.75s ease-out 0.45s'
                : 'none'),
          }}
        >
          <img
            src={logosix}
            alt="GTA VI Logo"
            className="w-full h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>

      {/* Layer 3: Characters (Jason and Lucia) - Foreground Hero Layer */}
      <div
        className="absolute inset-0 w-full h-full z-20 will-change-transform pointer-events-none"
        style={{
          transform: isActive
            ? (isMobile
              ? (isRevealed ? 'translate(0, 10%) scale(1)' : 'translate(0, 15%) scale(1)')
              : (isInteractive
                ? `translate3d(calc(3.8vw + ${offset.x * 12}px), ${offset.y * 7}px, 20px) rotateY(${offset.x * 1.2}deg) rotateX(${-offset.y * 0.9}deg) scale(1.01)`
                : `translate3d(3.8vw, ${isRevealed ? 0 : 30}px, 0) scale(${isRevealed ? 1.01 : 1.03})`))
            : 'translate3d(calc(3.8vw + 80px), 10px, 0) scale(0.98)',
          opacity: isActive ? (isRevealed ? 1 : 0) : 0,
          transformOrigin: 'center bottom',
          transition: !isActive
            ? 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.65s ease-in-out'
            : (isInteractive && !isMobile
              ? 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease-out'
              : (isRevealed ? 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.9s ease-out 0.15s' : 'none')),
        }}
      >
        <img
          src={couple}
          alt="Jason and Lucia"
          className="w-full h-full object-cover object-top pointer-events-none"
        />
      </div>

      {/* Layer 4: Rockstar Games Emblem (Top-Right) */}
      <div
        className="absolute top-4 right-4 sm:top-5 sm:right-6 md:top-6 md:right-8 z-30 w-12 sm:w-16 md:w-20 will-change-transform pointer-events-none select-none"
        style={{
          transform: isActive
            ? (isMobile
              ? (isRevealed ? 'translate(0, 0) scale(1)' : 'translate(0, -20px) scale(0.8)')
              : (isInteractive
                ? `translate3d(${offset.x * 4}px, ${offset.y * 2}px, 25px)`
                : (isRevealed ? 'translate(0, 0) scale(1) rotate(0deg)' : 'translate(0, -25px) scale(0.7) rotate(-10deg)')))
            : 'translate(0, -20px) scale(0.8)',
          opacity: isActive ? (isRevealed ? 1 : 0) : 0,
          transition: !isActive
            ? 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
            : (isInteractive && !isMobile
              ? 'transform 0.25s ease-out, opacity 0.8s ease-out'
              : (isRevealed ? 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.65s, opacity 0.75s ease-out 0.65s' : 'none')),
        }}
      >
        <img
          src={rockstar}
          alt="Rockstar Games"
          className="w-full h-auto drop-shadow-xl"
        />
      </div>
    </main>
  )
}
