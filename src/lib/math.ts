export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v)

/** Remap v from [a,b] into [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a || 1e-6))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const smoothstep = (t: number) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - clamp(t), 4)
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)))

/** Frame-rate independent damping factor, for settling drag/idle rotation. */
export const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt)
