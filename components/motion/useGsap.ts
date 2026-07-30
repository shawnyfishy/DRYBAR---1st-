'use client';

import { useLayoutEffect, useEffect, type DependencyList, type RefObject } from 'react';
import gsap from 'gsap';
import { registerGsapPlugins } from '@/lib/motion';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useGsap(
  callback: (self: gsap.Context) => void,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = []
) {
  useIsomorphicLayoutEffect(() => {
    registerGsapPlugins();
    const el = scope.current;
    if (!el || reducedMotion()) return;

    const ctx = gsap.context(callback, el);
    return () => ctx.revert();
  }, deps);
}
