import './StickyBar.css'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DROP } from '../config/site'
import { useApp } from '../state/store'

gsap.registerPlugin(ScrollTrigger)

/** Mobile commerce rail: visible after the hero, hidden once the reserve chapter is reached. */
export function StickyBar() {
  const [pastHero, setPastHero] = useState(false)
  const [atReserve, setAtReserve] = useState(false)
  const selectedSize = useApp((state) => state.selectedSize)
  const reserved = useApp((state) => state.reserved)
  const reserve = useApp((state) => state.reserve)

  useEffect(() => {
    const hero = document.querySelector('.hero')
    const reserveSection = document.getElementById('reserve')
    if (!hero || !reserveSection) return
    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: '-10% 0px 0px 0px',
    })
    const reserveTrigger = ScrollTrigger.create({
      trigger: reserveSection,
      start: 'top 80%',
      end: 'max',
      onEnter: () => setAtReserve(true),
      onLeaveBack: () => setAtReserve(false),
    })
    heroObserver.observe(hero)
    return () => {
      heroObserver.disconnect()
      reserveTrigger.kill()
    }
  }, [])

  const click = () => {
    if (selectedSize) reserve()
    else document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="sticky-bar" data-visible={pastHero && !atReserve} aria-live="polite">
      <div>
        <span className="sticky-bar__price">{DROP.currency}{DROP.price}</span>
        <span className="sticky-bar__size">
          {selectedSize ? `Size ${selectedSize}` : `${DROP.runSize} numbered units`}
        </span>
      </div>
      <button type="button" className="btn btn--primary" disabled={reserved} onClick={click}>
        {reserved ? 'Reserved ✓' : selectedSize ? 'Reserve size' : 'Choose size'}
      </button>
    </div>
  )
}
