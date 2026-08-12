import { chromium } from 'playwright'
import { createServer } from 'vite'
import fs from 'fs'
import path from 'path'

const widths = [320, 360, 390, 430, 768, 1024, 1280, 1440]
const heightFor = (width) => (width < 430 ? 700 : width < 900 ? 844 : 900)
const targetUrl = process.env.TARGET_URL || 'http://localhost:5173'
const captureDir = process.env.CAPTURE_DIR

if (captureDir) fs.mkdirSync(captureDir, { recursive: true })

const playwrightCache = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright')
const installedChromium = fs.existsSync(playwrightCache)
  ? fs
      .readdirSync(playwrightCache)
      .filter((name) => /^chromium-\d+$/.test(name))
      .sort()
      .reverse()
      .map((name) => path.join(playwrightCache, name, 'chrome-win64', 'chrome.exe'))
      .find((candidate) => fs.existsSync(candidate))
  : undefined

const server = process.env.TARGET_URL
  ? null
  : await createServer({
      root: path.resolve('.'),
      logLevel: 'silent',
      server: { host: '127.0.0.1', port: 5173, strictPort: true },
    })
if (server) await server.listen()

const browser = await chromium.launch(installedChromium ? { executablePath: installedChromium } : undefined)
const results = []
const failures = []

for (const width of widths) {
  const height = heightFor(width)
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const runtimeErrors = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) runtimeErrors.push(`${response.status()} ${response.url()}`)
  })
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(1700)
  await page.locator('.drop-hero__video').evaluate((video) => new Promise((resolve) => {
    if (video instanceof HTMLVideoElement && video.videoWidth > 0) return resolve(true)
    const timer = window.setTimeout(() => resolve(false), 5000)
    video.addEventListener('loadedmetadata', () => {
      window.clearTimeout(timer)
      resolve(true)
    }, { once: true })
  }))

  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const node = document.querySelector(selector)
      if (!node) return null
      const box = node.getBoundingClientRect()
      return {
        top: Math.round(box.top),
        right: Math.round(box.right),
        bottom: Math.round(box.bottom),
        left: Math.round(box.left),
        width: Math.round(box.width),
        height: Math.round(box.height),
      }
    }

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      page: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
      },
      nav: rect('.drop-nav'),
      identity: rect('.drop-nav__mark'),
      heroTitle: rect('.drop-hero__hook'),
      heroCta: rect('.drop-hero__action button'),
      filmWindow: rect('.drop-hero__video-wrap'),
      spiderWorld: rect('.spider-world'),
      spiderRunner: rect('[data-qa="scrolling-spider-man"]'),
      webCanvas: (() => {
        const canvas = document.querySelector('[data-qa="reactive-web-canvas"]')
        if (!(canvas instanceof HTMLCanvasElement)) return null
        return {
          width: canvas.width,
          height: canvas.height,
          pointerEvents: getComputedStyle(canvas).pointerEvents,
        }
      })(),
      film: (() => {
        const video = document.querySelector('.drop-hero__video')
        if (!(video instanceof HTMLVideoElement)) return null
        return {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          objectFit: getComputedStyle(video).objectFit,
        }
      })(),
      sizeGrid: rect('.reserve-new__sizes'),
      footerCredit: rect('.drop-footer > a'),
    }
  })

  const overflow = metrics.page.scrollWidth > metrics.page.clientWidth + 1
  const heroCtaInFirstView = Boolean(metrics.heroCta && metrics.heroCta.bottom <= height + 1)
  const filmIsFullFrame = Boolean(
    metrics.filmWindow &&
      metrics.film &&
      metrics.film.videoWidth === 1280 &&
      metrics.film.videoHeight === 720 &&
      metrics.film.objectFit === 'contain' &&
      Math.abs(metrics.filmWindow.width / metrics.filmWindow.height - 16 / 9) < 0.02,
  )
  const identityFits = Boolean(metrics.identity && metrics.identity.right <= width + 1)
  const footerFits = Boolean(metrics.footerCredit && metrics.footerCredit.width <= width + 1)
  const spiderWorldFits = Boolean(
    metrics.spiderWorld &&
      metrics.spiderWorld.width === width &&
      metrics.spiderWorld.height === height &&
      metrics.webCanvas?.width >= width &&
      metrics.webCanvas?.height >= height &&
      metrics.webCanvas?.pointerEvents === 'none' &&
      metrics.spiderRunner?.width > 50,
  )

  if (overflow) failures.push(`${width}px: horizontal overflow`)
  if (!heroCtaInFirstView) failures.push(`${width}px: primary CTA leaves first view`)
  if (!filmIsFullFrame) failures.push(`${width}px: hero film is not a full 16:9 source frame`)
  if (!identityFits) failures.push(`${width}px: identity overflows`)
  if (!footerFits) failures.push(`${width}px: footer credit overflows`)
  if (!spiderWorldFits) failures.push(`${width}px: persistent Spider-Man world failed`)
  if (runtimeErrors.length) failures.push(`${width}px: ${runtimeErrors.join(' | ')}`)

  results.push({ width, height, overflow, heroCtaInFirstView, filmIsFullFrame, identityFits, footerFits, spiderWorldFits, runtimeErrors, metrics })
  if (captureDir && [320, 390, 430, 1440].includes(width)) {
    await page.screenshot({ path: path.join(captureDir, `hero-${width}.png`) })
    for (const [name, selector] of [['product', '#product'], ['powers', '.proofs'], ['identity', '#identity'], ['reserve', '#reserve']]) {
      await page.evaluate((target) => document.querySelector(target)?.scrollIntoView({ behavior: 'instant' }), selector)
      await page.waitForTimeout(450)
      await page.screenshot({ path: path.join(captureDir, `${name}-${width}.png`) })
    }
  }
  await page.close()
}

const flow = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })
await flow.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
await flow.waitForTimeout(1700)
const nativeTouch = await flow.evaluate(() => matchMedia('(pointer: coarse)').matches)
const navReserveVisible = await flow.locator('.drop-nav__buy').isVisible()
const runnerStartTransform = await flow.locator('[data-qa="scrolling-spider-man"]').evaluate((node) => getComputedStyle(node).transform)
await flow.touchscreen.tap(195, 422)
await flow.waitForTimeout(80)
const touchReaction = await flow.locator('.spider-world').getAttribute('data-interaction')
await flow.evaluate(() => document.getElementById('product')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(180)
const runnerMidTransform = await flow.locator('[data-qa="scrolling-spider-man"]').evaluate((node) => getComputedStyle(node).transform)
await flow.evaluate(() => document.querySelector('.proofs')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(260)
const powerOrigin = await flow.locator('.spider-world').getAttribute('data-origin')
const maskEyeCount = await flow.locator('.mask-proof__eye').count()
const powerTabs = await flow.locator('.proofs__power-tab').allTextContents()
await flow.evaluate(() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(500)
await flow.getByRole('button', { name: 'M', exact: true }).click()
const selected = await flow.getByRole('button', { name: 'M', exact: true }).getAttribute('aria-pressed')
const confirm = flow.getByRole('button', { name: /reserve this size/i })
const confirmEnabled = await confirm.isEnabled()
await confirm.click()
const confirmation = await flow.getByText(/Size M is held for this concept session/i).isVisible()
await flow.evaluate(() => document.getElementById('product')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(500)
const railVisibleMidPage = await flow.locator('.drop-sticky').getAttribute('data-visible')
await flow.evaluate(() => document.querySelector('footer')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(500)
const railVisibleAtFooter = await flow.locator('.drop-sticky').getAttribute('data-visible')

if (!nativeTouch || !navReserveVisible) failures.push('390px: mobile navigation or native touch failed')
if (touchReaction !== 'touch' || runnerStartTransform === runnerMidTransform) failures.push('390px: Spider-Man touch or scroll reaction failed')
if (powerOrigin !== 'left' || maskEyeCount !== 2 || powerTabs.join(',') !== 'MASK,WEB,SENSE') failures.push('390px: radial web origin or mask power scene failed')
if (selected !== 'true' || !confirmEnabled || !confirmation) failures.push('390px: reserve interaction failed')
if (railVisibleMidPage !== 'true' || railVisibleAtFooter !== 'false') failures.push('390px: commerce rail boundary failed')

await flow.close()

const reducedPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await reducedPage.emulateMedia({ reducedMotion: 'reduce' })
await reducedPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
await reducedPage.waitForTimeout(700)
const reducedMotion = await reducedPage.evaluate(() => ({
  preferenceMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
  videoPaused: document.querySelector('video')?.paused ?? false,
  loaderAbsent: !document.querySelector('.loader'),
}))
if (!reducedMotion.preferenceMatches || !reducedMotion.videoPaused || !reducedMotion.loaderAbsent) {
  failures.push('390px: reduced-motion fallback failed')
}
await reducedPage.close()

await browser.close()
if (server) await server.close()

console.log(JSON.stringify({
  results,
  flow: {
    nativeTouch,
    navReserveVisible,
    touchReaction,
    runnerStartTransform,
    runnerMidTransform,
    powerOrigin,
    maskEyeCount,
    powerTabs,
    selected,
    confirmEnabled,
    confirmation,
    railVisibleMidPage,
    railVisibleAtFooter,
  },
  reducedMotion,
  failures,
}, null, 2))
if (failures.length) process.exitCode = 1
