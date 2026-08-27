import localFont from "next/font/local";
import fs from "node:fs";
import path from "node:path";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PersistentPlayer from "@/components/PersistentPlayer";
import { withBase } from "@/lib/basePath";

const waxxelDisplay = localFont({
  src: "./fonts/Helvetica.ttf",
  weight: "400 700",
  display: "swap",
  variable: "--font-waxxel",
});

export const metadata = {
  title: "WÄXXEL — Techno",
  description: "WÄXXEL — mörk, mystisk techno. Lyssna, se kommande events och hör av dig.",
  icons: {
    icon: withBase("/favicon.svg"),
  },
};

function getTrack() {
  const file = path.join(process.cwd(), "content", "track.json");
  const track = JSON.parse(fs.readFileSync(file, "utf-8"));
  return { ...track, audioFile: withBase(track.audioFile) };
}

export default function RootLayout({ children }) {
  const track = getTrack();

  return (
    <html lang="sv" className={waxxelDisplay.variable}>
      <body>
        <a className="skip-link" href="#main">Hoppa till innehåll</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <PersistentPlayer track={track} />
      </body>
    </html>
  );
}
