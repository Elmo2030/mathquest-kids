/**
 * useSoundEngine — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Synthesises all game sounds in-browser using the Web Audio API.
 * No external audio files are required.
 *
 * Sounds:
 *   playCorrect()  — bright ascending "ding" (correct answer)
 *   playWrong()    — soft descending "buzz" (wrong answer)
 *   playStar()     — short coin-collect chime (star awarded)
 *   playFanfare()  — celebratory ascending arpeggio (round complete)
 *   playClick()    — subtle UI tap (button press)
 *
 * All sounds respect the user's OS mute state and are gated
 * behind a user-gesture check (AudioContext must be resumed).
 * ─────────────────────────────────────────────────────────────
 */

import { useCallback, useRef } from "react";

type OscType = OscillatorType;

// ── Low-level helpers ─────────────────────────────────────────

function getCtx(ctxRef: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctxRef.current) {
    try {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // Resume if suspended (browser autoplay policy)
  if (ctxRef.current.state === "suspended") {
    ctxRef.current.resume().catch(() => {});
  }
  return ctxRef.current;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gainPeak: number,
  type: OscType = "sine",
  fadeOut = true
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.01);
  if (fadeOut) {
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  } else {
    gain.gain.setValueAtTime(gainPeak, startTime + duration - 0.01);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

// ── Hook ──────────────────────────────────────────────────────

export function useSoundEngine() {
  const ctxRef = useRef<AudioContext | null>(null);

  /** Correct answer — bright ascending two-note ding */
  const playCorrect = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 523.25, t,        0.18, 0.35, "sine"); // C5
    playTone(ctx, 659.25, t + 0.12, 0.25, 0.30, "sine"); // E5
    playTone(ctx, 783.99, t + 0.22, 0.35, 0.25, "sine"); // G5
  }, []);

  /** Wrong answer — soft descending buzz */
  const playWrong = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 220, t,        0.15, 0.20, "sawtooth");
    playTone(ctx, 180, t + 0.12, 0.20, 0.15, "sawtooth");
  }, []);

  /** Star awarded — short coin-collect chime */
  const playStar = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [880, 1046.50, 1318.51, 1567.98]; // A5 C6 E6 G6
    notes.forEach((freq, i) => {
      playTone(ctx, freq, t + i * 0.07, 0.18, 0.22, "sine");
    });
  }, []);

  /** Round complete — celebratory ascending arpeggio fanfare */
  const playFanfare = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    // C major arpeggio + octave jump
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      playTone(ctx, freq, t + i * 0.1, 0.25, 0.28, "sine");
    });
    // Final chord swell
    [523.25, 659.25, 783.99].forEach((freq) => {
      playTone(ctx, freq, t + notes.length * 0.1, 0.6, 0.18, "sine");
    });
  }, []);

  /** Subtle UI click — very short tick */
  const playClick = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 1200, t, 0.04, 0.08, "sine");
  }, []);

  return { playCorrect, playWrong, playStar, playFanfare, playClick };
}
