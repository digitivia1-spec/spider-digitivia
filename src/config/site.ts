/** Site-wide config: device classing for responsive tuning, and the drop's commerce facts. */

export type DeviceClass = 'mobile' | 'tablet' | 'desktop'

/** The drop. One product, one size run. */
export const DROP = {
  name: 'THE WEB SUIT',
  edition: 'DROP 001',
  runSize: 500,
  price: 248,
  currency: '$',
  // Fixed future date so the countdown is real, not a moving target re-picked
  // on every page load.
  dropsAt: '2026-08-22T16:00:00Z',
  sizes: ['XS', 'S', 'M', 'L', 'XL'] as const,
} as const

export type Size = (typeof DROP.sizes)[number]
