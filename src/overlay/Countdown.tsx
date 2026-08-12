import { Fragment, useEffect, useState } from 'react'
import { DROP } from '../config/site'

function split(msLeft: number) {
  const total = Math.max(0, Math.floor(msLeft / 1000))
  return {
    days: Math.floor(total / 86400),
    hrs: Math.floor((total % 86400) / 3600),
    min: Math.floor((total % 3600) / 60),
    sec: total % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

// Fixed for the module's lifetime — DROP.dropsAt never changes at runtime.
const TARGET = new Date(DROP.dropsAt).getTime()

/**
 * A real countdown to a fixed date, ticking on a 1s interval. Cells cut hard
 * per second rather than animating a roll — see DESIGN.md: urgency reads as
 * precise, not playful.
 */
export function Countdown({ compact = false }: { compact?: boolean }) {
  const [left, setLeft] = useState(() => split(TARGET - Date.now()))

  useEffect(() => {
    const id = setInterval(() => setLeft(split(TARGET - Date.now())), 1000)
    return () => clearInterval(id)
  }, [])

  const cells: [string, number][] = [
    ['Days', left.days],
    ['Hrs', left.hrs],
    ['Min', left.min],
    ['Sec', left.sec],
  ]

  return (
    <div className="countdown" aria-label="Time until drop">
      {cells.map(([label, v], i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span className="countdown__sep" aria-hidden="true">
              :
            </span>
          )}
          <div className="countdown__cell" style={compact ? { minWidth: 48 } : undefined}>
            <span className="countdown__num">{pad(v)}</span>
            <span className="countdown__label">{label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
