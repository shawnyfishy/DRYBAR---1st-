'use client';

import React, { createContext, useContext, useState } from 'react';
import type { gsap } from 'gsap';

/**
 * Exposes the tween driving HorizontalTrack's horizontal motion so that
 * panels nested inside it can give ScrollTrigger's `containerAnimation`
 * option that tween instead of the real (vertical) scroller. Without this,
 * a trigger like `start: 'left center'` never fires against a vertical
 * scroller, and a vertical trigger like `start: 'top 85%'` fires once,
 * immediately, on page load — before the horizontal scroll ever reaches
 * that panel — since every panel sits at the same vertical position.
 */
const HorizontalScrollContext = createContext<gsap.core.Tween | null>(null);

export const HorizontalScrollProvider = HorizontalScrollContext.Provider;

export function useContainerAnimation() {
  return useContext(HorizontalScrollContext);
}
