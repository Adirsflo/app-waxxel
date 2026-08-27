import WaxxelLogoSlim from "./WaxxelLogoSlim";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <WaxxelLogoSlim className="site-footer__logo" />

        <ul className="social-icons">
          <li><a href="https://www.instagram.com/waxxel.music/" target="_blank" rel="noopener" aria-label="Instagram">IG</a></li>
          <li><a href="https://www.facebook.com/waxxelmusic" target="_blank" rel="noopener" aria-label="Facebook">FB</a></li>
          <li><a href="https://soundcloud.com/waxxelmusic" target="_blank" rel="noopener" aria-label="SoundCloud">SC</a></li>
          <li><a href="https://waxxelmusic.bandcamp.com/" target="_blank" rel="noopener" aria-label="Bandcamp">BC</a></li>
          <li><a href="https://www.beatport.com/label/waxxel/97281" target="_blank" rel="noopener" aria-label="Beatport">BP</a></li>
          <li><a href="https://www.youtube.com/@waxxelmusic" target="_blank" rel="noopener" aria-label="YouTube">YT</a></li>
        </ul>

        <p className="site-footer__copy">&copy; {new Date().getFullYear()} WÄXXEL</p>
      </div>
    </footer>
  );
}
