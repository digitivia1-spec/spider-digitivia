import './GallerySection.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MODES = [
  { label: '01 / Optical', title: 'Catch the light.', note: 'High-contrast lines remain legible while the field accelerates.' },
  { label: '02 / Tensile', title: 'Hold the force.', note: 'Every curve compresses, redirects, and returns to its origin.' },
  { label: '03 / Signal', title: 'Own the trace.', note: 'A unique motion signature marks every numbered release.' },
] as const

const WAVE_PATHS = Array.from({ length: 13 }, (_, index) => {
  const y = 92 + index * 35
  const lift = 42 + (index % 4) * 12
  return `M -100 ${y} C 90 ${y - lift}, 175 ${y + lift}, 330 ${y} S 565 ${y - lift}, 720 ${y} S 955 ${y + lift}, 1300 ${y}`
})

const NODES = Array.from({ length: 18 }, (_, index) => ({
  x: 70 + index * 63,
  y: 305 + Math.sin(index * 1.22) * 116,
}))

export function GallerySection() {
  const rootRef = useRef<HTMLElement>(null)
  const waveRef = useRef<SVGGElement>(null)
  const nodeRef = useRef<SVGGElement>(null)
  const sweepRef = useRef<HTMLDivElement>(null)
  const modeRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const modes = modeRefs.current.filter(Boolean)
    const progress = progressRefs.current.filter(Boolean)
    const ctx = gsap.context(() => {
      gsap.set(modes, { opacity: 0, yPercent: 105 })
      gsap.set(modes[0], { opacity: 1, yPercent: 0 })
      gsap.set(progress, { scaleX: 0.08, opacity: 0.24 })
      gsap.set(progress[0], { scaleX: 1, opacity: 1 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.76,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .fromTo('.motion-lab__wave', { strokeDashoffset: 1150 }, { strokeDashoffset: 0, stagger: 0.035, duration: 1.15, ease: 'none' }, 0)
        .to(waveRef.current, { xPercent: -9, scaleY: 1.72, transformOrigin: '50% 50%', duration: 3, ease: 'none' }, 0)
        .to(nodeRef.current, { xPercent: 8, yPercent: -5, rotation: -4, transformOrigin: '50% 50%', duration: 3, ease: 'none' }, 0)
        .fromTo(sweepRef.current, { xPercent: -110 }, { xPercent: 110, duration: 3, ease: 'none' }, 0)

      for (let index = 1; index < MODES.length; index += 1) {
        const at = index * 1.02
        timeline
          .set(modes[index - 1], { opacity: 0, yPercent: -105 }, at)
          .set(modes[index], { opacity: 1, yPercent: 0 }, at)
          .to(progress[index - 1], { scaleX: 0.08, opacity: 0.24, duration: 0.2, ease: 'none' }, at)
          .to(progress[index], { scaleX: 1, opacity: 1, duration: 0.34, ease: 'none' }, at + 0.08)
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section className="motion-lab" id="materials" ref={rootRef} aria-labelledby="motion-lab-title">
      <div className="motion-lab__stage">
        <header className="motion-lab__head">
          <p>Motion material</p>
          <span>Pure vector / zero stills</span>
        </header>

        <div className="motion-lab__index" aria-hidden="true">001 / LIVE</div>

        <div className="motion-lab__field" aria-hidden="true">
          <svg viewBox="0 0 1200 620" preserveAspectRatio="none" role="presentation">
            <g className="motion-lab__waves" ref={waveRef}>
              {WAVE_PATHS.map((path, index) => <path className="motion-lab__wave" key={index} d={path} pathLength="1200" />)}
            </g>
            <g className="motion-lab__nodes" ref={nodeRef}>
              {NODES.map((node, index) => (
                <g key={index} transform={`translate(${node.x} ${node.y})`}>
                  <circle r={index % 5 === 0 ? 9 : 4} />
                  {index % 5 === 0 && <circle className="motion-lab__node-ring" r="22" />}
                </g>
              ))}
            </g>
          </svg>
          <div className="motion-lab__sweep" ref={sweepRef} />
        </div>

        <div className="motion-lab__copy">
          <h2 className="motion-lab__sr-title" id="motion-lab-title">Motion is the material</h2>
          {MODES.map((mode, index) => (
            <div className="motion-lab__mode" key={mode.label} ref={(element) => { modeRefs.current[index] = element }}>
              <p>{mode.label}</p>
              <h3>{mode.title}</h3>
              <span>{mode.note}</span>
            </div>
          ))}
        </div>

        <div className="motion-lab__statement" aria-hidden="true">
          MOTION IS THE MATERIAL
        </div>

        <div className="motion-lab__progress" aria-hidden="true">
          {MODES.map((mode, index) => <span key={mode.label} ref={(element) => { progressRefs.current[index] = element }} />)}
        </div>
      </div>
    </section>
  )
}
