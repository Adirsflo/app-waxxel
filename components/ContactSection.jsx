import ContactForm from "./ContactForm";
import Reveal from "./Reveal";

export default function ContactSection() {
  return (
    <section className="section contact" id="contact">
      <div className="section__inner">
        <Reveal as="h2" className="section__title">Contact</Reveal>
        <p className="contact__lead">Booking, samarbeten eller bara ett hej — skriv gärna.</p>

        <Reveal>
          <ContactForm />
        </Reveal>

        <p className="contact__alt">
          Eller mejla direkt: <a href="mailto:info@waxxel.com">info@waxxel.com</a>
        </p>
      </div>
    </section>
  );
}
