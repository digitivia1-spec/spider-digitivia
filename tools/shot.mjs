// Headless visual QA harness: screenshots the page at given scroll positions / viewports.
// usage: node tools/shot.mjs [--w 390] [--h 844] [--scroll 0,0.2,0.5] [--out name] [--wait 3000]
import { chromium } from 'playwright'
import { createServer } from 'vite'
import fs from 'fs'
import path from 'path'

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i > -1 ? process.argv[i + 1] : d
}
const W = +arg('w', 390)
const H = +arg('h', 844)
const OUT = arg('out', 'shot')
const WAIT = +arg('wait', 2000)
const scrolls = arg('scroll', '0').split(',').map(Number)
const DIR = path.resolve(arg('dir', '.codex-tmp/shots'))
fs.mkdirSync(DIR, { recursive: true })

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
const server = await createServer({
  root: path.resolve('.'),
  logLevel: 'silent',
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
})
await server.listen()
const browser = await chromium.launch(installedChromium ? { executablePath: installedChromium } : undefined)
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: +arg('dpr', 1) })
const logs = []
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))

await page.goto('http://localhost:5173' + (arg('debug', '') === '1' ? '?debug' : ''), {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForTimeout(WAIT)

for (const s of scrolls) {
  await page.evaluate((p) => {
    const max = document.body.scrollHeight - window.innerHeight
    window.scrollTo({ top: max * p, behavior: 'instant' })
  }, s)
  await page.waitForTimeout(900)
  const name = `${DIR}/${OUT}_${W}x${H}_${String(s).replace('.', '')}.png`
  await page.screenshot({ path: name, timeout: 120000, animations: 'disabled' })
  console.log('shot', name)
}

const diag = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
  scrollH: document.body.scrollHeight,
  innerH: window.innerHeight,
  dpr: window.devicePixelRatio,
}))
console.log('DIAG', JSON.stringify(diag))
console.log('--- console ---')
console.log(logs.slice(-40).join('\n'))
await browser.close()
await server.close()
