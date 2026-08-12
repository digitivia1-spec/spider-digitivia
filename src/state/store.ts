import { create } from 'zustand'
import type { DeviceClass, Size } from '../config/site'

/** Global runtime flags read outside React's render cycle. */
export const runtime = {
  reducedMotion: false,
}

interface AppState {
  device: DeviceClass
  debug: boolean
  selectedSize: Size | null
  reserved: boolean
  setDevice: (d: DeviceClass) => void
  selectSize: (s: Size) => void
  reserve: () => void
}

export const useApp = create<AppState>((set) => ({
  device: 'mobile',
  debug: new URLSearchParams(location.search).has('debug'),
  selectedSize: null,
  reserved: false,
  setDevice: (device) => set({ device }),
  selectSize: (selectedSize) => set({ selectedSize }),
  reserve: () => set({ reserved: true }),
}))
