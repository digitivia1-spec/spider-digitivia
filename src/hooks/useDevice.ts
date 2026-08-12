import { useEffect } from 'react'
import type { DeviceClass } from '../config/site'
import { useApp, runtime } from '../state/store'

function classify(w: number): DeviceClass {
  if (w < 560) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export function useDeviceSync() {
  const setDevice = useApp((s) => s.setDevice)

  useEffect(() => {
    const apply = () => {
      setDevice(classify(window.innerWidth))
      // Real mobile viewport unit: accounts for the collapsing browser chrome.
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    apply()

    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotion = () => {
      runtime.reducedMotion = mq.matches
    }
    applyMotion()

    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    mq.addEventListener('change', applyMotion)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      mq.removeEventListener('change', applyMotion)
    }
  }, [setDevice])
}
