import './DigitiviaBadge.css'

/**
 * Quiet identity mark, not a footer credit line — a small persistent corner
 * badge (the same slot the reference reserves for its sound toggle), a
 * monogram only, no "made by" copy. It says nothing about Spider-Man; the
 * craft is the only place that connection shows.
 */
export function DigitiviaBadge() {
  return (
    <a
      className="digitivia-badge"
      href="https://digitivia.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Motion design by Digitivia — opens digitivia.com"
    >
      <svg viewBox="0 0 24 24" className="digitivia-badge__mark" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" fill="none" />
        <path d="M9 7.5 L9 16.5 Q15 16.5 15 12 Q15 7.5 9 7.5 Z" fill="none" />
      </svg>
    </a>
  )
}
