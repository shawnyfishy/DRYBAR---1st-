import React from 'react';
import { Logo } from '@/components/ui/Logo';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function TokenVerificationPage() {
  const colorTokens = [
    { name: '--color-cream', hex: '#FCF9F2', usage: 'Page Ground' },
    { name: '--color-butter', hex: '#FDF2C9', usage: 'Calm Fields & Gradient Midpoints' },
    { 
      name: '--color-yellow', 
      hex: '#FEDD30', 
      usage: 'SURFACES ONLY (Never Text)',
      warning: '#FEDD30 on #FCF9F2 is ~1.3:1 contrast and FAILS WCAG at every size. Yellow is a surface, a rule, a fill. Never text. Charcoal carries all copy.'
    },
    { name: '--color-charcoal', hex: '#262523', usage: 'All Body Text & Dark Surfaces' },
    { name: '--color-warmgrey', hex: '#8C867A', usage: 'Secondary Text, Captions & Hairlines' },
    { name: '--color-inkgrey', hex: '#454235', usage: 'Logo Ink' },
  ];

  const gradientTokens = [
    { name: '--grad-asagiri', class: '[background-image:var(--backgroundImage-grad-asagiri)]', usage: 'Default Page Ground' },
    { name: '--grad-yuzu', class: '[background-image:var(--backgroundImage-grad-yuzu)]', usage: 'Accent Surface (Max 1 per viewport)' },
    { name: '--grad-sumi', class: '[background-image:var(--backgroundImage-grad-sumi)]', usage: 'Dark Sections & Overlay Menu', textLight: true },
    { name: '--grad-hai', class: '[background-image:var(--backgroundImage-grad-hai)]', usage: 'Neutral Separator Fields & Image Surrounds' },
  ];

  const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192];

  return (
    <div className="min-h-screen bg-[var(--color-cream)] p-8 text-[var(--color-charcoal)] font-[var(--font-latin)]">
      <header className="mb-12 border-b border-[var(--color-warmgrey)]/30 pb-6">
        <Logo className="mb-4 h-12 w-auto" />
        <h1 className="text-3xl font-bold tracking-tight">Design Token Verification Page</h1>
        <p className="mt-2 text-[var(--color-warmgrey)]">
          Build-time token specimen test suite for Drybar Qatar design system.
        </p>
      </header>

      {/* 1. COLOR PALETTE */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wider text-[var(--color-warmgrey)]">
          1. Color Palette Tokens
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <div key={token.name} className="overflow-hidden rounded-xl border border-[var(--color-warmgrey)]/20 shadow-sm">
              <div 
                className="h-32 w-full transition-transform hover:scale-105" 
                style={{ backgroundColor: token.hex }} 
              />
              <div className="bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[var(--color-charcoal)]">{token.name}</span>
                  <span className="font-mono text-xs text-[var(--color-warmgrey)]">{token.hex}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-warmgrey)]">{token.usage}</p>
                {token.warning && (
                  <div className="mt-3 rounded bg-amber-50 p-2.5 text-[0.6875rem] leading-snug text-amber-900 border border-amber-200">
                    <strong>Contrast Note:</strong> {token.warning}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. GRADIENTS */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wider text-[var(--color-warmgrey)]">
          2. Layered Riso Gradients
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {gradientTokens.map((grad) => (
            <div 
              key={grad.name} 
              className={`flex min-h-[180px] flex-col justify-between rounded-xl p-6 shadow-sm border border-[var(--color-warmgrey)]/20 ${grad.class}`}
            >
              <span className={`font-mono text-sm font-bold ${grad.textLight ? 'text-white' : 'text-[var(--color-charcoal)]'}`}>
                {grad.name}
              </span>
              <span className={`text-xs ${grad.textLight ? 'text-neutral-300' : 'text-[var(--color-warmgrey)]'}`}>
                {grad.usage}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TYPOGRAPHY SPECIMENS */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wider text-[var(--color-warmgrey)]">
          3. Fluid Type Scale Specimens
        </h2>
        <div className="flex flex-col gap-8 rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-8">
          <div>
            <span className="font-mono text-xs text-[var(--color-warmgrey)] block mb-1">
              --text-display (clamp 3.25rem - 11rem)
            </span>
            <div className="text-[clamp(3.25rem,15.5vw,11rem)] font-normal leading-[0.86] tracking-[-0.035em]">
              Drybar Qatar
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-[var(--color-warmgrey)] block mb-1">
              --text-h2 (clamp 2rem - 4.5rem)
            </span>
            <div className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em]">
              Blowouts Only. No Cuts.
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-[var(--color-warmgrey)] block mb-1">
              --text-h3 (clamp 1.25rem - 1.875rem)
            </span>
            <div className="text-[clamp(1.25rem,4.4vw,1.875rem)] font-medium leading-[1.12] tracking-[-0.012em]">
              Hollywood Waves & Uptini Styles
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-[var(--color-warmgrey)] block mb-1">
              --text-body (clamp 1rem - 1.125rem)
            </span>
            <p className="text-[clamp(1rem,3.5vw,1.125rem)] font-normal leading-[1.55]">
              An hour that is yours. Welcome to Drybar Qatar at Gewan Island, The Pearl, Doha.
            </p>
          </div>

          <div>
            <span className="font-mono text-xs text-[var(--color-warmgrey)] block mb-1">
              --text-eyebrow (0.6875rem uppercase)
            </span>
            <div className="text-[0.6875rem] font-medium leading-[1.2] tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              Flagship Location • Gewan Island
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-[var(--color-warmgrey)] block mb-1">
              --text-price (tabular-nums price column)
            </span>
            <div className="text-[clamp(1rem,3.6vw,1.25rem)] font-medium tabular-nums text-[var(--color-charcoal)]">
              QAR 250 / QAR 300 / QAR 350 / QAR 400
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPACING RULER */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wider text-[var(--color-warmgrey)]">
          4. Spacing Scale Rulers
        </h2>
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-8">
          {spacingScale.map((px) => (
            <div key={px} className="flex items-center gap-4">
              <span className="w-16 font-mono text-xs text-[var(--color-warmgrey)]">{px}px</span>
              <div 
                className="h-4 rounded bg-[var(--color-yellow)] border border-yellow-400"
                style={{ width: `${px}px` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. MOTION TOKENS */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wider text-[var(--color-warmgrey)]">
          5. Motion Timing & Easings
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-4">
            <span className="font-mono text-xs text-[var(--color-warmgrey)]">--dur-fast</span>
            <div className="mt-1 font-bold">240ms</div>
          </div>
          <div className="rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-4">
            <span className="font-mono text-xs text-[var(--color-warmgrey)]">--dur-base</span>
            <div className="mt-1 font-bold">600ms</div>
          </div>
          <div className="rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-4">
            <span className="font-mono text-xs text-[var(--color-warmgrey)]">--dur-slow</span>
            <div className="mt-1 font-bold">1100ms</div>
          </div>
          <div className="rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-4">
            <span className="font-mono text-xs text-[var(--color-warmgrey)]">--dur-page</span>
            <div className="mt-1 font-bold">900ms</div>
          </div>
        </div>
      </section>
    </div>
  );
}
