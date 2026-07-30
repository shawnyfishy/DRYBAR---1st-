import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

/**
 * MOTION TOKENS - SINGLE SOURCE OF TRUTH
 *
 * The five custom eases below are registered from the exact cubic-bezier
 * control points measured off the reference site (9to5studio.it), converted
 * to GSAP CustomEase SVG-path form (a cubic-bezier(x1,y1,x2,y2) is
 * mathematically identical to the path "M0,0 C x1,y1 x2,y2 1,1").
 */

export const DUR = {
  fast: 0.24,
  base: 0.6,
  slow: 1.1,
  page: 0.9,
  reveal: 1,
  intro: 1.2,
} as const;

export const EASE = {
  out: 'power5',
  inOut: 'expo2',
  soft: 'circ2',
  snap: 'circ3',
  smooth: 'butter',
  scrub: 'none',
} as const;

export const STAGGER = {
  word: 0.045,
  line: 0.08,
  row: 0.10,
  menuItem: 0.05,
} as const;

export const PARALLAX = {
  desktop: 0.10,
  mobile: 0.05,
} as const;

export const LENIS = {
  lerp: 0.085,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: false,
} as const;

// Guarded single-execution plugin registration
let pluginsRegistered = false;

export function registerGsapPlugins() {
  if (typeof window !== 'undefined' && !pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger, CustomEase);

    // cubic-bezier(.76,0,.24,1) — confident, symmetric deceleration. Primary
    // curve for the preloader/intro and major full-viewport reveals.
    CustomEase.create('power5', 'M0,0 C0.76,0 0.24,1 1,1');
    // cubic-bezier(.83,0,.17,1) — sharper snap, used for wipes/secondary reveals.
    CustomEase.create('expo2', 'M0,0 C0.83,0 0.17,1 1,1');
    // cubic-bezier(.25,1,.5,1) — fast-out near-linear settle. Menu panel
    // slides and word/line stagger reveals.
    CustomEase.create('circ2', 'M0,0 C0.25,1 0.5,1 1,1');
    // cubic-bezier(.19,1,.22,1) — snappier variant of circ2.
    CustomEase.create('circ3', 'M0,0 C0.19,1 0.22,1 1,1');
    // cubic-bezier(.56,0,.05,1) — smooth in-out for continuous/scrub motion.
    CustomEase.create('butter', 'M0,0 C0.56,0 0.05,1 1,1');
    // legacy alias kept so existing ease:'airWipe' call sites inherit the
    // corrected curve without needing every call site touched in this pass.
    CustomEase.create('airWipe', 'M0,0 C0.83,0 0.17,1 1,1');

    pluginsRegistered = true;
  }
}
