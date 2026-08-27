import Reveal from "./Reveal";

export default function ListenSection({ track }) {
  return (
    <section className="section listen" id="listen">
      <div className="section__inner">
        <Reveal as="h2" className="section__title">Listen</Reveal>

        <Reveal className="now-playing-card">
          <div className="now-playing-card__meta">
            <span className="player__track">{track.title}</span>
            <span className="player__artist">{track.artist}</span>
          </div>
          <p className="now-playing-card__hint">
            Spelas i bakgrunden — styr uppspelning och volym i spelaren längst ner på skärmen.
          </p>
        </Reveal>

        <Reveal as="p" className="listen__more">
          Fler spår och sets hittar du på{" "}
          <a href="https://soundcloud.com/waxxelmusic" target="_blank" rel="noopener">SoundCloud</a>,{" "}
          <a href="https://waxxelmusic.bandcamp.com/" target="_blank" rel="noopener">Bandcamp</a>{" "}
          och <a href="https://www.beatport.com/label/waxxel/97281" target="_blank" rel="noopener">Beatport</a>.
        </Reveal>
      </div>
    </section>
  );
}
