import './Cursor.css'
import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  t: number
}

const TRAIL_MS = 620
const MIN_DIST = 10

/**
 * Custom cursor matching the reference's cursor:none + full-viewport
 * pointer-events:none canvas pattern. Two input branches share one trail
 * engine: a mouse gets the dot+ring follower plus the web-strand trail
 * (native cursor hidden); touch gets the trail only, drawn from finger
 * position on drag — there is no resting position to show a dot/ring at
 * between touches, and hiding the (nonexistent) native cursor is moot on
 * touch anyway. Bows out entirely under prefers-reduced-motion.
 */
export function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || innerWidth < 900) return

    const fine = matchMedia('(pointer: fine) and (hover: hover)').matches
    const coarse = matchMedia('(pointer: coarse)').matches
    if (!fine && !coarse) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      canvas.style.width = innerWidth + 'px'
      canvas.style.height = innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    addEventListener('resize', resize)

    let last: Point | null = null
    const trail: Point[] = []
    const pushPoint = (x: number, y: number) => {
      if (!last || Math.hypot(x - last.x, y - last.y) > MIN_DIST) {
        const p = { x, y, t: performance.now() }
        trail.push(p)
        last = p
        if (trail.length > 40) trail.shift()
      }
    }

    let raf = 0
    const drawTrail = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      const now = performance.now()
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift()
      if (trail.length > 1) {
        ctx.lineCap = 'round'
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1]
          const b = trail[i]
          const alpha = Math.max(0, 1 - (now - b.t) / TRAIL_MS)
          const accent = i % 3 === 0
          ctx.strokeStyle = accent ? `rgba(226,54,54,${alpha * 0.95})` : `rgba(245,245,245,${alpha * 0.65})`
          ctx.shadowColor = accent ? 'rgba(226,54,54,0.9)' : 'rgba(245,245,245,0.6)'
          ctx.shadowBlur = 8
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
        ctx.shadowBlur = 0
      }
    }

    const cleanups: (() => void)[] = [() => removeEventListener('resize', resize)]

    if (fine) {
      document.documentElement.classList.add('custom-cursor')
      const mouse = { x: innerWidth / 2, y: innerHeight / 2 }
      const ring = { x: mouse.x, y: mouse.y }
      let hovering = false

      const onMove = (e: MouseEvent) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
        pushPoint(mouse.x, mouse.y)
        const target = e.target as Element
        const interactive = !!target.closest?.('a, button, [role="button"], input, .final__chip')
        if (interactive !== hovering) {
          hovering = interactive
          ringRef.current?.classList.toggle('is-hover', hovering)
          dotRef.current?.classList.toggle('is-hover', hovering)
        }
      }
      const onLeave = () => {
        dotRef.current?.style.setProperty('opacity', '0')
        ringRef.current?.style.setProperty('opacity', '0')
      }
      const onEnter = () => {
        dotRef.current?.style.setProperty('opacity', '1')
        ringRef.current?.style.setProperty('opacity', '1')
      }

      const loop = () => {
        ring.x += (mouse.x - ring.x) * 0.18
        ring.y += (mouse.y - ring.y) * 0.18
        if (dotRef.current) dotRef.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`
        if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
        drawTrail()
        raf = requestAnimationFrame(loop)
      }

      addEventListener('mousemove', onMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', onLeave)
      document.documentElement.addEventListener('mouseenter', onEnter)
      raf = requestAnimationFrame(loop)

      cleanups.push(() => {
        document.documentElement.classList.remove('custom-cursor')
        removeEventListener('mousemove', onMove)
        document.documentElement.removeEventListener('mouseleave', onLeave)
        document.documentElement.removeEventListener('mouseenter', onEnter)
        cancelAnimationFrame(raf)
      })
    } else if (coarse) {
      // No persistent pointer between touches, so only the trail runs — spun
      // up on first touch and torn down a moment after the last one lifts,
      // rather than looping forever in the background on every mobile visit.
      // The ring is a mouse-only element (nothing to orbit between touches);
      // hide it outright rather than leave it inert at its default 0,0 spot.
      ringRef.current?.style.setProperty('display', 'none')
      let active = false
      let idleTimer = 0

      const loop = () => {
        drawTrail()
        raf = requestAnimationFrame(loop)
      }
      const start = () => {
        if (active) return
        active = true
        dotRef.current?.classList.add('is-touch')
        dotRef.current?.style.setProperty('opacity', '1')
        raf = requestAnimationFrame(loop)
      }
      const stop = () => {
        active = false
        dotRef.current?.style.setProperty('opacity', '0')
        cancelAnimationFrame(raf)
        ctx.clearRect(0, 0, innerWidth, innerHeight)
      }

      const onTouchStart = (e: TouchEvent) => {
        start()
        const t = e.touches[0]
        if (t && dotRef.current) dotRef.current.style.transform = `translate(${t.clientX}px, ${t.clientY}px)`
      }
      const onTouchMove = (e: TouchEvent) => {
        start()
        clearTimeout(idleTimer)
        const t = e.touches[0]
        if (t) {
          pushPoint(t.clientX, t.clientY)
          if (dotRef.current) dotRef.current.style.transform = `translate(${t.clientX}px, ${t.clientY}px)`
        }
      }
      const onTouchEnd = () => {
        dotRef.current?.style.setProperty('opacity', '0')
        idleTimer = window.setTimeout(stop, TRAIL_MS + 100)
      }

      addEventListener('touchstart', onTouchStart, { passive: true })
      addEventListener('touchmove', onTouchMove, { passive: true })
      addEventListener('touchend', onTouchEnd, { passive: true })
      addEventListener('touchcancel', onTouchEnd, { passive: true })

      cleanups.push(() => {
        clearTimeout(idleTimer)
        dotRef.current?.classList.remove('is-touch')
        removeEventListener('touchstart', onTouchStart)
        removeEventListener('touchmove', onTouchMove)
        removeEventListener('touchend', onTouchEnd)
        removeEventListener('touchcancel', onTouchEnd)
        cancelAnimationFrame(raf)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
