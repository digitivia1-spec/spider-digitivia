import './Hero.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DROP } from '../config/site'
import heroFilm from '../../113354-697718015_medium.mp4?url'
import heroPoster from '../../src-assets/film/face-02.webp'

gsap.registerPlugin(ScrollTrigger)

function WebField() {
  const rays = Array.from({ length: 16 }, (_, index) => index * 22.5)
  return (
    <svg className="hero__web-field" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" vectorEffect="non-scaling-stroke">
        {rays.map((angle) => {
          const rad = (angle * Math.PI) / 180
          return (
            <line
              key={angle}
              x1="50"
              y1="46"
              x2={50 + Math.cos(rad) * 78}
              y2={46 + Math.sin(rad) * 78}
            />
          )
        })}
        {[10, 19, 30, 43, 58].map((radius) => (
          <ellipse key={radius} cx="50" cy="46" rx={radius} ry={radius * 0.72} />
        ))}
      </g>
    </svg>
  )
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const video = videoRef.current
    if (!root || !video) return

    video.muted = true
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      video.pause()
      video.currentTime = 0
    } else {
      void video.play().catch(() => undefined)
    }

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([video, contentRef.current, frameRef.current], { opacity: 1, clearProps: 'transform' })
        return
      }

      const introTargets = root.querySelectorAll<HTMLElement>('[data-hero-reveal]')
      const shutterLines = root.querySelectorAll<HTMLElement>('.hero__shutter span')
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(video, { opacity: 0, scale: 1 }, { opacity: 1, scale: 1, duration: 1.8 }, 0)
        .fromTo(frameRef.current, { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0.22)
        .fromTo(shutterLines, { scaleX: 0 }, { scaleX: 1, duration: 1.15, stagger: 0.07 }, 0.2)
        .fromTo(introTargets, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.42)

      gsap.to(video, {
        scale: 0.92,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.65 },
      })
      gsap.to(shutterLines, {
        xPercent: (index) => (index % 2 === 0 ? 24 : -24),
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.7 },
      })
      gsap.to(contentRef.current, {
        yPercent: -18,
        opacity: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '75% top', scrub: 0.5 },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const enterReserve = () => {
    document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="hero" id="top" ref={rootRef} aria-labelledby="hero-title">
      <div className="hero__ambient" style={{ backgroundImage: `url(${heroPoster})` }} aria-hidden="true" />
      <div className="hero__film-window">
        <video
          ref={videoRef}
          className="hero__film"
          src={heroFilm}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hero__film-meta" aria-hidden="true">
          <span>Full source frame</span>
          <span>Scroll to enter</span>
        </div>
      </div>

      <div className="hero__grade" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />
      <WebField />
      <div className="hero__shutter" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero__frame" ref={frameRef} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero__content" ref={contentRef}>
        <p className="hero__kicker" data-hero-reveal>
          Spider-Man <span>/</span> {DROP.edition}
        </p>
        <h1 className="hero__title" id="hero-title" data-hero-reveal>
          <span>The</span>
          <span>Web Suit</span>
        </h1>
        <p className="hero__promise" data-hero-reveal>
          Wear the icon. Unlock your signal.
        </p>
        <button type="button" className="hero__cta" onClick={enterReserve} data-hero-reveal>
          <span>Reserve yours</span>
          <span aria-hidden="true">{DROP.currency}{DROP.price}</span>
        </button>
      </div>

      <div className="hero__facts" data-hero-reveal>
        <span>{DROP.runSize} numbered units</span>
        <span>Physical suit + digital identity</span>
      </div>
    </section>
  )
}
