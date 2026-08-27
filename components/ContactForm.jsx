"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState({ text: "", state: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    setStatus({ text: "Skickar...", state: "" });

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus({ text: "Tack! Meddelandet är skickat.", state: "ok" });
        form.reset();
      } else {
        throw new Error("Request failed");
      }
    } catch {
      setStatus({
        text: "Något gick fel — mejla oss gärna direkt på info@waxxel.com istället.",
        state: "error",
      });
    }
  }

  return (
    <form
      className="contact-form"
      action="https://formspree.io/f/YOUR_FORM_ID"
      method="POST"
      onSubmit={handleSubmit}
    >
      <div className="contact-form__row">
        <label htmlFor="name">Namn</label>
        <input type="text" id="name" name="name" required autoComplete="name" />
      </div>
      <div className="contact-form__row">
        <label htmlFor="email">E-post</label>
        <input type="email" id="email" name="email" required autoComplete="email" />
      </div>
      <div className="contact-form__row">
        <label htmlFor="message">Meddelande</label>
        <textarea id="message" name="message" rows={5} required></textarea>
      </div>
      <button type="submit" className="btn btn--solid">Skicka</button>
      <p className="contact-form__status" data-state={status.state} role="status">
        {status.text}
      </p>
    </form>
  );
}
