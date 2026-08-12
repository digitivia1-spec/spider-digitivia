import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ChapterSection.css'

gsap.registerPlugin(ScrollTrigger)

type ChapterKind = 'reveal' | 'build' | 'countdown' | 'release'

interface ChapterData {
  eyebrow: string
  title: string
  body: string
  kind: ChapterKind
}

const CHAPTERS: ChapterData[] = [
  {
    eyebrow: 'CHAPTER 01',
    title: 'The Reveal',
    body: `Four years of silence. One suit, finally seen. The web drawing itself across the frame was never a metaphor — it's the first thing the drop actually is.`,
    kind: 'reveal',
  },
  {
    eyebrow: 'CHAPTER 02',
    title: 'The Build',
    body: `Every seam mapped before it's cut. The weave pattern, the shooter mounts, the fit — built like a technical spec, not a costume.`,
    kind: 'build',
  },
  {
    eyebrow: 'CHAPTER 03',
    title: 'The Countdown',
    body: `Five hundred units. A fixed number, a fixed date. No restock, no second run — the clock is the only negotiation.`,
    kind: 'countdown',
  },
  {
    eyebrow: 'CHAPTER 04',
    title: 'Release',
    body: `The wait ends when the counter hits zero. What happens after that is between you and whether you reserved a size.`,
    kind: 'release',
  },
]

// Web motif (chapter 4) radiates from the top-right corner of its 400x600
// viewBox — angles point down/left into the frame, one spoke picked out in
// accent red so the "arrival" beat reads as more than a monochrome sketch.
const WEB_SPOKE_ANGLES = [100, 122, 144, 166, 188]
const WEB_ARC_RADII = [90, 170, 250, 330, 410]

function ChapterMedia({ kind, numeral }: { kind: ChapterKind; numeral: string }) {
  switch (kind) {
    case 'reveal':
      return (
        <>
          <span className="chapter-section__ghost-numeral" aria-hidden="true">
            {numeral}
          </span>
          <svg
            className="chapter-section__hairline"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="100"
              y1="6"
              x2="52"
              y2="100"
              stroke="var(--accent)"
              strokeWidth="0.15"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </>
      )
    case 'build':
      return (
        <svg className="chapter-section__techpack" viewBox="0 0 400 600" fill="none" aria-hidden="true">
          <rect x="150" y="40" width="210" height="520" rx="6" stroke="var(--fg-faint)" strokeWidth="1" />
          <path d="M150 160 H360" stroke="var(--accent-faint)" strokeWidth="1" />
          <path d="M150 330 H360" stroke="var(--fg-faint)" strokeWidth="1" />
          <path d="M150 470 H360" stroke="var(--accent-faint)" strokeWidth="1" />
          <path d="M210 160 L228 250 L246 160" stroke="var(--fg-faint)" strokeWidth="1" />
          <path d="M300 330 L282 420 L320 420 Z" stroke="var(--accent-faint)" strokeWidth="1" />
          <path d="M220 40 Q255 12 290 40" stroke="var(--fg-faint)" strokeWidth="1" />
          <path d="M150 40 V560" stroke="var(--fg-faint)" strokeWidth="1" strokeDasharray="2 7" />
        </svg>
      )
    case 'countdown':
      return (
        <>
          <div className="chapter-section__glow" aria-hidden="true" />
          <span className="chapter-section__outline-numeral" aria-hidden="true">
            {numeral}
          </span>
        </>
      )
    case 'release':
      return (
        <>
          <div className="chapter-section__wash" aria-hidden="true" />
          <svg className="chapter-section__web" viewBox="0 0 400 600" fill="none" aria-hidden="true">
            {WEB_ARC_RADII.map((r) => (
              <circle key={r} cx="400" cy="0" r={r} stroke="var(--fg-faint)" strokeWidth="1" />
            ))}
            {WEB_SPOKE_ANGLES.map((deg) => {
              const rad = (deg * Math.PI) / 180
              const x2 = 400 + Math.cos(rad) * 620
              const y2 = Math.sin(rad) * 620
              const accent = deg === 144
              return (
                <line
                  key={deg}
                  x1="400"
                  y1="0"
                  x2={x2}
                  y2={y2}
                  stroke={accent ? 'var(--accent)' : 'var(--fg-faint)'}
                  strokeWidth="1"
                  opacity={accent ? 0.6 : 0.4}
                />
              )
            })}
          </svg>
        </>
      )
  }
}

/**
 * Chapter/story reveal — 4 stacked full-bleed chapters, each its own
 * ScrollTrigger-scrubbed media+text pair (no pin: fragile across 4 stacked
 * full-height sections, scrub-without-pin per DESIGN.md's motion approach).
 */
export function ChapterSection() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el, i) => {
        if (!el) return
        const media = mediaRefs.current[i]
        const text = textRefs.current[i]
        if (media) {
          gsap.fromTo(
            media,
            { opacity: reduced ? 1 : 0.15, filter: reduced ? 'none' : 'blur(8px) brightness(0.55)' },
            {
              opacity: 1,
              filter: 'blur(0px) brightness(1)',
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 20%', scrub: true },
            },
          )
        }
        if (text) {
          gsap.fromTo(
            text,
            { opacity: reduced ? 1 : 0.15, filter: reduced ? 'none' : 'blur(8px) brightness(0.55)' },
            {
              opacity: 1,
              filter: 'blur(0px) brightness(1)',
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 15%', scrub: true },
            },
          )
        }
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {CHAPTERS.map((chapter, i) => (
        <section
          key={chapter.eyebrow}
          id={i === 0 ? 'story' : undefined}
          className={`chapter-section chapter-section--${chapter.kind}`}
          ref={(el) => {
            sectionRefs.current[i] = el
          }}
        >
          <div
            className="chapter-section__media"
            ref={(el) => {
              mediaRefs.current[i] = el
            }}
          >
            <ChapterMedia kind={chapter.kind} numeral={String(i + 1).padStart(2, '0')} />
          </div>
          <div className="chapter-section__scrim" aria-hidden="true" />
          <div
            className="chapter-section__text"
            ref={(el) => {
              textRefs.current[i] = el
            }}
          >
            <div className="chapter-section__eyebrow">
              <span className="chapter-section__tick" aria-hidden="true" />
              <p className="meta-label chapter-section__label">{chapter.eyebrow}</p>
            </div>
            <h2 className="italic-title chapter-section__title">{chapter.title}</h2>
            <p className="body-copy chapter-section__body">{chapter.body}</p>
          </div>
        </section>
      ))}
    </>
  )
}
