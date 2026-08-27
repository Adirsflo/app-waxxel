"use client";

import { useEffect, useRef, useState } from "react";
import WaxxelIcon from "./WaxxelIcon";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeNav = () => setIsNavOpen(false);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <a href="#top" className="brand" aria-label="WÄXXEL — till toppen">
          <WaxxelIcon className="brand__icon" />
          <span className="brand__word">WÄXXEL</span>
        </a>

        <button
          className="nav-toggle"
          aria-expanded={isNavOpen}
          aria-controls="primary-nav"
          onClick={() => setIsNavOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
          <span className="sr-only">Meny</span>
        </button>

        <nav
          className={`primary-nav${isNavOpen ? " is-open" : ""}`}
          id="primary-nav"
          ref={navRef}
        >
          <ul>
            <li><a href="#listen" onClick={closeNav}>Listen</a></li>
            <li><a href="#events" onClick={closeNav}>Events</a></li>
            <li><a href="#contact" onClick={closeNav}>Contact</a></li>
          </ul>
          <ul className="primary-nav__socials">
            <li><a href="https://www.instagram.com/waxxel.music/" target="_blank" rel="noopener" onClick={closeNav}>Instagram</a></li>
            <li><a href="https://soundcloud.com/waxxelmusic" target="_blank" rel="noopener" onClick={closeNav}>SoundCloud</a></li>
            <li><a href="https://waxxelmusic.bandcamp.com/" target="_blank" rel="noopener" onClick={closeNav}>Bandcamp</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
