import './Nav.css'
import { useEffect, useState } from 'react'

const LINKS = [
  ['Engine', 'anatomy'],
  ['Motion', 'materials'],
  ['Signal', 'signal'],
  ['Reserve', 'reserve'],
] as const

function SpiderGlyph() {
  return (
    <svg className="nav__glyph" viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="3.4" ry="5.2" />
      <path d="M13.7 13 8 7M18.3 13 24 7M12.9 15 5 13M19.1 15 27 13M12.9 18 5 20M19.1 18 27 20M13.7 20 8 26M18.3 20 24 26" />
    </svg>
  )
}

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const navigate = (id: string) => {
    setOpen(false)
    goTo(id)
  }

  return (
    <>
      <nav className="nav" aria-label="Primary navigation">
        <button className="nav__identity" type="button" onClick={() => goTo('top')} aria-label="Return to the top">
          <SpiderGlyph />
          <span>WEB / 001</span>
        </button>

        <span className="nav__drop">Limited series</span>

        <ul className="nav__links">
          {LINKS.map(([label, id]) => (
            <li key={id}>
              <button type="button" onClick={() => navigate(id)}>{label}</button>
            </li>
          ))}
        </ul>

        <button
          className="nav__menu"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? 'Close' : 'Menu'}</span>
          <i aria-hidden="true" />
        </button>
      </nav>

      <div className="nav-drawer" data-open={open} aria-hidden={!open}>
        <p>Navigate the drop</p>
        <ol>
          {LINKS.map(([label, id], index) => (
            <li key={id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <button type="button" onClick={() => navigate(id)}>{label}</button>
            </li>
          ))}
        </ol>
        <span className="nav-drawer__edition">Spider-Man / The Web Suit</span>
      </div>
    </>
  )
}
