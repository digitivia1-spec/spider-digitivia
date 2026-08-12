import './ManifestoSection.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERIALS = Array.from({ length: 48 }, (_, index) => String(index * 11 + 1).padStart(3, '0'))
const WORDS = ['THE', 'SUIT', 'IS', 'THE', 'OBJECT.', 'DIGITIVIA', 'BUILDS', 'THE', 'WORLD', 'THAT', 'MOVES', 'AROUND', 'IT.']

export function ManifestoSection() {
  const rootRef = useRef<HTMLElement>(null)
  const serialRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current
    const words = wordRefs.current.filter(Boolean)
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(words, {
        opacity: 0.08,
        yPercent: 36,
        filter: 'blur(7px)',
      }, {
        opacity: 1,
        yPercent: 0,
        filter: 'blur(0px)',
        stagger: 0.09,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 70%',
          end: 'bottom 78%',
          scrub: 0.75,
        },
      })

      gsap.to(serialRef.current, {
        xPercent: -12,
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.9 },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section className="signal" id="signal" ref={rootRef} aria-labelledby="signal-title">
      <div className="signal__stage">
        <div className="signal__serial-field" ref={serialRef} aria-hidden="true">
          {SERIALS.map((serial, index) => <span key={`${serial}-${index}`}>{serial}</span>)}
        </div>

        <div className="signal__content container">
          <p className="signal__eyebrow">The physical digital bridge</p>
          <h2 id="signal-title" aria-label="The suit is the object. Digitivia builds the world that moves around it.">
            {WORDS.map((word, index) => (
              <span
                key={`${word}-${index}`}
                aria-hidden="true"
                ref={(element) => {
                  wordRefs.current[index] = element
                }}
              >
                {word}
                {index === 8 && (
                  <i className="signal__pulse" aria-hidden="true">
                    <span />
                    <span />
                  </i>
                )}
              </span>
            ))}
          </h2>

          <div className="signal__lower">
            <p>Every numbered suit receives a motion identity and a shareable owner signal. The physical object stays central; the digital layer makes ownership move.</p>
            <div className="signal__ledger" aria-label="Digital identity contents">
              <span>Numbered garment</span>
              <span>Motion poster</span>
              <span>Owner signal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
