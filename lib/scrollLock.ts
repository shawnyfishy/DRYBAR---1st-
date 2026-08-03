let storedY = 0;
let isLocked = false;

export function lockScroll(): void {
  if (typeof window === 'undefined') return;

  const lenis = (window as any).lenisInstance;
  if (lenis) {
    lenis.stop();
    return;
  }

  if (isLocked) return;

  storedY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${storedY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  isLocked = true;
}

export function unlockScroll(): void {
  if (typeof window === 'undefined') return;

  const lenis = (window as any).lenisInstance;
  if (lenis) {
    lenis.start();
    return;
  }

  if (!isLocked) return;

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo({ top: storedY, behavior: 'instant' });
  isLocked = false;
}

export function scrollToTop(): void {
  if (typeof window === 'undefined') return;

  const lenis = (window as any).lenisInstance;
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
