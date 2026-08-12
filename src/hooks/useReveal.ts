import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fades up every `.reveal` element inside the returned ref as it enters the
 * viewport, staggered. One ScrollTrigger per section rather than a global
 * scroll listener — GSAP batches the actual scroll handling internally.
 */
export function useReveal<T extends HTMLElement>(stagger = 0.08) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.querySelectorAll<HTMLElement>('.reveal')
    if (!targets.length) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.01 : 0.7,
        ease: 'expo.out',
        stagger: reduced ? 0 : stagger,
        scrollTrigger: {
          trigger: root,
          start: 'top 82%',
          once: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [stagger])

  return ref
}
