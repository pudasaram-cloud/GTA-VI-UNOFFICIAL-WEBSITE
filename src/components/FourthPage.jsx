import { useState, useRef, useEffect, useCallback } from 'react'
import boat from '../assets/boat.mp4'
import chaseimage from '../assets/chaseimage.png'
import fifthImage from '../assets/5th.png'
import art from '../assets/art.jpg'
import club from '../assets/club.jpg'
import radio from '../assets/radio.jpg'
import newAsset from '../assets/new.jpg'
import ultimate from '../assets/ultimate.png'
import ultimatemain from '../assets/ultimatemain.png'
import gamecd from '../assets/ps5.png'
import NewsSection from './NewsSection'
import FooterSection from './FooterSection'

const BOAT_TARGET_TIME = 3.0 // Boat video target duration (0s -> 3s on scroll)

export default function FourthPage({ isActive = false, onScrollUp }) {
  const videoRef = useRef(null)
  const onScrollUpRef = useRef(onScrollUp)
  const touchStartYRef = useRef(0)
  const scrollContainerRef = useRef(null)
  const darkOverlayRef = useRef(null)
  const newsSectionRef = useRef(null)

  // Track panelIndex synchronously via ref to prevent async React state batching race conditions:
  // 0: boat.mp4 (0s -> 3s on scroll down)
  // 1: Ultimate Edition panel
  // 2: READY TO PLAY ON PS5 text
  // 3: GTA VI IS NOW AVAILABLE ON PS5! card (with ps5.png)
  // 4: chaseimage.png full width and height view
  // 5: chaseimage.png darkened with "LUCIA & JASON" story text
  // 6: 5th.png full width and height view (slides up from bottom, Lucia & Jason text exits up)
  // 7: 5th.png darkened with "VICE CITY, USA." story text & normal scrollable cards stream (no step animations)
  const panelIndexRef = useRef(0)
  const panelLockRef = useRef(false)

  // Reverse scrubbing animation refs
  const reverseAnimRef = useRef(null)
  const isReversingRef = useRef(false)
  const reverseSpeedRef = useRef(1.0)
  const lastReverseTimeRef = useRef(null)
  const navigatingBackTimeoutRef = useRef(null)

  // Active scroll pause timer (video plays while scrolling, pauses when scrolling stops)
  const scrollPauseTimerRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [panelIndex, setPanelIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Keep onScrollUp ref fresh
  useEffect(() => {
    onScrollUpRef.current = onScrollUp
  }, [onScrollUp])

  // Synchronous panel index update
  const setPanel = useCallback((idx) => {
    panelIndexRef.current = idx
    setPanelIndex(idx)
  }, [])

  // Stop any active reverse scrub loop
  const stopReverseScrub = useCallback(() => {
    isReversingRef.current = false
    if (reverseAnimRef.current) {
      cancelAnimationFrame(reverseAnimRef.current)
      reverseAnimRef.current = null
    }
    if (navigatingBackTimeoutRef.current) {
      clearTimeout(navigatingBackTimeoutRef.current)
      navigatingBackTimeoutRef.current = null
    }
    if (scrollPauseTimerRef.current) {
      clearTimeout(scrollPauseTimerRef.current)
      scrollPauseTimerRef.current = null
    }
  }, [])

  // Dynamic background darkening as user scrolls down through the cards and into news/footer
  // Transitions the fixed background seamlessly into deep navy blue (#050e1f) with zero cut lines or seams
  const handleContainerScroll = useCallback((e) => {
    const el = e.currentTarget
    if (!el) return

    // Calculate where NewsSection starts to finish darkening right as user scrolls past Card 4
    const newsEl = newsSectionRef.current
    const newsTop = newsEl ? newsEl.offsetTop : (el.scrollHeight - el.clientHeight) * 0.72
    const targetScroll = Math.max(1, newsTop - el.clientHeight * 0.45)
    const progress = Math.min(1, Math.max(0, el.scrollTop / targetScroll))

    if (darkOverlayRef.current) {
      darkOverlayRef.current.style.opacity = progress.toFixed(3)
    }
  }, [])

  // SCROLL DOWN:
  // 1. On Panel 0 (boat.mp4): Video ONLY plays while user is actively scrolling ("scroll krddi thma video ek play wenna one")
  //    Auto-pauses when scrolling stops. When video reaches ~3s, Panel 1 (Ultimate Edition) opens ("3s wage play unama next panel eka enna one").
  // 2. From Panel 1: Ultimate Edition exits UP, and "READY TO PLAY ON PS5" (Panel 2) slides UP from bottom
  // 3. From Panel 2: "READY TO PLAY ON PS5" exits UP, and "GTA VI IS NOW AVAILABLE ON PS5!" (Panel 3) slides UP from bottom
  // 4. From Panel 3: Panel 3 exits UP, and chaseimage.png slides UP full width and height!
  const handleScrollDown = useCallback((deltaY) => {
    // Cancel reverse scrub if active
    stopReverseScrub()

    // If panel transition is locked (cooldown in effect), ignore subsequent wheel ticks
    if (panelLockRef.current) return

    // CASE 1: Currently on Panel 1 (Ultimate Edition) -> Advance to Panel 2 (PS5 Text)
    if (panelIndexRef.current === 1) {
      panelLockRef.current = true
      setPanel(2)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 2: Currently on Panel 2 (PS5 Text) -> Advance to Panel 3 (PS5 Game Card)
    if (panelIndexRef.current === 2) {
      panelLockRef.current = true
      setPanel(3)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 3: Currently on Panel 3 (PS5 Card) -> Advance to Stage 4 (chaseimage.png)
    if (panelIndexRef.current === 3) {
      panelLockRef.current = true
      setPanel(4)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 4: Currently on Stage 4 (chaseimage.png) -> Advance to Stage 5 (Dark background + Lucia & Jason text slides UP)
    if (panelIndexRef.current === 4) {
      panelLockRef.current = true
      setPanel(5)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 5: Currently on Stage 5 (Lucia & Jason text) -> Advance to Stage 6 (5th.png slides UP, text exits UP)
    if (panelIndexRef.current === 5) {
      panelLockRef.current = true
      setPanel(6)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 6: Currently on Stage 6 (5th.png) -> Advance to Stage 7 (Dark background + Vice City text & normal scrollable cards section)
    if (panelIndexRef.current === 6) {
      panelLockRef.current = true
      setPanel(7)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
      if (darkOverlayRef.current) {
        darkOverlayRef.current.style.opacity = '0'
      }
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 7: Already on Stage 7 (Normal scroll section)
    if (panelIndexRef.current >= 7) {
      return
    }

    // CASE 0: On Panel 0 (initial boat video playback towards 3.0s)
    // Plays smoothly ONLY while scrolling down; auto-pauses when scrolling stops; upon reaching ~3s reveals Panel 1!
    if (panelIndexRef.current === 0 && videoRef.current) {
      const video = videoRef.current

      // If already at or very near 3.0s, this scroll down reveals Panel 1 (Ultimate Edition)!
      if (video.currentTime >= BOAT_TARGET_TIME - 0.15) {
        if (scrollPauseTimerRef.current) {
          clearTimeout(scrollPauseTimerRef.current)
          scrollPauseTimerRef.current = null
        }
        panelLockRef.current = true
        video.currentTime = BOAT_TARGET_TIME
        video.pause()
        setIsPlaying(false)
        setCurrentTime(BOAT_TARGET_TIME)
        setPanel(1)
        setTimeout(() => {
          panelLockRef.current = false
        }, 800)
        return
      }

      // Smoothly play boat video forward while scrolling
      video.playbackRate = 1.0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {})
      }

      // Auto-pause 220ms after scrolling stops, so it ONLY plays while user is actively scrolling!
      if (scrollPauseTimerRef.current) {
        clearTimeout(scrollPauseTimerRef.current)
      }
      scrollPauseTimerRef.current = setTimeout(() => {
        if (panelIndexRef.current === 0 && videoRef.current) {
          videoRef.current.pause()
          setIsPlaying(false)
        }
      }, 220)
      return
    }
  }, [setPanel, stopReverseScrub])

  // SCROLL UP:
  // 1. From Stage 6 (5th.png): slides DOWN out of view, Lucia & Jason text slides DOWN from top into center
  // 2. From Stage 5 (Lucia & Jason text): slides DOWN out of view, background brightens back to chaseimage.png
  // 3. From Stage 4 (chaseimage.png): slides DOWN out of view, and "GTA VI IS NOW AVAILABLE ON PS5!" (Panel 3) slides DOWN from top into center
  // 4. From Panel 3 (PS5 Card): Card slides DOWN out of view, "READY TO PLAY ON PS5" (Panel 2) slides DOWN from top into center
  // 5. From Panel 2 (PS5 Text): PS5 text slides DOWN out of view, Ultimate Edition (Panel 1) slides DOWN from top into center
  // 6. From Panel 1 (Ultimate Edition): Panel 1 slides DOWN out of view, boat.mp4 reverse-scrubs 3s -> 0s at normal 1.0x speed
  // 7. At 0s: Transitions back to previous page (Page 3)
  const handleScrollUp = useCallback(() => {
    if (scrollPauseTimerRef.current) {
      clearTimeout(scrollPauseTimerRef.current)
      scrollPauseTimerRef.current = null
    }

    // If panel transition is locked, ignore wheel momentum to prevent skipping panels
    if (panelLockRef.current) return

    // CASE 7 -> 6: Currently on Stage 7 (Vice City normal scroll section) -> Return to Stage 6 (5th.png full bright view)
    // Vice City normal scroll section slides DOWN out of view, 5th.png brightens back
    if (panelIndexRef.current === 7) {
      panelLockRef.current = true
      setPanel(6)
      if (darkOverlayRef.current) {
        darkOverlayRef.current.style.opacity = '0'
      }
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 6 -> 5: Currently on Stage 6 (5th.png) -> Return to Stage 5 (Lucia & Jason story text)
    // 5th.png slides DOWN out of view, Lucia & Jason text slides DOWN from top into center
    if (panelIndexRef.current === 6) {
      panelLockRef.current = true
      setPanel(5)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 5 -> 4: Currently on Stage 5 (Lucia & Jason text) -> Return to Stage 4 (chaseimage.png full bright view)
    // Lucia & Jason text slides DOWN out of view, background brightens back
    if (panelIndexRef.current === 5) {
      panelLockRef.current = true
      setPanel(4)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 4 -> 3: Currently on Stage 4 (chaseimage.png) -> Return to Panel 3 (PS5 Card)
    // Panel 3 slides DOWN from top into view, chaseimage slides DOWN out of view
    if (panelIndexRef.current === 4) {
      panelLockRef.current = true
      setPanel(3)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 3 -> 2: Currently on Panel 3 (PS5 Card) -> Return to Panel 2 (PS5 Text)
    // Panel 3 slides DOWN out of view, Panel 2 slides DOWN from top into view!
    if (panelIndexRef.current === 3) {
      panelLockRef.current = true
      setPanel(2)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 2 -> 1: Currently on Panel 2 (PS5 Text) -> Return to Panel 1 (Ultimate Edition)
    // Panel 2 slides DOWN out of view, Panel 1 slides DOWN from top into view!
    if (panelIndexRef.current === 2) {
      panelLockRef.current = true
      setPanel(1)
      setTimeout(() => {
        panelLockRef.current = false
      }, 800)
      return
    }

    // CASE 1 -> 0: Currently on Panel 1 (Ultimate Edition) -> Dismiss Panel 1 to bottom and reverse scrub boat.mp4
    if (panelIndexRef.current === 1) {
      panelLockRef.current = true
      setPanel(0)
      setTimeout(() => {
        panelLockRef.current = false
      }, 600)
    }

    if (!videoRef.current) return
    const video = videoRef.current

    // Pause forward playback immediately
    video.pause()
    setIsPlaying(false)

    // If already at or very close to the start (<= 0.08s), go to previous page directly
    if (video.currentTime <= 0.08) {
      stopReverseScrub()
      video.currentTime = 0
      setCurrentTime(0)
      onScrollUpRef.current?.()
      return
    }

    // If already reversing, keep playing at normal 1.0x speed without accelerating
    if (isReversingRef.current) {
      return
    }

    // Start smooth reverse scrub loop at normal 1.0x speed
    isReversingRef.current = true
    reverseSpeedRef.current = 1.0
    lastReverseTimeRef.current = performance.now()

    let lastSeekTime = performance.now()
    let accumulatedDt = 0

    const step = (now) => {
      if (!isReversingRef.current || !videoRef.current) return

      const dt = Math.min(0.08, (now - lastReverseTimeRef.current) / 1000)
      lastReverseTimeRef.current = now
      accumulatedDt += dt

      // Seek throttled to ~28-30fps (every 35ms) for butter-smooth browser video decoding
      if (now - lastSeekTime >= 35) {
        lastSeekTime = now
        const toSubtract = accumulatedDt * reverseSpeedRef.current
        accumulatedDt = 0

        const cur = videoRef.current.currentTime
        const nextTime = Math.max(0, cur - toSubtract)
        videoRef.current.currentTime = nextTime
        setCurrentTime(nextTime)

        // When reaching 0s: Stop reverse scrub and navigate to previous page!
        if (nextTime <= 0.05) {
          videoRef.current.currentTime = 0
          setCurrentTime(0)
          stopReverseScrub()
          navigatingBackTimeoutRef.current = setTimeout(() => {
            onScrollUpRef.current?.()
          }, 150)
          return
        }
      }

      reverseAnimRef.current = requestAnimationFrame(step)
    }

    reverseAnimRef.current = requestAnimationFrame(step)
  }, [setPanel, stopReverseScrub])

  // Reset / clean state whenever FourthPage becomes active or inactive
  useEffect(() => {
    panelLockRef.current = false

    if (isActive) {
      stopReverseScrub()
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.pause()
      }
      setIsPlaying(false)
      setPanel(0)
      setCurrentTime(0)
    } else {
      stopReverseScrub()
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      setIsPlaying(false)
      setPanel(0)
      setCurrentTime(0)
    }
    return () => {
      stopReverseScrub()
    }
  }, [isActive, setPanel, stopReverseScrub])

  // Monitor boat.mp4 time: update currentTime state for overlay opacity calculation.
  // When video reaches 3.0s, pauses video and opens Panel 1 ("3s wage play unama next panel eka enna one")!
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (isReversingRef.current) return // Handled by reverse scrub loop
      const cur = video.currentTime
      setCurrentTime(cur)

      // When reaching BOAT_TARGET_TIME (3.0s), hold at 3.0s and reveal Panel 1 (Ultimate Edition)
      if (cur >= BOAT_TARGET_TIME && panelIndexRef.current === 0) {
        if (scrollPauseTimerRef.current) {
          clearTimeout(scrollPauseTimerRef.current)
          scrollPauseTimerRef.current = null
        }
        video.currentTime = BOAT_TARGET_TIME
        video.pause()
        setIsPlaying(false)
        setPanel(1)
        panelLockRef.current = true
        setTimeout(() => {
          panelLockRef.current = false
        }, 800)
      }
    }

    const handleEnded = () => {
      if (panelIndexRef.current === 0) {
        if (scrollPauseTimerRef.current) {
          clearTimeout(scrollPauseTimerRef.current)
          scrollPauseTimerRef.current = null
        }
        video.currentTime = BOAT_TARGET_TIME
        video.pause()
        setIsPlaying(false)
        setPanel(1)
        panelLockRef.current = true
        setTimeout(() => {
          panelLockRef.current = false
        }, 800)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [setPanel])

  // Window Wheel & Keyboard listeners when active
  useEffect(() => {
    if (!isActive) return

    const handleWheel = (e) => {
      // When on Stage 7 (the normal scroll section with Vice City text and cards)
      if (panelIndexRef.current === 7) {
        const scrollEl = scrollContainerRef.current
        if (scrollEl) {
          // If user scrolls UP and is already at the very top (scrollTop <= 2), transition back to Stage 6!
          if (e.deltaY < -20 && scrollEl.scrollTop <= 2) {
            handleScrollUp()
          }
          // Otherwise, allow native normal scrolling down and up inside the container!
          return
        }
      }

      if (e.deltaY > 12) {
        handleScrollDown(e.deltaY)
      } else if (e.deltaY < -12) {
        handleScrollUp()
      }
    }

    const handleKeyDown = (e) => {
      if (panelIndexRef.current === 7) {
        const scrollEl = scrollContainerRef.current
        if (scrollEl && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
          if (scrollEl.scrollTop <= 2) {
            e.preventDefault()
            handleScrollUp()
          }
        }
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        handleScrollDown(60)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        handleScrollUp()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, handleScrollDown, handleScrollUp])

  // Touch handlers for mobile / tablet gestures (Bidirectional)
  const handleTouchStart = (e) => {
    if (!isActive || !e.touches[0]) return
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    if (!isActive || !e.touches[0]) return
    if (panelIndexRef.current === 7) {
      const scrollEl = scrollContainerRef.current
      if (scrollEl) {
        const currentY = e.touches[0].clientY
        const deltaY = touchStartYRef.current - currentY
        if (deltaY < -30 && scrollEl.scrollTop <= 2) {
          handleScrollUp()
        }
        return
      }
    }
    const currentY = e.touches[0].clientY
    const deltaY = touchStartYRef.current - currentY

    if (deltaY > 20) {
      handleScrollDown(deltaY * 2)
    } else if (deltaY < -20) {
      handleScrollUp()
    }
  }

  // Calculate dark blue overlay opacity:
  // - Panel 1, 2, and 3: 1 (starts fading in ONLY when Panel 1 arrives, held for Panel 2 & 3)
  // - Panel 0 & Stage 4 (chaseimage.png): 0 (completely crystal-clear view)
  const overlayOpacity = panelIndex >= 1 && panelIndex <= 3 ? 1 : 0

  return (
    <main
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`relative w-screen h-screen overflow-hidden bg-black select-none ${
        isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Background Video: boat.mp4 - Controlled by scroll (0s -> 3.0s, held on Panel 1-3) */}
      <div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none transition-opacity duration-1000 ease-in-out"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        <video
          ref={videoRef}
          src={boat}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center pointer-events-none transition-[filter] duration-700 ease-out"
          style={{
            filter: `brightness(${panelIndex >= 1 ? 0.78 : 1})`,
          }}
        />
      </div>

      {/* Cinematic Vignette Overlay */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/40 pointer-events-none transition-opacity duration-800 ease-in-out"
        style={{ opacity: isActive ? 1 : 0 }}
      />

      {/* Dark Blue Overlay over active video: ONLY active during Panel 1, 2, 3 */}
      <div
        className="absolute inset-0 z-15 pointer-events-none transition-all duration-800 ease-out"
        style={{
          background: 'linear-gradient(180deg, rgba(1, 4, 16, 0.91) 0%, rgba(2, 8, 28, 0.93) 50%, rgba(1, 4, 16, 0.91) 100%)',
          backdropFilter: panelIndex >= 1 && panelIndex <= 3 ? 'blur(3px)' : 'blur(0px)',
          WebkitBackdropFilter: panelIndex >= 1 && panelIndex <= 3 ? 'blur(3px)' : 'blur(0px)',
          opacity: overlayOpacity,
        }}
      />

      {/* Stage 4 & 5: chaseimage.png - Full width & height view */}
      <div
        className="absolute inset-0 w-full h-full z-20 pointer-events-none select-none will-change-transform overflow-hidden"
        style={{
          transform: panelIndex >= 4
            ? 'translate3d(0, 0, 0)'
            : 'translate3d(0, 100%, 0)',
          opacity: panelIndex >= 4 ? 1 : 0,
          transition: panelIndex >= 4
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
            : 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease-in',
        }}
      >
        <img
          src={chaseimage}
          alt="Grand Theft Auto VI Chase Scene"
          className="w-full h-full object-cover object-center pointer-events-none transition-[filter] duration-700 ease-out"
          style={{
            filter: `brightness(${panelIndex === 5 ? 0.65 : 1})`,
          }}
        />
      </div>

      {/* Dark Contrast Overlay for Stage 5: darkens background on the left where story text appears */}
      <div
        className="absolute inset-0 z-22 bg-gradient-to-r from-black/85 via-black/55 to-black/30 pointer-events-none transition-opacity duration-800 ease-out"
        style={{
          opacity: panelIndex === 5 ? 1 : 0,
        }}
      />

      {/* =========================================================================
          STAGE 5: LUCIA & JASON STORY TEXT
          - panelIndex === 5: translate3d(0, 0, 0), opacity 1
          - panelIndex >= 6: translate3d(0, -115%, 0), opacity 0 (exits UP into 5th section!)
          - panelIndex < 5: translate3d(0, 100%, 0), opacity 0 (below view)
          ========================================================================= */}
      <div
        className="absolute inset-0 z-30 flex flex-col justify-center items-start px-5 sm:px-12 md:px-16 lg:px-24 select-none pointer-events-none will-change-transform"
        style={{
          transform: panelIndex === 5
            ? 'translate3d(0, 0, 0)'
            : panelIndex >= 6
            ? 'translate3d(0, -115%, 0)'
            : 'translate3d(0, 100%, 0)',
          opacity: panelIndex === 5 ? 1 : 0,
          pointerEvents: panelIndex === 5 ? 'auto' : 'none',
          transition: panelIndex === 5
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
            : 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease-in',
        }}
      >
        <div className="max-w-[660px] text-left">
          {/* Main Heading: LUCIA & JASON */}
          <h2 className="font-sans font-black text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] tracking-tight uppercase leading-[0.98] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            LUCIA &amp; JASON
          </h2>

          {/* Description Paragraph */}
          <p className="mt-4 sm:mt-6 md:mt-8 text-white font-sans font-medium text-xs sm:text-base md:text-lg lg:text-xl xl:text-[22px] leading-relaxed md:leading-[1.48] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-[620px]">
            Lucia and Jason are two ambitious criminals chasing a better life in the dangerous streets of Leonida. Together, they face crime, betrayal, love, and difficult choices. In a world where trust is everything, they must rely on each other to survive.
          </p>
        </div>
      </div>

      {/* =========================================================================
          STAGE 6, 7 & 8: 5TH SECTION (5th.png)
          Slides UP from bottom to top over full width & height
          Stage 6: 100% bright full screen view
          Stage 7: Darkened + lightly blurred background with matching plum/twilight gradient and Vice City, USA. text
          Stage 8: Same darkened + blurred background with Media & Artwork card on top
          ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full z-35 pointer-events-none select-none will-change-transform overflow-hidden"
        style={{
          transform: panelIndex >= 6
            ? 'translate3d(0, 0, 0)'
            : 'translate3d(0, 100%, 0)',
          opacity: panelIndex >= 6 ? 1 : 0,
          transition: panelIndex >= 6
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
            : 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease-in',
        }}
      >
        <img
          src={fifthImage}
          alt="GTA VI 5th Section"
          className="w-full h-full object-cover object-center pointer-events-none transition-[filter,transform] duration-800 ease-out will-change-transform"
          style={{
            filter: panelIndex >= 7
              ? 'brightness(0.72) saturate(1.22) contrast(1.05) blur(6px)'
              : 'brightness(1) saturate(1) contrast(1) blur(0px)',
            transform: panelIndex >= 7 ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>

      {/* Dark & Color-Matching Plum / Twilight Gradient Overlay for Stage 7 */}
      <div
        className="absolute inset-0 z-36 pointer-events-none transition-opacity duration-800 ease-out"
        style={{
          background: 'linear-gradient(to right, rgba(23, 16, 36, 0.65) 0%, rgba(29, 18, 43, 0.42) 50%, rgba(18, 13, 28, 0.20) 100%)',
          opacity: panelIndex >= 7 ? 1 : 0,
        }}
      />

      {/* Dynamic Progressive Darkening Overlay (Starts at 0 opacity, smoothly transitions the whole background into deep navy blue #050e1f) */}
      <div
        ref={darkOverlayRef}
        className="absolute inset-0 z-37 pointer-events-none will-change-[opacity]"
        style={{
          backgroundColor: '#050e1f',
          opacity: 0,
        }}
      />

      {/* =========================================================================
          STAGE 7: NORMAL SCROLL SECTION (FROM "VICE CITY, USA." DOWNWARDS)
          - Natural smooth vertical page scrolling without locked step animations
          - Starts with "Vice City, USA." full screen
          - Flows continuously into the 4 cards: Media & Artwork, The Launch Gallery, Radio, Only in Leonida
          - Background remains darkened & blurred 5th.png with twilight plum overlay
          - Background gradient progressively darkens towards the final card
          ========================================================================= */}
      <div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        className={`absolute inset-0 z-38 overflow-y-auto overflow-x-hidden ${
          panelIndex === 7 ? 'pointer-events-auto select-auto' : 'pointer-events-none select-none'
        }`}
        style={{
          transform: panelIndex === 7 ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
          opacity: panelIndex === 7 ? 1 : 0,
          transition: panelIndex === 7
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
            : 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease-in',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Section 1: "Vice City, USA." Story Text */}
        <div className="min-h-screen flex flex-col justify-center items-start px-5 sm:px-12 md:px-16 lg:px-24 select-none">
          <div className="w-full max-w-[760px] lg:max-w-[840px] xl:max-w-[920px] text-left">
            {/* Main Heading: Vice City, USA. */}
            <h2 className="font-sans font-black text-[#fa7ba6] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] 2xl:text-[104px] tracking-tight leading-[0.96] drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">
              Vice City, USA.
            </h2>

            {/* Description Paragraph */}
            <p className="mt-4 sm:mt-7 md:mt-9 text-[#fbe6e3] font-sans font-medium text-sm sm:text-lg md:text-xl lg:text-[23px] xl:text-[26px] leading-[1.48] md:leading-[1.52] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] max-w-[760px] lg:max-w-[840px] xl:max-w-[900px]">
              Jason and Lucia have always known the deck is stacked against them. But when an easy score goes wrong, they find themselves on the darkest side of the sunniest place in America, in the middle of a criminal conspiracy stretching across the state of Leonida — forced to rely on each other more than ever if they want to make it out alive.
            </p>

            {/* Subtle Scroll Down Prompt */}
            <div className="mt-8 sm:mt-12 flex items-center gap-3 text-white/40">
              <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-sans font-semibold">Scroll down</span>
              <span className="animate-bounce font-mono text-base sm:text-lg">↓</span>
            </div>
          </div>
        </div>

        {/* Section 2: Cards Stack (Flows vertically, background remains unbroken fixed viewport) */}
        <div className="w-full flex flex-col items-center gap-12 sm:gap-16 md:gap-20 pb-24 sm:pb-32 px-4 sm:px-6 md:px-8 bg-transparent">
          {/* Card 1: Media & Artwork */}
          <div className="relative w-[92vw] max-w-[1080px] xl:max-w-[1140px] h-[62vh] min-h-[440px] max-h-[590px] xl:max-h-[630px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center">
            <img
              src={art}
              alt="GTA VI Media & Artwork"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%] pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/45 to-transparent pointer-events-none" />
            <div className="relative z-10 w-full h-full flex flex-col justify-end items-start text-left p-6 sm:p-8 md:p-10 lg:p-12 select-none">
              <span className="font-sans font-bold text-[#b7c5b0] tracking-[0.2em] uppercase text-[11px] sm:text-xs md:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                DOWNLOADS
              </span>
              <h2 className="mt-1.5 sm:mt-2 font-sans font-black text-[#fdf8d7] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] tracking-tight uppercase leading-[0.98] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                <span className="block">MEDIA &amp; ARTWORK</span>
              </h2>
              <p className="mt-2.5 sm:mt-3 text-white/95 font-sans font-medium text-xs sm:text-sm md:text-base leading-snug max-w-[280px] sm:max-w-[320px] md:max-w-[360px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Download and share official videos, screenshots, and more.
              </p>
              <button
                type="button"
                className="mt-4 sm:mt-5 inline-flex items-center gap-2 bg-[#f6d78d] hover:bg-[#ebd07c] text-neutral-950 font-sans font-bold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_4px_16px_rgba(246,215,141,0.35)] hover:shadow-[0_6px_22px_rgba(246,215,141,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
              >
                <span>See All</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono text-sm">→</span>
              </button>
            </div>
          </div>

          {/* Card 2: The Launch Gallery */}
          <div className="relative w-[92vw] max-w-[1080px] xl:max-w-[1140px] h-[62vh] min-h-[440px] max-h-[590px] xl:max-h-[630px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center">
            <img
              src={club}
              alt="GTA VI The Launch Gallery"
              className="absolute inset-0 w-full h-full object-cover object-[18%_center] pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/90 via-black/50 to-transparent pointer-events-none" />
            <div className="relative z-10 w-full h-full flex flex-col justify-end items-start md:items-end p-6 sm:p-8 md:p-10 lg:p-12 select-none">
              <div className="flex flex-col items-start text-left max-w-[320px] sm:max-w-[360px] md:max-w-[400px] mr-0 md:mr-6 lg:mr-10">
                <span className="font-sans font-bold text-[#b8d4f6] tracking-[0.2em] uppercase text-[11px] sm:text-xs md:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  SCREENSHOTS
                </span>
                <h2 className="mt-1.5 sm:mt-2 font-sans font-black text-[#fdf8d7] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] tracking-tight uppercase leading-[0.98] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                  <span className="block">THE LAUNCH</span>
                  <span className="block mt-0.5">GALLERY</span>
                </h2>
                <p className="mt-2.5 sm:mt-3 text-white/95 font-sans font-medium text-xs sm:text-sm md:text-base leading-snug max-w-[320px] sm:max-w-[360px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Get a stunning look inside Leonida with a collection of new screenshots.
                </p>
                <button
                  type="button"
                  className="mt-4 sm:mt-5 inline-flex items-center gap-2 bg-[#dcf763] hover:bg-[#cde950] text-neutral-950 font-sans font-bold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_4px_16px_rgba(220,247,99,0.35)] hover:shadow-[0_6px_22px_rgba(220,247,99,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
                >
                  <span>View All</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono text-sm">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: In-Game Radio, Soundtrack, and Score */}
          <div className="relative w-[92vw] max-w-[1080px] xl:max-w-[1140px] h-[62vh] min-h-[440px] max-h-[590px] xl:max-h-[630px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center">
            <img
              src={radio}
              alt="GTA VI In-Game Radio, Soundtrack, and Score"
              className="absolute inset-0 w-full h-full object-cover object-[center_28%] pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/45 to-transparent pointer-events-none" />
            <div className="relative z-10 w-full h-full flex flex-col justify-end items-start text-left p-6 sm:p-8 md:p-10 lg:p-12 select-none">
              <span className="font-sans font-bold text-white/90 tracking-[0.2em] uppercase text-[11px] sm:text-xs md:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                MUSIC
              </span>
              <h2 className="mt-1.5 sm:mt-2 font-sans font-black text-[#fffbd7] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] tracking-tight uppercase leading-[0.98] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                <span className="block">IN-GAME RADIO,</span>
                <span className="block mt-0.5">SOUNDTRACK,</span>
                <span className="block mt-0.5">AND SCORE</span>
              </h2>
              <p className="mt-2.5 sm:mt-3 text-white/95 font-sans font-medium text-xs sm:text-sm md:text-base leading-snug max-w-[320px] sm:max-w-[360px] md:max-w-[400px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Listen to the Official Score and Soundtrack, plus select in-game radio stations.
              </p>
              <button
                type="button"
                className="mt-4 sm:mt-5 inline-flex items-center gap-2 bg-[#fdd4a8] hover:bg-[#f6c694] text-neutral-950 font-sans font-bold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_4px_16px_rgba(253,212,168,0.35)] hover:shadow-[0_6px_22px_rgba(253,212,168,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
              >
                <span>Explore More</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono text-sm">→</span>
              </button>
            </div>
          </div>

          {/* Card 4: Only in Leonida */}
          <div className="relative w-[92vw] max-w-[1080px] xl:max-w-[1140px] h-[62vh] min-h-[440px] max-h-[590px] xl:max-h-[630px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center">
            <img
              src={newAsset}
              alt="GTA VI Only in Leonida"
              className="absolute inset-0 w-full h-full object-cover object-[20%_center] pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/90 via-black/50 to-transparent pointer-events-none" />
            <div className="relative z-10 w-full h-full flex flex-col justify-end items-start md:items-end p-6 sm:p-8 md:p-10 lg:p-12 select-none">
              <div className="flex flex-col items-start text-left max-w-[340px] sm:max-w-[380px] md:max-w-[440px] mr-0 md:mr-6 lg:mr-10">
                <span className="font-sans font-bold text-[#bfe8f9] tracking-[0.2em] uppercase text-[11px] sm:text-xs md:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  PEOPLE &amp; PLACES
                </span>
                <h2 className="mt-1.5 sm:mt-2 font-sans font-black text-[#fffbd7] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] tracking-tight uppercase leading-[0.98] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                  <span className="block">ONLY IN LEONIDA</span>
                </h2>
                <p className="mt-2.5 sm:mt-3 text-white/95 font-sans font-medium text-xs sm:text-sm md:text-base leading-snug max-w-[340px] sm:max-w-[380px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Vice City, USA. The darkest side of the sunniest place in America.
                </p>
                <button
                  type="button"
                  className="mt-4 sm:mt-5 inline-flex items-center gap-2 bg-[#ffa68d] hover:bg-[#f8957c] text-neutral-950 font-sans font-bold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_4px_16px_rgba(255,166,141,0.35)] hover:shadow-[0_6px_22px_rgba(255,166,141,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
                >
                  <span>Explore More</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono text-sm">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: News and updates (Seamlessly on deep blue background) */}
        <div ref={newsSectionRef} className="w-full">
          <NewsSection />
        </div>

        {/* Section 4: Footer */}
        <FooterSection />
      </div>

      {/* =========================================================================
          PANEL 1: ULTIMATE EDITION PANEL
          - panelIndex === 0: translate3d(0, 115%, 0) (below view)
          - panelIndex === 1: translate3d(0, 0, 0) (centered in view)
          - panelIndex >= 2: translate3d(0, -115%, 0) (above view)
          When scrolling UP from Panel 2, Panel 1 slides DOWN from top into view!
          ========================================================================= */}
      <div
        className="absolute inset-0 z-25 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 pointer-events-none select-none will-change-transform"
        style={{
          transform: panelIndex === 1
            ? 'translate3d(0, 0, 0)'
            : panelIndex >= 2
            ? 'translate3d(0, -115%, 0)'
            : 'translate3d(0, 115%, 0)',
          opacity: panelIndex === 1 ? 1 : 0,
          pointerEvents: panelIndex === 1 ? 'auto' : 'none',
          transition: panelIndex === 1
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
            : 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease-in',
        }}
      >
        {/* Main Glassmorphic Card Container */}
        <div className="relative w-[92vw] max-w-[1080px] xl:max-w-[1140px] h-[78vh] min-h-[500px] sm:min-h-[560px] max-h-[720px] xl:max-h-[760px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center p-5 sm:p-8 md:p-12 lg:p-14">
          {/* Card Background Image: ultimate.png */}
          <img
            src={ultimate}
            alt="GTA VI Ultimate Edition Background"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Contrast Gradient Overlay on Card Background */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/50 via-black/25 to-black/30 md:from-black/35 md:via-transparent md:to-black/20 pointer-events-none" />

          {/* Inner Content Grid */}
          <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 sm:gap-6 md:gap-12 lg:gap-16">
            {/* Left Side: ultimatemain.png (Game Box Cover) */}
            <div className="flex-shrink-0 h-[38%] sm:h-[48%] md:h-[88%] lg:h-[92%] max-h-[560px] xl:max-h-[600px] aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.7)] group">
              <img
                src={ultimatemain}
                alt="Grand Theft Auto VI Ultimate Edition Cover Art"
                className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-103"
              />
            </div>

            {/* Right Side: Title, Description, Button */}
            <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
              <h2 className="font-sans font-black text-[#f6be3c] text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl tracking-wide uppercase leading-[0.92] drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]">
                <span className="block">ULTIMATE</span>
                <span className="block mt-0.5 sm:mt-1">EDITION</span>
              </h2>

              <p className="mt-2.5 sm:mt-4 md:mt-6 text-white/95 font-sans font-medium text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-[480px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                GTA VI Ultimate Edition: Experience the ultimate adventure with exclusive bonus content, premium rewards special in-game items, and an enhanced Grand Theft Auto VI experience.
              </p>

              <button
                type="button"
                className="mt-4 sm:mt-6 md:mt-9 inline-flex items-center gap-2.5 bg-[#f5b642] hover:bg-[#e8aa33] text-neutral-950 font-sans font-bold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-[0_6px_22px_rgba(245,182,66,0.35)] hover:shadow-[0_8px_28px_rgba(245,182,66,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
              >
                <span>Learn more</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono text-sm md:text-base">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANEL 2: READY TO PLAY ON PS5
          - panelIndex === 2: translate3d(0, 0, 0), opacity 1
          - panelIndex >= 3: translate3d(0, -115%, 0), opacity 0 (exits UP into Panel 3)
          - panelIndex < 2: translate3d(0, 115%, 0), opacity 0 (below view)
          ========================================================================= */}
      <div
        className="absolute inset-0 z-25 flex items-center justify-center p-6 sm:p-10 md:p-16 pointer-events-none select-none will-change-transform"
        style={{
          transform: panelIndex === 2
            ? 'translate3d(0, 0, 0)'
            : panelIndex >= 3
            ? 'translate3d(0, -115%, 0)'
            : 'translate3d(0, 115%, 0)',
          opacity: panelIndex === 2 ? 1 : 0,
          pointerEvents: panelIndex === 2 ? 'auto' : 'none',
          transition: panelIndex === 2
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
            : 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease-in',
        }}
      >
        {/* Centered Heading: READY TO PLAY ON PS5 (No background panel) */}
        <div className="flex flex-col items-center justify-center text-center select-none max-w-[1100px] px-4">
          <h2 className="font-sans font-black text-white text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[104px] tracking-tight uppercase leading-[1.04] drop-shadow-[0_6px_36px_rgba(0,0,0,0.95)]">
            <span className="block">READY TO PLAY</span>
            <span className="block mt-2 sm:mt-5">ON PS5</span>
          </h2>
        </div>
      </div>

      {/* =========================================================================
          PANEL 3: GTA VI IS NOW AVAILABLE ON PS5!
          - panelIndex === 3: translate3d(0, 0, 0), opacity 1
          - panelIndex >= 4: translate3d(0, -115%, 0), opacity 0 (exits UP into chase.mp4 view)
          - panelIndex < 3: translate3d(0, 115%, 0), opacity 0 (below view)
          Slides UP with the exact same animation matching the panels above!
          ========================================================================= */}
      <div
        className="absolute inset-0 z-25 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 pointer-events-none select-none will-change-transform"
        style={{
          transform: panelIndex === 3
            ? 'translate3d(0, 0, 0)'
            : panelIndex >= 4
            ? 'translate3d(0, -115%, 0)'
            : 'translate3d(0, 115%, 0)',
          opacity: panelIndex === 3 ? 1 : 0,
          pointerEvents: panelIndex === 3 ? 'auto' : 'none',
          transition: panelIndex === 3
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out'
            : 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease-in',
        }}
      >
        {/* Main White Card Container matching reference image */}
        <div className="relative w-[92vw] max-w-[1080px] xl:max-w-[1140px] h-[78vh] min-h-[500px] sm:min-h-[560px] max-h-[720px] xl:max-h-[760px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center p-5 sm:p-8 md:p-12 lg:p-14 bg-white select-none">
          {/* Inner Content Grid */}
          <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 sm:gap-6 md:gap-12 lg:gap-16">
            {/* Left Side: gamecd.png (PS5 Game Box & Disc) */}
            <div className="flex-shrink-0 h-[36%] sm:h-[46%] md:h-[88%] lg:h-[92%] max-h-[560px] xl:max-h-[600px] max-w-[90%] md:max-w-[48%] flex items-center justify-center group">
              <img
                src={gamecd}
                alt="Grand Theft Auto VI PS5 Game Case and Disc"
                className="w-full h-full object-contain object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-103 drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Right Side: Title, Description, Button */}
            <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
              {/* Heading: GTA VI IS NOW AVAILABLE ON PS5! */}
              <h2 className="font-sans font-black text-neutral-950 text-2xl sm:text-3xl md:text-5xl lg:text-[50px] xl:text-[56px] tracking-tight uppercase leading-[1.0] drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                <span className="block">GTA VI IS NOW AVAILABLE</span>
                <span className="block mt-0.5 sm:mt-1 md:mt-2">ON PS5!</span>
              </h2>

              {/* Description Paragraph */}
              <p className="mt-2.5 sm:mt-4 md:mt-6 text-neutral-600 font-sans font-medium text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed max-w-[480px]">
                The wait is over! Grand Theft Auto VI takes you back to the vibrant streets of Vice City, where crime, ambition, and adventure collide. Explore a breathtaking open world, follow an unforgettable story, and experience thrilling action with Lucia and Jason. Get ready for the next generation of Grand Theft Auto!
              </p>

              {/* Action Button: Learn more -> */}
              <button
                type="button"
                className="mt-4 sm:mt-6 md:mt-9 inline-flex items-center gap-2.5 bg-[#f5b642] hover:bg-[#e8aa33] text-neutral-950 font-sans font-bold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-[0_6px_22px_rgba(245,182,66,0.35)] hover:shadow-[0_8px_28px_rgba(245,182,66,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
              >
                <span>Learn more</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono text-sm md:text-base">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
