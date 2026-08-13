type MaskArtworkProps = {
  className?: string
}

type LensPairProps = {
  className?: string
}

// Proportions are derived from Sony's official Brand New Day one-sheet: a broad
// human brow, low swept lenses, layered bezels, compressed cheeks, and a round
// jaw. The paths remain original vector construction so every animated instance
// can share one light, responsive mask system.
const HEAD = 'M300 20C214 17 141 43 96 94C61 134 47 190 50 258L58 365C63 433 89 493 134 544C176 591 226 629 274 655C285 662 294 666 300 667C306 666 315 662 326 655C374 629 424 591 466 544C511 493 537 433 542 365L550 258C553 190 539 134 504 94C459 43 386 17 300 20Z'

const LEFT_SOCKET = 'M283 167C229 171 170 190 120 224C101 252 99 291 114 336C163 327 213 305 250 272C273 251 281 211 283 167Z'
const RIGHT_SOCKET = 'M317 167C371 171 430 190 480 224C499 252 501 291 486 336C437 327 387 305 350 272C327 251 319 211 317 167Z'
const LEFT_BEZEL = 'M273 181C225 187 175 203 134 232C119 255 117 286 129 322C170 312 211 293 243 264C262 246 270 215 273 181Z'
const RIGHT_BEZEL = 'M327 181C375 187 425 203 466 232C481 255 483 286 471 322C430 312 389 293 357 264C338 246 330 215 327 181Z'
const LEFT_LENS = 'M262 194C220 201 180 214 148 239C136 259 135 281 143 306C176 297 208 281 235 257C250 242 258 218 262 194Z'
const RIGHT_LENS = 'M338 194C380 201 420 214 452 239C464 259 465 281 457 306C424 297 392 281 365 257C350 242 342 218 338 194Z'

export function SpiderMaskArtwork({ className = '' }: MaskArtworkProps) {
  return (
    <g className={`mask-art ${className}`.trim()} data-qa="mask-artwork">
      <path className="mask-art__head" d={HEAD} />
      <g className="mask-art__planes">
        <path d="M58 365C63 433 89 493 134 544C176 591 226 629 274 655L238 516L143 422Z" />
        <path d="M542 365C537 433 511 493 466 544C424 591 374 629 326 655L362 516L457 422Z" />
        <path className="mask-art__nose-plane" d="M300 252L267 365L300 410L333 365Z" />
      </g>
      <g className="mask-art__web" fill="none">
        <path pathLength="1" d="M300 20V667M300 305L96 94M300 305L50 258M300 305L58 365M300 305L92 493M300 305L176 591M300 305L424 591M300 305L508 493M300 305L542 365M300 305L550 258M300 305L504 94" />
        <path pathLength="1" d="M152 57Q300 118 448 57M84 121Q300 205 516 121M54 220Q300 305 546 220M58 365Q300 454 542 365M92 493Q300 568 508 493M176 591Q300 637 424 591" />
      </g>
      <g className="mask-art__lenses">
        <path className="mask-art__socket mask-art__socket--left" d={LEFT_SOCKET} />
        <path className="mask-art__socket mask-art__socket--right" d={RIGHT_SOCKET} />
        <path className="mask-art__bezel mask-art__bezel--left" d={LEFT_BEZEL} />
        <path className="mask-art__bezel mask-art__bezel--right" d={RIGHT_BEZEL} />
        <path className="mask-art__lens mask-art__lens--left" d={LEFT_LENS} />
        <path className="mask-art__lens mask-art__lens--right" d={RIGHT_LENS} />
        <path className="mask-art__lens-facet mask-art__lens-facet--left" d="M262 194C220 201 180 214 148 239C176 226 211 221 249 223C255 212 260 201 262 194Z" />
        <path className="mask-art__lens-facet mask-art__lens-facet--right" d="M338 194C380 201 420 214 452 239C424 226 389 221 351 223C345 212 340 201 338 194Z" />
      </g>
      <path className="mask-art__brow-seam" d="M283 167L300 116L317 167M250 272L300 305L350 272" />
    </g>
  )
}

export function SpiderLensPair({ className = '' }: LensPairProps) {
  return (
    <svg className={`spider-eyes ${className}`.trim()} viewBox="92 96 416 316" aria-hidden="true" data-qa="spider-lens-pair">
      <g className="mask-art__lenses">
        <path className="mask-art__socket mask-art__socket--left" d={LEFT_SOCKET} />
        <path className="mask-art__socket mask-art__socket--right" d={RIGHT_SOCKET} />
        <path className="mask-art__bezel mask-art__bezel--left" d={LEFT_BEZEL} />
        <path className="mask-art__bezel mask-art__bezel--right" d={RIGHT_BEZEL} />
        <path className="mask-art__lens mask-art__lens--left" d={LEFT_LENS} />
        <path className="mask-art__lens mask-art__lens--right" d={RIGHT_LENS} />
        <path className="mask-art__lens-facet mask-art__lens-facet--left" d="M262 194C220 201 180 214 148 239C176 226 211 221 249 223C255 212 260 201 262 194Z" />
        <path className="mask-art__lens-facet mask-art__lens-facet--right" d="M338 194C380 201 420 214 452 239C424 226 389 221 351 223C345 212 340 201 338 194Z" />
      </g>
    </svg>
  )
}
