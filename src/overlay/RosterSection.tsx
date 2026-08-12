import './RosterSection.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BEATS = [
  {
    label: 'Phase 01 / Calibrate',
    title: 'Find the center.',
    body: 'A live web field locks onto one focal point, then builds tension outward from the signal core.',
    word: 'CALIBRATE',
  },
  {
    label: 'Phase 02 / Tension',
    title: 'Pull every line.',
    body: 'The lattice stretches without breaking. Scroll becomes force, and force becomes visible direction.',
    word: 'TENSION',
  },
  {
    label: 'Phase 03 / Release',
    title: 'Turn motion into identity.',
    body: 'The field opens into a personal signal built for one numbered suit and one numbered owner.',
    word: 'RELEASE',
  },
] as const

const SPOKES = Array.from({ length: 20 }, (_, index) => index * 18)
const RINGS = [68, 122, 184, 252, 326, 408]

function polar(radius: number, angle: number, wobble = 0) {
  const radians = ((angle + wobble) * Math.PI) / 180
  return {
    x: 500 + Math.cos(radians) * radius,
    y: 500 + Math.sin(radians) * radius * 0.72,
  }
}

function ringPath(radius: number, ringIndex: number) {
  const points = SPOKES.map((angle, index) => polar(radius + Math.sin((index + ringIndex) * 1.35) * 13, angle, ringIndex * 2.2))
  return `${points.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')} Z`
}

export function RosterSection() {
  const rootRef = useRef<HTMLElement>(null)
  const latticeRef = useRef<SVGGElement>(null)
  const scannerRef = useRef<SVGGElement>(null)
  const coreRef = useRef<SVGGElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const beatRefs = useRef<(HTMLDivElement | null)[]>([])
  const meterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const beats = beatRefs.current.filter(Boolean)
    const meters = meterRefs.current.filter(Boolean)
    const ctx = gsap.context(() => {
      gsap.set(beats, { opacity: 0, yPercent: 24 })
      gsap.set(beats[0], { opacity: 1, yPercent: 0 })
      gsap.set(meters, { scaleX: 0.1, opacity: 0.28 })
      gsap.set(meters[0], { scaleX: 1, opacity: 1 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.72,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .fromTo('.web-engine__ring', { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: 1.05, stagger: 0.045, ease: 'none' }, 0)
        .to(latticeRef.current, { rotation: 22, scale: 1.14, transformOrigin: '50% 50%', duration: 3, ease: 'none' }, 0)
        .to(scannerRef.current, { rotation: 330, transformOrigin: '50% 50%', duration: 3, ease: 'none' }, 0)
        .fromTo(coreRef.current, { scale: 0.28, opacity: 0.28 }, { scale: 1.42, opacity: 1, transformOrigin: '50% 50%', duration: 3, ease: 'none' }, 0)
        .to(wordRef.current, { xPercent: -18, duration: 3, ease: 'none' }, 0)

      for (let index = 1; index < BEATS.length; index += 1) {
        const at = index * 1.02
        timeline
          .to(beats[index - 1], { opacity: 0, yPercent: -20, duration: 0.24, ease: 'none' }, at)
          .fromTo(beats[index], { opacity: 0, yPercent: 24 }, { opacity: 1, yPercent: 0, duration: 0.34, ease: 'none' }, at + 0.12)
          .to(meters[index - 1], { scaleX: 0.1, opacity: 0.28, duration: 0.2, ease: 'none' }, at)
          .to(meters[index], { scaleX: 1, opacity: 1, duration: 0.34, ease: 'none' }, at + 0.08)
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section className="web-engine" id="anatomy" ref={rootRef} aria-labelledby="web-engine-title">
      <div className="web-engine__stage">
        <header className="web-engine__head">
          <p>Web engine</p>
          <span>Scroll protocol / live geometry</span>
        </header>

        <div className="web-engine__word" ref={wordRef} aria-hidden="true">
          CALIBRATE / TENSION / RELEASE
        </div>

        <div className="web-engine__visual" aria-hidden="true">
          <svg viewBox="0 0 1000 1000" role="presentation">
            <g className="web-engine__lattice" ref={latticeRef}>
              {SPOKES.map((angle) => {
                const point = polar(560, angle)
                return <line key={angle} x1="500" y1="500" x2={point.x} y2={point.y} />
              })}
              {RINGS.map((radius, index) => (
                <path className="web-engine__ring" key={radius} d={ringPath(radius, index)} pathLength="1000" />
              ))}
            </g>
            <g className="web-engine__scanner" ref={scannerRef}>
              <line x1="500" y1="500" x2="980" y2="500" />
              <path d="M500 58 A442 442 0 0 1 926 382" />
            </g>
            <g className="web-engine__core" ref={coreRef}>
              <circle cx="500" cy="500" r="42" />
              <circle cx="500" cy="500" r="17" />
              <path d="M500 434 L566 500 L500 566 L434 500 Z" />
            </g>
          </svg>
        </div>

        <div className="web-engine__copy">
          <h2 className="web-engine__sr-title" id="web-engine-title">A web field driven by scroll</h2>
          {BEATS.map((beat, index) => (
            <div
              className="web-engine__beat"
              key={beat.label}
              ref={(element) => { beatRefs.current[index] = element }}
            >
              <p>{beat.label}</p>
              <h3>{beat.title}</h3>
              <span>{beat.body}</span>
              <strong aria-hidden="true">{beat.word}</strong>
            </div>
          ))}
        </div>

        <div className="web-engine__progress" aria-hidden="true">
          {BEATS.map((beat, index) => (
            <span key={beat.label} ref={(element) => { meterRefs.current[index] = element }} />
          ))}
        </div>
      </div>
    </section>
  )
}
