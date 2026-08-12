import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './SpiderWorld.css'

gsap.registerPlugin(ScrollTrigger)

type SpiderWorldProps = {
  scopeRef: RefObject<HTMLElement | null>
}

type WebPoint = {
  baseX: number
  baseY: number
  x: number
  y: number
  column: number
  row: number
}

type Pulse = {
  x: number
  y: number
  radius: number
  life: number
}

const TONES = {
  dark: ['rgba(255, 239, 222, 0.23)', 'rgba(235, 35, 49, 0.4)'],
  light: ['rgba(8, 25, 58, 0.19)', 'rgba(215, 22, 38, 0.34)'],
  red: ['rgba(255, 239, 222, 0.28)', 'rgba(10, 25, 58, 0.34)'],
} as const

function SpiderFigure() {
  return (
    <svg className="spider-figure__art" viewBox="0 0 190 330" aria-hidden="true">
      <g className="spider-figure__body">
        <g className="spider-figure__pose-leg spider-figure__pose-leg--left">
          <path className="spider-figure__limb spider-figure__limb--back" d="M78 188C54 203 31 229 19 261c-5 14 10 22 20 11l51-60Z" />
          <path className="spider-figure__boot" d="M39 272c-9 19-22 32-14 40 9 9 31-9 38-28Z" />
        </g>
        <g className="spider-figure__pose-leg spider-figure__pose-leg--right">
          <path className="spider-figure__limb" d="M109 201c20 23 39 54 43 90 2 17-17 20-24 5l-38-76Z" />
          <path className="spider-figure__boot" d="M129 292c-1 19 6 33 16 32 13-1 15-25 7-41Z" />
        </g>

        <g className="spider-figure__pose-arm spider-figure__pose-arm--left">
          <path className="spider-figure__arm spider-figure__arm--left" d="M70 105C43 113 22 134 9 158c-8 14 7 25 19 14l53-49Z" />
          <path className="spider-figure__glove" d="M27 172c-11 10-25 9-25 18 0 11 25 10 39-4Z" />
        </g>
        <g className="spider-figure__pose-arm spider-figure__pose-arm--right">
          <path className="spider-figure__arm spider-figure__arm--right" d="M116 106c31 4 54 21 67 45 8 15-7 27-20 15l-58-42Z" />
          <path className="spider-figure__glove" d="M163 166c11 11 25 12 24 21-2 11-27 7-40-8Z" />
        </g>

        <path className="spider-figure__torso-blue" d="M67 113c-10 27-7 68 13 92 8 10 20 12 30 3 20-20 24-64 11-95Z" />
        <path className="spider-figure__torso" d="M72 102c10-8 35-8 45 2 7 18 4 43-5 58-10 16-28 15-38-1-10-16-12-41-2-59Z" />
        <path className="spider-figure__neck" d="M82 90h24l3 20H79Z" />

        <path className="spider-figure__head" d="M68 49C71 19 87 5 98 5c15 0 31 18 32 45 1 25-13 47-32 48-20 0-33-23-30-49Z" />
        <path className="spider-figure__eye" d="M79 46c3-15 9-24 15-29-1 19-5 31-14 39Z" />
        <path className="spider-figure__eye" d="M116 45c-3-15-9-23-16-28 2 19 6 31 15 39Z" />

        <g className="spider-figure__web" fill="none">
          <path d="M98 7v87M72 39c17 9 35 9 55 0M69 61c18 10 39 10 59 0M75 81c15 8 30 8 46 0" />
          <path d="M98 8C82 23 74 40 69 58M98 8c16 15 25 32 30 50M98 8C88 32 84 61 84 91M98 8c10 24 15 53 14 83" />
          <path d="M95 104v58M71 121c17 9 33 9 48 0M69 141c18 10 34 10 47 0" />
        </g>

        <g className="spider-figure__emblem">
          <ellipse cx="95" cy="135" rx="5" ry="12" />
          <path d="m91 127-12-10m12 17-15-4m15 11-13 10m21-24 12-10m-12 17 15-4m-15 11 13 10" />
        </g>
      </g>
    </svg>
  )
}

export function SpiderWorld({ scopeRef }: SpiderWorldProps) {
  const worldRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scope = scopeRef.current
    const world = worldRef.current
    const canvas = canvasRef.current
    const figure = figureRef.current
    const context = canvas?.getContext('2d')
    if (!scope || !world || !canvas || !figure || !context) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let columns = width < 600 ? 7 : 11
    let rows = width < 600 ? 12 : 9
    let points: WebPoint[] = []
    let pulses: Pulse[] = []
    let frame = 0
    let lastTime = 0
    let lastScroll = window.scrollY
    let scrollVelocity = 0
    let hoverForce = 0
    let tone: keyof typeof TONES = 'dark'
    let interactionTimer = 0
    const pointer = { x: width * 0.5, y: height * 0.5, active: false }

    const buildPoints = () => {
      points = []
      const xGap = width / Math.max(1, columns - 1)
      const yGap = height / Math.max(1, rows - 1)
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const offset = row % 2 === 0 ? 0 : xGap * 0.34
          const baseX = column * xGap + offset - xGap * 0.18
          const baseY = row * yGap
          points.push({ baseX, baseY, x: baseX, y: baseY, column, row })
        }
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      columns = width < 600 ? 7 : 11
      rows = width < 600 ? 12 : 9
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildPoints()
    }

    const getPoint = (column: number, row: number) => points.find((point) => point.column === column && point.row === row)

    const detectTone = () => {
      const center = document.elementFromPoint(width * 0.5, height * 0.5)?.closest<HTMLElement>('[data-world-tone]')
      const next = center?.dataset.worldTone
      if (next === 'light' || next === 'red' || next === 'dark') {
        tone = next
        world.dataset.tone = next
      }
    }

    const setInteraction = (kind: 'hover' | 'touch' | 'scroll') => {
      world.dataset.interaction = kind
      window.clearTimeout(interactionTimer)
      interactionTimer = window.setTimeout(() => {
        world.dataset.interaction = 'idle'
      }, 620)
    }

    const draw = (time = 0) => {
      const delta = Math.min(32, time - lastTime || 16)
      lastTime = time
      context.clearRect(0, 0, width, height)
      scrollVelocity *= 0.91
      hoverForce += ((pointer.active ? 1 : 0) - hoverForce) * 0.08
      const [webColor, signalColor] = TONES[tone]
      const influence = Math.min(width, height) * (width < 600 ? 0.34 : 0.28)

      for (const point of points) {
        const dx = point.baseX - pointer.x
        const dy = point.baseY - pointer.y
        const distance = Math.max(1, Math.hypot(dx, dy))
        const pull = pointer.active ? Math.max(0, 1 - distance / influence) : 0
        const scrollWave = Math.sin(point.row * 0.72 + point.column * 0.48 + time * 0.0014) * Math.min(22, Math.abs(scrollVelocity) * 0.08)
        const targetX = point.baseX + (dx / distance) * pull * -34 * hoverForce + scrollWave
        const targetY = point.baseY + (dy / distance) * pull * -26 * hoverForce + scrollVelocity * 0.022
        point.x += (targetX - point.x) * Math.min(1, delta * 0.008)
        point.y += (targetY - point.y) * Math.min(1, delta * 0.008)
      }

      context.lineWidth = width < 600 ? 0.75 : 1
      context.strokeStyle = webColor
      context.beginPath()
      for (const point of points) {
        const right = getPoint(point.column + 1, point.row)
        const below = getPoint(point.column, point.row + 1)
        const diagonal = getPoint(point.column + (point.row % 2 === 0 ? 0 : 1), point.row + 1)
        for (const neighbor of [right, below, diagonal]) {
          if (!neighbor) continue
          context.moveTo(point.x, point.y)
          context.lineTo(neighbor.x, neighbor.y)
        }
      }
      context.stroke()

      context.fillStyle = signalColor
      for (const point of points) {
        const radius = pointer.active && Math.hypot(point.x - pointer.x, point.y - pointer.y) < influence ? 1.8 : 0.9
        context.beginPath()
        context.arc(point.x, point.y, radius, 0, Math.PI * 2)
        context.fill()
      }

      pulses = pulses.filter((pulse) => pulse.life > 0)
      for (const pulse of pulses) {
        pulse.radius += delta * 0.2
        pulse.life -= delta * 0.0019
        context.globalAlpha = Math.max(0, pulse.life)
        context.strokeStyle = signalColor
        context.lineWidth = 2
        context.beginPath()
        context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2)
        context.stroke()
        for (let spoke = 0; spoke < 8; spoke += 1) {
          const angle = (Math.PI * 2 * spoke) / 8
          context.beginPath()
          context.moveTo(pulse.x + Math.cos(angle) * pulse.radius * 0.38, pulse.y + Math.sin(angle) * pulse.radius * 0.38)
          context.lineTo(pulse.x + Math.cos(angle) * pulse.radius, pulse.y + Math.sin(angle) * pulse.radius)
          context.stroke()
        }
        context.globalAlpha = 1
      }

      world.style.setProperty('--sense-x', `${pointer.x}px`)
      world.style.setProperty('--sense-y', `${pointer.y}px`)
      if (!reduced) frame = window.requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const onPointerDown = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      pulses.push({ x: event.clientX, y: event.clientY, radius: 8, life: 1 })
      setInteraction('touch')
      gsap.fromTo(figure, { scale: 0.84, rotate: '-=8' }, { scale: 1, rotate: '+=8', duration: 0.62, ease: 'elastic.out(1, 0.42)', overwrite: 'auto' })
      if (reduced) draw()
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest('a, button, [data-spider-react]')
      if (!target) return
      pointer.active = true
      setInteraction('hover')
      gsap.to(figure, { scale: 1.12, duration: 0.32, ease: 'back.out(2)', overwrite: 'auto' })
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest('a, button, [data-spider-react]')
      if (!target) return
      gsap.to(figure, { scale: 1, duration: 0.42, ease: 'expo.out', overwrite: 'auto' })
    }

    const onScroll = () => {
      const next = window.scrollY
      scrollVelocity += next - lastScroll
      lastScroll = next
      setInteraction('scroll')
      detectTone()
    }

    resize()
    detectTone()
    draw()

    const motionContext = gsap.context(() => {
      const path = world.querySelector<SVGPathElement>('.spider-world__path')
      if (reduced) {
        gsap.set(figure, { x: () => width * 0.72, y: () => height * 0.68, rotate: -9 })
        gsap.set(path, { strokeDashoffset: 0 })
        return
      }

      gsap.set(figure, { x: () => width * 0.025, y: () => height * 0.62, rotate: -14 })
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.62,
          invalidateOnRefresh: true,
        },
      })
        .to(figure, { x: () => width * 0.76, y: () => height * 0.12, rotate: 17, duration: 1, ease: 'none' })
        .to(figure, { x: () => width * 0.1, y: () => height * 0.38, rotate: -22, duration: 1, ease: 'none' })
        .to(figure, { x: () => width * 0.72, y: () => height * 0.58, rotate: 12, duration: 1, ease: 'none' })
        .to(figure, { x: () => width * 0.16, y: () => height * 0.1, rotate: -12, duration: 1, ease: 'none' })
        .to(figure, { x: () => width * 0.7, y: () => height * 0.38, rotate: 18, duration: 1, ease: 'none' })
        .to(figure, { x: () => width * 0.08, y: () => height * 0.66, rotate: -18, duration: 1, ease: 'none' })
        .to(figure, { x: () => width * 0.72, y: () => height * 0.17, rotate: 8, duration: 1, ease: 'none' })

      gsap.fromTo(path, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
      })
    }, world)

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(interactionTimer)
      motionContext.revert()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
    }
  }, [scopeRef])

  return (
    <div className="spider-world" ref={worldRef} data-tone="dark" data-interaction="idle" aria-hidden="true">
      <canvas className="spider-world__canvas" ref={canvasRef} data-qa="reactive-web-canvas" />
      <div className="spider-world__sense" />
      <svg className="spider-world__route" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path className="spider-world__path" pathLength="1" d="M-80 820C180 640 40 310 318 180s380 222 590 42 32-290 212-350" />
      </svg>
      <div className="spider-figure" ref={figureRef} data-qa="scrolling-spider-man">
        <span className="spider-figure__thread" />
        <SpiderFigure />
      </div>
    </div>
  )
}
