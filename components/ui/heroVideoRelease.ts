/**
 * Cross-component playback signalling for the full-bleed hero video.
 *
 * HeroVideo mounts asynchronously (dynamic import, ssr:false — required to
 * avoid a hydration mismatch on the client-only reduced-motion/save-data
 * check), so the <video> element may not exist yet at the moment Hero's
 * GSAP timeline is constructed or its IntersectionObserver fires. Hero
 * calls `releaseHeroVideo()` from its t=0.55 onStart and `setHeroVideoVisible()`
 * from its section-level IntersectionObserver/visibilitychange handlers
 * instead of touching the DOM node directly; HeroVideo subscribes to both
 * and decides when to actually call `.play()`/`.pause()` on the element it
 * owns, regardless of mount order.
 */

const RELEASE_EVENT = 'hero-video-release';
let released = false;

export function releaseHeroVideo() {
  if (released) return;
  released = true;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(RELEASE_EVENT));
  }
}

export function onHeroVideoRelease(cb: () => void): () => void {
  if (released) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(RELEASE_EVENT, handler, { once: true });
  return () => window.removeEventListener(RELEASE_EVENT, handler);
}

type VisibilityListener = (visible: boolean) => void;
const visibilityListeners = new Set<VisibilityListener>();
let heroVisible = true;

export function setHeroVideoVisible(visible: boolean) {
  heroVisible = visible;
  visibilityListeners.forEach((cb) => cb(visible));
}

export function onHeroVideoVisibilityChange(cb: VisibilityListener): () => void {
  visibilityListeners.add(cb);
  cb(heroVisible);
  return () => {
    visibilityListeners.delete(cb);
  };
}
