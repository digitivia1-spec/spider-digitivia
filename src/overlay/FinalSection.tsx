import './FinalSection.css'
import { useEffect, useRef, useState } from 'react'
import { DROP } from '../config/site'
import type { Size } from '../config/site'
import { useApp } from '../state/store'
import { Countdown } from './Countdown'
import { Toast } from './Toast'

const SEAL_RAYS = Array.from({ length: 16 }, (_, index) => index * 22.5)

function EditionSeal() {
  return (
    <div className="reserve__edition" role="img" aria-label="Animated seal for numbered edition 001">
      <svg className="reserve__seal" viewBox="0 0 600 600" aria-hidden="true">
        <g className="reserve__seal-grid">
          {SEAL_RAYS.map((angle) => {
            const radians = (angle * Math.PI) / 180
            return (
              <line
                key={angle}
                x1="300"
                y1="300"
                x2={300 + Math.cos(radians) * 290}
                y2={300 + Math.sin(radians) * 290}
              />
            )
          })}
          <circle cx="300" cy="300" r="250" />
          <circle cx="300" cy="300" r="184" />
          <circle cx="300" cy="300" r="112" />
        </g>
        <g className="reserve__seal-orbit">
          <circle cx="300" cy="300" r="218" pathLength="100" />
          <path d="M300 42 A258 258 0 0 1 548 230" pathLength="100" />
        </g>
        <g className="reserve__seal-core">
          <path d="M300 206 L394 300 L300 394 L206 300 Z" />
          <circle cx="300" cy="300" r="16" />
        </g>
      </svg>
      <div className="reserve__edition-number">
        <span>Edition</span>
        <strong>001</strong>
        <small>Motion identity active</small>
      </div>
    </div>
  )
}

function dropDateLabel() {
  return new Date(DROP.dropsAt)
    .toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })
    .toUpperCase()
}

export function FinalSection() {
  const selectedSize = useApp((state) => state.selectedSize)
  const selectSize = useApp((state) => state.selectSize)
  const reserved = useApp((state) => state.reserved)
  const reserve = useApp((state) => state.reserve)
  const [toast, setToast] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  const handleReserve = () => {
    if (!selectedSize) return
    reserve()
    setToast(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 3200)
  }

  return (
    <section className="reserve" id="reserve" aria-labelledby="reserve-title">
      <div className="reserve__visual">
        <div className="reserve__protocol" aria-hidden="true">
          <span>WEB / DROP 001</span>
          <span>500 / LIMITED SERIES</span>
        </div>
        <EditionSeal />
        <div className="reserve__coordinates" aria-hidden="true">
          <span>X 03.1415</span>
          <span>Y 16.0826</span>
          <span>SIGNAL LOCKED</span>
        </div>
      </div>

      <div className="reserve__panel">
        <p className="reserve__eyebrow">Reserve Drop 001</p>
        <h2 id="reserve-title">Choose<br />your size.</h2>
        <div className="reserve__facts">
          <span>{DROP.currency}{DROP.price}</span>
          <span>{DROP.runSize} units</span>
        </div>

        <div className="reserve__picker">
          <div className="reserve__picker-head">
            <span>Size</span>
            <span>{selectedSize ? `Selected ${selectedSize}` : 'Select one'}</span>
          </div>
          <div className="reserve__sizes" role="group" aria-label="Choose suit size">
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
        </div>

        <button
          type="button"
          className="btn btn--primary reserve__cta"
          disabled={!selectedSize || reserved}
          onClick={handleReserve}
        >
          <span>{reserved ? 'Size reserved' : 'Confirm size'}</span>
          <span aria-hidden="true">{reserved ? '✓' : `${DROP.currency}${DROP.price}`}</span>
        </button>

        <div className="reserve__window">
          <p>Drop window</p>
          <Countdown compact />
          <span>{dropDateLabel()}</span>
        </div>

        <p className="reserve__note">Concept checkout only. No payment is collected.</p>
      </div>

      <Toast visible={toast} message={selectedSize ? `Size ${selectedSize} is held for this concept session.` : ''} />
    </section>
  )
}
