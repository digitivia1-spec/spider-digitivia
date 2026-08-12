import { useEffect } from 'react'
import { DropExperience } from './drop/DropExperience'
import { useDeviceSync } from './hooks/useDevice'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useDeviceSync()
  useSmoothScroll()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  return <DropExperience />
}
