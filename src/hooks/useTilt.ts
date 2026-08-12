import { useEffect, useRef } from 'react'

/**
 * 3D pointer/touch-follow tilt + a light-position CSS var for a glow that
 * tracks the same point — the "premium product card" microinteraction.
 * Works from both hover (desktop) and touch (drag-across, not just tap) so
 * it isn't a mouse-only effect stapled onto a mobile-first page.
 */
export function useTilt<T extends HTMLElement>(strength = 10) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const set = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect()
      const px = (clientX - r.left) / r.width
      const py = (clientY - r.top) / r.height
      const rx = (0.5 - py) * strength
      const ry = (px - 0.5) * strength
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
      el.style.setProperty('--tilt-x', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--tilt-y', `${(py * 100).toFixed(1)}%`)
      el.style.setProperty('--tilt-glow', '1')
    }
    const reset = () => {
      el.style.transform = ''
      el.style.setProperty('--tilt-glow', '0')
    }

    const onMouseMove = (e: MouseEvent) => set(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) set(t.clientX, t.clientY)
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', reset)
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', reset)
    el.addEventListener('touchcancel', reset)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', reset)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', reset)
      el.removeEventListener('touchcancel', reset)
    }
  }, [strength])

  return ref
}
