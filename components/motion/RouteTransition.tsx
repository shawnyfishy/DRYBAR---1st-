'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, registerGsapPlugins } from '@/lib/motion';
import { Logo } from '@/components/ui/Logo';
import { useMenu } from '@/components/layout/MenuProvider';
import { scrollToTop } from '@/lib/scrollLock';

let refreshHandle: number | null = null;
function scheduleRefresh() {
  if (refreshHandle !== null) cancelAnimationFrame(refreshHandle);
  refreshHandle = requestAnimationFrame(() => {
    refreshHandle = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      refreshHandle = null;
    });
  });
}

interface RouteTransitionContextType {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextType>({
  navigate: () => {},
  isTransitioning: false,
});

export const useRouteTransition = () => useContext(RouteTransitionContext);

export interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

export function TransitionLink({
  href,
  children,
  className,
  target,
  rel,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { navigate } = useRouteTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    // Allow default for modifier clicks (cmd-click, ctrl-click, middle click, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    const hrefStr = href.toString();
    const isExternal = hrefStr.startsWith('http') || hrefStr.startsWith('//') || target === '_blank';

    if (isExternal) {
      return;
    }

    e.preventDefault();
    if (hrefStr !== pathname) {
      navigate(hrefStr);
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className} target={target} rel={rel} {...props}>
      {children}
    </Link>
  );
}

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { close: closeDrawer } = useMenu();

  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const prevPathnameRef = useRef(pathname);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (href: string) => {
    if (isTransitioningRef.current || href === pathname) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Close any open drawer before starting a transition
    closeDrawer();

    if (prefersReducedMotion) {
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        gsap.to(pageContent, {
          opacity: 0,
          duration: 0.075,
          onComplete: () => {
            router.push(href);
            scrollToTop();
            gsap.to(pageContent, { opacity: 1, duration: 0.075 });
            isTransitioningRef.current = false;
            setIsTransitioning(false);
          },
        });
      } else {
        router.push(href);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }
      return;
    }

    registerGsapPlugins();

    const overlay = overlayRef.current;
    const logo = logoRef.current;

    if (!overlay || !logo) {
      router.push(href);
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      return;
    }

    // Motion Part 1: COVER
    // clipPath inset(100% 0% 0% 0%) to inset(0% 0% 0% 0%), 0.65s, EASE.inOut
    // logo opacity 0 to 1 over 0.3s starting at 0.25s
    const tl = gsap.timeline({
      onComplete: () => {
        // SWAP: hold 0.12s before route push
        setTimeout(() => {
          router.push(href);
          scrollToTop();
          scheduleRefresh();
        }, 120);
      },
    });

    gsap.set(overlay, {
      clipPath: 'inset(100% 0% 0% 0%)',
      willChange: 'clip-path',
      pointerEvents: 'auto',
      opacity: 1,
    });
    gsap.set(logo, { opacity: 0 });

    tl.to(overlay, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.65,
      ease: EASE.inOut,
    }).to(
      logo,
      {
        opacity: 1,
        duration: 0.3,
        ease: EASE.out,
      },
      0.25
    );
  };

  // Route arrival detection via usePathname
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      const isViaNavigate = isTransitioningRef.current;
      prevPathnameRef.current = pathname;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        const pageContent = document.getElementById('page-content');
        // Same containing-block hazard as the animated paths: settle opacity
        // but leave no transform behind.
        if (pageContent) gsap.set(pageContent, { opacity: 1, clearProps: 'transform' });
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        return;
      }

      const overlay = overlayRef.current;
      const logo = logoRef.current;
      const pageContent = document.getElementById('page-content');

      // Scroll to top immediately & refresh ScrollTrigger
      scrollToTop();
      scheduleRefresh();

      if (isViaNavigate && overlay && logo) {
        // Release the touch/click lock the instant the incoming page is
        // mounted, not when the curtain finishes visually sweeping away.
        gsap.set(overlay, { pointerEvents: 'none' });

        // REVEAL & ENTER
        const revealTl = gsap.timeline({
          onComplete: () => {
            isTransitioningRef.current = false;
            setIsTransitioning(false);
            gsap.set(overlay, { willChange: 'auto' });
            scheduleRefresh();
          },
        });

        // REVEAL: clipPath inset(0% 0% 0% 0%) to inset(0% 0% 100% 0%), 0.75s, EASE.inOut
        // Logo opacity fades out over first 0.2s
        revealTl
          .to(logo, { opacity: 0, duration: 0.2, ease: EASE.out }, 0)
          .to(
            overlay,
            {
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 0.75,
              ease: EASE.inOut,
            },
            0
          );

        // ENTER: incoming #page-content opacity 0 / y 24px to opacity 1 / y 0, 0.6s, EASE.out, starting 0.25s into REVEAL
        if (pageContent) {
          revealTl.fromTo(
            pageContent,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, ease: EASE.out, clearProps: 'transform' },
            0.25
          );
        }
      } else if (!isViaNavigate && overlay && logo) {
        // Popstate (Browser Back/Forward) animation sweep
        closeDrawer();
        isTransitioningRef.current = true;
        setIsTransitioning(true);

        const popTl = gsap.timeline({
          onComplete: () => {
            isTransitioningRef.current = false;
            setIsTransitioning(false);
            gsap.set(overlay, { willChange: 'auto' });
            scheduleRefresh();
          },
        });

        gsap.set(overlay, {
          clipPath: 'inset(100% 0% 0% 0%)',
          willChange: 'clip-path',
          pointerEvents: 'auto',
          opacity: 1,
        });
        gsap.set(logo, { opacity: 0 });

        popTl
          .to(overlay, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: EASE.inOut })
          .to(logo, { opacity: 1, duration: 0.2 }, 0.15)
          .to(logo, { opacity: 0, duration: 0.15 }, 0.4)
          .set(overlay, { pointerEvents: 'none' }, 0.4)
          .to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: EASE.inOut }, 0.4);

        if (pageContent) {
          popTl.fromTo(
            pageContent,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, ease: EASE.out, clearProps: 'transform' },
            0.55
          );
        }
      }
    }
  }, [pathname, closeDrawer]);

  return (
    <RouteTransitionContext.Provider value={{ navigate, isTransitioning }}>
      {/* ROUTE TRANSITION CHARCOAL OVERLAY CURTAIN */}
      <div
        ref={overlayRef}
        id="route-transition-overlay"
        aria-hidden="true"
        className="fixed inset-0 z-[45] flex items-center justify-center bg-[var(--color-charcoal)] pointer-events-none"
        style={{ clipPath: 'inset(100% 0% 0% 0%)', willChange: 'clip-path' }}
      >
        <div ref={logoRef} className="opacity-0">
          <Logo className="h-12 w-auto md:h-16" />
        </div>
      </div>
      {children}
    </RouteTransitionContext.Provider>
  );
}

