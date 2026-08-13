type MaskArtworkProps = {
  className?: string
}

type LensPairProps = {
  className?: string
}

const HEAD = 'M300 18C212 18 142 54 105 111C80 149 69 191 72 241L78 302L91 371L98 438C112 490 142 529 185 570L248 620C270 637 287 655 300 672C313 655 330 637 352 620L415 570C458 529 488 490 502 438L509 371L522 302L528 241C531 191 520 149 495 111C458 54 388 18 300 18Z'

const LEFT_SOCKET = 'M120 225C157 157 214 118 282 111C278 184 253 259 208 318C174 362 144 384 118 397C101 343 102 280 120 225Z'
const RIGHT_SOCKET = 'M480 225C443 157 386 118 318 111C322 184 347 259 392 318C426 362 456 384 482 397C499 343 498 280 480 225Z'
const LEFT_LENS = 'M142 231C172 182 215 149 260 137C254 192 234 249 198 296C175 325 154 346 136 357C126 317 128 269 142 231Z'
const RIGHT_LENS = 'M458 231C428 182 385 149 340 137C346 192 366 249 402 296C425 325 446 346 464 357C474 317 472 269 458 231Z'

export function SpiderMaskArtwork({ className = '' }: MaskArtworkProps) {
  return (
    <g className={`mask-art ${className}`.trim()} data-qa="mask-artwork">
      <path className="mask-art__head" d={HEAD} />
      <g className="mask-art__planes">
        <path d="M108 371L114 438C125 490 151 529 191 570L252 620L219 482L208 318Z" />
        <path d="M492 371L486 438C475 490 449 529 409 570L348 620L381 482L392 318Z" />
      </g>
      <g className="mask-art__web" fill="none">
        <path pathLength="1" d="M300 18V672M300 18C214 133 154 255 112 392M300 18C386 133 446 255 488 392M300 18C248 164 221 344 219 482M300 18C352 164 379 344 381 482" />
        <path pathLength="1" d="M117 152Q300 256 483 152M95 272Q300 388 505 272M112 392Q300 505 488 392M139 515Q300 602 461 515M191 570Q300 642 409 570" />
      </g>
      <g className="mask-art__lenses">
        <path className="mask-art__socket mask-art__socket--left" d={LEFT_SOCKET} />
        <path className="mask-art__socket mask-art__socket--right" d={RIGHT_SOCKET} />
        <path className="mask-art__lens mask-art__lens--left" d={LEFT_LENS} />
        <path className="mask-art__lens mask-art__lens--right" d={RIGHT_LENS} />
        <path className="mask-art__lens-facet mask-art__lens-facet--left" d="M142 231C172 182 215 149 260 137C222 170 183 219 136 357C126 317 128 269 142 231Z" />
        <path className="mask-art__lens-facet mask-art__lens-facet--right" d="M458 231C428 182 385 149 340 137C378 170 417 219 464 357C474 317 472 269 458 231Z" />
      </g>
      <path className="mask-art__brow-seam" d="M282 111L300 74L318 111" />
    </g>
  )
}

export function SpiderLensPair({ className = '' }: LensPairProps) {
  return (
    <svg className={`spider-eyes ${className}`.trim()} viewBox="92 96 416 316" aria-hidden="true" data-qa="spider-lens-pair">
      <g className="mask-art__lenses">
        <path className="mask-art__socket mask-art__socket--left" d={LEFT_SOCKET} />
        <path className="mask-art__socket mask-art__socket--right" d={RIGHT_SOCKET} />
        <path className="mask-art__lens mask-art__lens--left" d={LEFT_LENS} />
        <path className="mask-art__lens mask-art__lens--right" d={RIGHT_LENS} />
        <path className="mask-art__lens-facet mask-art__lens-facet--left" d="M142 231C172 182 215 149 260 137C222 170 183 219 136 357C126 317 128 269 142 231Z" />
        <path className="mask-art__lens-facet mask-art__lens-facet--right" d="M458 231C428 182 385 149 340 137C378 170 417 219 464 357C474 317 472 269 458 231Z" />
      </g>
    </svg>
  )
}
