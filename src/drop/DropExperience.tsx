import './DropExperience.css'
import { Fragment, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DROP } from '../config/site'
import type { Size } from '../config/site'
import { useApp } from '../state/store'
import heroFilm from '../../113354-697718015_medium.mp4?url'
import heroPoster from '../../src-assets/film/face-02.webp'

gsap.registerPlugin(ScrollTrigger)

const PROOFS = [
  {
    index: '01',
    label: 'The object',
    title: 'Cut to move.',
    body: 'A close-fit performance shell built as a collectible piece, not a costume-store replica.',
  },
  {
    index: '02',
    label: 'The edition',
    title: 'One of five hundred.',
    body: 'Every suit carries a permanent edition number. No restock language. No endless run.',
  },
  {
    index: '03',
    label: 'The signal',
    title: 'Your number moves.',
    body: 'Digitivia pairs each edition with a distinct motion signature built around its serial.',
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

function WeaveProof() {
  const lines = Array.from({ length: 18 }, (_, index) => index)
  return (
    <svg className="proof-graphic proof-graphic--weave" viewBox="0 0 600 600" aria-hidden="true">
      <rect width="600" height="600" />
      <g>
        {lines.map((line) => (
          <Fragment key={line}>
            <path d={`M${-180 + line * 46} 620 L${230 + line * 46} -20`} />
            <path d={`M${-220 + line * 46} -20 L${190 + line * 46} 620`} />
          </Fragment>
        ))}
      </g>
      <path className="proof-graphic__slash" d="M-40 448 640 152" />
      <circle cx="300" cy="300" r="62" />
      <circle cx="300" cy="300" r="12" />
    </svg>
  )
}

function NumberProof() {
  return (
    <div className="number-proof" aria-hidden="true">
      <span>Edition</span>
      <strong>001</strong>
      <div className="number-proof__barcode">
        {Array.from({ length: 32 }, (_, index) => <i key={index} />)}
      </div>
      <small>001 / 500</small>
    </div>
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
      <text x="32" y="56">DIGITIVIA MOTION ID / 001</text>
    </svg>
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
  const [stickyVisible, setStickyVisible] = useState(false)

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

      const panels = gsap.utils.toArray<HTMLElement>('.proofs__panel')
      const visuals = gsap.utils.toArray<HTMLElement>('.proofs__visual-card')
      gsap.set(panels.slice(1), { opacity: 0, y: 44 })
      gsap.set(visuals.slice(1), { opacity: 0, xPercent: 18, rotate: 4 })

      const proofTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.proofs',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
        },
      })
      proofTimeline
        .to('.proofs__progress-fill', { scaleX: 0.5, duration: 1 }, 0)
        .to(panels[0], { opacity: 0, y: -38, duration: 0.28 }, 0.66)
        .to(visuals[0], { opacity: 0, xPercent: -16, rotate: -3, duration: 0.32 }, 0.64)
        .to(panels[1], { opacity: 1, y: 0, duration: 0.3 }, 0.73)
        .to(visuals[1], { opacity: 1, xPercent: 0, rotate: -2, duration: 0.36 }, 0.7)
        .to('.proofs__progress-fill', { scaleX: 0.75, duration: 1 }, 1)
        .to(panels[1], { opacity: 0, y: -38, duration: 0.28 }, 1.66)
        .to(visuals[1], { opacity: 0, xPercent: -16, rotate: -6, duration: 0.32 }, 1.64)
        .to(panels[2], { opacity: 1, y: 0, duration: 0.3 }, 1.73)
        .to(visuals[2], { opacity: 1, xPercent: 0, rotate: 2, duration: 0.36 }, 1.7)
        .to('.proofs__progress-fill', { scaleX: 1, duration: 1 }, 2)

      gsap.fromTo('.identity__trace path', { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.identity', start: 'top 80%', end: 'bottom 70%', scrub: 0.6 },
      })
      gsap.to('.identity__word--one', {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.identity', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      })
      gsap.to('.identity__word--two', {
        xPercent: 13,
        ease: 'none',
        scrollTrigger: { trigger: '.identity', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      })
    }, root)

    let ticking = false
    const updateSticky = () => {
      ticking = false
      const heroBottom = root.querySelector('.drop-hero')?.getBoundingClientRect().bottom ?? 0
      const reserveTop = root.querySelector('#reserve')?.getBoundingClientRect().top ?? 0
      setStickyVisible(heroBottom < 80 && reserveTop > window.innerHeight * 0.55)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateSticky)
      }
    }
    updateSticky()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      ctx.revert()
    }
  }, [])

  const handleReserve = () => {
    if (!selectedSize || reserved) return
    reserve()
  }

  return (
    <main className="drop-site" ref={rootRef}>
      <a className="drop-skip" href="#product">Skip to product</a>

      <nav className="drop-nav" aria-label="Main navigation">
        <a className="drop-nav__mark" href="#top" aria-label="The Web Suit home">
          <SpiderStamp />
          <span>SPDR / 001</span>
        </a>
        <div className="drop-nav__links">
          <a href="#product">The suit</a>
          <a href="#identity">The signal</a>
          <a href="#reserve">Sizes</a>
        </div>
        <button type="button" className="drop-nav__buy" onClick={scrollToReserve}>
          Reserve <span>{DROP.currency}{DROP.price}</span>
        </button>
      </nav>

      <section className="drop-hero" id="top" aria-labelledby="drop-hook">
        <div className="drop-hero__stage">
          <div className="drop-hero__issue" data-drop-intro>
            <span>Drop 001</span>
            <span>Worldwide concept release</span>
          </div>
          <p className="drop-hero__product-name" data-drop-intro>The Web Suit / Spider-Man × Digitivia</p>
          <h1 className="drop-hero__hook" id="drop-hook">
            <span data-drop-intro>Only <em>500</em></span>
            <span data-drop-intro>get a number.</span>
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
            <div className="drop-hero__collector-head"><span>Collector record</span><span>Drop 001</span></div>
            <strong>001</strong>
            <div className="drop-hero__collector-barcode">
              {Array.from({ length: 24 }, (_, index) => <i key={index} />)}
            </div>
            <small>Edition 001 / 500</small>
          </div>

          <div className="drop-hero__second-act" aria-hidden="true">
            <span>Scroll reveal / ownership</span>
            <strong>The suit is physical.<br />The signal is yours.</strong>
          </div>

          <div className="drop-hero__action" data-drop-intro>
            <p>One physical suit. One permanent serial. One motion identity keyed to its owner.</p>
            <button type="button" onClick={scrollToReserve}>
              <span>Claim your edition</span>
              <span aria-hidden="true">↘</span>
            </button>
          </div>
          <p className="drop-hero__credit" data-drop-intro>Scroll to reveal your record</p>
          <div className="drop-hero__progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <div className="drop-ticker" aria-hidden="true">
        <div>
          {Array.from({ length: 4 }, (_, index) => (
            <Fragment key={index}>
              <span>500 numbered</span><i>✳</i><span>One signal each</span><i>✳</i><span>{DROP.currency}{DROP.price}</span><i>✳</i>
            </Fragment>
          ))}
        </div>
      </div>

      <section className="product-intro" id="product" aria-labelledby="product-title">
        <div className="product-intro__index" data-drop-reveal>01 / The proposition</div>
        <div className="product-intro__copy">
          <h2 id="product-title" data-drop-reveal>Not merch.<br /><span>A numbered object.</span></h2>
          <p data-drop-reveal>The Web Suit joins a physical collectible with a digital identity. The object is Spider-Man. The world around ownership is Digitivia.</p>
        </div>
        <div className="product-intro__facts" data-drop-reveal>
          <div><span>Run</span><strong>500</strong><small>Never repeated</small></div>
          <div><span>Price</span><strong>{DROP.currency}{DROP.price}</strong><small>Concept checkout</small></div>
          <div><span>Pairing</span><strong>1:1</strong><small>Suit to signal</small></div>
        </div>
      </section>

      <section className="proofs" aria-labelledby="proofs-title">
        <div className="proofs__stage">
          <div className="proofs__topline">
            <p id="proofs-title">02 / What you own</p>
            <span>Scroll through the proof</span>
          </div>
          <div className="proofs__visuals" aria-hidden="true">
            <div className="proofs__visual-card"><WeaveProof /></div>
            <div className="proofs__visual-card"><NumberProof /></div>
            <div className="proofs__visual-card"><SignalProof /></div>
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

      <section className="identity" id="identity" aria-labelledby="identity-title">
        <p className="identity__eyebrow" data-drop-reveal>03 / Digitivia layer</p>
        <h2 className="identity__headline" id="identity-title">
          <span className="identity__word--one">Your number</span>
          <span className="identity__word--two">moves.</span>
        </h2>
        <svg className="identity__trace" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d="M-40 228C120 228 120 76 280 76s160 228 320 228S760 36 920 36s160 192 320 192" />
          <path pathLength="1" d="M-40 284c130 0 130-160 260-160s130 160 260 160 130-160 260-160 130 160 260 160 130-160 260-160" />
        </svg>
        <div className="identity__bottom">
          <p data-drop-reveal>Edition 001 does not move like edition 500. Every serial becomes a distinct visual rhythm, creating a digital ownership mark without competing with the physical suit.</p>
          <div className="identity__sample" data-drop-reveal aria-label="Example motion identity 001">
            <span>Motion identity</span><strong>001</strong><small>Signal active</small>
          </div>
        </div>
      </section>

      <section className="reserve-new" id="reserve" aria-labelledby="reserve-new-title">
        <div className="reserve-new__header">
          <p data-drop-reveal>04 / Reserve Drop 001</p>
          <h2 id="reserve-new-title" data-drop-reveal>Pick the fit.<br />Hold the number.</h2>
        </div>
        <div className="reserve-new__layout">
          <div className="reserve-new__edition" data-drop-reveal aria-hidden="true">
            <span>Limited series</span>
            <strong>500</strong>
            <small>physical units</small>
          </div>
          <div className="reserve-new__form" data-drop-reveal>
            <div className="reserve-new__price"><span>The Web Suit</span><strong>{DROP.currency}{DROP.price}</strong></div>
            <fieldset>
              <legend>Choose size <span>{selectedSize ? `Selected: ${selectedSize}` : 'Select one'}</span></legend>
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
              <span>{reserved ? `Size ${selectedSize} held` : 'Reserve this size'}</span>
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

      <footer className="drop-footer">
        <p>The suit is the object.<br />Digitivia builds the world around it.</p>
        <a href="https://digitivia.com" target="_blank" rel="noopener noreferrer">Digitivia</a>
        <div><span>Fan-made concept. Not affiliated with Marvel or Sony.</span><span>Concept 2026</span></div>
      </footer>

      <button className="drop-sticky" type="button" data-visible={stickyVisible} onClick={scrollToReserve} tabIndex={stickyVisible ? 0 : -1}>
        <span>Reserve / {DROP.runSize} made</span><strong>{DROP.currency}{DROP.price}</strong>
      </button>
    </main>
  )
}
