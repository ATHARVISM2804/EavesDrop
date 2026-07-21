"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Optional cloud-flythrough video behind the hero.
 *
 * Design constraints, all handled here so the page can't regress:
 *  • LCP: the always-present `.atmosphere` CSS gradient (rendered by the parent)
 *    paints instantly. This video layers ON TOP and fades in only once it can
 *    play, so it never blocks first paint or becomes the LCP element.
 *  • Legibility: desaturated + dimmed, with the parent's scrim over it, so the
 *    near-black headline keeps contrast as the clouds move.
 *  • Performance / data: skipped entirely on small screens and for users who
 *    prefer reduced motion — they keep the static gradient.
 *  • Graceful absence: if /public/hero-clouds.mp4 doesn't exist yet, the video
 *    simply never fades in and the gradient shows. Nothing breaks.
 *
 * To activate: drop a muted, loopable cloud clip at public/hero-clouds.mp4
 * (ideally a slow, high-altitude drift; 1080p, ~6–10s loop, H.264, < 4 MB).
 * An optional public/hero-clouds.webm will be preferred where supported.
 */
export function CloudBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only load the video on wide viewports with motion allowed.
    const wide = window.matchMedia("(min-width: 768px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(wide.matches && !still.matches);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!enabled || !v) return;
    const onReady = () => setReady(true);
    v.addEventListener("canplay", onReady);
    // Autoplay can be rejected; ignore — the gradient stays visible.
    void v.play().catch(() => {});
    return () => v.removeEventListener("canplay", onReady);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <video
      ref={videoRef}
      aria-hidden
      muted
      loop
      playsInline
      preload="auto"
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
        ready ? "opacity-70" : "opacity-0"
      }`}
      style={{ filter: "saturate(0.55) brightness(1.04) contrast(0.98)" }}
    >
      {/* Optional: add public/hero-clouds.webm above this for smaller files. */}
      <source src="/hero-clouds.mp4" type="video/mp4" />
    </video>
  );
}
