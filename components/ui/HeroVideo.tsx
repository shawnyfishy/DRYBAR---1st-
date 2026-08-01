'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { onHeroVideoRelease, onHeroVideoVisibilityChange } from './heroVideoRelease';

const POSTER_SRC = '/video/hero-loop-poster.webp';
const CANPLAY_TIMEOUT_MS = 4000;

// Desaturating and flattening the footage slightly is what lets a warm
// yellow/charcoal brand survive a full-bleed video without reading as
// generic stock. Applied to both the live video and the poster fallback so
// the treatment is consistent regardless of which one is actually showing.
const BRAND_FILTER = 'saturate(0.72) contrast(1.06) brightness(0.94)';

interface NetworkInformationLike {
  saveData?: boolean;
}

function shouldUseVideo(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (connection?.saveData) return false;
  return true;
}

/**
 * Full-bleed media for the hero's video layer. Renders a looping, muted
 * background video with a static poster fallback for reduced-motion,
 * save-data, and failed-decode cases.
 *
 * Playback is released by Hero's GSAP timeline via `releaseHeroVideo()` at
 * t=0.55 (see heroVideoRelease.ts) rather than by this component calling
 * `.play()` on mount — the aperture opening and the video's first visible
 * frame need to land together. Scroll/tab visibility is likewise driven
 * externally via `setHeroVideoVisible()`, called from an IntersectionObserver
 * that Hero owns on the section (not here), since this component isn't
 * guaranteed to be mounted when that observer is created.
 */
export function HeroVideo() {
  const [useVideo] = useState(shouldUseVideo);
  const [mediaFailed, setMediaFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!useVideo || mediaFailed) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;

    const handlePlaying = () => {
      setMediaFailed(false);
    };

    const handleError = () => {
      setMediaFailed(true);
    };

    const handleEnded = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [useVideo, mediaFailed]);

  useEffect(() => {
    if (!useVideo || mediaFailed) return;
    const video = videoRef.current;
    if (!video) return;

    let isReleased = false;
    let isVisible = true;

    const tryPlay = () => {
      if (isReleased && isVisible) {
        video.play().catch(() => {});
      }
    };

    const unsubscribeRelease = onHeroVideoRelease(() => {
      isReleased = true;
      video.dataset.introReleased = '1';
      tryPlay();
    });

    const unsubscribeVisibility = onHeroVideoVisibilityChange((visible) => {
      isVisible = visible;
      if (visible) {
        tryPlay();
      } else {
        video.pause();
      }
    });

    return () => {
      unsubscribeRelease();
      unsubscribeVisibility();
    };
  }, [useVideo, mediaFailed]);

  if (!useVideo || mediaFailed) {
    return (
      <Image
        src={POSTER_SRC}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="hero-video h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={POSTER_SRC}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source media="(max-width: 767px)" src="/video/hero-loop-mobile.mp4" type="video/mp4" />
      <source media="(max-width: 767px)" src="/video/hero-loop-mobile.webm" type="video/webm" />
      <source src="/video/hero-loop.mp4" type="video/mp4" />
      <source src="/video/hero-loop.webm" type="video/webm" />
    </video>
  );
}
