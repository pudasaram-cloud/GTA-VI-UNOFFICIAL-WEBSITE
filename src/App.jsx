import { useState, useRef, useEffect } from 'react'
import HomePage from './components/HomePage'
import SecondPage from './components/SecondPage'
import ThirdPage from './components/ThirdPage'
import FourthPage from './components/FourthPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState(0) // 0: Home, 1: Story, 2: Trailer, 3: Trailer 4-Panels, 4: Boat Video (4th Page)
  const isLockedRef = useRef(false)
  const touchStartYRef = useRef(0)

  const changePage = (newPage) => {
    if (isLockedRef.current || newPage === currentPage || newPage < 0 || newPage > 4) return
    isLockedRef.current = true
    setCurrentPage(newPage)
    setTimeout(() => {
      isLockedRef.current = false
    }, 850)
  }

  // Wheel listener:
  // - 0 ⇄ 1: In-place cinematic morph
  // - 1 ⇄ 2: ThirdPage slides UP from bottom
  // - 2 ⇄ 3: ThirdPage darkens in-place and reveals 4 panels
  // - 3 ⇄ 4: 4 panels slide UP out of view and background cross-fades to boat.mp4 video!
  // Page 4 handles its own internal scroll-down (0s -> 2s play) and scroll-up (panel down, 2s -> 0s reverse scrub, then onScrollUp)
  const handleWheel = (e) => {
    if (isLockedRef.current) return
    if (currentPage === 4) return // Page 4 handles its own bidirectional scrub and page transition
    if (e.deltaY > 20) {
      if (currentPage < 4) changePage(currentPage + 1)
    } else if (e.deltaY < -20) {
      if (currentPage > 0) changePage(currentPage - 1)
    }
  }

  // Touch swipe support for mobile / trackpads
  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    if (isLockedRef.current || !e.touches[0]) return
    if (currentPage === 4) return // Page 4 handles its own touch swipe gestures
    const currentY = e.touches[0].clientY
    const deltaY = touchStartYRef.current - currentY

    if (deltaY > 40) {
      if (currentPage < 4) changePage(currentPage + 1)
    } else if (deltaY < -40) {
      if (currentPage > 0) changePage(currentPage - 1)
    }
  }

  // Keyboard navigation (ArrowDown / ArrowUp / PageDown / PageUp / Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLockedRef.current) return
      if (currentPage === 4) return // Page 4 handles its own keyboard navigation
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        if (currentPage < 4) changePage(currentPage + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (currentPage > 0) changePage(currentPage - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage])

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative w-screen h-screen overflow-hidden bg-[#06040a] select-none"
    >
      {/* Scene 1: Home Page Hero Keyart */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-800 ease-in-out ${
          currentPage === 0
            ? 'z-10 pointer-events-auto opacity-100'
            : 'z-0 pointer-events-none opacity-0'
        }`}
      >
        <HomePage isActive={currentPage === 0} />
      </div>

      {/* Scene 2: Second Page Story & World */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-900 ease-out ${
          currentPage === 1
            ? 'z-20 pointer-events-auto opacity-100 translate-y-0'
            : currentPage >= 2
            ? 'z-0 pointer-events-none opacity-0 -translate-y-[10vh]'
            : 'z-0 pointer-events-none opacity-0 translate-y-0'
        }`}
      >
        <SecondPage isActive={currentPage === 1} />
      </div>

      {/* Scene 4: Fourth Page (boat.mp4 Video Background) - Mounted & visible when currentPage >= 3 so boat.mp4 is visible immediately when scrolling down from ThirdPage */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-600 ease-in-out ${
          currentPage >= 3
            ? 'z-25 opacity-100'
            : 'z-0 opacity-0'
        } ${currentPage === 4 ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <FourthPage
          isActive={currentPage === 4}
          onScrollUp={() => changePage(3)}
        />
      </div>

      {/* Scene 3: Third Page Trailer & 4-Panels (Panels slide UP on transition to Scene 4) */}
      <div
        className="absolute inset-0 w-full h-full z-30 will-change-transform drop-shadow-[0_-25px_60px_rgba(0,0,0,0.85)]"
        style={{
          transform: currentPage >= 2 ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
          pointerEvents: currentPage === 2 || currentPage === 3 ? 'auto' : 'none',
          transition: 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <ThirdPage
          isActive={currentPage >= 2}
          showPanels={currentPage === 3}
          isExitUp={currentPage === 4}
        />
      </div>
    </div>
  )
}
