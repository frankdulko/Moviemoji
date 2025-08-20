// utils/confetti.ts
import confetti from "canvas-confetti";

export function celebrate() {
  // Center burst
  confetti({
    particleCount: 120,
    spread: 70,
    startVelocity: 45,
    scalar: 1.1,
    origin: { x: 0.5, y: 0.6 },
  });

  // Side cannons
  confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
  confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });

  // A short “wave” for flair
  const duration = 800;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 7,
      startVelocity: 35,
      spread: 70,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
