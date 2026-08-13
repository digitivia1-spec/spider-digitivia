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
  await page.waitForTimeout(2300)
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
      backgroundSuit: rect('[data-qa="background-spider-suit"]'),
      backgroundSuitOpacity: (() => {
        const suit = document.querySelector('[data-qa="background-spider-suit"]')
        return suit ? Number.parseFloat(getComputedStyle(suit).opacity) : 0
      })(),
      heroPurpose: document.querySelector('.drop-hero__action p')?.textContent?.trim() ?? '',
      bodyHasEmDash: document.body.innerText.includes('\u2014'),
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
      metrics.spiderRunner?.width > 50 &&
      metrics.backgroundSuit?.width > 250 &&
      metrics.backgroundSuitOpacity > 0,
  )
  const purposeIsClear = metrics.heroPurpose.includes('500 numbered Spider-Man suits') &&
    metrics.heroPurpose.includes('Every suit comes with its own Digitivia animation') &&
    !metrics.bodyHasEmDash

  if (overflow) failures.push(`${width}px: horizontal overflow`)
  if (!heroCtaInFirstView) failures.push(`${width}px: primary CTA leaves first view`)
  if (!filmIsFullFrame) failures.push(`${width}px: hero film is not a full 16:9 source frame`)
  if (!identityFits) failures.push(`${width}px: identity overflows`)
  if (!footerFits) failures.push(`${width}px: footer credit overflows`)
  if (!spiderWorldFits) failures.push(`${width}px: persistent Spider-Man world failed`)
  if (!purposeIsClear) failures.push(`${width}px: product purpose copy is unclear`)
  if (runtimeErrors.length) failures.push(`${width}px: ${runtimeErrors.join(' | ')}`)

  results.push({ width, height, overflow, heroCtaInFirstView, filmIsFullFrame, identityFits, footerFits, spiderWorldFits, purposeIsClear, runtimeErrors, metrics })
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
const zeroScene = await flow.evaluate(() => {
  const zero = document.querySelector('[data-qa="zero-scene"]')
  const mask = document.querySelector('.drop-zero__mask')
  const head = zero?.querySelector('.mask-art__head')
  const lens = zero?.querySelector('.mask-art__lens')
  if (!(zero instanceof HTMLElement) || !(mask instanceof SVGElement)) return null
  const maskBox = mask.getBoundingClientRect()
  const headBox = head instanceof SVGGraphicsElement ? head.getBBox() : null
  const lensBox = lens instanceof SVGGraphicsElement ? lens.getBBox() : null
  return {
    display: getComputedStyle(zero).display,
    copy: zero.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    maskWidth: Math.round(maskBox.width),
    headAspect: headBox ? Number((headBox.width / headBox.height).toFixed(3)) : null,
    lensAspect: lensBox ? Number((lensBox.width / lensBox.height).toFixed(3)) : null,
    scrollLocked: getComputedStyle(document.body).overflow === 'hidden',
  }
})
const maskSystem = await flow.evaluate(() => {
  const values = (selector) => Array.from(document.querySelectorAll(selector), (node) => node.getAttribute('d') ?? '')
  const heads = values('[data-qa="mask-artwork"] .mask-art__head')
  const leftLenses = values('.mask-art__lens--left')
  const rightLenses = values('.mask-art__lens--right')
  const leftBezels = values('.mask-art__bezel--left')
  const rightBezels = values('.mask-art__bezel--right')
  return {
    artworkCount: document.querySelectorAll('[data-qa="mask-artwork"]').length,
    uniqueHeadPaths: new Set(heads).size,
    leftLensCount: leftLenses.length,
    rightLensCount: rightLenses.length,
    uniqueLeftLensPaths: new Set(leftLenses).size,
    uniqueRightLensPaths: new Set(rightLenses).size,
    leftBezelCount: leftBezels.length,
    rightBezelCount: rightBezels.length,
    uniqueLeftBezelPaths: new Set(leftBezels).size,
    uniqueRightBezelPaths: new Set(rightBezels).size,
  }
})
await flow.waitForTimeout(2300)
const zeroSceneSettled = await flow.evaluate(() => ({
  display: getComputedStyle(document.querySelector('[data-qa="zero-scene"]')).display,
  navVisible: Boolean(document.querySelector('.drop-nav')?.getBoundingClientRect().height),
  heroVisible: Boolean(document.querySelector('.drop-hero__action button')?.getBoundingClientRect().height),
}))
const nativeTouch = await flow.evaluate(() => matchMedia('(pointer: coarse)').matches)
const navReserveVisible = await flow.locator('.drop-nav__buy').isVisible()
const runnerStartTransform = await flow.locator('[data-qa="scrolling-spider-man"]').evaluate((node) => getComputedStyle(node).transform)
const backgroundSuitStartTransform = await flow.locator('[data-qa="background-spider-suit"]').evaluate((node) => getComputedStyle(node).transform)
const maskStartTransform = await flow.locator('[data-qa="scrolling-spider-man"] .spider-figure__mask').evaluate((node) => getComputedStyle(node).transform)
await flow.touchscreen.tap(330, 180)
await flow.waitForTimeout(120)
const touchReaction = await flow.locator('.spider-world').getAttribute('data-interaction')
const maskTouchTransform = await flow.locator('[data-qa="scrolling-spider-man"] .spider-figure__mask').evaluate((node) => getComputedStyle(node).transform)
await flow.evaluate(() => document.getElementById('product')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(180)
const runnerMidTransform = await flow.locator('[data-qa="scrolling-spider-man"]').evaluate((node) => getComputedStyle(node).transform)
const backgroundSuitMidTransform = await flow.locator('[data-qa="background-spider-suit"]').evaluate((node) => getComputedStyle(node).transform)
await flow.evaluate(() => document.querySelector('.proofs')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(260)
const powerOrigin = await flow.locator('.spider-world').getAttribute('data-origin')
const maskEyeCount = await flow.locator('.proof-graphic--mask .mask-art__lens').count()
const powerTabs = await flow.locator('.proofs__power-tab').allTextContents()
await flow.evaluate(() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(500)
await flow.getByRole('button', { name: 'M', exact: true }).click()
const selected = await flow.getByRole('button', { name: 'M', exact: true }).getAttribute('aria-pressed')
const confirm = flow.getByRole('button', { name: /reserve size m/i })
const confirmEnabled = await confirm.isEnabled()
await confirm.click()
const confirmation = await flow.getByText(/Size M is saved for this preview/i).isVisible()
await flow.evaluate(() => document.getElementById('product')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(500)
const navVisibleMidPage = await flow.locator('.drop-nav__buy').isVisible()
await flow.evaluate(() => document.querySelector('footer')?.scrollIntoView({ behavior: 'instant' }))
await flow.waitForTimeout(500)
const navVisibleAtFooter = await flow.locator('.drop-nav__buy').isVisible()

if (!nativeTouch || !navReserveVisible) failures.push('390px: mobile navigation or native touch failed')
if (!zeroScene || zeroScene.display === 'none' || !zeroScene.copy.includes('Spider-Man') || !zeroScene.copy.includes('is here') || zeroScene.maskWidth < 250 || !zeroScene.headAspect || zeroScene.headAspect < 0.74 || zeroScene.headAspect > 0.8 || !zeroScene.lensAspect || zeroScene.lensAspect < 0.94 || zeroScene.lensAspect > 1.16 || zeroScene.scrollLocked) failures.push('390px: immediate Spider-Man zero scene failed')
if (maskSystem.artworkCount !== 6 || maskSystem.uniqueHeadPaths !== 1 || maskSystem.leftLensCount !== maskSystem.rightLensCount || maskSystem.leftLensCount < 12 || maskSystem.uniqueLeftLensPaths !== 1 || maskSystem.uniqueRightLensPaths !== 1 || maskSystem.leftBezelCount !== maskSystem.rightBezelCount || maskSystem.leftBezelCount !== maskSystem.leftLensCount || maskSystem.uniqueLeftBezelPaths !== 1 || maskSystem.uniqueRightBezelPaths !== 1) failures.push('390px: unified Spider-Man mask geometry failed')
if (zeroSceneSettled.display !== 'none' || !zeroSceneSettled.navVisible || !zeroSceneSettled.heroVisible) failures.push('390px: zero scene did not hand off cleanly to the hero')
if (touchReaction !== 'touch' || runnerStartTransform === runnerMidTransform) failures.push('390px: Spider-Man touch or scroll reaction failed')
if (maskStartTransform === maskTouchTransform) failures.push('390px: Spider-Man mask did not follow touch')
if (backgroundSuitStartTransform === backgroundSuitMidTransform) failures.push('390px: background Spider-Man suit did not move with scroll')
if (powerOrigin !== 'left' || maskEyeCount !== 2 || powerTabs.join(',') !== 'MASK,WEB,SENSE') failures.push('390px: radial web origin or mask power scene failed')
if (selected !== 'true' || !confirmEnabled || !confirmation) failures.push('390px: reserve interaction failed')
if (!navVisibleMidPage || !navVisibleAtFooter) failures.push('390px: persistent commerce action failed')

await flow.close()

const reducedPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await reducedPage.emulateMedia({ reducedMotion: 'reduce' })
await reducedPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
await reducedPage.waitForTimeout(700)
const reducedMotion = await reducedPage.evaluate(() => ({
  preferenceMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
  videoPaused: document.querySelector('video')?.paused ?? false,
  loaderAbsent: !document.querySelector('.loader'),
  zeroSceneHidden: getComputedStyle(document.querySelector('[data-qa="zero-scene"]')).display === 'none',
  navVisible: Boolean(document.querySelector('.drop-nav')?.getBoundingClientRect().height),
}))
if (!reducedMotion.preferenceMatches || !reducedMotion.videoPaused || !reducedMotion.loaderAbsent || !reducedMotion.zeroSceneHidden || !reducedMotion.navVisible) {
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
    zeroScene,
    zeroSceneSettled,
    maskSystem,
    touchReaction,
    maskStartTransform,
    maskTouchTransform,
    runnerStartTransform,
    runnerMidTransform,
    backgroundSuitStartTransform,
    backgroundSuitMidTransform,
    powerOrigin,
    maskEyeCount,
    powerTabs,
    selected,
    confirmEnabled,
    confirmation,
    navVisibleMidPage,
    navVisibleAtFooter,
  },
  reducedMotion,
  failures,
}, null, 2))
if (failures.length) process.exitCode = 1
