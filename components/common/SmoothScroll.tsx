import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Shared handle to the active Lenis instance. Other components (scroll-to-top,
 * in-page anchor navigation) use this so they drive the *same* smooth-scroll
 * instance instead of fighting it with native `window.scrollTo`.
 */
let lenisInstance: Lenis | null = null;

export const getLenis = (): Lenis | null => lenisInstance;

/**
 * Buttery smooth scrolling across the whole app.
 * Works with the scroll-driven hero and native anchor/scroll calls.
 */
const SmoothScroll: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisInstance = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      // Only clear the handle if this is still the active instance.
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);

  return null;
};

export default SmoothScroll;
