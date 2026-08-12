import type { ReactNode } from 'react'
import { useTilt } from '../hooks/useTilt'

/**
 * Wraps the pointer/touch tilt hook in a component so it can be dropped
 * inside a .map() — each instance gets its own ref via its own hook call,
 * which a bare hook invocation inside the parent's map callback can't do.
 */
export function Tilt({
  children,
  className = '',
  strength = 8,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useTilt<HTMLDivElement>(strength)
  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  )
}
