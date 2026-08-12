import './CrawlingSpider.css'
import type { CSSProperties } from 'react'

// 4 legs per side. Each is a 2-segment bent line (hip -> knee -> foot) at an
// angle spread front-to-back, animated in two alternating groups via CSS so
// opposite-phase legs never lift together — the detail that keeps a walk
// cycle from reading as a generic wiggle.
const ANGLES = [-55, -22, 12, 45]

function Leg({ angleDeg, mirror, index }: { angleDeg: number; mirror?: boolean; index: number }) {
  const dir = mirror ? -1 : 1
  const rad = (angleDeg * Math.PI) / 180
  const hipX = dir * 8
  const hipY = 0
  const kneeX = hipX + dir * Math.cos(rad) * 20
  const kneeY = hipY + Math.sin(rad) * 20 - 6
  const footX = kneeX + dir * Math.cos(rad) * 16
  const footY = kneeY + Math.sin(rad) * 16 + 12

  return (
    <path
      className={`spider__leg ${index % 2 === 0 ? 'spider__leg--a' : 'spider__leg--b'}`}
      style={{ ['--leg-delay' as string]: `${index * 0.06}s` }}
      d={`M${hipX},${hipY} Q${kneeX},${kneeY} ${footX},${footY}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  )
}

/**
 * A small crawling spider, walk-cycle animated in pure CSS — the literal
 * "spidey thing" motif, reusable wherever a panel needs a living accent
 * instead of a flat static shape.
 */
export function CrawlingSpider({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-45 -30 90 60" className={`spider ${className}`} style={style} aria-hidden="true">
      {ANGLES.map((a, i) => (
        <Leg key={`l${i}`} angleDeg={a} index={i} />
      ))}
      {ANGLES.map((a, i) => (
        <Leg key={`r${i}`} angleDeg={a} mirror index={i} />
      ))}
      <ellipse cx="0" cy="2" rx="10" ry="7.5" className="spider__abdomen" />
      <circle cx="0" cy="-8" r="5" className="spider__head" />
    </svg>
  )
}
