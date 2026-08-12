import './ArchiveSection.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Tilt } from './Tilt'
import { CrawlingSpider } from './CrawlingSpider'

gsap.registerPlugin(ScrollTrigger)

type DropState = 'archived' | 'live'

interface Drop {
  number: string
  eyebrow: string
  title: string
  state: DropState
  badge: string
  units: string
  synopsis: string
  designer: string
  colorway: string
}

const DROPS: Drop[] = [
  {
    number: '001',
    eyebrow: 'Drop 001',
    title: 'First Thread',
    state: 'archived',
    badge: 'Sold Out',
    units: '180 Units',
    synopsis: 'Where it started. A single colorway, gone in six minutes.',
    designer: 'Studio Web',
    colorway: 'Jet / Ash',
  },
  {
    number: '002',
    eyebrow: 'Drop 002',
    title: 'Second Skin',
    state: 'archived',
    badge: 'Sold Out',
    units: '240 Units',
    synopsis: 'Tighter weave, faster shooters. Gone in four.',
    designer: 'Studio Web',
    colorway: 'Rust / Jet',
  },
  {
    number: '003',
    eyebrow: 'Drop 003',
    title: 'Night Web',
    state: 'archived',
    badge: 'Sold Out',
    units: '310 Units',
    synopsis: 'The one that sold out before the countdown hit zero.',
    designer: 'Studio Web',
    colorway: 'Ash / Cold Blue',
  },
  {
    number: '004',
    eyebrow: 'Drop 004',
    title: 'The Web Suit',
    state: 'live',
    badge: '62% Claimed',
    units: '500 Units',
    synopsis: 'Five hundred numbered units. This is the one still open.',
    designer: 'Studio Web',
    colorway: 'Red / Blue',
  },
]

/** Flat "tech-pack" line-art silhouette of a bodysuit — no photo, no 3D. */
function GarmentSilhouette() {
  return (
    <svg className="archive__silhouette" viewBox="0 0 120 160" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="60" cy="20" r="11" />
        <path d="M60 32 C48 32 40 36 36 46 L26 74 L34 80 L44 56 L40 96 L32 152 L46 152 L52 100 L60 92 L68 100 L74 152 L88 152 L80 96 L76 56 L86 80 L94 74 L84 46 C80 36 72 32 60 32 Z" />
        <path d="M60 34 L60 90" />
        <path d="M46 50 L74 50" />
        <path d="M42 94 L78 94" />
      </g>
    </svg>
  )
}

export function ArchiveSection() {
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const posterRefs = useRef<(HTMLDivElement | null)[]>([])
  const metaRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        const poster = posterRefs.current[i]
        const meta = metaRefs.current[i]
        if (!card || !poster || !meta) return

        const from = { opacity: reduced ? 1 : 0.15, filter: reduced ? 'none' : 'blur(8px) brightness(0.55)' }
        const to = { opacity: 1, filter: 'blur(0px) brightness(1)', ease: 'none' }

        gsap.fromTo(poster, from, {
          ...to,
          scrollTrigger: { trigger: card, start: 'top 75%', end: 'top 20%', scrub: true },
        })
        gsap.fromTo(meta, from, {
          ...to,
          scrollTrigger: { trigger: card, start: 'top 75%', end: 'top 20%', scrub: true },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="archive full-bleed" id="archive" aria-label="The Archive — drop history">
      {DROPS.map((drop, i) => (
        <article
          className="archive__card"
          key={drop.number}
          aria-label={`Drop ${drop.number}: ${drop.title}`}
          ref={(el) => {
            cardRefs.current[i] = el
          }}
        >
          <div className="container archive__grid">
            <div
              className="archive__poster"
              ref={(el) => {
                posterRefs.current[i] = el
              }}
            >
              <div className={`archive__glow archive__glow--${drop.state}`} aria-hidden="true" />
              <Tilt className={`archive__panel archive__panel--${drop.state}`} strength={9}>
                <svg className="archive__numeral" viewBox="0 0 150 200" aria-hidden="true">
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="140">
                    {drop.number}
                  </text>
                </svg>
                <GarmentSilhouette />
                {drop.state === 'live' && <CrawlingSpider className="archive__spider" />}
              </Tilt>
            </div>

            <div
              className="archive__meta"
              ref={(el) => {
                metaRefs.current[i] = el
              }}
            >
              <p className="meta-label archive__eyebrow">
                <span className="archive__rule" aria-hidden="true" />
                {drop.eyebrow}
              </p>
              <h3 className="italic-title archive__title">{drop.title}</h3>
              <div className="archive__status">
                <span className={`archive__badge archive__badge--${drop.state}`}>
                  {drop.state === 'live' && <span className="archive__dot" aria-hidden="true" />}
                  {drop.badge}
                </span>
                <span className="archive__sep" aria-hidden="true">
                  |
                </span>
                <span className="meta-label archive__units">{drop.units}</span>
              </div>
              <p className="body-copy archive__synopsis">{drop.synopsis}</p>
              <div className="archive__detail">
                <span className="meta-label">Designer</span>
                <span className="archive__value">{drop.designer}</span>
              </div>
              <div className="archive__detail">
                <span className="meta-label">Colorway</span>
                <span className="archive__value">{drop.colorway}</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
