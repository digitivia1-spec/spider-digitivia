import './Loader.css'
import { useEffect, useState } from 'react'

/** One lens: outline draws in, then the white lens fills and narrows to a slit-blink. */
function Lens({ mirror }: { mirror?: boolean }) {
  return (
    <svg viewBox="0 0 200 160" className={`loader__lens ${mirror ? 'is-mirror' : ''}`} aria-hidden="true">
      <path
        className="loader__lens-outline"
        d="M12 80 C12 34 52 10 100 10 C148 10 188 34 188 80 C188 126 148 150 100 150 C52 150 12 126 12 80 Z"
        fill="none"
        pathLength={1}
      />
      <path
        className="loader__lens-fill"
        d="M34 80 C34 50 62 30 100 30 C138 30 166 50 166 80 C166 110 138 130 100 130 C62 130 34 110 34 80 Z"
      />
    </svg>
  )
}

/**
 * Full-screen brand loader: the mask's lenses draw in, fill, then blink shut
 * as the page wipes away — the reference's exact first-impression beat,
 * rebuilt in flat SVG since there's no photograph to work from.
 */
export function Loader() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in')

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setPhase('done')
      return
    }
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setPhase('hold'), 360)
    const t2 = setTimeout(() => setPhase('out'), 700)
    const t3 = setTimeout(() => setPhase('done'), 1080)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      document.body.style.overflow = ''
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div className="loader" data-phase={phase} aria-hidden="true">
      <div className="loader__eyes">
        <Lens />
        <Lens mirror />
      </div>
    </div>
  )
}
