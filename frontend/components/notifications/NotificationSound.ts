"use client";

let audioContext: AudioContext | null = null;

export function playNotificationSound() {
  try {
    if (typeof window === "undefined") {
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    if (!audioContext) {
      audioContext =
        new AudioContextClass();
    }

    const context = audioContext;

    if (context.state === "suspended") {
      void context.resume();
    }

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      760,
      context.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      980,
      context.currentTime + 0.09
    );

    gain.gain.setValueAtTime(
      0,
      context.currentTime
    );

    gain.gain.linearRampToValueAtTime(
      0.08,
      context.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.22
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(
      context.currentTime + 0.24
    );
  } catch {
    // Notification sound is best-effort.
  }
}