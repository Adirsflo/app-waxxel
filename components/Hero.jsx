import WaxxelLogo from "./WaxxelLogo";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__bg" style={{ backgroundImage: "url('/assets/images/hero-bg.jpg')" }} />
      <div className="hero__scrim" />
      <div className="hero__content">
        <WaxxelLogo className="hero__logo" />
        <p className="hero__tagline">Dark. Mystical. Techno.</p>
        <a href="#listen" className="btn btn--ghost hero__cta">Listen now</a>
      </div>
      <a href="#listen" className="scroll-cue" aria-hidden="true"></a>
    </section>
  );
}
