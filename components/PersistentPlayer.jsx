"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PersistentPlayer({ track }) {
  const audioRef = useRef(null);
  const barRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(track.defaultVolume ?? 15);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Restore last-used volume once, on mount (client-only — localStorage isn't
  // available during the static build, so server/first-paint render always
  // uses the CMS-configured default; this effect then reconciles it against
  // whatever the visitor last set, which unavoidably means one state update
  // after mount rather than during render).
  useEffect(() => {
    const raw = localStorage.getItem("waxxel-volume");
    const saved = raw === null ? NaN : Number(raw);
    const initial = Number.isFinite(saved) && saved >= 0 && saved <= 1
      ? Math.round(saved * 100)
      : (track.defaultVolume ?? 15);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is unreachable at render time (SSR/static export), so this one-time reconciliation after mount is unavoidable
    setVolume(initial);
    if (audioRef.current) audioRef.current.volume = initial / 100;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Playback stays paused on load. The first time the visitor interacts with
  // the page, playback starts for real. `wheel`/`touchmove` cover manual
  // scrolling — unlike the generic `scroll` event, they only fire from real
  // physical input, never from a browser programmatically restoring scroll
  // position (that was the earlier bug: `scroll` fired on its own after a
  // reload and started audio with nobody touching anything).
  // One caveat that's a browser limitation, not something fixable here:
  // per the web's autoplay policy, only click/tap/key presses are guaranteed
  // to count as the "user gesture" required to start audio with sound —
  // scrolling isn't in that list in most browsers, so `play()` from a wheel/
  // touchmove handler can still be silently blocked. It's kept as a
  // best-effort attempt; a click/tap always works as the reliable fallback.
  useEffect(() => {
    function startOnInteraction() {
      const audio = audioRef.current;
      if (audio && audio.paused) audio.play().catch(() => {});
    }
    const events = ["pointerdown", "keydown", "touchstart", "wheel", "touchmove"];
    events.forEach((evt) => document.addEventListener(evt, startOnInteraction, { once: true, passive: true }));
    return () => events.forEach((evt) => document.removeEventListener(evt, startOnInteraction));
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }

  function handleVolumeChange(e) {
    const vol = Number(e.target.value);
    setVolume(vol);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = vol / 100;
    localStorage.setItem("waxxel-volume", String(vol / 100));
    if (vol > 0 && audio.muted) {
      audio.muted = false;
      setIsMuted(false);
    }
  }

  function seek(clientX) {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  }

  const progressPct = duration ? (current / duration) * 100 : 0;

  return (
    <div className={`now-playing${isPlaying ? " is-playing" : ""}${isMuted ? " is-muted" : ""}`}>
      <button className="now-playing__toggle" onClick={togglePlay} aria-label="Spela/pausa">
        <svg className="icon icon--play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        <svg className="icon icon--pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
      </button>

      <div className="now-playing__meta">
        <span className="now-playing__track">{track.title}</span>
        <span className="now-playing__artist">{track.artist}</span>
      </div>

      <div className="now-playing__bar" ref={barRef} onClick={(e) => seek(e.clientX)}>
        <div className="now-playing__bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="now-playing__times">
        <span>{formatTime(current)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="now-playing__volume">
        <button className="now-playing__mute" onClick={toggleMute} aria-label="Stäng av/på ljud">
          <svg className="icon icon--vol-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zM16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" /></svg>
          <svg className="icon icon--vol-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3-2.29-2.29-1.41 1.41L14.09 12l-1.29 1.29 1.41 1.41L16.5 12zm2.71-2.71-1.41 1.41L16.09 12l1.29 1.29 1.41-1.41L17.5 12z" /></svg>
        </button>
        <input
          type="range"
          className="now-playing__slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volym"
        />
      </div>

      <audio
        ref={audioRef}
        src={track.audioFile}
        preload="none"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={(e) => setIsMuted(e.target.muted)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onTimeUpdate={(e) => setCurrent(e.target.currentTime)}
      />
    </div>
  );
}
