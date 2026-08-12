import { useEffect } from 'react'
import { Cursor } from './overlay/Cursor'
import { Loader } from './overlay/Loader'
import { Nav } from './overlay/Nav'
import { Hero } from './overlay/Hero'
import { RosterSection } from './overlay/RosterSection'
import { ManifestoSection } from './overlay/ManifestoSection'
import { GallerySection } from './overlay/GallerySection'
import { FinalSection } from './overlay/FinalSection'
import { StickyBar } from './overlay/StickyBar'
import { Footer } from './overlay/Footer'
import { Debug } from './overlay/Debug'
import { useDeviceSync } from './hooks/useDevice'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useDeviceSync()
  useSmoothScroll()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <Hero />
      <RosterSection />
      <GallerySection />
      <ManifestoSection />
      <FinalSection />
      <Footer />

      <StickyBar />
      <Debug />
    </>
  )
}
