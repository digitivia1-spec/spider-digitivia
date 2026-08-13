import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const officialPath = path.resolve(process.argv[2] || 'output/playwright/official-brand-new-day-poster.png')
const renderPath = path.resolve(process.argv[3] || 'output/playwright/mask-after/powers-390.png')
const outputPath = path.resolve(process.argv[4] || 'output/playwright/mask-reference-comparison.png')

for (const required of [officialPath, renderPath]) {
  if (!fs.existsSync(required)) throw new Error(`Missing comparison input: ${required}`)
}

const panelWidth = 560
const panelHeight = 650
const labelHeight = 58
const background = { r: 5, g: 20, b: 43, alpha: 1 }

const officialMetadata = await sharp(officialPath).metadata()
const officialInput = officialMetadata.width === 560 && officialMetadata.height === 840
  ? await sharp(officialPath).extract({ left: 0, top: 0, width: 560, height: 650 }).png().toBuffer()
  : officialPath

const official = await sharp(officialInput)
  .resize({ width: panelWidth, height: panelHeight, fit: 'contain', background })
  .png()
  .toBuffer()

const rendered = await sharp(renderPath)
  .extract({ left: 46, top: 186, width: 300, height: 330 })
  .resize({ width: panelWidth, height: panelHeight, fit: 'contain', background })
  .png()
  .toBuffer()

const label = (copy) => Buffer.from(`<svg width="${panelWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#05142b"/><text x="28" y="38" fill="#fff4e6" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2">${copy}</text></svg>`)

await sharp({
  create: {
    width: panelWidth * 2 + 4,
    height: panelHeight + labelHeight,
    channels: 4,
    background,
  },
})
  .composite([
    { input: label('OFFICIAL SONY MASK REFERENCE'), left: 0, top: 0 },
    { input: label('REBUILT SHARED VECTOR'), left: panelWidth + 4, top: 0 },
    { input: official, left: 0, top: labelHeight },
    { input: rendered, left: panelWidth + 4, top: labelHeight },
    { input: Buffer.from('<svg width="4" height="708" xmlns="http://www.w3.org/2000/svg"><rect width="4" height="708" fill="#ff1438"/></svg>'), left: panelWidth, top: 0 },
  ])
  .png()
  .toFile(outputPath)

console.log(outputPath)
