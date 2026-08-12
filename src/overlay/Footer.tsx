import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__collab">A physical drop imagined as a living digital world.</p>
      <a
        className="site-footer__digitivia"
        href="https://digitivia.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Digital experience by</span>
        <strong>Digitivia</strong>
      </a>
      <div className="site-footer__base">
        <span>Spider-Man / The Web Suit / Drop 001</span>
        <span>Concept 2026</span>
      </div>
      <p className="site-footer__legal">
        Fan-made design concept. Not affiliated with or endorsed by Marvel or Sony Pictures. No real orders are processed.
      </p>
    </footer>
  )
}
