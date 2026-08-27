import Reveal from "./Reveal";

export default function EventsSection({ events }) {
  return (
    <section className="section events" id="events">
      <div className="section__inner">
        <Reveal as="h2" className="section__title">Events</Reveal>

        {events.length === 0 ? (
          <Reveal as="p" className="events__empty">
            Inga kommande events just nu — håll utkik på{" "}
            <a href="https://www.instagram.com/waxxel.music/" target="_blank" rel="noopener">Instagram</a>.
          </Reveal>
        ) : (
          <Reveal as="ul" className="events__list">
            {events.map((ev, i) => (
              <li className="event-card" key={`${ev.date}-${ev.name}-${i}`}>
                <span className="event-card__date">{ev.date}</span>
                <span>
                  <p className="event-card__name">{ev.name}</p>
                  <p className="event-card__venue">{ev.venue}</p>
                </span>
                {ev.link ? (
                  <a className="event-card__link" href={ev.link} target="_blank" rel="noopener">
                    Tickets
                  </a>
                ) : (
                  <span></span>
                )}
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
