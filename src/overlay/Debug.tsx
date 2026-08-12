import { useEffect, useRef } from 'react'
import { useApp } from '../state/store'

/** Enabled with ?debug. Never mounted otherwise. */
export function Debug() {
  const debug = useApp((s) => s.debug)
  const device = useApp((s) => s.device)
  const el = useRef<HTMLDivElement>(null)
  const frames = useRef({ n: 0, last: performance.now(), fps: 0 })

  useEffect(() => {
    if (!debug) return
    let raf = 0
    const loop = () => {
      const f = frames.current
      f.n++
      const now = performance.now()
      if (now - f.last >= 500) {
        f.fps = Math.round((f.n * 1000) / (now - f.last))
        f.n = 0
        f.last = now
      }
      if (el.current) {
        el.current.textContent = [
          `fps    ${f.fps}`,
          `device ${device}`,
          `vp     ${window.innerWidth}x${window.innerHeight}`,
        ].join('\n')
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [debug, device])

  if (!debug) return null
  return <div className="debug" ref={el} />
}
