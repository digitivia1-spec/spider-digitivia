import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Physical, weighted scroll instead of the browser's flat native scroll —
 * this is most of what makes scroll-driven motion read as "premium" rather
 * than a page that happens to have some animations on it. Drives GSAP's
 * ticker so every ScrollTrigger in the app (hero parallax, chapter/archive
 * scrub) stays perfectly in sync with Lenis's eased position instead of the
 * raw scrollTop. Off entirely under prefers-reduced-motion and on touch —
 * native scroll is already the physically correct feel for a finger drag.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1,
      wheelMultiplier: 1,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
