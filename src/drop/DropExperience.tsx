import './DropExperience.css'
import { Fragment, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DROP } from '../config/site'
import type { Size } from '../config/site'
import { useApp } from '../state/store'
import heroFilm from '../../113354-697718015_medium.mp4?url'
import heroPoster from '../../src-assets/film/face-02.webp'
import { SpiderWorld } from './SpiderWorld'

gsap.registerPlugin(ScrollTrigger)

const PROOFS = [
  {
    index: 'MASK',
    label: 'Suit design',
    title: 'The classic mask.',
    body: 'Large white eyes and a clear web pattern make the suit look like Spider-Man at first glance.',
  },
  {
    index: 'WEB',
    label: 'Website motion',
    title: 'The web moves with you.',
    body: 'Scroll, move, or tap. The background web reacts to what you do.',
  },
  {
    index: 'SENSE',
    label: 'Digital extra',
    title: 'Your own Spider-Sense.',
    body: 'Your suit number includes a personal Spider-Sense animation created by Digitivia.',
  },
] as const

function SpiderStamp() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 14c4 0 7 3 7 7v7c0 5-3 9-7 9s-7-4-7-9v-7c0-4 3-7 7-7Z" />
      <path d="m18 20-9-7m9 13-13-2m13 8-11 7m23-19 9-7m-9 13 13-2m-13 8 11 7M21 14l-4-8m10 8 4-8" />
    </svg>
  )
}

function MaskProof() {
  return (
    <svg className="proof-graphic proof-graphic--mask" viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <clipPath id="mask-proof-clip">
          <path d="M300 10C162 10 82 119 92 292c10 159 88 282 208 338 120-56 198-179 208-338C518 119 438 10 300 10Z" />
        </clipPath>
      </defs>
      <rect className="mask-proof__backdrop" width="600" height="600" />
      <g className="mask-proof__sense" fill="none">
        <path d="M45 298C45 141 159 23 300 23S555 141 555 298" />
        <path d="M18 298C18 126 145-5 300-5s282 131 282 303" />
      </g>
      <path className="mask-proof__head" d="M300 10C162 10 82 119 92 292c10 159 88 282 208 338 120-56 198-179 208-338C518 119 438 10 300 10Z" />
      <g className="mask-proof__planes" clipPath="url(#mask-proof-clip)">
        <path d="M82 304 151 190l80 342L88 486Z" />
        <path d="m518 304-69-114-80 342 143-46Z" />
      </g>
      <g className="mask-proof__web" clipPath="url(#mask-proof-clip)" fill="none">
        <path pathLength="1" d="M300-20v650M300-20C208 94 142 215 92 390M300-20c92 114 158 235 208 410M300-20C243 140 221 331 217 598M300-20c57 160 79 351 83 618" />
        <path pathLength="1" d="M92 158Q300 292 508 158M81 274Q300 398 519 274M104 404Q300 504 496 404M151 520Q300 579 449 520" />
      </g>
      <path className="mask-proof__socket" d="M114 214c49-88 117-126 171-111-17 101-67 185-154 225-20-35-26-76-17-114Z" />
      <path className="mask-proof__socket" d="M486 214c-49-88-117-126-171-111 17 101 67 185 154 225 20-35 26-76 17-114Z" />
      <path className="mask-proof__eye" d="M145 222c35-57 77-88 115-96-17 68-53 121-108 157-8-20-11-41-7-61Z" />
      <path className="mask-proof__eye" d="M455 222c-35-57-77-88-115-96 17 68 53 121 108 157 8-20 11-41 7-61Z" />
      <path className="mask-proof__bridge" d="M276 105 300 69l24 36-24 83Z" />
      <g className="mask-proof__emblem">
        <ellipse cx="300" cy="475" rx="13" ry="27" />
        <path d="m290 460-41-30m40 47-51-7m54 22-44 32m62-64 41-30m-40 47 51-7m-54 22 44 32" />
      </g>
    </svg>
  )
}

function WebProof() {
  return (
    <svg className="proof-graphic proof-graphic--web" viewBox="0 0 600 600" aria-hidden="true">
      <rect width="600" height="600" />
      <g className="web-proof__radials">
        {Array.from({ length: 16 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 16
          return <line key={index} x1="300" y1="300" x2={300 + Math.cos(angle) * 440} y2={300 + Math.sin(angle) * 440} />
        })}
      </g>
      <g className="web-proof__rings">
        {Array.from({ length: 7 }, (_, index) => <circle key={index} cx="300" cy="300" r={42 + index * 52} />)}
      </g>
      <circle className="web-proof__core" cx="300" cy="300" r="18" />
    </svg>
  )
}

function SignalProof() {
  return (
    <svg className="proof-graphic proof-graphic--signal" viewBox="0 0 600 600" aria-hidden="true">
      <rect width="600" height="600" />
      <g className="signal-lines">
        <path d="M-20 360C65 360 72 178 156 178s92 290 180 290 82-337 176-337 76 186 120 186" />
        <path d="M-20 300c95 0 95-74 190-74s95 148 190 148 95-74 260-74" />
        <path d="M-20 430c78 0 78-260 156-260s78 260 156 260 78-260 156-260 78 260 172 260" />
      </g>
      <g className="signal-dots">
        <circle cx="156" cy="178" r="10" />
        <circle cx="336" cy="468" r="10" />
        <circle cx="512" cy="131" r="10" />
      </g>
      <path className="signal-mask" d="M244 169c4-50 31-78 56-78s52 28 56 78c4 51-25 103-56 113-31-10-60-62-56-113Z" />
      <path className="signal-eye" d="M261 163c5-25 18-43 31-51-2 33-11 55-28 69Zm78 0c-5-25-18-43-31-51 2 33 11 55 28 69Z" />
      <text x="32" y="56">SPIDER-SENSE / MOTION ID 001</text>
    </svg>
  )
}

function SpiderEyes({ className = '' }: { className?: string }) {
  return (
    <svg className={`spider-eyes ${className}`} viewBox="0 0 600 260" aria-hidden="true">
      <path d="M52 40c38 111 103 170 208 190-48-80-106-143-208-190Z" />
      <path d="M548 40c-38 111-103 170-208 190 48-80 106-143 208-190Z" />
    </svg>
  )
}

function ScrubWords({ text }: { text: string }) {
  return (
    <span className="clarity-copy" aria-label={text}>
      {text.split(' ').map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="clarity-copy__word" aria-hidden="true">{word}</span>{' '}
        </Fragment>
      ))}
    </span>
  )
}

const pad = (value: number) => String(value).padStart(2, '0')

function useCountdown() {
  const calculate = () => {
    const total = Math.max(0, Math.floor((new Date(DROP.dropsAt).getTime() - Date.now()) / 1000))
    return [
      ['Days', Math.floor(total / 86400)],
      ['Hrs', Math.floor((total % 86400) / 3600)],
      ['Min', Math.floor((total % 3600) / 60)],
      ['Sec', total % 60],
    ] as const
  }
  const [parts, setParts] = useState(calculate)
  useEffect(() => {
    const timer = window.setInterval(() => setParts(calculate()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return parts
}

function scrollToReserve() {
  document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function DropExperience() {
  const rootRef = useRef<HTMLElement>(null)
  const selectedSize = useApp((state) => state.selectedSize)
  const selectSize = useApp((state) => state.selectSize)
  const reserved = useApp((state) => state.reserved)
  const reserve = useApp((state) => state.reserve)
  const countdown = useCountdown()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const video = root.querySelector<HTMLVideoElement>('.drop-hero__video')
    if (video) {
      video.muted = true
      if (reduced) {
        video.pause()
        video.currentTime = 0
      } else {
        void video.play().catch(() => undefined)
      }
    }

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll<HTMLElement>('[data-drop-intro]')
      if (reduced) {
        gsap.set(intro, { opacity: 1, clearProps: 'transform' })
        return
      }

      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.drop-nav', { yPercent: -110 }, { yPercent: 0, duration: 1 }, 0)
        .fromTo('.drop-hero__video-wrap', { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.35 }, 0.12)
        .fromTo(intro, { y: 52, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, stagger: 0.08 }, 0.28)

      gsap.timeline({
        scrollTrigger: {
          trigger: '.drop-hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.55,
        },
      })
        .to('.drop-hero__progress span', { scaleX: 1, duration: 1 }, 0)
        .to('.drop-hero__stage', { backgroundColor: 'oklch(0.185 0.046 254)', duration: 0.65 }, 0.08)
        .to('.drop-hero__hook', { yPercent: -26, opacity: 0, duration: 0.34 }, 0.08)
        .to('.drop-hero__issue, .drop-hero__product-name', { opacity: 0, duration: 0.26 }, 0.08)
        .to('.drop-hero__video-wrap', { scale: 0.72, xPercent: 3, yPercent: -4, opacity: 0.42, duration: 0.65 }, 0.08)
        .fromTo('.drop-hero__collector', { clipPath: 'inset(0 100% 0 0)', x: 42 }, { clipPath: 'inset(0 0% 0 0)', x: 0, opacity: 1, duration: 0.4 }, 0.36)
        .fromTo('.drop-hero__second-act', { y: 54, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 }, 0.42)
        .set('.drop-hero__action button', { backgroundColor: 'oklch(0.62 0.252 27)', color: 'oklch(0.945 0.024 83)' }, 0.55)
        .set('.drop-hero__credit', { color: 'oklch(0.945 0.024 83 / 0.58)' }, 0.55)

      gsap.utils.toArray<HTMLElement>('[data-drop-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 48, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })

      gsap.fromTo('.clarity-copy__word', { opacity: 0.58 }, {
        opacity: 1,
        stagger: 0.075,
        ease: 'none',
        scrollTrigger: {
          trigger: '.product-intro__copy',
          start: 'top 78%',
          end: 'bottom 48%',
          scrub: 0.45,
        },
      })

      const panels = gsap.utils.toArray<HTMLElement>('.proofs__panel')
      const visuals = gsap.utils.toArray<HTMLElement>('.proofs__visual-card')
      const powerTabs = gsap.utils.toArray<HTMLElement>('.proofs__power-tab')
      gsap.set(panels.slice(1), { opacity: 0, y: 44 })
      gsap.set(visuals.slice(1), { opacity: 0, xPercent: 18, rotate: 4 })
      gsap.set(powerTabs, { flexGrow: 0.7, opacity: 0.42 })
      gsap.set(powerTabs[0], { flexGrow: 2.2, opacity: 1 })
      gsap.set('.mask-proof__web path', { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set('.mask-proof__eye', { scale: 0.82, transformOrigin: 'center' })

      const proofTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.proofs',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
        },
      })
      proofTimeline
        .to('.mask-proof__web path', { strokeDashoffset: 0, duration: 0.58, stagger: 0.06 }, 0)
        .to('.mask-proof__eye', { scale: 1, duration: 0.48, ease: 'expo.out' }, 0.04)
        .to('.proofs__progress-fill', { scaleX: 0.5, duration: 1 }, 0)
        .to(panels[0], { opacity: 0, y: -38, duration: 0.28 }, 0.66)
        .to(visuals[0], { opacity: 0, xPercent: -16, rotate: -3, duration: 0.32 }, 0.64)
        .to(powerTabs[0], { flexGrow: 0.7, opacity: 0.42, duration: 0.24 }, 0.64)
        .to(powerTabs[1], { flexGrow: 2.2, opacity: 1, duration: 0.3 }, 0.67)
        .to(panels[1], { opacity: 1, y: 0, duration: 0.3 }, 0.73)
        .to(visuals[1], { opacity: 1, xPercent: 0, rotate: -2, duration: 0.36 }, 0.7)
        .to('.proofs__progress-fill', { scaleX: 0.75, duration: 1 }, 1)
        .to(panels[1], { opacity: 0, y: -38, duration: 0.28 }, 1.66)
        .to(visuals[1], { opacity: 0, xPercent: -16, rotate: -6, duration: 0.32 }, 1.64)
        .to(powerTabs[1], { flexGrow: 0.7, opacity: 0.42, duration: 0.24 }, 1.64)
        .to(powerTabs[2], { flexGrow: 2.2, opacity: 1, duration: 0.3 }, 1.67)
        .to(panels[2], { opacity: 1, y: 0, duration: 0.3 }, 1.73)
        .to(visuals[2], { opacity: 1, xPercent: 0, rotate: 2, duration: 0.36 }, 1.7)
        .to('.proofs__progress-fill', { scaleX: 1, duration: 1 }, 2)

      gsap.fromTo('.identity__trace path', { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.identity', start: 'top 80%', end: 'bottom 70%', scrub: 0.6 },
      })
      gsap.to('.identity__word--one', {
        xPercent: () => window.innerWidth < 760 ? -3 : -12,
        ease: 'none',
        scrollTrigger: { trigger: '.identity', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      })
      gsap.to('.identity__word--two', {
        xPercent: () => window.innerWidth < 760 ? 3 : 13,
        ease: 'none',
        scrollTrigger: { trigger: '.identity', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  const handleReserve = () => {
    if (!selectedSize || reserved) return
    reserve()
  }

  return (
    <main className="drop-site" ref={rootRef}>
      <SpiderWorld scopeRef={rootRef} />
      <a className="drop-skip" href="#product">Skip to product</a>

      <nav className="drop-nav" aria-label="Main navigation">
        <a className="drop-nav__mark" href="#top" aria-label="The Web Suit home">
          <SpiderStamp />
          <span>THE WEB SUIT</span>
        </a>
        <div className="drop-nav__links">
          <a href="#product">What you get</a>
          <a href="#identity">Your animation</a>
          <a href="#reserve">Choose a size</a>
        </div>
        <button type="button" className="drop-nav__buy" onClick={scrollToReserve}>
          Choose size <span>{DROP.currency}{DROP.price}</span>
        </button>
      </nav>

      <section className="drop-hero" id="top" aria-labelledby="drop-hook" data-world-tone="red" data-world-origin="right">
        <div className="drop-hero__stage">
          <div className="drop-hero__issue" data-drop-intro>
            <span>Limited Spider-Man suit</span>
            <span>Only 500 made</span>
          </div>
          <p className="drop-hero__product-name" data-drop-intro>The Web Suit by Spider-Man and Digitivia</p>
          <h1 className="drop-hero__hook" id="drop-hook">
            <span data-drop-intro>Wear the <em>suit.</em></span>
            <span data-drop-intro>Be Spider-Man.</span>
          </h1>
          <div className="drop-hero__video-wrap">
            <video
              className="drop-hero__video"
              src={heroFilm}
              poster={heroPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <div className="drop-hero__video-meta" aria-hidden="true">
              <span>Source film / 16:9</span>
              <span>00:06.5</span>
            </div>
          </div>

          <div className="drop-hero__collector" aria-hidden="true">
            <div className="drop-hero__collector-head"><span>Your suit number</span><span>001 of 500</span></div>
            <SpiderEyes className="drop-hero__collector-eyes" />
            <small>Personal animation included</small>
          </div>

          <div className="drop-hero__second-act" aria-hidden="true">
            <span>Scroll to see the suit</span>
            <strong>Spider-Man moves<br />with you.</strong>
          </div>

          <div className="drop-hero__action" data-drop-intro>
            <p>Buy one of 500 numbered Spider-Man suits. Your suit includes a personal digital animation by Digitivia.</p>
            <button type="button" onClick={scrollToReserve}>
              <span>Choose your size</span>
              <span aria-hidden="true">↘</span>
            </button>
          </div>
          <p className="drop-hero__credit" data-drop-intro>Scroll to explore the suit</p>
          <div className="drop-hero__progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <div className="drop-ticker" aria-hidden="true">
        <div>
          {Array.from({ length: 4 }, (_, index) => (
            <Fragment key={index}>
              <span>500 numbered suits</span><i>✳</i><span>$248 each</span><i>✳</i><span>Personal animation included</span><i>✳</i>
            </Fragment>
          ))}
        </div>
      </div>

      <section className="product-intro" id="product" aria-labelledby="product-title" data-world-tone="light" data-world-origin="right">
        <SpiderEyes className="product-intro__eyes" />
        <div className="product-intro__index" data-drop-reveal>What you get</div>
        <div className="product-intro__copy">
          <h2 id="product-title" data-drop-reveal>
            One suit.
            <span className="product-intro__inline-eyes" aria-hidden="true"><SpiderEyes /></span>
            <br /><span>One personal animation.</span>
          </h2>
          <p data-drop-reveal><ScrubWords text="You get a physical Spider-Man suit. Your suit number also includes a personal Digitivia animation." /></p>
        </div>
        <div className="product-intro__facts" data-drop-reveal>
          <div data-spider-react><span>Physical suit</span><strong>Spider-Man</strong><small>Made to wear</small></div>
          <div data-spider-react><span>Limited release</span><strong>500 suits</strong><small>Numbered 001 to 500</small></div>
          <div data-spider-react><span>Digital extra</span><strong>Your animation</strong><small>Included with the suit</small></div>
        </div>
      </section>

      <section className="proofs" aria-labelledby="proofs-title" data-world-tone="dark" data-world-origin="left">
        <div className="proofs__stage">
          <div className="proofs__topline">
            <p id="proofs-title">Three ways this feels like Spider-Man.</p>
            <span>Scroll through all three.</span>
          </div>
          <div className="proofs__visuals" aria-hidden="true">
            <div className="proofs__visual-card" data-spider-react><MaskProof /></div>
            <div className="proofs__visual-card" data-spider-react><WebProof /></div>
            <div className="proofs__visual-card" data-spider-react><SignalProof /></div>
            <div className="proofs__power-rail">
              {PROOFS.map((proof) => <span className="proofs__power-tab" key={proof.index}>{proof.index}</span>)}
            </div>
          </div>
          <div className="proofs__copy">
            {PROOFS.map((proof) => (
              <article className="proofs__panel" key={proof.index}>
                <span>{proof.index} / {proof.label}</span>
                <h3>{proof.title}</h3>
                <p>{proof.body}</p>
              </article>
            ))}
          </div>
          <div className="proofs__progress" aria-hidden="true"><span className="proofs__progress-fill" /></div>
        </div>
      </section>

      <section className="identity" id="identity" aria-labelledby="identity-title" data-world-tone="red" data-world-origin="center">
        <SpiderEyes className="identity__eyes" />
        <p className="identity__eyebrow" data-drop-reveal>Included with every suit</p>
        <h2 className="identity__headline" id="identity-title">
          <span className="identity__word--one">Your suit.</span>
          <span className="identity__word--two">Your animation.</span>
        </h2>
        <svg className="identity__trace" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d="M-40 228C120 228 120 76 280 76s160 228 320 228S760 36 920 36s160 192 320 192" />
          <path pathLength="1" d="M-40 284c130 0 130-160 260-160s130 160 260 160 130-160 260-160 130 160 260 160 130-160 260-160" />
        </svg>
        <div className="identity__bottom">
          <p data-drop-reveal>Every suit has a number from 001 to 500. Digitivia turns that number into a personal Spider-Sense animation.</p>
          <div className="identity__sample" data-drop-reveal aria-label="Example motion identity 001">
            <span>Your digital animation</span><strong>001</strong><small>Included with the suit</small>
          </div>
        </div>
      </section>

      <section className="reserve-new" id="reserve" aria-labelledby="reserve-new-title" data-world-tone="light" data-world-origin="right">
        <SpiderEyes className="reserve-new__eyes" />
        <div className="reserve-new__header">
          <p data-drop-reveal>Only 500 suits</p>
          <h2 id="reserve-new-title" data-drop-reveal>Choose your size.</h2>
        </div>
        <div className="reserve-new__layout">
          <div className="reserve-new__edition" data-drop-reveal data-spider-react aria-hidden="true">
            <span>Limited Spider-Man suit</span>
            <SpiderEyes />
            <small>Numbered 001 to 500</small>
          </div>
          <div className="reserve-new__form" data-drop-reveal>
            <div className="reserve-new__price"><span>The Web Suit</span><strong>{DROP.currency}{DROP.price}</strong></div>
            <fieldset>
              <legend>Choose a size <span>{selectedSize ? `Selected: ${selectedSize}` : 'Select one'}</span></legend>
              <div className="reserve-new__sizes">
                {DROP.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => selectSize(size as Size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="reserve-new__confirm" type="button" disabled={!selectedSize || reserved} onClick={handleReserve}>
              <span>{reserved ? `Size ${selectedSize} held` : selectedSize ? `Reserve size ${selectedSize}` : 'Choose a size to reserve'}</span>
              <span aria-hidden="true">{reserved ? '✓' : '↗'}</span>
            </button>
            <div className="reserve-new__countdown" aria-label="Time until drop">
              {countdown.map(([label, value]) => (
                <div key={label}><strong>{pad(value)}</strong><span>{label}</span></div>
              ))}
            </div>
            <p className="reserve-new__note" role="status" aria-live="polite">
              {reserved ? `Size ${selectedSize} is held for this concept session.` : 'Concept checkout only. No payment is collected.'}
            </p>
          </div>
        </div>
      </section>

      <footer className="drop-footer" data-world-tone="dark" data-world-origin="left">
        <SpiderEyes className="drop-footer__eyes" />
        <p>You wear the Spider-Man suit.<br />Digitivia makes your number move.</p>
        <a href="https://digitivia.com" target="_blank" rel="noopener noreferrer">Digitivia</a>
        <div><span>This is a fan-made concept. It is not affiliated with Marvel or Sony.</span><span>Concept 2026</span></div>
      </footer>

    </main>
  )
}
