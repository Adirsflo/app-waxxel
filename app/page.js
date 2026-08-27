import fs from "node:fs";
import path from "node:path";
import Hero from "@/components/Hero";
import ListenSection from "@/components/ListenSection";
import EventsSection from "@/components/EventsSection";
import ContactSection from "@/components/ContactSection";

function getEvents() {
  const file = path.join(process.cwd(), "content", "events.json");
  return JSON.parse(fs.readFileSync(file, "utf-8")).events;
}

function getTrack() {
  const file = path.join(process.cwd(), "content", "track.json");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export default function Home() {
  const events = getEvents();
  const track = getTrack();

  return (
    <>
      <Hero />
      <ListenSection track={track} />
      <EventsSection events={events} />
      <ContactSection />
    </>
  );
}
